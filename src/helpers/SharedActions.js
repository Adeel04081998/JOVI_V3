import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Alert, StatusBar } from 'react-native';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';
import { postRequest, getRequest } from '../manager/ApiManager';
import Endpoints from '../manager/Endpoints';
import Toast from '../components/atoms/Toast';
import { store } from '../redux/store';
import ReduxActions from '../redux/actions';
import configs from '../utils/configs';
import Regex from '../utils/Regex';
import GV, { PITSTOP_TYPES } from '../utils/GV';
const dispatch = store.dispatch;
export const sharedGetDeviceInfo = async () => {
    let model = DeviceInfo.getModel();
    let deviceID =
        Platform.OS === 'ios'
            ? DeviceInfo.getUniqueId()
            : await DeviceInfo.getAndroidId();
    let systemVersion = DeviceInfo.getSystemVersion();
    return { deviceID, model, systemVersion };
};
export const sharedExceptionHandler = err => {
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
            return errorStr;
        }
        else if (err.errors && typeof err.errors === "object") {
            var errorKeys = Object.keys(err.errors),
                errorStr = "";
            for (let index = 0; index < errorKeys.length; index++) {
                if (index > 0) errorStr += err.errors[errorKeys[index]][0] + "\n"
                else errorStr += err.errors[errorKeys[index]][0]
            }
            Toast.error(errorStr, TOAST_SHOW);
            return errorStr;
        }

        else if (err && typeof err === "string") {
            Toast.error(err, TOAST_SHOW);
            return err;
        }
        else if (err.message && typeof err.message === "string") {
            Toast.error(err.message, TOAST_SHOW);
            return err.message;
        }
        else if (err.Error && typeof err.Error === "string") {
            Toast.error(err.Error, TOAST_SHOW);
            return err.Error;
        }
        else if (err.error && typeof err.error === "string") {
            Toast.error(err.error, TOAST_SHOW);
            return err.error;
        }
        else {
            Toast.error('Something went wrong', TOAST_SHOW);
            return 'Something went wrong';
        }
    }
  
};
export const sharedInteval = (
    duration = 30,
    delay = 1,
    listener = () => { },
) => {
    // DURATION MUST BE IS SECONDS
    var timer = duration,
        minutes,
        seconds;
    let interlID = BackgroundTimer.setInterval(function () {
        // console.log('Interval Ran----');
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        listener({ minutes, seconds, intervalStoped: false });
        if (--timer < 0) {
            listener({ minutes, seconds, intervalStoped: true });
            BackgroundTimer.clearInterval(interlID);
            // console.log("Interval Stopped---", interlID);
            return;
        }
    }, 1000);
};
export const focusAwareStatusBar = props => {
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar {...props} /> : null;
};
export const VALIDATION_CHECK = text => {
    text = `${text}`.toLowerCase().trim();
    if (
        text === '' ||
        text === ' ' ||
        text === 'null' ||
        text === 'undefined' ||
        text === 'false'
    ) {
        return false;
    }
    return true;
};
export const sendOTPToServer = (payload, onSuccess, onError, onLoader) => {
    postRequest(
        Endpoints.SEND_OTP,
        payload,
        res => {
            onSuccess(res);
        },
        err => {
            onError(err);
        },
        {},
        true,
        loader => {
            onLoader(loader);
        },
    );
};
export const sharedGetEnumsApi = () => {
    getRequest(Endpoints.GET_ENUMS, res => {
        console.log("[getEnums].res", res);
        dispatch(ReduxActions.setEnumsActions(res.data.enums))
    },
    err => {
      sharedExceptionHandler(err);
    },
    {},
    false,
  );
};
export const sharedGetUserDetailsApi = () => {
    getRequest(
        Endpoints.GET_USER_DETAILS,
        res => {
            // console.log("[getUserDetailsApi].res", res);
            dispatch(ReduxActions.setUserAction({ ...res.data.userDetails }));
        },
        err => {
            sharedExceptionHandler(err);
        },
        {},
        false,
    );
};
export const fetchRobotJson = (url, cb = () => { }) => {
    // fetch('https://cloud-ex42.usaupload.com/5OSX/Robot_-_With_Shape_Layer_Text.json?download_token=5c263b7ebfac80573376d00e6ee5ce29f3d822a4d3addb5209b2e6f4cfa3a8ed', {
    fetch(renderFile(url), {
        method: 'GET',
    })
        .then(response => response.json())
        .then(responseData => {
            cb(responseData);
            // cb(theBlob);
        })
        .catch(error => {
            // console.log(error);
            cb(null);
        });
};
export const sharedGetHomeMsgsApi = () => {
    let payload = {
        mascotScreenEnum: 1,
        getPersonalizeMsgs: true,
    };
    postRequest(
        Endpoints.GET_HOME_MSGS,
        payload,
        res => {
            // console.log("[sharedGetHomeMsgsApi].res", res.data);
            if (res.data.homeScreenDataViewModel.robotJson) {
                fetchRobotJson(res.data.homeScreenDataViewModel.robotJson, data => {
                    // console.log('data robotJson',data)
                    dispatch(
                        ReduxActions.setMessagesAction({ ...res.data, robotJson: data }),
                    );
                });
            } else {
                dispatch(ReduxActions.setMessagesAction({ ...res.data }));
            }
        },
        err => {
            sharedExceptionHandler(err);
        },
        {},
        false,
    );
};
export const sharedGetUserAddressesApi = () => {
    getRequest(
        Endpoints.GET_USER_ADDRESSES,
        res => {
            // console.log("[sharedGetHomeMsgsApi].res", res);
            dispatch(ReduxActions.setUserAction({ ...res.data }));
        },
        err => {
            sharedExceptionHandler(err);
        },
        {},
        false,
    );
};
export const sharedGetPromotions = () => {
    postRequest(
        `${Endpoints.GET_PROMOTIONS}`,
        {
            isDashboard: true,
            isUserSpecific: false, // Need to discuss with Shakir
            latitude: 33.668531, // should be replace with user's final destination
            longitude: 73.075001, // should be replace with user's final destination
            isCitySpecific: true,
        },
        res => {
            // console.log("[sharedGetPromotions].res", res);
            dispatch(ReduxActions.setPromotionsAction({ ...res.data }));
        },
        err => {
            sharedExceptionHandler(err);
        },
        {},
        false,
    );
};

