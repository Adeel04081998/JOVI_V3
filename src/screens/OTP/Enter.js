import React, { useEffect, useState } from 'react';
import { Animated, TouchableWithoutFeedback, FlatList, Dimensions, KeyboardAvoidingView, Platform, Easing, SafeAreaView, Appearance, StyleSheet } from 'react-native';
import Button from '../../components/molecules/Button';
import images from '../../assets/images';
import ENUMS from '../../utils/ENUMS';
import View from '../../components/atoms/View';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import VectorIcon from '../../components/atoms/VectorIcon';
import Image from '../../components/atoms/Image';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import AnimatedView from '../../components/atoms/AnimatedView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import constants from '../../res/constants';
import svgs from '../../assets/svgs';
import { SvgXml } from 'react-native-svg';
import Regex from '../../utils/Regex';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import Toast from '../../components/atoms/Toast';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import otpStyles from './styles';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';

const HEIGHT = 120;
const SPACING_VERTICAL = 10;
const EXP_HEIGHT = (HEIGHT * 2) + SPACING_VERTICAL;
const NetworkList = ({ collapsed, setNetwork, setCollapsed }) => {
    return <View style={{}}>
        {
            ENUMS.NETWORK_LIST.map((network, index) => (
                <TouchableOpacity key={`network-key-${index}`} style={{ paddingVertical: SPACING_VERTICAL - 5 }} onPress={() => {
                    setNetwork(network);
                    setCollapsed(!collapsed);
                }}>
                    <Text style={{ textAlign: "center", paddingVertical: SPACING_VERTICAL }}>{network.text}</Text>
                    <View style={{ borderBottomColor: "#F6F5FA", borderBottomWidth: 2 }} />
                </TouchableOpacity>
            ))
        }

    </View>
}
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
    const styles = otpStyles.styles(colors);
    const [collapsed, setCollapsed] = React.useState(true);
    const [pickerVisible, setPickerVisible] = React.useState(false);
    const [cellNo, setCellNo] = React.useState("");
    const [network, setNetwork] = React.useState({
        text: "Choose your mobile netwrok",
        value: 0
    });
    const [country, setCountry] = React.useState("92");
    const animationHeight = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        if (collapsed) {
            Animated.timing(animationHeight, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
                easing: Easing.ease
            }).start();
        }
        else {
            Animated.timing(animationHeight, {
                toValue: EXP_HEIGHT,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.ease
            }).start();
        }
    }, [collapsed]);
    const onPress = () => {
        if (network.value <= 0) return Toast.info("Please select your mobile network.");
        postRequest(Endpoints.SEND_OTP, {
            'phoneNumber': country + cellNo,
            'appHash': "XNZuxsosN/Q",
            'otpType': 1,
            'userType': 1,
            'isWhatsapp': false,
            "isNewVersion": true,
            "mobileNetwork": network.value
        }, res => {
            console.log("res...", res);
            const { statusCode, message } = res.data;
            if (statusCode === 417) return Toast.error(message);
            NavigationService.common_actions.navigate(ROUTES.AUTH_ROUTES.VerifyOTP.screen_name)
        },
            err => {
                console.log("err...", err);
            },
            {}
        );
    }
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F5FA" }}>
        <Text style={{ textAlign: "center" }}>Continue with phone</Text>
        <KeyboardAwareScrollView>
            {/* <Image source={images.otp()} style={{ height: 100, width: 100, alignSelf: "center" }} /> */}
            <SvgXml xml={svgs.otp()} height={120} width={120} style={{ alignSelf: "center" }} />
            <Text style={{ textAlign: "center", }}>You will recieve a 4 digit code to verify next</Text>
            <View style={{ marginHorizontal: 20, marginVertical: 15, borderRadius: 12, overflow: 'hidden', backgroundColor: "#fff" }}>
                <TouchableOpacity activeOpacity={1} style={{ backgroundColor: "#000", alignItems: "center", flexDirection: "row", justifyContent: "center", paddingVertical: SPACING_VERTICAL }} onPress={() => setCollapsed(!collapsed)} >
                    <Text style={{ color: "#fff", textAlign: "center" }}>{network.text}</Text>
                    <VectorIcon type='Ionicons' name={"ios-arrow-down"} style={{ paddingLeft: 5 }} color={"#fff"} onPress={() => setCollapsed(!collapsed)} />
                </TouchableOpacity>
                {/* Networks list */}
                <AnimatedView style={{
                    height: animationHeight,
                    elevation: 1,

                }}>
                    <NetworkList collapsed={collapsed} setCollapsed={setCollapsed} setNetwork={setNetwork} />
                </AnimatedView>
                <AnimatedView style={{
                    backgroundColor: "#fff", flexDirection: "row", alignItems: "center", paddingBottom: 20,
                }}>
                    <TouchableOpacity style={{ flexDirection: "row", left: 10 }} onPress={() => setPickerVisible(true)}>
                        <Text>{`+${country}`}</Text>
                        <VectorIcon type='Ionicons' name="ios-arrow-down" color={"#000"} onPress={() => setPickerVisible(true)} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                        <TextInput value={cellNo.toString()} placeholder='3xxxxxxxxx' pattern={Regex.pkCellNo} errorText='Please enter a valid number!' forcePattern={true} maxLength={10}
                            onChangeText={text => {
                                let number = parseInt(text);
                                if (!isNaN(number)) {
                                    setCellNo(number.toString())
                                } else setCellNo("")
                            }} />
                    </View>
                </AnimatedView>
            </View>

            <TouchableOpacity style={{ marginHorizontal: 20, backgroundColor: "#7359BE", borderRadius: 10, paddingVertical: 15 }} activeOpacity={.7} onPress={onPress}>
                <Text style={{ color: "#fff", textAlign: "center" }}>Continue</Text>
            </TouchableOpacity>

            <View style={{ marginVertical: 5, alignSelf: "center" }}>
                <Text style={{ paddingVertical: 5 }}>By tapping send OTP i am agreeing to </Text>
                <TouchableOpacity onPress={() => alert('c')}>
                    <Text style={{ color: "purple" }}>
                        terms & conditions {" "}
                        <Text style={{ color: "#000" }} onPress={() => { }}>and</Text>
                        {" "}
                        <Text style={{ color: "purple" }}>privacy & policy</Text>
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Country Code Picker */}
            <Picker pickerVisible={pickerVisible} setCountry={setCountry} setPickerVisible={setPickerVisible} />
        </KeyboardAwareScrollView>
    </SafeAreaView >
};
