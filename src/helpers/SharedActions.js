import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from "react-native";
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';
import Toast from "../components/atoms/Toast";
export const sharedGetDeviceInfo = () => {
    let model = DeviceInfo.getModel();
    let deviceID = Platform.OS === "ios" ? DeviceInfo.getUniqueId() : DeviceInfo.getAndroidId();
    let systemVersion = DeviceInfo.getSystemVersion();
    return { deviceID, model, systemVersion }
}
export default {
    navigation_listener: null,
    sharedExceptionHandler: (err) => {
        if (err) {
            if (err.errors && typeof err.errors === "object") {
                var errorKeys = Object.keys(err.errors),
                    errorStr = "";
                for (let index = 0; index < errorKeys.length; index++) {
                    if (index > 0) errorStr += err.errors[errorKeys[index]][0] + "\n"
                    else errorStr += err.errors[errorKeys[index]][0]
                }
                Toast.error(errorStr, null, 3000);
            }
            else if (err && typeof err === "string") {
                Toast.error(err, null, 3000);
            }
            else if (err.message && typeof err.message === "string") {
                Toast.error(err.message, null, 3000);
            }
            else if (err.Error && typeof err.Error === "string") {
                Toast.error(err.Error, null, 3000);
            }
            else if (err.error && typeof err.error === "string") {
                Toast.error(err.error, null, 3000);
            }
            else {
                Toast.error('Something went wrong', null, 3000);
            }
        }
    },
    sharedInteval: (duration = 30, delay = 1, listener = () => { }) => {
        // DURATION MUST BE IS SECONDS
        var timer = duration, minutes, seconds;
        BackgroundTimer.start();
        let interlID = setInterval(() => {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            listener({ minutes, seconds, intervalStoped: false });
            if (--timer < 0) {
                BackgroundTimer.stop();
                listener({ minutes, seconds, intervalStoped: true });
                clearInterval(interlID)
                console.log("Interval Stopped---");
                return;
            }
        }, delay * 1000);
        return interlID;
    }
}
export const focusAwareStatusBar = (props) => {
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar {...props} /> : null;
}
export const VALIDATION_CHECK = (text) => {
    text = `${text}`.toLowerCase().trim();
    if (text === "" || text === " " || text === "null" || text === "undefined" || text === "false") {
        return false;
    }
    return true;
  
}
