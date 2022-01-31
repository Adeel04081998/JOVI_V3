import React, { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Dimensions, Platform, KeyboardAvoidingView, Appearance, Keyboard, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/molecules/Button';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import otpStyles from './styles';
// import TextInput from '../../components/atoms/TextInput';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import SharedActions from '../../helpers/SharedActions';
import Sms from "../../helpers/Sms";
import RNOtpVerify from "react-native-otp-verify";
import Regex from '../../utils/Regex';
import NavigationService from '../../navigations/NavigationService';
import Endpoints from '../../manager/Endpoints';
import ROUTES from '../../navigations/ROUTES';
import { postRequest } from '../../manager/ApiManager';
import Toast from '../../components/atoms/Toast';
import ReduxAction from '../../redux/actions/index'


const SPACING = 20;
export default () => {
    const cellNo = "923039839093"; // should be redux value
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const styles = otpStyles.styles(colors);
    const [inputs, setInputs] = React.useState(["", "", "", ""]);
    const [typedCode, setTypedCode] = useState('')
    const [minutes, setMinutes] = React.useState("00");
    const [seconds, setSeconds] = React.useState("00");
    const [isLoading, setIsLoading] = React.useState(false);
    const [runInterval, setRunInterval] = React.useState(true);
    const intervalRef = React.useRef(null);
    const [disableOnchange, setDisableOnChange] = useState(false)
    const disbleContinueButton = inputs.includes('');
    const inputRef = useRef([]);
    const dispatch = useDispatch()
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
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = SharedActions.sharedInteval(GV.OTP_INTERVAL, 1, listerner)
        }
    }, [runInterval])
    React.useEffect(() => {
        Sms.requestReadSmsPermission()
            .then(async res => {
                _onSmsListener();
            })
            .catch(err => console.log("err...", err));
        return () => {
            clearInterval(intervalRef.current);
            setRunInterval(false)
            RNOtpVerify.removeListener()
        };
    }, [])
    const _customEffect = () => {
        if (inputRef.current.length !== inputs.length) {
            inputRef.current = Array(inputs.length).fill().map((_, i) => inputRef.current[i] || createRef());
        };
        return () => {
            // console.log('RNOtpVerify.removeListener------')
            setRunInterval(false)
            clearInterval(intervalRef.current);
            RNOtpVerify.removeListener();
        }
    };
    useEffect(() => {
        typedCode.length === 4 && Keyboard.dismiss();
    }, [typedCode]);


    useEffect(_customEffect, []);


    const verifyOtpToServer = async (otpCode) => {

        const payload = {
            "code": otpCode,
            "phoneNumber": __DEV__ ? '923365898423' : '',
            "userType": 1,
            "imei": SharedActions.sharedGetDeviceInfo().devieID,
            "smartPhone": SharedActions.sharedGetDeviceInfo().model,
            "hardwareID": SharedActions.sharedGetDeviceInfo().devieID
        };
        postRequest(Endpoints.OTPVerify, payload, res => {
            console.log("res...", res);
            const { statusCode, message, otpResult } = res.data;
            if (statusCode === 417) return Toast.error(message);
            setRunInterval(false)
            clearInterval(intervalRef.current);
            dispatch(ReduxAction.userAction(...otpResult))
            if(otpResult.newUser){
            NavigationService.common_actions.navigate(ROUTES.AUTH_ROUTES.SignUP.screen_name)
            }
            else{
                NavigationService.common_actions.navigate(ROUTES.APP_ROUTES.Home.screen_name)
            }
        },
            err => {
                console.log("err...", err.response);
                setRunInterval(false)
                clearInterval(intervalRef.current);
            },
            {},
            true,
            (loader) => setIsLoading(loader)
        );
    };
    const resendOtp = () => {
        // setState(prevState => ({ ...prevState, intervalStoped: true, otpVerified: false, '0': '', '1': '', '2': '', '3': '', focusedIndex: initState.focusedIndex, inputs: initState.inputs }));
        // postRequest('/api/User/OTP/Send', { "phoneNumber": phoneNumber, "appHash": appHash[0], "isResend": true, 'otpType': 1, "isNewVersion": true, 'userType': isJoviCustomerApp ? 1 : 2, }, {}, dispatch, onResendSuccess, onResendError, '');
        // startListeningForOtp();
    };

    const _onSmsListener = async () => {
        try {
            const registered = await RNOtpVerify.getOtp();
            console.log("registered", registered)
            if (registered) {
                RNOtpVerify.addListener(message => {
                    console.log("message", message);
                    let stringify = message.toString().match(Regex.androidOTP);
                    console.log('stringify', stringify);
                    let parsedValue = parseInt(stringify[0]);
                    console.log('parsedValue', parsedValue);

                    let commaSplittedArray = stringify[0].split('');
                    console.log('commaSplittedArray', commaSplittedArray);
                    setInputs(commaSplittedArray)
                    RNOtpVerify.removeListener()
                    // SmsRetriever.removeSmsListener();
                });
            }
        } catch (error) {
            console.log(`[_onSmsListenerPressed].catch`, JSON.stringify(error));
        }
    };
    const onChangeNumber = () => {
        NavigationService.common_actions.goBack();
    }


    const _onChange = (e, nextField) => {
        e.persist();
        if (e.nativeEvent.text === " " || e.nativeEvent.text === "") return;
        if (isNaN(e.nativeEvent.text)) return;
        if (!disableOnchange && e.nativeEvent.text && nextField < inputs.length) {
            console.log('OnChange', inputRef.current[nextField]);
            inputRef.current[nextField].current.focus();
        };
    };
    const _focusNextField = (e, nextField, currentIndex) => {
        if (e.nativeEvent.key === "Backspace") {
            let prevField = nextField >= 2 ? nextField - 2 : 0;
            if (inputs[currentIndex] !== "") return;
            else if (inputs[currentIndex] === "") return inputRef.current[prevField].current.focus();
        }
    };
    const onChangeHanlder = (val, index) => {
        if (isNaN(val)) return;
        else {
            val = val.trim();
            let newVal = "";
            if (!val) {
                inputs[index] = "";
                newVal = typedCode.slice(0, typedCode.length - 1);
            } else {
                newVal = typedCode.concat(val);
                inputs[index] = newVal[index];
            };
            // setState(prevState => ({ ...prevState, typedCode: newVal, inputs, [index]: val }));
            setTypedCode(newVal)
            setInputs(inputs)
            if (newVal.length === 4) {
                verifyOtpToServer(parseInt(newVal));
            }
        }

        // debugger;
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
                        ref={inputRef.current[index]}
                        value={input}
                        style={[styles.otpCode]}
                        keyboardType="numeric"
                        maxLength={1}
                        autoFocus={index === 0 ? true : false}
                        underlineColorAndroid="transparent"
                        autoCompleteType="tel"
                        returnKeyType="next"
                        textContentType="oneTimeCode"
                        onFocus={() => { }}
                        onChangeText={val => onChangeHanlder(val, index)}
                        onKeyPress={e => _focusNextField(e, index + 1, index)}
                        onChange={(e) => _onChange(e, index + 1, index)}
                    />
                ))
            }
        </View>
        <Text style={{ textAlign: "center", paddingVertical: SPACING - 5 }}>{`${minutes}:${seconds}`}</Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>{`Didn't recieve code?`}</Text>
        <TouchableOpacity onPress={resendOtp} disabled={parseInt(seconds) !== 0}>
            <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 10, color: parseInt(seconds) !== 0 ? 'grey' : "#7359BE", marginTop: 3 }}>{`Request again Get Via SMS`}</Text>
        </TouchableOpacity>
        <View style={styles.buttonView}>
            <Button
                style={styles.continueButton}
                text={'Verify and Create Account'}
                textStyle={{ color: '#fff', ...styles.textAlignCenter }}
                onPress={() => { }}
                isLoading={isLoading}
                disabled={disbleContinueButton || isLoading}
            />
        </View>
        <TouchableOpacity onPress={onChangeNumber}>
            <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 10, color: "#7359BE" }}>{`Change number`}</Text>
        </TouchableOpacity>


    </SafeAreaView>
}