export const sharedLogoutUser = () => {
    dispatch(ReduxActions.clearUserAction({ introScreenViewed: true }));
};

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

export const renderFile = picturePath => {
    const userReducer = store.getState().userReducer;
    return `${GV.BASE_URL.current}/api/Common/S3File/${encodeURIComponent(
        picturePath,
    )}?access_token=${userReducer?.token?.authToken}`;
};

export const sharedConfirmationAlert = (
    title,
    message,
    buttons = [],
    options = { cancelable: true, onDismiss: () => { } },
) => {
    Alert.alert(title, message, buttons, options);
};
export const sharedCalculateCartTotals = (pitstops = []) => {
    console.log("[sharedCalculateCartTotals]", pitstops);
    let subTotal = 0,
        discount = 0,
        serviceCharges = 0,
        total = 0;
    pitstops.map((_pitstop, index) => {
        if (_pitstop.pitstopType !== PITSTOP_TYPES.JOVI) {
            _pitstop.checkOutItemsListVM.map((product, j) => {
                subTotal += (product.gstAddedPrice * product.quantity);
            })
        }
    })
    total = subTotal;
    dispatch(ReduxActions.setCartAction({ subTotal, discount, serviceCharges, total }));

};
export const sharedDiscountsCalculator = (
    originalPrice = 0,
    discount = 0,
    discountDivider = 100,
) => {
    let afterDiscount = Math.round(
        originalPrice - originalPrice * (discount / discountDivider),
    );
    return afterDiscount;
};
export const sharedJoviRemainingAmountCalculator = (pitstops, cartReducer) => {
    let joviPitstops = pitstops.filter(p => p.pitstopType === PITSTOP_TYPES.JOVI),
        openOrdersList = cartReducer.openOrdersList,
        joviPrevOrderesPitstopsAmount = 0,
        joviRemainingAmount = 0;
    if (joviPitstops.length) {
        if (openOrdersList.length) {
            joviPrevOrderesPitstopsAmount = openOrdersList
                .map((orderInfo, index) => orderInfo?.estimatePrice ?? 0)
                .reduce((a, b) => a + b);
        }
        joviRemainingAmount =
            joviPrevOrderesPitstopsAmount -
            joviPitstops
                .map((orderInfo, index) => orderInfo?.estimatePrice ?? 0)
                .reduce((a, b) => a + b);
        return joviRemainingAmount;
    } else
        console.log('[JOVI PITSTOP NOT FOUND TO CALCULATE REMAINING AMOUNT..]');
};
export const sharedUniqueIdGenerator = (randomNum = 1000) => {
    return Math.floor(Math.random() * randomNum) + new Date().getTime();
};
export const sharedAddUpdatePitstop = (
    pitstopDetails = {},
    isDeletePitstop = false,
    swappedArray = [],
) => {
    if (false) return dispatch(ReduxActions.clearCartAction({}));
    // FOR JOVI PITSTOPS
    // {
    //      GIVE ONLY ITEM OBJECT TO ADD NEW PITSTOP
    //      GIVE ITEM AND INDEX TO UPDATE
    //      GIVE INDEX >= 0 AND ISDELETE AS TRUE TO DELETE PITSTOP
    // }
    // **********
    // FOR VENDOR PITSTOP
    console.log('pitstopDetails', pitstopDetails);
    const cartReducer = store.getState().cartReducer;
    const pitstopIndex = pitstopDetails.pitstopIndex || null;
    let pitstops = cartReducer.pitstops;
    let joviRemainingAmount = cartReducer.joviRemainingAmount;

    if (pitstopDetails.pitstopType === PITSTOP_TYPES.JOVI) {
        console.log('[JOVI PITSTOP]');
        // JOVI PITSTOPS HANDLING
        if (pitstopIndex !== null) {
            console.log('[INDEX] EXIST');
            if (isDeletePitstop) {
                // DELETE CASE
                console.log('[DELETE PITSTOP CASE]');
                pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIndex);
            } else {
                // EDIT CASE
                console.log('[UPDATE]');
                pitstops[pitstopIndex] = { ...pitstopDetails }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS
                // pitstops[index] = { ...pitstops[index], ...pitstopDetails }; // ...pitstops[index] IF YOU DON'T HAVE ITEM'S PREVIOUS DATA (VERY RARE CASE)
            }
        } else {
            // ADD NEW PITSTOP
            console.log('[NEW CREATE]');
            pitstops.push({ pitstopID: sharedUniqueIdGenerator(), ...pitstopDetails });
        }
        console.log('[PITSTOPS]', pitstops);
        joviRemainingAmount = sharedJoviRemainingAmountCalculator(
            pitstops,
            cartReducer,
        );
    } else {
        // VENDOR PITSTOPS HANDLING
        const upcomingVendorDetails = pitstopDetails.vendorDetails;
        const upcomingItemDetails = pitstopDetails.itemDetails;
        const actionKey = upcomingItemDetails.actionKey || ''; //
        console.log('[ACTION KEY]', actionKey);
        if (pitstopIndex !== null) {
            console.log('[UPDATE/DELETE CASE]');
            if (isDeletePitstop || !upcomingItemDetails.quantity) {
                console.log('[DELETE PITSTOP CASE]');
                pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIndex);
            } else {
                if (upcomingItemDetails.quantity <= 0) {
                    // TO REMOVE/DELETE SPECIFIC ITEM FROM CHECKOUT ITEM LIST
                    let filteredCheckOutItemsListVM = pitstops[pitstopIndex].checkOutItemsListVM.filter((_prevItem, itemIndex) => _prevItem[actionKey] !== upcomingItemDetails[actionKey]);
                    pitstops[pitstopIndex].checkOutItemsListVM = filteredCheckOutItemsListVM;
                    console.log('[REMOVE/DELETE ITEM CASE LOGIC]', pitstops);
                } else {
                    pitstops[pitstopIndex].checkOutItemsListVM.map(
                        (_prevItem, itemIndex) => {
                            if (_prevItem[actionKey] === upcomingItemDetails[actionKey]) {
                                _prevItem.quantity = upcomingItemDetails.quantity;
                            }
                            return _prevItem;
                        },
                    );
                    console.log('[TO UPDATE EXISTING ITEM CASE]', pitstops);
                }
            }
        } else {
            console.log('[ADD ITEM TO EXISTING CHECKOUTITEMS LIST CASE]');
            const pitstopFound = pitstops.length && pitstops.find(x => x.pitstopID === upcomingVendorDetails.pitstopID); //(x.pitstopID === pitstopDetails.pitstopID || x.smid === pitstopDetails.smid))
            if (pitstopFound) {
                console.log('[PITSTOP FOUND]');
                pitstops = pitstops.map((_pitstop, pitstopIndex) => {
                    // WHY WE DON'T USE pitstops[pitstopIndex]
                    // KUN K YE DYNAMIC HO GA KISI B PITSTOPS K LIYE AUR ISS TIME HMARY PASS EXISTING PITSTOP KA INDEX NAHI HO GA
                    if (_pitstop.pitstopID === pitstopFound.pitstopID) {
                        _pitstop.checkOutItemsListVM.push({ checkOutItemID: sharedUniqueIdGenerator(), ...upcomingItemDetails, });
                    }
                    return _pitstop;
                });
            } else {
                // ADD NEW PITSTOP (DONE)
                console.log('[PITSTOP NOT FOUND AND ADD NEW PITSTOP]');
                pitstops.push({
                    ...pitstopDetails.vendorDetails,
                    pitstopID: sharedUniqueIdGenerator(),
                    checkOutItemsListVM: [{ ...upcomingItemDetails, checkOutItemID: sharedUniqueIdGenerator() }],
                });
            }
        }
    }
    dispatch(ReduxActions.setCartAction({ pitstops, joviRemainingAmount }));
    sharedCalculateCartTotals(pitstops)
};

export const sharedGetFilters = () => {
    postRequest(Endpoints.GET_FILTERS,{
        "vendorType":4

    }, res => {
        console.log("[sharedGetFiltersApi].res ====>>", res);
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

export const uniqueKeyExtractor = () => new Date().getTime().toString() + (Math.floor(Math.random() * Math.floor(new Date().getTime()))).toString();

export const renderPrice=(price,prefix="Rs. ",suffix="",)=>{
    prefix=`${prefix}`.trim();
    suffix=`${suffix}`.trim();
    price=`${price}`.trim().replace(Regex.price,'').trim();
    return suffix.length>0 ? `${prefix} ${price} ${suffix}` : `${prefix} ${price}`;
}
