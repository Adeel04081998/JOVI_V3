import React, { createRef, useEffect, useRef, useState } from 'react';
import { Appearance, Keyboard, Platform, TextInput } from 'react-native';
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
import SharedActions, { sendOTPToServer, sharedGetDeviceInfo, sharedInteval, sharedExceptionHandler } from '../../helpers/SharedActions';
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
    const [minutes, setMinutes] = React.useState("00");
    const [seconds, setSeconds] = React.useState("00");
    const [isLoading, setIsLoading] = React.useState(false);
    const [runInterval, setRunInterval] = React.useState(true);
    const intervalRef = React.useRef(null);
    const arrRef = React.useRef([]);
    const disbleContinueButton = inputs?.includes('');
    const params = props.route.params;
    const cellNo = params.payload.phoneNumber; // should be redux value
    const [requestAgain, setRequestAgain] = React.useState(true);
    const isRequestSent = React.useRef(false);
    // refs to focus input 
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const inputRef4 = useRef(null);

    const dispatch = useDispatch()
    const listerner = (info) => {
        const { minutes, seconds, isItervalStoped } = info;
        setMinutes(minutes);
        setSeconds(seconds);
        if (info.intervalStoped === true) return setRequestAgain(false)
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
            intervalRef.current = sharedInteval(GV.OTP_INTERVAL, 1, listerner)
        }
    }, [runInterval])
    React.useEffect(() => {
        _onSmsListener()
        // Sms.requestReadSmsPermission()
        //     .then(async res => {
        //         _onSmsListener();
        //     })
        //     .catch(err => console.log("err...", err));
        return () => {
            resetInterval()
            RNOtpVerify.removeListener()
        };
    }, [])


    const _customEffect = () => {

        return () => {
            // console.log('RNOtpVerify.removeListener------')
            resetInterval()
            RNOtpVerify.removeListener();
        }
    };



    useEffect(_customEffect, []);
    const refCallback = inputRef => node => {
        inputRef.current = node;
    };



    const onOptChange = (index) => {
        return (value) => {
            if (isNaN(Number(value))) {
                return;
            }
            const otpArrayCpy = inputs.concat();
            otpArrayCpy[index] = value;
            setInputs(otpArrayCpy);
            let result = true
            for (let i = 0; i < otpArrayCpy.length; i++) {
                if (otpArrayCpy[i] <= 0) {
                    result = false;
                    break;
                }
            }
            if (result) {
                let _tempArr = otpArrayCpy.toString()
                let tempStr = _tempArr.replace(/,/g, '')
                verifyOtpToServer(tempStr, 'from onOptChange if')
            }
            if (value !== '') {
                if (index === 0) {
                    inputRef2.current.focus();
                } else if (index === 1) {
                    inputRef3.current.focus();
                } else if (index === 2) {
                    inputRef4.current.focus();
                }
            }
        };
    };



    const onOTPKeyPress = (index) => {
        return ({ nativeEvent: { key: value } }) => {
            //autofocus to previous input if the value is blank and existing value is also blank
            if (value === 'Backspace' && (inputs[index] === '')) {
                if (index === 1) {
                    inputRef1.current.focus();
                } else if (index === 2) {
                    inputRef2.current.focus();
                } else if (index === 3) {
                    inputRef3.current.focus();
                }
                if (Platform.OS === "android" && index > 0) {
                    const otpArrayCpy = inputs.concat();
                    otpArrayCpy[index - 1] = '';
                    setInputs(otpArrayCpy);
                }
            }
            else if (value !== 'Backspace' && Platform.OS === "ios" && value !== '') {
                const lastThreeInputs = inputs.slice(1, inputs.length).find(x => x ? true : false)
                arrRef.current = arrRef.current.concat(value)
                if (arrRef.current.length === 4 && index === 0 && !lastThreeInputs) {
                    console.log('here in else backspace');
                    let _tempArr = arrRef.current.toString()
                    let tempStr = _tempArr.replace(/,/g, '')
                    setInputs(arrRef.current)
                    verifyOtpToServer(tempStr, 'from onOTPKeyPress')
                }
            }
        };
    };

    const verifyOtpToServer = async (otpCode = inputs.join(''), tempStr) => {
        Keyboard.dismiss()
        if (!isRequestSent.current) {
            isRequestSent.current = true;
            const payload = {
                "code": parseInt(otpCode),
                "phoneNumber": params.payload.phoneNumber,
                "userType": 1,
                "imei": sharedGetDeviceInfo().deviceID,
                "smartPhone": sharedGetDeviceInfo().model,
                "hardwareID": sharedGetDeviceInfo().deviceID
            };
            postRequest(Endpoints.OTP_VERIFY, payload, res => {
                const { statusCode, message, otpResult } = res.data;
                if (statusCode === 417) return Toast.error(message);
                resetInterval()
                try {
                    dispatch(ReduxAction.setUserAction({ ...otpResult, ...params.payload, isLoggedIn: otpResult.newUser ? false : true, introScreenViewed: otpResult.newUser ? false : true }))
                    if (otpResult.newUser) {
                        NavigationService.NavigationActions.stack_actions.replace(ROUTES.AUTH_ROUTES.SignUp.screen_name, {}, ROUTES.AUTH_ROUTES.VerifyOTP.screen_name)
                        // NavigationService.NavigationActions.common_actions.reset(null,[{name: ROUTES.AUTH_ROUTES.SignUp.screen_name}])
                    }
                }
                catch (error) {
                    console.log('[verifyOtpToServer].error', error);
                }

            },
                err => {
                    isRequestSent.current = false;
                    setInputs(["", "", "", ""])
                    arrRef.current = []
                    sharedExceptionHandler(err)
                    // resetInterval()
                },
                {},
                true,
                (loader) => setIsLoading(loader)
            );
        } else console.log(" isRequestSent.current", isRequestSent.current);
    };
    const resendOtp = () => {
        setRequestAgain(true)
        setInputs(["", "", "", ""])
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
            const { statusCode, message } = res.data;
            if (statusCode === 417) return Toast.error(message);
            else {
                setRunInterval(true)
                _onSmsListener()
            }
        }
        const onError = (err) => {
            resetInterval()
        }
        const onLoader = (loader) => {
            setIsLoading(loader)
        }
        if (requestAgain) return
        sendOTPToServer(payload, onSuccess, onError, onLoader)

    };

    const _onSmsListener = async () => {
        try {
            const registered = await RNOtpVerify.getOtp();
            if (registered) {
                RNOtpVerify.addListener(message => {
                    if (message === "Timeout Error.") return
                    let stringify = message.toString().match(Regex.androidOTP);
                    let commaSplittedArray = stringify[0].split('');
                    setInputs(commaSplittedArray)
                    if (commaSplittedArray.length === 4) verifyOtpToServer(stringify[0], 'from sms listener if')
                    RNOtpVerify.removeListener()
                });
            }
        } catch (error) {
            console.log(`[_onSmsListenerPressed].catch`, JSON.stringify(error));
        }
    };


    const onChangeNumber = () => {
        NavigationService.NavigationActions.common_actions.goBack();
    }


    const renderTopUi = () => {
        return (
            <View style={{ marginVertical: 30 }} >
                <Text style={{ textAlign: "center", color: '#000', fontWeight: '600', paddingVertical: 10 }} fontFamily={"PoppinsMedium"} >{"Verify Phone Number"}</Text>
                <Text style={{ textAlign: "center", color: '#7D7D7D' }} fontFamily={"PoppinsMedium"}  >{`Code is sent to ${cellNo}`}</Text>
            </View>
        )
    }

    const renderInputsUi = () => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                {[inputRef1, inputRef2, inputRef3, inputRef4].map(
                    (inputRef, i) => (
                        <TextInput
                            ref={refCallback(inputRef)}
                            onChangeText={onOptChange(i)}
                            onKeyPress={onOTPKeyPress(i)}
                            value={inputs[i]}
                            maxLength={1}
                            key={i}
                            autoFocus={i === 0 ? true : undefined}
                            style={[styles.otpCode]}
                            keyboardType="numeric"
                            underlineColorAndroid="transparent"
                            autoCompleteType="tel"
                            returnKeyType="next"
                            textContentType="oneTimeCode"
                        />
                    )
                )}
            </View>
        )
    }


    const renderResendButtonUi = () => {
        return (
            <TouchableOpacity onPress={resendOtp}
                // disabled={parseInt(seconds) !== 0}
                disabled={requestAgain}
                wait={1} >
                <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 12, color: requestAgain ? 'grey' : "#7359BE", marginTop: 3 }}>{`Request again Get Via SMS`}</Text>
            </TouchableOpacity>
        )
    }


    const renderVerifyButtonUi = () => {
        return (
            <View style={styles.buttonView}>
                <Button
                    style={styles.continueButton}
                    text={'Verify'}
                    textStyle={{ color: '#fff', ...styles.textAlignCenter, fontSize: 14 }}
                    onPress={() => verifyOtpToServer()}
                    isLoading={isLoading}
                    disabled={disbleContinueButton || isLoading}
                />
            </View>
        )
    }


    const renderChangeNumberUi = () => {
        return (
            <TouchableOpacity onPress={onChangeNumber}>
                <Text style={{ textAlign: "center", textDecorationLine: "underline", fontSize: 12, color: "#7359BE" }}>{`Change phone number`}</Text>
            </TouchableOpacity>
        )
    }


    return <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F5FA" }}>
        {renderTopUi()}
        {renderInputsUi()}
        <Text style={{ textAlign: "center", paddingVertical: SPACING - 5 }}>{`${minutes}:${seconds}`}</Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>{`Didn't receive code?`}</Text>
        {renderResendButtonUi()}
        {renderVerifyButtonUi()}
        {renderChangeNumberUi()}
    </SafeAreaView>
}

