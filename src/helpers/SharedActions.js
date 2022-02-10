import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from "react-native";
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';
import { postRequest, getRequest } from '../manager/ApiManager';
import Endpoints from '../manager/Endpoints';
import Toast from "../components/atoms/Toast";
import { store } from '../redux/store';
import ReduxActions from '../redux/actions';
const dispatch = store.dispatch;
export const sharedGetDeviceInfo = async () => {
    let model = DeviceInfo.getModel();
    let deviceID = Platform.OS === "ios" ? DeviceInfo.getUniqueId() : await DeviceInfo.getAndroidId();
    let systemVersion = DeviceInfo.getSystemVersion();
    return { deviceID, model, systemVersion }
}
export const sharedExceptionHandler = (err) => {
    console.log("[sharedExceptionHandler].err", err);
    const TOAST_SHOW = 3000;
    if (err) {
        if (err.data && err.data.errors) {
            var errorKeys = Object.keys(err.data.errors),
                errorStr = "";
            for (let index = 0; index < errorKeys.length; index++) {
                if (index > 0) errorStr += err.data.errors[errorKeys[index]][0] + "\n"
                else errorStr += err.data.errors[errorKeys[index]][0]
            }
            Toast.error(errorStr, TOAST_SHOW);
        }
        else if (err.errors && typeof err.errors === "object") {
            var errorKeys = Object.keys(err.errors),
                errorStr = "";
            for (let index = 0; index < errorKeys.length; index++) {
                if (index > 0) errorStr += err.errors[errorKeys[index]][0] + "\n"
                else errorStr += err.errors[errorKeys[index]][0]
            }
            Toast.error(errorStr, TOAST_SHOW);
        }

        else if (err && typeof err === "string") {
            Toast.error(err, TOAST_SHOW);
        }
        else if (err.message && typeof err.message === "string") {
            Toast.error(err.message, TOAST_SHOW);
        }
        else if (err.Error && typeof err.Error === "string") {
            Toast.error(err.Error, TOAST_SHOW);
        }
        else if (err.error && typeof err.error === "string") {
            Toast.error(err.error, TOAST_SHOW);
        }
        else {
            Toast.error('Something went wrong', TOAST_SHOW);
        }
    }
}
export const sharedInteval = (duration = 30, delay = 1, listener = () => { }) => {
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
export const sendOTPToServer = (payload, onSuccess, onError, onLoader) => {
    postRequest(Endpoints.SEND_OTP, payload, res => {
        onSuccess(res)
    },
        err => {
            onError(err)
        },
        {},
        true,
        (loader) => { onLoader(loader) }
    );
}
export const sharedGetEnumsApi = () => {
    getRequest(Endpoints.GET_ENUMS, res => {
        // console.log("[getEnums].res", res);
        dispatch(ReduxActions.setEnumsActions(res.data.enums))
    },
        err => {
            sharedExceptionHandler(err)
        },
        {},
        false,
    );
}
export const sharedGetUserDetailsApi = () => {
    getRequest(Endpoints.GET_USER_DETAILS, res => {
        // console.log("[getUserDetailsApi].res", res);
        dispatch(ReduxActions.setUserAction({ ...res.data.userDetails }));
    },
        err => {
            sharedExceptionHandler(err)
        },
        {},
        false,
    );
}
export const sharedGetHomeMsgsApi = () => {
    let payload = {
        "mascotScreenEnum": 0,
        "getPersonalizeMsgs": true,
    };
    postRequest(Endpoints.GET_HOME_MSGS, payload, res => {
        // console.log("[sharedGetHomeMsgsApi].res", res);
        dispatch(ReduxActions.setHomeMessagesAction({ ...res.data }))
    },
        err => {
            sharedExceptionHandler(err)
        },
        {},
        false,
    );
}
export const sharedGetUserAddressesApi = () => {
    getRequest(Endpoints.GET_USER_ADDRESSES, res => {
        // console.log("[sharedGetHomeMsgsApi].res", res);
        dispatch(ReduxActions.setUserAction({ ...res.data }))
    },
        err => {
            sharedExceptionHandler(err)
        },
        {},
        false,
    );
}
export const sharedGetPromotions = () => {
    getRequest(`${Endpoints.GET_PROMOTIONS}/true`, res => {
        // console.log("[sharedGetHomeMsgsApi].res", res);
        dispatch(ReduxActions.setUserAction({ ...res.data }))
    },
        err => {
            sharedExceptionHandler(err)
        },
        {},
        false,
    );
}

export const sharedLogoutUser = () => {
    dispatch(ReduxActions.clearUserAction({ introScreenViewed: true }));
}

export const sharedStartingRegionPK = {
    latitude: 25.96146850382255,
    latitudeDelta: 24.20619842968337,
    longitude: 69.89856876432896,
    longitudeDelta: 15.910217463970177
};

export const secToHourMinSec = (sec = 1,) => {
    let totalSeconds = parseInt(sec);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // If you want strings with leading zeroes:
    minutes = String(minutes).padStart(2, "0");
    hours = String(hours).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    if (hours > 0) {
        return hours + ":" + minutes + ":" + seconds;
    }

    return minutes + ":" + seconds;

}//end of secToHourMinSec

