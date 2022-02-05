import React, { useRef } from 'react';
import { Appearance, Platform, SafeAreaView } from 'react-native';
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
import { sendOTPToServer, sharedExceptionHandler } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV from '../../utils/GV';
import Regex from '../../utils/Regex';
import otpStyles from './styles';


const SPACING_VERTICAL = 10;

const Picker = ({ pickerVisible, setCountry, setPickerVisible }) => {
    if (pickerVisible) return <CountryPicker
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
        countryCodes={ENUMS.COUNTRY_CODES}
    />
    else return null;
}

export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = otpStyles.styles(colors, SPACING_VERTICAL);
    const [collapsed, setCollapsed] = React.useState(true);
    const [pickerVisible, setPickerVisible] = React.useState(false);
    const [forcePattern, setForcePattern] = React.useState(false);
    const [cellNo, setCellNo] = React.useState(__DEV__ ? "" : "");
    const [isLoading, setIsLoading] = React.useState(false);
    const [network, setNetwork] = React.useState({
        text: __DEV__ ? "Jazz" : "Choose your Mobile Network",
        value: __DEV__ ? 1 : 0
    });
    let regexp = new RegExp(Regex.pkCellNo);


    const [country, setCountry] = React.useState("92");
    const onPress = async () => {
        const appHash = Platform.OS === "android" && (await RNOtpVerify.getHash())[0]
        const phoneNumber = country + cellNo
        if (network.value <= 0) return Toast.info("Please select your mobile network.");
        else if (!regexp.test(phoneNumber)) {
            return setForcePattern(true)
        }
        const onSuccess = (res) => {
            console.log("res...", res);
            const { statusCode, message } = res.data;
            if (statusCode === 417) return Toast.error(message);
            NavigationService.NavigationActions.common_actions.navigate(ROUTES.AUTH_ROUTES.VerifyOTP.screen_name, { payload })
        }
        const onError = (err) => {
            console.log("err...", err.response);
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

    const disbleContinueButton = network.value <= 0 || cellNo.length < 10;
    return <SafeAreaView style={styles.otpSafeArea}>
        <KeyboardAwareScrollView>
            <SvgXml xml={svgs.otp()} height={120} width={120} style={{ alignSelf: "center", marginBottom: 20, }} />
            <Text fontFamily={'PoppinsMedium'} style={{ fontSize: 14, paddingLeft: 25, color: 'black' }}>Enter your mobile number</Text>
            <View style={styles.otpDropdownParentView}>
                <TouchableOpacity style={styles.otpDropdownView}
                    wait={0.55}//greater than the animation time of dropdown rendered below
                    activeOpacity={1}
                    onPress={() => {
                        setCollapsed(!collapsed);
                    }} >
                    <Text fontFamily="PoppinsRegular" style={{ color: "#fff", ...styles.textAlignCenter }}>{network.text}</Text>
                    <VectorIcon type='AntDesign' name={collapsed ? "down" : "up"} style={{ paddingLeft: 5, }} size={12} color={"#fff"} />
                </TouchableOpacity>
                {/* Networks list */}
                <Dropdown collapsed={collapsed} scrollViewStyles={{ top: 42 }} options={ENUMS.NETWORK_LIST} itemUI={(item, index, collapsed) => <TouchableOpacity key={`network-key-${index}`} style={{ paddingVertical: 4, borderWidth: 0.5, borderTopWidth: 0, borderColor: 'rgba(0,0,0,0.3)', borderBottomRightRadius: index === ENUMS.NETWORK_LIST.length - 1 ? 12 : 0, borderBottomLeftRadius: index === ENUMS.NETWORK_LIST.length - 1 ? 12 : 0 }} onPress={() => {
                    setNetwork(item);
                    setCollapsed(!collapsed);
                }}>
                    <Text style={{ textAlign: "center", paddingVertical: 3 }}>{item.text}</Text>
                    <View style={{}} />
                </TouchableOpacity>} />
                <AnimatedView style={styles.inputView}>
                    <TouchableOpacity style={{ marginLeft: 10, flexDirection: "row", width: '15%', justifyContent: 'flex-end', backgroundColor: '#fff', alignItems: 'center' }} onPress={() => setPickerVisible(true)}>
                        <Text style={{ color: '#000', paddingRight: 2 }} >{`+${country}`}</Text>
                        <VectorIcon type='AntDesign' name="caretdown" color={"#000"} style={{ marginRight: 2, marginTop: -3 }} size={12} onPress={() => setPickerVisible(true)} />
                    </TouchableOpacity>

                    <TextInput value={cellNo.toString()}
                        keyboardType="numeric"
                        placeholder='3xxxxxxxxx'
                        maxLength={10}
                        iconName={''}
                        onChangeText={text => {
                            let number = parseInt(text);
                            if (!isNaN(number)) {
                                setCellNo(number.toString())
                            } else setCellNo("")
                        }}
                        errorTextStyle={{ fontSize: 12 }}
                        containerStyle={{
                            width: '60%', borderColor: forcePattern ? 'red' : null,
                            borderWidth: forcePattern ? 0.5 : 0,
                        }}
                        onFocus={() => setForcePattern(false)}
                    />
                </AnimatedView>
                {forcePattern &&
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '30%' }}>
                        </View>
                        <View style={{ width: '60%' }} >
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
                    text={'Continue'}
                    textStyle={{ color: '#fff', ...styles.textAlignCenter }}
                    onPress={onPress}
                    isLoading={isLoading}
                    disabled={disbleContinueButton || isLoading}
                />
            </View>

            <View style={styles.termsAndConditionView}>
                <Text fontFamily={'PoppinsBold'} style={{ alignSelf: 'center', paddingVertical: 5, fontSize: 12 }}>By tapping Continue I am agreeing to </Text>
                <TouchableOpacity onPress={() => { }}>
                    <Text fontFamily={'PoppinsLight'} style={{ color: "#6D51BB", fontSize: 14 }}>
                        terms & conditions <Text style={{ color: 'black' }} onPress={() => { }} >and</Text> privacy & policy
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Country Code Picker */}
            <Picker pickerVisible={pickerVisible} setCountry={setCountry} setPickerVisible={setPickerVisible} />
        </KeyboardAwareScrollView>
    </SafeAreaView >
};
