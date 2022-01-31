import React from 'react';
import { Appearance, SafeAreaView, useColorScheme } from 'react-native';
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
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
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
    const [cellNo, setCellNo] = React.useState("");
    const [isLoading,setIsLoading] = React.useState(false);
    const [network, setNetwork] = React.useState({
        text: "Choose your mobile network",
        value: 0
    });
    const [country, setCountry] = React.useState("92");
    const onPress = async () => {
        if (network.value <= 0) return Toast.info("Please select your mobile network.");
        const payload = {
            'phoneNumber': country + cellNo,
            'appHash': (await RNOtpVerify.getHash())[0],
            'otpType': 1,
            'userType': 1,
            'isWhatsapp': false,
            "isNewVersion": true,
            "mobileNetwork": network.value
        };
        postRequest(Endpoints.SEND_OTP,payload , res => {
            console.log("res...", res);
            const { statusCode, message } = res.data;
            if (statusCode === 417) return Toast.error(message);
            NavigationService.common_actions.navigate(ROUTES.AUTH_ROUTES.VerifyOTP.screen_name)
        },
            err => {
                console.log("err...", err.response);
            },{},true,(loader)=>setIsLoading(loader)
        );
    }
    const disbleContinueButton = network.value <= 0 || cellNo === '';
    return <SafeAreaView style={styles.otpSafeArea}>
        <KeyboardAwareScrollView>
            <SvgXml xml={svgs.otp()} height={120} width={120} style={{ alignSelf: "center",marginBottom:20, }} />
            <Text fontFamily={'PoppinsMedium'} style={{fontSize:14,marginHorizontal:20,color:'black'}}>Enter your mobile number</Text>
            <View style={styles.otpDropdownParentView}>
                <TouchableOpacity activeOpacity={1} style={styles.otpDropdownView} onPress={() => setCollapsed(!collapsed)} >
                    <Text style={{ color: "#fff", ...styles.textAlignCenter }}>{network.text}</Text>
                    <VectorIcon type='AntDesign' name={collapsed? "down":"up"} style={{ paddingLeft: 5, }} size={12} color={"#fff"} onPress={() => setCollapsed(!collapsed)} />
                </TouchableOpacity>
                {/* Networks list */}
                <Dropdown collapsed={collapsed} scrollViewStyles={{ top: 42 }} options={ENUMS.NETWORK_LIST} itemUI={(item, index, collapsed) => <TouchableOpacity key={`network-key-${index}`} style={{ paddingVertical: 4,borderTopWidth:0,borderBottomWidth:0.2,borderLeftWidth:0.2,borderRightWidth:0.2,borderColor:'rgba(0,0,0,0.3)', borderBottomRightRadius:index === ENUMS.NETWORK_LIST.length-1?12:0, borderBottomLeftRadius:index === ENUMS.NETWORK_LIST.length-1?12:0 }} onPress={() => {
                    setNetwork(item);
                    setCollapsed(!collapsed);
                }}>
                    <Text style={{ textAlign: "center", paddingVertical: 3 }}>{item.text}</Text>
                    <View style={{ }} />
                </TouchableOpacity>} />
                <AnimatedView style={styles.inputView}>
                    <TouchableOpacity style={{ flexDirection: "row", left: 10 }} onPress={() => setPickerVisible(true)}>
                        <Text>{`+${country}`}</Text>
                        <VectorIcon type='AntDesign' name="down" color={"#000"} style={{margin:5}} size={12} onPress={() => setPickerVisible(true)} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                        <TextInput value={cellNo.toString()} keyboardType="numeric" placeholder='3xxxxxxxxx' pattern={Regex.pkCellNo} errorText='Please enter a valid number!' forcePattern={true} maxLength={10}
                            onChangeText={text => {
                                let number = parseInt(text);
                                if (!isNaN(number)) {
                                    setCellNo(number.toString())
                                } else setCellNo("")
                            }} />
                    </View>
                </AnimatedView>
            </View>
            <View style={styles.buttonView}>

            <Button
                style={styles.continueButton}
                text={'Continue'}
                textStyle={{ color: '#fff',...styles.textAlignCenter }}
                onPress={onPress}
                isLoading={isLoading}
                disabled={disbleContinueButton || isLoading}
            />
            </View>

            <View style={styles.termsAndConditionView}>
                <Text fontFamily={'PoppinsBold'} style={{alignSelf:'center', paddingVertical: 5,fontSize:12 }}>By tapping send OTP I am agreeing to </Text>
                <TouchableOpacity onPress={() => alert('c')}>
                    <Text fontFamily={'PoppinsLight'} style={{ color: "#6D51BB",fontSize:14 }}>
                        terms & conditions and privacy & policy
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Country Code Picker */}
            <Picker pickerVisible={pickerVisible} setCountry={setCountry} setPickerVisible={setPickerVisible} />
        </KeyboardAwareScrollView>
    </SafeAreaView >
};
