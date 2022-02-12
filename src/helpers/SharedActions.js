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
import GV, { PITSTOP_TYPES } from '../utils/GV';
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
export const sharedCalculateCartTotals = (pitstops = []) => {
    let subTotal = 0,
    discount = 0,
    serviceCharges = 0,
    total = 0;


}
export const sharedDiscountsCalculator = (originalPrice = 0, discount = 0, discountDivider = 100) => {
    let afterDiscount = Math.round(originalPrice - (originalPrice * (discount / discountDivider)));
    return afterDiscount;
};
export const sharedJoviRemainingAmountCalculator = (pitstops, cartReducer) => {
    let joviPitstops = pitstops.filter(p => p.pitstopType === PITSTOP_TYPES.JOVI),
        openOrdersList = cartReducer.openOrdersList,
        joviPrevOrderesPitstopsAmount = 0,
        joviRemainingAmount = 0;
    if (joviPitstops.length) {
        if (openOrdersList.length) {
            joviPrevOrderesPitstopsAmount = openOrdersList.map((orderInfo, index) => orderInfo?.estimatePrice ?? 0).reduce((a, b) => a + b);
        }
        joviRemainingAmount = joviPrevOrderesPitstopsAmount - joviPitstops.map((orderInfo, index) => orderInfo?.estimatePrice ?? 0).reduce((a, b) => a + b);
        return joviRemainingAmount;
    } else console.log("[JOVI PITSTOP NOT FOUND TO CALCULATE REMAINING AMOUNT..]")
}
export const sharedUniqueIdGenerator = (randomNum = 1000) => {
    return Math.floor(Math.random() * randomNum) + new Date().getTime();
}
export const sharedAddUpdatePitstop = (pitstopDetails = {},isDeletePitstop = false, isDeleteItem = false, swappedArray = []) => {
    if (false) return dispatch(ReduxActions.clearCartAction({}))
    // FOR JOVI PITSTOPS
    // {
    //      GIVE ONLY ITEM OBJECT TO ADD NEW PITSTOP
    //      GIVE ITEM AND INDEX TO UPDATE
    //      GIVE INDEX >= 0 AND ISDELETE AS TRUE TO DELETE PITSTOP
    // }
    // **********
    // FOR VENDOR PITSTOP

    const cartReducer = store.getState().cartReducer;
    const pitstopIndex = pitstopDetails.pitstopIndex || null;
    let pitstops = cartReducer.pitstops;
    let joviRemainingAmount = cartReducer.joviRemainingAmount;
    
    if (pitstopDetails.pitstopType === PITSTOP_TYPES.JOVI) {
        console.log("[JOVI PITSTOP]")
        // JOVI PITSTOPS HANDLING
        if (pitstopIndex !== null) {
            console.log("[INDEX] EXIST")
            if (isDeletePitstop) {
                // DELETE CASE
                console.log("[DELETE PITSTOP CASE]")
                pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIndex)
            } else {
                // EDIT CASE
                console.log("[UPDATE]")
                pitstops[pitstopIndex] = { ...pitstopDetails }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS 
                // pitstops[index] = { ...pitstops[index], ...pitstopDetails }; // ...pitstops[index] IF YOU DON'T HAVE ITEM'S PREVIOUS DATA (VERY RARE CASE)
            }
        } else {
            // ADD NEW PITSTOP
            console.log("[NEW CREATE]")
            pitstops.push({ pitstopID: sharedUniqueIdGenerator(), ...pitstopDetails, })
        }
        console.log("[PITSTOPS]", pitstops)
        joviRemainingAmount = sharedJoviRemainingAmountCalculator(pitstops, cartReducer);
    } 
    else {
        // VENDOR PITSTOPS HANDLING
        const upcomingVendorDetails = pitstopDetails.vendorDetails
        const upcomingItemDetails = pitstopDetails.item;
        const checkoutItemID = upcomingItemDetails.checkoutItemID // 
        console.log("upcomingItemDetails",upcomingItemDetails)
        if (pitstopIndex !== null) {
            console.log("[UPDATE CASE]");
            if (isDeletePitstop) {
                console.log("[DELETE PITSTOP CASE]")
                pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIndex)
            } else {
                if(upcomingItemDetails.quantity <=0){
                    // TO REMOVE/DELETE SPECIFIC ITEM FROM CHECKOUT ITEM LIST
                let filteredCheckOutItemsListVM = pitstops[pitstopIndex].checkOutItemsListVM.filter((_prevItem, itemIndex) => _prevItem.checkoutItemID !== checkoutItemID);
                console.log("[REMOVE/DELETE ITEM CASE LOGIC]", filteredCheckOutItemsListVM);
               pitstops[pitstopIndex].checkOutItemsListVM = filteredCheckOutItemsListVM;
                
            } else {
                console.log("[TO UPDATE EXISTING ITEM CASE]");
                    pitstops[pitstopIndex].checkOutItemsListVM.map((_prevItem, itemIndex) => {
                                if (_prevItem.checkoutItemID === checkoutItemID) {
                                   return { ...upcomingItemDetails}
                                }
                                return _prevItem;
                        });
                }
            }
        } else {
            console.log("[ADD ITEM TO EXISTING CHECKOUTITEMS LIST CASE]")
            const pitstopFound = pitstops.length && pitstops.find(x => (x.pitstopID === pitstopDetails.pitstopID)) //(x.pitstopID === pitstopDetails.pitstopID || x.smid === pitstopDetails.smid))
            if (pitstopFound) {
                console.log("[PITSTOP FOUND]")
                pitstops = pitstops.map((_pitstop, pitstopIndex) => {
                    // WHY WE DON'T USE pitstops[pitstopIndex]
                    // KUN K YE DYNAMIC HO GA KISI B PITSTOPS K LIYE AUR ISS TIME HMARY PASS EXISTING PITSTOP KA INDEX NAHI HO GA
                    if (_pitstop.pitstopID === pitstopFound.pitstopID) {
                        _pitstop.checkOutItemsListVM.push({ checkoutItemID: sharedUniqueIdGenerator(), ...upcomingItemDetails })
                    }
                    return _pitstop;
                })
            } 
            else {
                // ADD NEW PITSTOP (DONE)
                console.log("[PITSTOP NOT FOUND AND ADD NEW PITSTOP]")
                pitstops.push({ ...pitstopDetails.vendorDetails, pitstopID: sharedUniqueIdGenerator(), checkOutItemsListVM: [{ ...upcomingItemDetails,checkoutItemID: sharedUniqueIdGenerator(), }], })
            }
        }
    }
    dispatch(ReduxActions.setCartAction({ pitstops, joviRemainingAmount }))

}
