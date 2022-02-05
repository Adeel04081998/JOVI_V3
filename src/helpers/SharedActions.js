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
import configs from '../utils/configs';
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
        let interlID = BackgroundTimer.setInterval(function () {
            // console.log('Interval Ran----');
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            listener({ minutes, seconds, intervalStoped: false });
            if (--timer < 0) {
                listener({ minutes, seconds, intervalStoped: true });
                BackgroundTimer.clearInterval(interlID)
                console.log("Interval Stopped---", interlID);
                return;
            }
        }, 1000);
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
export const fetchRobotJson = (url,cb = () => {}) => {
    fetch(`${BASE_URL}/api/Common/S3File/${encodeURIComponent(url)}` , {
        method: "GET",
    })
        .then((response) => response.json())
        .then((responseData) => {
            cb(responseData);
        })
        .catch((error) => {
            cb(null);
            console.log(error);
        });
}
export const sharedGetHomeMsgsApi = () => {
    let payload = {
        "mascotScreenEnum": 0,
        "getPersonalizeMsgs": true,
    };
    postRequest(Endpoints.GET_HOME_MSGS, payload, res => {
        // console.log("[sharedGetHomeMsgsApi].res", res);
        if (res.data.robotJson) {
            fetchRobotJson(res.data.robotJson, (data) => {
                dispatch(ReduxActions.setMessagesAction({ ...res.data, robotJson: data }));
            });
        } else {
            dispatch(ReduxActions.setMessagesAction({ ...res.data }));
        }
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

