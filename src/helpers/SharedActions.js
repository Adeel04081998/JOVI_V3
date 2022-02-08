import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Alert, StatusBar } from "react-native";
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';
import { postRequest, getRequest } from '../manager/ApiManager';
import Endpoints from '../manager/Endpoints';
import Toast from "../components/atoms/Toast";
import { store } from '../redux/store';
import ReduxActions from '../redux/actions';
import GV from '../utils/GV';
const dispatch = store.dispatch;
export const sharedGetDeviceInfo = async () => {
    let model = DeviceInfo.getModel();
    let deviceID = Platform.OS === "ios" ? DeviceInfo.getUniqueId() : await DeviceInfo.getAndroidId();
    let systemVersion = DeviceInfo.getSystemVersion();
    return { deviceID, model, systemVersion }
}
export const sharedExceptionHandler = (err) => {
    // console.log("[sharedExceptionHandler].err", err);
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
            // console.log("Interval Stopped---", interlID);
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
export const fetchRobotJson = (url, cb = () => { }) => {
    // fetch('https://cloud-ex42.usaupload.com/5OSX/Robot_-_With_Shape_Layer_Text.json?download_token=5c263b7ebfac80573376d00e6ee5ce29f3d822a4d3addb5209b2e6f4cfa3a8ed', {
    fetch(renderFile(url), {
        method: "GET",
    })
        .then((response) => response.json())
        .then((responseData) => {
            cb(responseData)
            // cb(theBlob);
        })
        .catch((error) => {
            // console.log(error);
            cb(null);
        });
}
export const sharedGetHomeMsgsApi = () => {
    let payload = {
        "mascotScreenEnum": 1,
        "getPersonalizeMsgs": true,
    };
    postRequest(Endpoints.GET_HOME_MSGS, payload, res => {
        // console.log("[sharedGetHomeMsgsApi].res", res.data);
        if (res.data.homeScreenDataViewModel.robotJson) {
            fetchRobotJson(res.data.homeScreenDataViewModel.robotJson, (data) => {
                // console.log('data robotJson',data)
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
    postRequest(`${Endpoints.GET_PROMOTIONS}`, {
        "isDashboard": true,
        "isUserSpecific": false, // Need to discuss with Shakir
        "latitude": 33.668531, // should be replace with user's final destination
        "longitude": 73.075001,// should be replace with user's final destination
        "isCitySpecific": true
    }, res => {
        // console.log("[sharedGetPromotions].res", res);
        dispatch(ReduxActions.setPromotionsAction({ ...res.data }))
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

export const renderFile = (picturePath) => {
    const userReducer = store.getState().userReducer;
    return `${GV.BASE_URL.current}/api/Common/S3File/${encodeURIComponent(picturePath)}?access_token=${userReducer?.token?.authToken}`
}

export const sharedConfirmationAlert = (title, message, buttons = [], options = { cancelable: true, onDismiss: () => { } }) => {
    Alert.alert(title, message, buttons, options)
}

export const sharedGetFilters = () => {
    getRequest(Endpoints.GET_CATEGORIES_TAGS_LIST, res => {
        console.log("[sharedGetHomeMsgsApi].res ====>>", res);
        // dispatch(ReduxActions.setMessagesAction({ ...res.data, robotJson: data }));
        dispatch(ReduxActions.setCategoriesTagsAction({...res.data}))

  
    },
        err => {
            console.log("error", err);
            // sharedExceptionHandler(err)
        },
        {},
    )
      
   
}
