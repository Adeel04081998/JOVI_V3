import React, { createRef, useEffect, useRef, useState } from 'react';
import { Appearance, Keyboard, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/molecules/Button';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import otpStyles from './styles';
// import TextInput from '../../components/atoms/TextInput'; //NOT Using Component because it is not handling ref for now!!!!
import theme from '../../res/theme';
import GV from '../../utils/GV';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import SharedActions, { sendOTPToServer, sharedGetDeviceInfo } from '../../helpers/SharedActions';
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
export default (props) => {
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
    const params = props.route.params;
    const cellNo = params.payload.phoneNumber; // should be redux value
    const inputRef = useRef([]);
    const dispatch = useDispatch()
    const listerner = (info) => {
        const { minutes, seconds, isItervalStoped } = info;
        setMinutes(minutes);
        setSeconds(seconds);
        if (!isItervalStoped) {
            setRunInterval(isItervalStoped)
        }
    };
    const resetInterval = () => {
        clearInterval(intervalRef.current);
        setRunInterval(false)
        setMinutes("00");
        setSeconds("00");
    }
    React.useEffect(() => {
        if (runInterval) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                // resetInterval()
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
            resetInterval()
            RNOtpVerify.removeListener()
        };
    }, [])
    const _customEffect = () => {
        if (inputRef.current.length !== inputs.length) {
            inputRef.current = Array(inputs.length).fill().map((_, i) => inputRef.current[i] || createRef());
        };
        return () => {
            // console.log('RNOtpVerify.removeListener------')
            resetInterval()
            RNOtpVerify.removeListener();
        }
    };
    useEffect(() => {
        typedCode.length === 4 && Keyboard.dismiss();
    }, [typedCode]);


    useEffect(_customEffect, []);


    const verifyOtpToServer = async (otpCode = inputs.join('')) => {
        const payload = {
            "code": parseInt(otpCode),
            "phoneNumber": params.payload.phoneNumber,
            "userType": 1,
            "imei": sharedGetDeviceInfo().deviceID,
            "smartPhone": sharedGetDeviceInfo().model,
            "hardwareID": sharedGetDeviceInfo().deviceID
        };
        postRequest(Endpoints.OTPVerify, payload, res => {
            console.log("[verifyOtpToServer].res...", res);
            const { statusCode, message, otpResult } = res.data;
            if (statusCode === 417) return Toast.error(message);
            resetInterval()
            try {
                dispatch(ReduxAction.setUserAction({ ...otpResult, ...params }))
                if (otpResult.newUser) {
                    NavigationService.NavigationActions.stack_actions.replace(ROUTES.AUTH_ROUTES.SignUp.screen_name,{},ROUTES.AUTH_ROUTES.VerifyOTP.screen_name)
                }
                else {
                    SharedActions.navigation_listener.auth_handler(true);
                }
            }
            catch (error) {
                console.log('error', error);
            }

        },
            err => {
                console.log("err...", err.response);
                setInputs(["", "", "", ""])
                setTypedCode('')
                SharedActions.sharedExceptionHandler(err)
                resetInterval()
            },
            {},
            true,
            (loader) => setIsLoading(loader)
        );
    };
    const resendOtp = () => {
        setInputs(["", "", "", ""])
        setTypedCode('')
        const { appHash, isNewVersion, isWhatsapp, mobileNetwork, otpType, userType, phoneNumber } = params.payload;
        const payload = {
            'phoneNumber': phoneNumber,
            'appHash': appHash,
            'otpType': otpType,
            'userType': userType,
            'isWhatsapp': isWhatsapp,
            "isNewVersion": isNewVersion,
            "mobileNetwork": mobileNetwork
        };
        const onSuccess = (res) => {
            console.log("res...", res);
            setRunInterval(true)
            const { statusCode, message } = res.data;
            if (statusCode === 417) return Toast.error(message);
        }
        const onError = (err) => {
            resetInterval()
            console.log("err...", err.response);
        }
        const onLoader = (loader) => {
            setIsLoading(loader)
        }

        sendOTPToServer(payload, onSuccess, onError, onLoader)

    };

    const _onSmsListener = async () => {
        try {
            const registered = await RNOtpVerify.getOtp();
            if (registered) {
                RNOtpVerify.addListener(message => {
                    if (message === "Timeout Error.") return
                    let stringify = message.toString().match(Regex.androidOTP);
                    let parsedValue = parseInt(stringify[0]);
                    let commaSplittedArray = stringify[0].split('');
                    setInputs(commaSplittedArray)
                    if (commaSplittedArray.length === 4) verifyOtpToServer(stringify[0])
                    RNOtpVerify.removeListener()

                    // SmsRetriever.removeSmsListener();
                });
            }
        } catch (error) {
            console.log(`[_onSmsListenerPressed].catch`, JSON.stringify(error));
        }
    };
    const onChangeNumber = () => {
        NavigationService.NavigationActions.common_actions.goBack();
    }


    const _onChange = (e, nextField) => {
        e.persist();
        if (e.nativeEvent.text === " " || e.nativeEvent.text === "") return;
        if (isNaN(e.nativeEvent.text)) return;
        if (!disableOnchange && e.nativeEvent.text && nextField < inputs.length) {
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
    const onChangeHandler = (val, index) => {
        if (isNaN(val)) return;
        if (val?.length === 4) {
            let arr = []
            for (let index = 0; index < val.length; index++) {
                arr.push(val[index])
            }
            setInputs(arr)
            verifyOtpToServer(val);
        }
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
            setTypedCode(newVal)
            setInputs(inputs)
            if (newVal.length === 4) {
                verifyOtpToServer(newVal);
            }
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
                        ref={inputRef.current[index]}
                        value={input}
                        style={[styles.otpCode]}
                        keyboardType="numeric"
                        maxLength={4}
                        autoFocus={index === 0 ? true : false}
                        underlineColorAndroid="transparent"
                        autoCompleteType="tel"
                        returnKeyType="next"
                        textContentType="oneTimeCode"
                        onFocus={() => { }}
                        onChangeText={val => onChangeHandler(val, index)}
                        onKeyPress={e => _focusNextField(e, index + 1, index)}
                        onChange={(e) => _onChange(e, index + 1, index)}
                    />
                ))
            }
        </View>
        <Text style={{ textAlign: "center", paddingVertical: SPACING - 5 }}>{`${minutes}:${seconds}`}</Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>{`Didn't recieve code?`}</Text>
        <TouchableOpacity onPress={resendOtp} disabled={parseInt(seconds) !== 0} wait={1} >
            <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 10, color: parseInt(seconds) !== 0 ? 'grey' : "#7359BE", marginTop: 3 }}>{`Request again Get Via SMS`}</Text>
        </TouchableOpacity>
        <View style={styles.buttonView}>
            <Button
                style={styles.continueButton}
                text={'Verify and Create Account'}
                textStyle={{ color: '#fff', ...styles.textAlignCenter }}
                onPress={() => verifyOtpToServer()}
                isLoading={isLoading}
                disabled={disbleContinueButton || isLoading}
            />
        </View>
        <TouchableOpacity onPress={onChangeNumber}>
            <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 10, color: "#7359BE" }}>{`Change number`}</Text>
        </TouchableOpacity>
    </SafeAreaView>
}

