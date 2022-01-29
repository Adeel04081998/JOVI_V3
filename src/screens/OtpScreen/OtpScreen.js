import React, { useEffect, useState } from 'react';
import { SafeAreaView, Keyboard, Image, TextInput, TouchableOpacity, Animated, StyleSheet, TouchableWithoutFeedback, Modal, FlatList, Dimensions, Easing, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../../components/atoms/Button';
import images from '../../assets/images';
import ENUMS from '../../utils/ENUMS';
import View from '../../components/atoms/View';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import Text from '../../components/atoms/Text';

const size = 330;
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
        // fadeOut()
    }, [])
    fadeIn = () => {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    };

    // fadeOut = () => {
    //     Animated.timing(fadeAnimation, {
    //         toValue: 0,
    //         duration: 4000,
    //         useNativeDriver: true
    //     }).start();
    // };
    const toggleDropdown = () => {
        openDropDown ? setOpenDropDown(false) : setOpenDropDown(true)
        animate(Easing.linear)
    };

    const animate = easing => {
        // animation.setValue(0);
        console.log('easing',easing);
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing,
            useNativeDriver: false
        }).start();
    };

    const size = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80]
    });

    const animatedStyles = [
        styles.dropdown,
        {
            transform: [{ scaleX: size}],
        }
    ];
    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.item(index)} onPress={() => onItemPress(item)}>
            <Text>{item}</Text>
        </TouchableOpacity>
    );
    const togglePicker = () => {
        setShowPicker(!showPicker)
    }

    const setSelectedValue = countryCode => {
        togglePicker();
        let allowedCountryCode = state.allowedCountryCodes.find(item => item.code === countryCode.toString());
        setCountryCode(countryCode)
    };

    const onItemPress = (item) => {
        setSelected(item);
        onSelect(item);
        setOpenDropDown(false);
    };

    const renderDropdown = () => {
        return (
            <TouchableOpacity
                style={[styles.overlay]}
                onPress={() => setOpenDropDown(false)}
            >
                <Animated.View style={animatedStyles}>
                    <FlatList
                        data={ENUMS.networkList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Animated.View>
            </TouchableOpacity>
        )
    }

    const renderPhoneNumberUI = () => {
        return (<View style={{ flex: 3, alignItems: 'center' }} >
            <Text style={{ paddingLeft: 15, paddingVertical: 5 }} >Enter Your Mobile Number</Text>
            <TouchableWithoutFeedback
                onPress={toggleDropdown}>
                <View style={{ justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'black', flexDirection: 'row', width: Dimensions.get('window').width - 30, padding: 10 }}  >
                    <Text style={{ color: 'white' }} >Choose your Mobile Network</Text>
                    <Text style={{ color: 'white' }}  >^</Text>
                </View>
            </TouchableWithoutFeedback>
            {openDropDown ?
                renderDropdown()
                : null}
            <View style={{ justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: '#F3F3F3', flexDirection: 'row', width: Dimensions.get('window').width - 30 }}  >
                <TouchableWithoutFeedback onPress={() => togglePicker()}>
                    <View style={{ ...styles.countryCode }}>
                        <Text style={{ fontSize: 16 }}>{"+" + countryCode}</Text>
                        <View>
                            <Text> ^ </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TextInput numberOfLines={1} placeholder="Type number" value={cellNo} keyboardType="numeric" textContentType={"oneTimeCode"} onChangeText={(val) => setCellNo(val)} />
            </View>

        </View>)
    }
    const renderButtonUI = () => {
        return (<View style={{ alignItems: 'center', flex: 0.9, paddingBottom: 20 }} >
            <Button
                onPress={() => { console.log('Hello') }}
                parentTouchableStyle={{ backgroundColor: '#7359BE', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width - 30, height: 50, borderWidth: 0, borderRadius: 10 }}
                textStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
                buttonText={'Continue'}
            />
            <View style={{ alignItems: 'center' }} >
                <Text>By Tapping send OTP I am agreeing to</Text>
                <Text>terms & conditions and privacy policy</Text>
            </View>
        </View>)
    }
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
                {renderPhoneNumberUI()}
                {renderButtonUI()}
                {
                    showPicker &&
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
                }
            </Animated.View>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 25,
    },
    dropdown: {
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 2,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: 'white'
    },
    overlay: {
        marginHorizontal: 0,
        zIndex: 999,
        position: 'absolute',
        width: Dimensions.get('window').width - 30,
        top: 65
    },
    item: (index) => {
        return {
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: index == 4 ? 0 : 1,
            borderBottomColor: 'lightgrey'
        }
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#efefef',
        height: 50,
        zIndex: 1,
        width: '100%'
    },
    countryCode: {
        paddingVertical: 0,
        height: 50,
        width: 70,
        fontSize: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    box: {
        marginTop: 32,
        borderRadius: 4,
        backgroundColor: "red",
    },
});
