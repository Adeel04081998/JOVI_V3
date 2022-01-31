import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Dimensions, Platform, KeyboardAvoidingView, Appearance } from 'react-native';
import Button from '../../components/molecules/Button';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import otpStyles from './styles';
import TextInput from '../../components/atoms/TextInput';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import SharedActions from '../../helpers/SharedActions';
import Sms from "../../helpers/Sms";
import RNOtpVerify from "react-native-otp-verify";
import Regex from '../../utils/Regex';
const SPACING = 20;
export default () => {
    const cellNo = "923039839093"; // should be redux value
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const styles = otpStyles.styles(colors);
    const inputs = Array(4).fill();
    const [minutes, setMinutes] = React.useState("00");
    const [seconds, setSeconds] = React.useState("00");
    const [runInterval, setRunInterval] = React.useState(true);
    const listerner = (info) => {
        const { minutes, seconds, isItervalStoped } = info;
        console.log("info", info);
        setMinutes(minutes);
        setSeconds(seconds);
        if (!isItervalStoped) {
            setRunInterval(isItervalStoped)
        }
    };
    React.useEffect(() => {
        if (runInterval) {
            SharedActions.sharedInteval(GV.OTP_INTERVAL, 1, listerner)
        }
    }, [runInterval])
    const onResend = () => setRunInterval(true);
    React.useEffect(() => {
        Sms.requestReadSmsPermission()
            .then(async res => {
                _onSmsListener();
            })
            .catch(err => console.log("err...", err))
    }, [])
    const _onSmsListener = async () => {
        try {
            const registered = await RNOtpVerify.getOtp();
            console.log("registered", registered)
            if (registered) {
                RNOtpVerify.addListener(message => {
                    console.log("message", message);
                    let stringify = message.toString().match(Regex.androidOTP);
                    let parsedValue = parseInt(stringify[0]);
                    let commaSplittedArray = stringify[0].split('');
                    RNOtpVerify.removeListener()
                    // SmsRetriever.removeSmsListener();
                });
            }
        } catch (error) {
            console.log(`[_onSmsListenerPressed].catch`, JSON.stringify(error));
        }
    };
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F5FA" }}>
        <Text style={{ textAlign: "center" }}>Verify Phone</Text>
        <Text style={{ textAlign: "center", paddingVertical: SPACING }}>{`Code is sent to ${cellNo}`}</Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {
                inputs.map((input, index) => (
                    <TextInput
                        key={`input-key-${index}`}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder=""
                        // ref={elRefs.current[i]}
                        // value={val}
                        // value={state[i]}
                        style={[styles.otpCode]}
                        // style={{
                        //     width: 65, elevation: 2,
                        //     shadowColor: '#000000',
                        //     shadowRadius: 4,
                        //     shadowOffset: { height: 4, width: 0 },
                        //     shadowOpacity: 0.5,
                        // }}
                        keyboardType="numeric"
                        maxLength={1}
                        // autoFocus={i === 0 ? true : false}
                        underlineColorAndroid="transparent"
                        autoCompleteType="tel"
                        returnKeyType="next"
                        textContentType="oneTimeCode"
                    // onFocus={() => setState(pre => ({ ...pre, focusedIndex: i }))}
                    // onChangeText={val => onChangeHanlder(val, i)}
                    // onKeyPress={e => _focusNextField(e, i + 1, i)}
                    // onChange={(e) => _onChange(e, i + 1, i)}
                    />
                ))
            }
        </View>
        <Text style={{ textAlign: "center", paddingVertical: SPACING - 5 }}>{`${minutes}:${seconds}`}</Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>{`Didn't recieve code?`}</Text>
        <TouchableOpacity onPress={onResend}>
            <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 10, color: "#7359BE", marginTop: 3 }}>{`Request again Get Via SMS`}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginHorizontal: 20, backgroundColor: "#7359BE", borderRadius: 10, paddingVertical: 15, marginVertical: SPACING }} activeOpacity={.7} onPress={() => { }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Verify and Create Account</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 10, color: "#7359BE" }}>{`Change number`}</Text>


    </SafeAreaView>
}

