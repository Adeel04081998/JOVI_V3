import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Animated, TouchableWithoutFeedback, FlatList, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../../components/molecules/Button';
import images from '../../assets/images';
import ENUMS from '../../utils/ENUMS';
import View from '../../components/atoms/View';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import VectorIcon from '../../components/atoms/VectorIcon';
import styles from './styles';

export default Otp = () => {
    const FOREIGN_NUMBER_MAX_LENGTH = 18;
    const FOREIGN_NUMBER_Min_LENGTH = 4;
    const animation = new Animated.Value(0);
    const inputRange = [0, 1];
    const outputRange = [1, 0.8];
    const scale = animation.interpolate({ inputRange, outputRange });
    const [openDropDown, setOpenDropDown] = useState(false)
    const [showPicker, setShowPicker] = useState(false)
    const [countryCode, setCountryCode] = useState('92')
    const [cellNo, setCellNo] = useState('')
    const [maxLengthForeign, setMaxLengthForeign] = useState(FOREIGN_NUMBER_MAX_LENGTH)
    const [maxLength, setMaxLength] = useState(10)
    const [selected, setSelected] = useState(undefined)
    const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0))
    const [allowedCountryCodes, setAllowedCountryCodes] = useState([])
    const [countryCodeSelectionList, setCountryCodeSelectionList] = useState([
        { id: 1, selected: true, title: "Receive Code by SMS", desc: "get OTP through SMS", icon: (color) => commonSvgIcons.chatOTPICON(color) },
        { id: 2, selected: false, title: "Receive Code by Whatsapp", desc: "get OTP through Whatsapp", icon: (color) => commonSvgIcons.whatsapOTPICON(color) }
    ])
    let checkCountryCode = countryCode;
    const IS_PK_SELECTED = checkCountryCode === "92";
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    let cellNoCheck = !IS_PK_SELECTED && (cellNo.length >= FOREIGN_NUMBER_Min_LENGTH || (cellNo.length > FOREIGN_NUMBER_Min_LENGTH && cellNo.length <= FOREIGN_NUMBER_MAX_LENGTH)) ? true : ((IS_PK_SELECTED && cellNo.length > 9) ? true : false);
    const LIST_ITEM_HEIGHT = 54;


    useEffect(() => {
        fadeIn()
    }, [])
    fadeIn = () => {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    };

    const onChangeNumberHandler = value => {
        if (IS_PK_SELECTED) {
            value = value.replace(/\s/g, "");
            if (value === "") return setState({ ...state, cellNo: value, isValid: Validator.isNumeric(value), maxLength: MOBILE_NUMBER_MAX_LENGTH });
            else if (!cellNo.length && value == '0' && IS_PK_SELECTED) { value = '' }
            else if (value[0] == '0' && IS_PK_SELECTED) {
                value = value.slice(1, value.length);
            }
            else {
                // value = value;
                value = value;
            }
            setState({ ...state, cellNo: value, isValid: Validator.isNumeric(value), maxLength: 10 });
        } else {
            if (cellNo.length >= 4 || (cellNo.length >= 4 && cellNo.length <= 18)) {
                setState({ ...state, cellNo: value, isValid: true });
            }
            else if (value === "") return setState({ ...state, cellNo: value, isValid: false });
            else { return setState({ ...state, cellNo: value, isValid: Validator.isNumeric(value), }) }
        }
    }

    const onSuccessHandler = response => {
        if (response.data.statusCode === 200) {
            clearState();
            navigateWithResetScreen(0, [{
                name: 'Code',
                params: {
                    paramsData: response.config.data,
                    backScreenObj: navigation.dangerouslyGetState()?.routes[navigation.dangerouslyGetState().index].backScreenObj ?
                        navigation.dangerouslyGetState()?.routes[navigation.dangerouslyGetState().index].backScreenObj : { container: null, screen: "Login" }
                },
            }])
        } else {
            CustomToast.error(response.data.message || "Something went wrong", "", 3000)
        }

        // navigation.navigate('Code', {
        //     'paramsData': response.config.data, backScreenObj: {
        //         container: null,
        //         screen: "Login"
        //     }
        // });

        // clearState(); update this check in if esle  
        // navigateWithResetScreen(0, [{
        //     name: 'Code',
        //     params: {
        //         paramsData: response.config.data,
        //         backScreenObj: navigation.dangerouslyGetState()?.routes[navigation.dangerouslyGetState().index].backScreenObj ?
        //             navigation.dangerouslyGetState()?.routes[navigation.dangerouslyGetState().index].backScreenObj : { container: null, screen: "Login" }
        //     },
        // }])


    };
    const onErrorHandler = error => {
        console.log("OTP.js -> onErrorHandler :--- ,", error);
        sharedServerErrorToast(error);
    };
    const _sendOtpRequestHandler = async () => {
        let appHash = null;
        let data = null;
        let phoneNumber = countryCode + cellNo;
        if (Platform.OS === 'android') {
            appHash = await RNOtpVerify.getHash();
            data = {
                'phoneNumber': phoneNumber,
                'appHash': appHash[0],
                'otpType': (Object.keys(BACK_SCREEN_OBJ).length && BACK_SCREEN_OBJ?.screen === "Reset_Password") ? 2 : 1,
                'userType': isJoviCustomerApp ? 1 : 2,
                'isWhatsapp': false,
                // 'isWhatsapp': state.countryCodeSelectionList[1].selected, 
                "isNewVersion": true
            };
            // console.log('appHash :', appHash)
        } else {
            data = {
                'phoneNumber': phoneNumber,
                'otpType': (Object.keys(BACK_SCREEN_OBJ).length && BACK_SCREEN_OBJ?.screen === "Reset_Password") ? 2 : 1,
                'userType': isJoviCustomerApp ? 1 : 2,
                'isWhatsapp': state.countryCodeSelectionList[1].selected,
                "isNewVersion": true
            };
        }
        console.log('Payload: ', data);
        // dispatch(userAction({ ...props.user,  phoneNumber, appHash }));
        dispatch(userAction({ ...props.user, mobile: phoneNumber, phoneNumber, appHash }));
        postRequest('/api/User/OTP/Send', data, {}, dispatch, onSuccessHandler, onErrorHandler, '');
    };
    const sendOtpRequesToServer = async () => {
        let internetConnectivity = await NetInfo.fetch();
        if (!internetConnectivity.isConnected) {
            return CustomToast.error('No internet connection');
        } else {
            if (Object.keys(BACK_SCREEN_OBJ).length && BACK_SCREEN_OBJ?.screen === "profile_container") {
                getRequest(`/api/User/PhoneNumberCheck/${countryCode + cellNo}`,
                    {},
                    dispatch,
                    res => {
                        if (res.data.statusCode === 200) {
                            CustomToast.error("Phone number already exist", null, "long")
                        } else if (res.data.statusCode === 404) {
                            _sendOtpRequestHandler()
                        };
                    },
                    err => {
                        // debugger;
                        if (err) {
                            CustomToast.error("Error Occurred during checking existing number");
                        }
                    },
                    "",
                    true,
                    true
                );
            } else {
                _sendOtpRequestHandler()
            }
        }
    };

    const toggleDropdown = () => {
        openDropDown ? setOpenDropDown(false) : setOpenDropDown(true)
    };

    const togglePicker = () => {
        setShowPicker(!showPicker)
    }

    const setSelectedValue = countryCode => {
        togglePicker();
        let allowedCountryCode = allowedCountryCodes.find(item => item.code === countryCode.toString());
        setCountryCode(countryCode)
    };

    const onItemPress = (item) => {
        setSelected(item);
        onSelect(item);
        setOpenDropDown(false);
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.item(index)} onPress={() => onItemPress(item)}>
            <Text>{item}</Text>
        </TouchableOpacity>
    );

    const renderDropdown = () => {
        return (
            <TouchableOpacity
                style={[styles.overlay]}
                onPress={() => setOpenDropDown(false)}
            >
                <View style={styles.dropdown}>
                    <FlatList
                        data={ENUMS.networkList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const renderTextInputUI = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: '#F3F3F3', flexDirection: 'row', width: Dimensions.get('window').width - 30 }}  >
                <TouchableWithoutFeedback onPress={() => togglePicker()}>
                    <View style={{ ...styles.countryCode }}>
                        <Text style={{ fontSize: 16, paddingHorizontal: 5 }}>{"+" + countryCode}</Text>
                        <View style={{ alignItems: 'center' }} >
                            <VectorIcon type="AntDesign" name="caretdown" color={'black'} size={15} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TextInput numberOfLines={1} placeholder="Type number" value={cellNo} returnKeyType="done" keyboardType="numeric" textContentType={"oneTimeCode"} onChangeText={(val) => setCellNo(val)} style={{ flex: 0, backgroundColor: 'white' }} />
            </View>
        )
    }

    const renderInputContainer = () => {
        return (
            <View style={{ flex: 3, alignItems: 'center' }} >
                <Text style={{ paddingLeft: 15, paddingVertical: 5 }} >Enter Your Mobile Number</Text>
                <TouchableWithoutFeedback
                    onPress={toggleDropdown}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'black', flexDirection: 'row', width: Dimensions.get('window').width - 30, padding: 10 }}  >
                        <Text style={{ color: 'white' }} >Choose your Mobile Network</Text>
                        <VectorIcon type="AntDesign" name="down" color='white' style={{ marginLeft: 5 }} size={15} />
                    </View>
                </TouchableWithoutFeedback>
                {openDropDown ?
                    renderDropdown()
                    : null}
                {renderTextInputUI()}

            </View>
        )
    }

    // CONTINUE BUTTON UI START

    const renderButtonUI = () => {
        return (
            <View style={{ alignItems: 'center', flex: 0.9, paddingBottom: 20 }} >
                <Button
                    onPress={sendOtpRequesToServer}
                    style={{ backgroundColor: '#7359BE', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width - 30, height: 50, borderWidth: 0, borderRadius: 10 }}
                    textStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
                    text={'Continue'}
                />
                <View style={{ alignItems: 'center' }} >
                    <Text>By Tapping continue I am agreeing to</Text>
                    <Text>terms & conditions and privacy policy</Text>
                </View>
            </View>
        )
    }
    // CONTINUE BUTTON UI END

    //COUNTRY PICKER UI START

    const renderCountryPickerUI = () => {
        return (
            <CountryPicker
                visible
                withEmoji
                withFilter
                onSelect={data => setSelectedValue(data.callingCode[0])}
                onClose={() => setShowPicker(false)}
                withAlphaFilter
                withCallingCode
                countryCodes={["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "IO", "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "CI", "JM", "JP", "JE", "JO", "KZ", "KE", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "CG", "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "ST", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "VI", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "EH", "YE", "ZM", "ZW", "KI", "HK", "AX"]}
            />

        )
    }

    //COUNTRY PICKER UI END

    //MAIN VIEW START

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={keyboardVerticalOffset} >
            <Animated.View style={[
                {
                    flex: 5,
                    opacity: fadeAnimation
                }
            ]} >
                <View style={{ alignItems: 'center', flex: 0.8 }} >
                    <Image source={images.otp()} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                </View>
                {renderInputContainer()}
                {renderButtonUI()}
                {showPicker && renderCountryPickerUI()}
            </Animated.View>
        </KeyboardAvoidingView>
    );

    //MAIN VIEW END
};
