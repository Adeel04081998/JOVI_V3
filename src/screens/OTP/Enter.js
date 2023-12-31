import React, { useEffect, useRef, useState } from 'react';
import { Appearance, Keyboard, Platform, SafeAreaView } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import RNOtpVerify from "react-native-otp-verify";
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import AnimatedView from '../../components/atoms/AnimatedView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import Toast from '../../components/atoms/Toast';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import Dropdown from '../../components/molecules/Dropdown/Index';
import { sendOTPToServer, sharedExceptionHandler, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { getRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import preference_manager, { IS_ALL_CACHE_CLEANED } from '../../preference_manager';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV from '../../utils/GV';
import Regex from '../../utils/Regex';
import otpStyles from './styles';


const SPACING_VERTICAL = 10;

const Picker = ({ pickerVisible, setCountry, setPickerVisible }) => {


    const [countryCodes, setCountryCode] = useState([])
    const getCountryCodesList = () => {
        getRequest(
            Endpoints.GET_COUNTRY_CODES_LIST,
            res => {
                // console.log("otpCountryCodes.res", res);
                if (res.data.statusCode === 200) {
                    const { otpCountryCodes } = res.data;
                    setCountryCode(otpCountryCodes)
                }

            },
            err => {
                sharedExceptionHandler(err);
            },
            {},
            false,
        );
    }
    React.useEffect(() => {
        getCountryCodesList()
    }, [])

    if (pickerVisible && countryCodes.length) return <CountryPicker
        visible
        withEmoji
        withFilter
        onSelect={data => {
            setCountry(data.callingCode[0]);
            setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
        withAlphaFilter
        withCallingCode
        // countryCodes={ENUMS.COUNTRY_CODES}
        countryCodes={countryCodes}

    />
    else return null;
}

export default () => {
    const initNetworkState = {
        text: "Choose your Mobile Network",
        value: __DEV__ ? 1 : 0
    };
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = otpStyles.styles(colors, SPACING_VERTICAL);
    const [collapsed, setCollapsed] = React.useState(true);
    const [pickerVisible, setPickerVisible] = React.useState(false);
    const [forcePattern, setForcePattern] = React.useState(false);
    const [cellNo, setCellNo] = React.useState(__DEV__ ? "3149277092" : "");
    const [isLoading, setIsLoading] = React.useState(false);
    const [network, setNetwork] = React.useState(initNetworkState);
    let regexp = new RegExp(Regex.pkCellNo);


    const [country, setCountry] = React.useState("92");
    const isNationalNumber = `${country}` === "92";
    const onPress = async () => {
        IS_ALL_CACHE_CLEANED.current = false;
        Keyboard.dismiss();
        const appHash = Platform.OS === "android" ? (await RNOtpVerify.getHash())[0] : "";
        const phoneNumber = country + cellNo
        if (isNationalNumber && network.value <= 0) return Toast.info("Please select your mobile network.");
        else if (isNationalNumber && !regexp.test(phoneNumber)) {
            return setForcePattern(true)
        }
        const onSuccess = (res) => {
            console.log("res...", res);
            const { statusCode, message } = res.data;
            if (statusCode === 417) return Toast.error(message);
            NavigationService.NavigationActions.common_actions.navigate(ROUTES.AUTH_ROUTES.VerifyOTP.screen_name, { payload: { ...payload, sendOTPviaEmail: res.data.sendOTPviaEmail, email: VALIDATION_CHECK(res.data.email) ? res.data.email : null } })
        }
        const onError = (err) => {
            // console.log("err...", err.response);
            sharedExceptionHandler(err)
        }
        const onLoader = (loader) => {
            setIsLoading(loader)
        }
        const payload = {
            'phoneNumber': phoneNumber,
            'appHash': appHash,
            'otpType': 1,
            'userType': 1,
            'isWhatsapp': false,
            "isNewVersion": true,
            "mobileNetwork": network.value
        };
        sendOTPToServer(payload, onSuccess, onError, onLoader)
    }
    const legalScreen = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.AUTH_ROUTES.Legal.screen_name)
    }

    // const disbleContinueButton = isNationalNumber ? (network.value <= 0 || cellNo.length < 10) : cellNo.length < 10;
    const disbleContinueButton = isNationalNumber ? (network.value <= 0 || cellNo.length < 10) : false; // Validation on International numbers removed after discussion with zulfiqar and atif
    return <SafeAreaView style={styles.otpSafeArea}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <SvgXml xml={svgs.otp()} height={120} width={120} style={{ alignSelf: "center", marginBottom: 20, }} />
            <Text fontFamily={'PoppinsMedium'} style={{ fontSize: 14, paddingLeft: 25, color: 'black', marginBottom: -3 }}>Enter your Mobile Number</Text>
            <View style={styles.otpDropdownParentView}>
                <TouchableOpacity style={styles.otpDropdownView}
                    disabled={!isNationalNumber}
                    wait={0.55}//greater than the animation time of dropdown rendered below
                    activeOpacity={1}
                    onPress={() => {
                        setCollapsed(!collapsed);
                    }} >
                    <Text fontFamily="PoppinsRegular" style={{ color: isNationalNumber ? "#fff" : colors.grey, ...styles.textAlignCenter }}>{network.text}</Text>
                    <VectorIcon type='AntDesign' name={collapsed ? "down" : "up"} style={{ paddingLeft: 5, }} size={12} color={isNationalNumber ? "#fff" : colors.grey} />
                </TouchableOpacity>
                {/* Networks list */}
                <Dropdown collapsed={collapsed} scrollViewStyles={{ top: 42 }} options={ENUMS.NETWORK_LIST} itemUI={(item, index, collapsed) => <TouchableOpacity key={`network-key-${index}`} style={{ paddingVertical: 4, borderWidth: 0.5, borderTopWidth: 0, borderColor: 'rgba(0,0,0,0.3)', borderBottomRightRadius: index === ENUMS.NETWORK_LIST.length - 1 ? 12 : 0, borderBottomLeftRadius: index === ENUMS.NETWORK_LIST.length - 1 ? 12 : 0 }} onPress={() => {
                    setNetwork(item);
                    setCollapsed(!collapsed);
                }}>
                    <Text style={{ textAlign: "center", paddingVertical: 3, color: colors.black }}>{item.text}</Text>
                    <View style={{}} />
                </TouchableOpacity>} />
                <AnimatedView style={styles.inputView}>
                    <TouchableOpacity style={{ marginLeft: 15, flexDirection: "row", width: '15%', justifyContent: 'flex-end', backgroundColor: '#fff', alignItems: 'center' }} onPress={() => setPickerVisible(true)}>
                        <Text style={{ color: '#000', paddingRight: 2 }} >{`+${country}`}</Text>
                        <VectorIcon type='AntDesign' name="caretdown" color={"#000"} style={{ marginRight: 2, marginTop: -3 }} size={12} onPress={() => setPickerVisible(true)} />
                    </TouchableOpacity>

                    <TextInput value={cellNo.toString()}
                        keyboardType="numeric"
                        placeholder='3xxxxxxxxx'
                        maxLength={isNationalNumber ? 10 : 15}
                        iconName={''}
                        onChangeText={text => {
                            let number = parseInt(text);
                            if (!isNaN(number)) {
                                setCellNo(number.toString())
                            } else setCellNo("")
                        }}
                        errorTextStyle={{ fontSize: 12 }}
                        containerStyle={{
                            width: '50%', borderColor: forcePattern ? 'red' : null,
                            borderWidth: forcePattern ? 0.5 : 0,
                            marginLeft: 5
                        }}
                        style={{ fontFamily: FontFamily.Poppins.Regular }}
                        onFocus={() => setForcePattern(false)}
                    />
                </AnimatedView>
                {forcePattern &&
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '35%' }}
                        /** Will remove it soon */
                        />
                        <View style={{ width: '50%' }} >
                            <Text style={[{
                                color: 'red',
                                bottom: 5,
                                // alignSelf: 'center'
                            }]}>Invalid Number!</Text>
                        </View>
                    </View>
                }
            </View>
            <View style={styles.buttonView}>

                <Button
                    style={styles.continueButton}
                    text={`Send OTP`}
                    textStyle={{ color: '#fff', ...styles.textAlignCenter, fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                    onPress={onPress}
                    isLoading={isLoading}
                    disabled={disbleContinueButton || isLoading}
                    wait={0.6}
                />
            </View>

            <View style={styles.termsAndConditionView}>
                <Text fontFamily={'PoppinsBold'} style={{ alignSelf: 'center', paddingVertical: 5, fontSize: 12 }}>{`By tapping 'send OTP' I agree With`}</Text>
                <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity onPress={() => { legalScreen() }}>
                        <Text fontFamily={'PoppinsLight'} style={{ color: "#6D51BB", fontSize: 14 }}>
                            Terms & Conditions
                        </Text>
                    </TouchableOpacity>
                    <Text fontFamily={'PoppinsLight'} style={{ color: 'black', fontSize: 14, paddingHorizontal: 5 }}>
                        and
                    </Text>
                    <TouchableOpacity onPress={() => { legalScreen() }}>
                        <Text fontFamily={'PoppinsLight'} style={{ color: "#6D51BB", fontSize: 14 }}>
                            Privacy Policy
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Text style={{ color: 'black' }} onPress={() => { }} >and</Text> Privacy Policy */}
            {/* Country Code Picker */}
            <Picker pickerVisible={pickerVisible} setCountry={(item) => {
                setNetwork(initNetworkState);
                setCountry(item);
            }} setPickerVisible={setPickerVisible} />
        </KeyboardAwareScrollView>
    </SafeAreaView >
};
