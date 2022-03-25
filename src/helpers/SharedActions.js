import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import Toast from '../components/atoms/Toast';
import { getRequest, postRequest } from '../manager/ApiManager';
import configs from '../utils/configs';
import Endpoints from '../manager/Endpoints';
import NavigationService from '../navigations/NavigationService';
import ROUTES from '../navigations/ROUTES';
import { default as actions, default as ReduxActions } from '../redux/actions';
import { store } from '../redux/store';
import constants from '../res/constants';
import ENUMS from '../utils/ENUMS';
import GV, { ORDER_STATUSES, PITSTOP_TYPES } from '../utils/GV';
import Regex from '../utils/Regex';
import firestore from '@react-native-firebase/firestore'
import dayjs from 'dayjs';
import { hybridLocationPermission } from './Location';

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
    console.log("[sharedExceptionHandler].err", err);
    const TOAST_SHOW = 3000;
    if (err) {
        if (err.data) {
            if (err?.data?.StatusCode === 401) return;
            else if (err.data.errors) {
                var errorKeys = Object.keys(err.data.errors),
                    errorStr = "";
                for (let index = 0; index < errorKeys.length; index++) {
                    if (index > 0) errorStr += err.data.errors[errorKeys[index]][0] + "\n"
                    else errorStr += err.data.errors[errorKeys[index]][0]
                }
                Toast.error(errorStr, TOAST_SHOW);
                return errorStr;
            }
            else if (err.data.message && typeof err.data.message === "string") {
                Toast.error(err.data.message, TOAST_SHOW);
                return err.data.message;
            }
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
    } else {
        Toast.error('Something went wrong', TOAST_SHOW);
        return 'Something went wrong';
    }
}

export const sharedInteval = (duration = 30, delay = 1, listener = () => { }) => {
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

export const VALIDATION_NUMBER_CHECK = text => {
    text = `${text}`.toLowerCase().trim();
    if (
        text === '' ||
        text === ' ' ||
        text === 'null' ||
        text === 'undefined' ||
        text === 'false' ||
        text === '0'
    ) {
        return null;
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
    getRequest(
        Endpoints.GET_ENUMS,
        res => {
            // console.log("[getEnums].res", res);
            dispatch(ReduxActions.setEnumsActions(res.data.enums));
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
            console.log("[getUserDetailsApi].res", res);
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
            console.log("[sharedGetUserAddressesApi].res", res);
            if (res.data.statusCode === 200)
                dispatch(ReduxActions.setUserAction({ ...res.data }));
            else dispatch(ReduxActions.setUserAction({ addresses: [] }));
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

export const sharedConfirmationAlert = (title, message, buttons = [], options = { cancelable: true, onDismiss: () => { } }) => {
    Alert.alert(title, message, buttons, options)
}
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

export const renderFile = (picturePath = "") => {
    // console.log("[renderFile].picturePath", picturePath)
    const splitedPath = String(picturePath).split(":");
    if (splitedPath.length && splitedPath[0] === "https") return picturePath;
    else {
        const userReducer = store.getState().userReducer;
        return `${GV.BASE_URL.current}/api/Common/S3File/${encodeURIComponent(
            picturePath,
        )}?access_token=${userReducer?.token?.authToken}`;
    }
};

export const renderPrice = (price, prefix = "Rs. ", suffix = "", reg = Regex.price,) => {
    let showZero = false;
    if (typeof price === "object") {
        if ('showZero' in price) {
            showZero = price.showZero;
        }
        price = price?.price ?? 0;
    }

    prefix = `${prefix}`.trim();
    suffix = `${suffix}`.trim();
    price = `${price}`.trim().replace(reg, '').trim();
    return parseInt(`${price}`) < 1 ? showZero ? `${prefix} ${price}${suffix}` : '' : suffix.length > 0 ? `${prefix} ${price}${suffix}` : `${prefix} ${price}`;
}

export const renderDistance = (distance, suffix = "m", prefix = "", reg = Regex.distanceM,) => {
    return distance; // WILL BE STRING VALUE WITH PRE/SUFFIX (e.g M, KM) FROM SERVER
    // COMMENTED BECUASE VALUE WOULD BE HANDELED ON SERVER SIDE
    // prefix = `${prefix}`.trim();
    // suffix = `${suffix}`.trim();
    // distance = `${distance}`.trim().replace(reg, '').trim();
    // return prefix.length > 0 ? `${prefix} ${distance}${suffix}` : `${distance}${suffix}`;
}

export const isNextPage = (totalItem, itemPerRequest, currentRequestCount) => {
    const total = itemPerRequest * currentRequestCount;

    return totalItem - total > 0 ? true : false;
};//end of isNextPage

export const sharedCalculateMaxTime = (dataArr = [], key = "estimatePrepTime") => {
    if (!dataArr.length) return null;
    let estimateTime = null,
        arr = [];
    dataArr.map((_resItem, _resIndex) => {
        if (VALIDATION_CHECK(_resItem[key])) {
            let splitTime = String(_resItem[key]).split(":");
            let now = new Date();
            let _dateSpan = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...splitTime);
            arr.push(_dateSpan.getTime())
        }

    })
    // estimateTime = arr.length ? new Date(Math.max(...arr)).toLocaleTimeString().replace(Regex.time, '$1') : null;
    if (arr.length) {
        const timeSpan = new Date(Math.max(...arr));
        const hrs = timeSpan.getHours();
        const mins = timeSpan.getMinutes();
        // console.log("timeSpan, hrs, mins", timeSpan, hrs, mins);
        estimateTime = (hrs < 9 ? `0${hrs}` : hrs) + ":" + (mins < 9 ? `0${mins}` : mins);
    }
    return estimateTime;
}
export const sharedCalculateCartTotals = (pitstops = [], cartReducer) => {
    console.log("[sharedCalculateCartTotals]", pitstops);
    let joviRemainingAmount = constants.max_jovi_order_amount,
        subTotal = 0,
        discount = 0,
        itemsCount = 0,
        joviPitstopsTotal = 0,
        joviPrevOrdersPitstopsAmount = 0,
        joviCalculation = 0,
        vendorMaxEstTime = "",
        estimateTime = "",
        gst = 0,
        total = 0;
    pitstops = pitstops.map((pitstop, index) => {
        let _pitstop = { ...pitstop }
        if (_pitstop.pitstopType === PITSTOP_TYPES.JOVI) {
            itemsCount += 1;
            _pitstop.individualPitstopTotal = _pitstop.estimatePrice || 0;
            let openOrdersList = cartReducer.openOrdersList;
            if (openOrdersList.length) {
                joviPrevOrdersPitstopsAmount += openOrdersList.map((orderInfo, index) => orderInfo?.estimatePrice ?? 0).reduce((a, b) => a + b);
            }
            joviPitstopsTotal += _pitstop.estimatePrice || 0;
        } else {
            let _pitTotal = 0
            vendorMaxEstTime = sharedCalculateMaxTime(_pitstop.pitstopType === PITSTOP_TYPES.RESTAURANT ? _pitstop.checkOutItemsListVM : [], "estimatePrepTime");
            console.log("vendorMaxEstTime", vendorMaxEstTime);
            _pitstop.vendorMaxEstTime = vendorMaxEstTime;
            _pitstop.checkOutItemsListVM.map((product, j) => {

                // gst += (product.gstAmount || 0) * product.quantity;
                // discount += (product.discountAmount || 0) * product.quantity;
                // _pitTotal = ((product.gstAddedPrice || product.itemPrice || 0) + (product.totalAddOnPrice || 0)) * product.quantity;

                gst += product._totalGst * product.quantity;
                discount += product._totalDiscount * product.quantity;
                _pitTotal += product._itemPrice * product.quantity;
                subTotal += _pitTotal + discount;
                itemsCount += product.quantity;

            })
            _pitstop.individualPitstopTotal = _pitTotal;
        }
        return _pitstop;
    })
    estimateTime = sharedCalculateMaxTime([...pitstops].filter(_p => _p.pitstopType === PITSTOP_TYPES.RESTAURANT), "vendorMaxEstTime")
    console.log("estimateTime", estimateTime);
    subTotal = subTotal + joviPitstopsTotal;
    total = (subTotal - discount);
    joviCalculation = joviRemainingAmount - (joviPitstopsTotal + joviPrevOrdersPitstopsAmount)
    joviRemainingAmount = joviCalculation <= 0 ? 0 : joviCalculation;
    dispatch(ReduxActions.setCartAction({ pitstops, joviRemainingAmount, subTotal, itemsCount, joviPitstopsTotal, joviPrevOrdersPitstopsAmount, joviCalculation, total, estimateTime, gst, discount }));
};
export const sharedDiscountsCalculator = (
    originalPrice = 0,
    discount = 0
) => {
    let _discountAmount = Math.round(originalPrice * (discount / 100));
    return {
        _discountAmount,
        afterDiscount: originalPrice - _discountAmount
    };
};
export const sharedUniqueIdGenerator = (randomNum = 1000) => {
    return Math.floor(Math.random() * randomNum) + new Date().getTime();
};
const checkSameProduct = (currentCheckoutItems, newP) => {
    let newProductOptionsListIds = newP.selectedOptions.map(item => (item.itemOptionID)).slice().sort();
    currentCheckoutItems.map((item, i) => {
        let isOptionsSame = item.selectedOptions.map(x => (x.itemOptionID)).slice().sort().every(function (value, index) {
            return value === newProductOptionsListIds[index];
        });
        let isNotesSame = item.notes.toString().toLowerCase() === newP.notes.toString().toLowerCase();
        if (isOptionsSame && isNotesSame) {
            newP = { ...newP, quantity: newP.quantity + item.quantity, alreadyExisted: true, checkoutIndex: i };
        }
    });
    return newP;
}
export const sharedAddUpdatePitstop = (
    pitstopDetails = {},
    isDeletePitstop = false,
    swappedPitstops = [],
    forceAddNewItem = false,
    fromCart = false,
    cb = () => { },
    forceUpdate = false,
) => {
    const cartReducer = store.getState().cartReducer;
    if (swappedPitstops.length) {
        dispatch(ReduxActions.setCartAction({ pitstops: swappedPitstops }));
        sharedCalculateCartTotals(swappedPitstops, cartReducer);
        return;
    }
    console.log("pitstopDetails", pitstopDetails);
    let pitstops = cartReducer.pitstops;
    const pitstopIndex = (pitstopDetails?.pitstopIndex >= 0 ? pitstopDetails.pitstopIndex : null);
    if (pitstopIndex !== null && isDeletePitstop) {
        console.log('[DELETE PITSTOP FROM CART]');
        pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIndex);
    } else if (pitstopDetails.pitstopType === PITSTOP_TYPES.JOVI) {
        console.log('[JOVI PITSTOP]');
        if (pitstopIndex !== null) {
            console.log('[INDEX] EXIST');
            if (false) {
                console.log('[DELETE PITSTOP CASE]');
                pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIndex);
            } else {
                console.log('[UPDATE JOVI PITSTOP]');
                pitstops[pitstopIndex] = { ...pitstopDetails, isJoviJob: true, }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS
                // pitstops[pitstopIndex] = { ...pitstops[index], ...pitstopDetails }; // ...pitstops[index] IF YOU DON'T HAVE ITEM'S PREVIOUS DATA (VERY RARE CASE)
            }
        } else {
            // ADD NEW PITSTOP
            console.log('[NEW CREATE]');
            pitstops.push({ ...pitstopDetails, pitstopID: sharedUniqueIdGenerator(), isJoviJob: true, isRestaurant: false });
        }
    } else {
        // VENDOR PITSTOPS HANDLING
        const upcomingVendorDetails = pitstopDetails.vendorDetails;
        let upcomingItemDetails = pitstopDetails.itemDetails;
        const actionKey = upcomingItemDetails.actionKey || 'checkOutItemID'; //
        const pitstopActionKey = upcomingVendorDetails.actionKey || 'marketID'; //
        console.log('[PITSTOP IDACTION KEY]', pitstopActionKey);
        console.log('[ITEM ID ACTION KEY]', actionKey);
        const pitstopIdx = pitstops.findIndex(x => x[pitstopActionKey] === upcomingVendorDetails[pitstopActionKey]); //(x.pitstopID === pitstopDetails.pitstopID || x.smid === pitstopDetails.smid))
        if (pitstopIdx !== -1) {
            let currentPitstopItems = pitstops[pitstopIdx].checkOutItemsListVM;
            console.log('[PITSTOP FOUND]', upcomingItemDetails.selectedOptions, pitstops[pitstopIdx]);
            let itemIndex = currentPitstopItems.findIndex(item => item[actionKey] === upcomingItemDetails[actionKey]);
            if (!fromCart && upcomingItemDetails.selectedOptions?.length) {
                upcomingItemDetails = checkSameProduct(currentPitstopItems, upcomingItemDetails);
            }
            else if (upcomingItemDetails.alreadyExisted) {
                itemIndex = upcomingItemDetails.checkoutIndex;
                console.log('[Update EXISTING CHECKOUT ITEMS]');
                if (!upcomingItemDetails.quantity) {
                    console.log('[QUANTITY LESS THAN OR EQUAL TO ZERO]');
                    if ((currentPitstopItems.length - 1) <= 0) pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIdx);
                } else {
                    currentPitstopItems[itemIndex] = { ...upcomingItemDetails, alreadyExisted: undefined, checkoutIndex: undefined, checkOutItemID: currentPitstopItems[itemIndex].checkOutItemID };
                    pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                }
            } else if (itemIndex !== -1 && !forceAddNewItem) {
                if (!upcomingItemDetails.quantity) {
                    console.log('[QUANTITY LESS THAN OR EQUAL TO ZERO]');
                    if ((currentPitstopItems.length - 1) <= 0) pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIdx);
                    else {
                        console.log('[REMOVE SINGLE ITEM FROM CHECKOUT LIST..]');
                        currentPitstopItems = currentPitstopItems.filter((_item, idx) => idx !== itemIndex);
                        pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                    }
                } else {
                    console.log('[INCREAMETN DECREACMENT QUANTITY]');
                    currentPitstopItems[itemIndex] = { ...upcomingItemDetails, checkOutItemID: currentPitstopItems[itemIndex].checkOutItemID };
                    pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                }
            } else {
                console.log('[ADD NEW ITEM TO EXISTING CHECKOUT ITEMS]');
                currentPitstopItems.push({ checkOutItemID: sharedUniqueIdGenerator(), ...upcomingItemDetails, });
                pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
            }
        } else {
            // ADD NEW PITSTOP (DONE)
            console.log('[PITSTOP NOT FOUND AND ADD NEW PITSTOP]');
            pitstops.push({
                ...pitstopDetails.vendorDetails,
                isRestaurant: pitstopDetails.pitstopType === PITSTOP_TYPES.RESTAURANT,
                pitstopID: pitstopDetails.vendorDetails.marketID ?? pitstopDetails.vendorDetails.pitstopID,
                checkOutItemsListVM: [{ ...upcomingItemDetails, checkOutItemID: sharedUniqueIdGenerator() }],
            });
        }
    }
    // console.log('[TO CALCULATE PITSTOPS]', pitstops);
    cb();
    cartReducer.forceUpdate = forceUpdate;
    if (!pitstops.length) {
        dispatch(ReduxActions.clearCartAction({ pitstops: [], forceUpdate }));
        if (fromCart)
            NavigationService.NavigationActions.common_actions.goBack();
    } else {
        dispatch(ReduxActions.setCartAction({ pitstops }));
        sharedCalculateCartTotals(pitstops, cartReducer)
    }

};

export const getRandomInt = (min = 10, max = 10000) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const sharedGetFilters = () => {
    postRequest(Endpoints.GET_FILTERS, {
        "vendorType": 4

    }, res => {
        console.log("[sharedGetFiltersApi].res ====>>", res);
        // dispatch(ReduxActionss.setMessagesAction({ ...res.data, robotJson: data }));
        dispatch(ReduxActions.setCategoriesTagsAction({ ...res?.data }))


    },
        err => {
            console.log("error", err);
            // sharedExceptionHandler(err)
        },
        {},
    )


}

export const uniqueKeyExtractor = () => new Date().getTime().toString() + (Math.floor(Math.random() * Math.floor(new Date().getTime()))).toString();

export const sharedGetPitstopData = (pitstop = {}, pitstopActionKey = "marketID") => {
    let pitstops = store.getState().cartReducer.pitstops || [];
    let pitstopIdx = pitstops.findIndex(p => p[pitstopActionKey] === pitstop[pitstopActionKey]);
    if (pitstopIdx !== -1) {
        return pitstops[pitstopIdx]
    } else return null;
}
const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}
export const sharedGetServiceCharges = (payload = null, successCb = () => { }) => {
    const cartReducer = store.getState().cartReducer;
    const userReducer = store.getState().userReducer;
    // const estimateTime = cartReducer?.estimateTime?.includes('AM') || cartReducer?.estimateTime?.includes('PM') ? convertTime12to24(cartReducer.estimateTime) : cartReducer.estimateTime;
    const estimateTime = cartReducer.estimateTime;
    console.log('userReducer', userReducer);
    const pitstopItems = [];
    [...cartReducer.pitstops].map((item, i) => {
        if (item.checkOutItemsListVM) {
            item.checkOutItemsListVM.map((product, j) => {
                pitstopItems.push({
                    "itemPrice": product._itemPrice,
                    "gstAddedPrice": item.pitstopType === 1 ? product.gstAddedPrice : product.gstAddedPrice + product.totalJoviDiscount + product._totalDiscount,
                    "gstPercentage": product.gstPercentage,
                    "itemDiscount": product.itemDiscount,
                    "joviDiscount": product.joviDiscount,
                    "actualPrice": item.pitstopType === 1 ? product.actualPrice : product.gstAddedPrice + product.totalJoviDiscount + product._totalDiscount,
                    "gstAmount": product._totalGst,
                    "quantity": product.quantity,
                    "pitStopType": item.pitstopType,
                    "pitstopID": item.marketID,
                    "pitstopItemID": product.pitStopItemID
                });
            });
        }
    });
    payload = payload ? payload : {
        "joviJobAmount": cartReducer.joviPitstopsTotal,
        "estimateTime": estimateTime || null,
        "pitstops": [...cartReducer.pitstops, { ...(userReducer?.finalDestObj ?? {}) }].map((_pitstop, pitIndex) => ({
            "isRestaurant": _pitstop.isRestaurant,
            "latLng": `${_pitstop.latitude},${_pitstop.longitude}`,
            "pitStopType": _pitstop.pitstopType,
        })),
        "skipEstAmountAndGst": cartReducer.pitstops.every(pt => pt.pitstopType === 2 || pt.pitstopType === undefined) ? true : false,
        // "hardwareID": "string",
        // "promoCodeApplied": "string",
        // "adminID": "string",
        // "isAdmin": true,
        // "orderID": 0
    }
    if (pitstopItems.length > 0) {
        payload = {
            ...payload,
            pitstopItems
        }
    }
    console.log('payload--sharedGetServiceCharges', payload);
    postRequest(
        Endpoints.SERVICE_CHARGES,
        payload,
        (response) => {
            const { statusCode, serviceCharge, serviceTax, chargeBreakdown, genericDiscount, orderEstimateTime } = response.data;
            console.log('service charges response -----', response);
            if (statusCode === 200)
                // NEED TO MODIFY THESE LOGIC FOR FUTURE CASES LIKE CHECKOUT SCREEN...
                dispatch(ReduxActions.setCartAction({ orderEstimateTime, serviceCharges: serviceCharge, serviceTax, total: cartReducer.total, genericDiscount, chargeBreakdown: chargeBreakdown ?? {} }))
            successCb(response);
        },
        (error) => {
            console.log('service charges error -----', error);
            sharedExceptionHandler(error);
        },
        true
    );

}
export const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

export const array_move = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

export const sharedGetPrice = (item, lineThrough) => {
    let _price = 0;
    if (lineThrough && item.discountAmount) {
        _price = item.discountedPrice || item.gstAddedPrice || item.itemPrice || item.price || 0;
    } else {
        _price = item.gstAddedPrice || item.itemPrice || item.price || 0;
    }
    return renderPrice(_price);
}




export const confirmServiceAvailabilityForLocation = (postRequest, latitude, longitude, cbSuccess, cbFailure) => {
    postRequest(
        Endpoints.AreaRestriction,
        {
            "cityID": 0,
            "latitude": latitude,
            "longitude": longitude
        },
        async (response) => {
            cbSuccess && cbSuccess(response);
        },
        (error) => {
            cbFailure && cbFailure(error);
        },
    );
};
export const sharedGetDeviceMacAddress = async () => {
    const deviceMacAddress = (Platform.OS === "android") ?
        await DeviceInfo.getAndroidId()
        :
        DeviceInfo.getUniqueId();
    // console.log("hardwareID", deviceMacAddress)

    return deviceMacAddress;
};
export const sharedSendFCMTokenToServer = async (postRequest, FcmToken) => {
    postRequest(
        Endpoints.FirebaseTokenAddLog,
        {
            "deviceToken": FcmToken,
            "hardwareID": await sharedGetDeviceMacAddress(),
            "androidVersion": parseInt(DeviceInfo.getSystemVersion()),
        },
        res => {
            if (res.data.statusCode === 200) {
                console.log("sharedSendFCMTokenToServer.success :", res)
            };
        },
        err => {
            if (err) {
                console.log("sharedSendFCMTokenToServer.error :", err)
            }
        },
        {},
        false
    );
};

export const sharedFetchOrder = (orderID = 0, successCb = () => { }, errCb = () => { }) => {
    getRequest(
        Endpoints.FetchOrder + '/' + orderID,
        (response) => {
            console.log('sharedFetchOrder', response);
            if (response.data.statusCode === 200) {
                if (response.data.order.orderStatus === 3) {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
                    return;
                }
            }
            successCb(response);
        },
        (error) => {
            console.log(((error?.response) ? error.response : {}), error);
            errCb(error);
            sharedExceptionHandler(error);
        }
    );
};
export const sharedClearReducers = () => {
    dispatch(actions.clearModalAction());
}
export const sleep = (second = 1) => {
    return new Promise(resolve => {
        let ms = Number(second) * Number(1000);
        setTimeout(resolve, ms)
    });
};//end of sleep
export const sharedHandleInfinityScroll = (event) => {
    let mHeight = event.nativeEvent.layoutMeasurement.height;
    let cSize = event.nativeEvent.contentSize.height;
    let Y = event.nativeEvent.contentOffset.y;
    if (Math.ceil(mHeight + Y) >= cSize) return true;
    return false;
}
export const checkIfFirstPitstopRestaurant = (pitstopsList = [], extraIgnoredStatuses = []) => {
    let isFirstPitstopRestaurant = null;
    const ignoredStatuses = [3, 4, 5, ...extraIgnoredStatuses];
    pitstopsList?.map((item) => {
        if (isFirstPitstopRestaurant === null && item?.pitstopType === 4 && !ignoredStatuses.includes(item?.joviJobStatus)) {
            isFirstPitstopRestaurant = true;
        }
    });
    return isFirstPitstopRestaurant;
}
export const sharedOrderNavigation = (orderID = null, orderStatus = null, replacingRoute = null, newOrder = null, showBack = false, pitstopsList = []) => {
    console.log('orderID', orderID);
    const isFirstPitstopRestaurant = checkIfFirstPitstopRestaurant(pitstopsList);
    const navigationLogic = (route) => {
        if (newOrder) {
            NavigationService.NavigationActions.common_actions.reset_with_filter_invert([ROUTES.APP_DRAWER_ROUTES.Home.screen_name], {
                name: route,
                params: { orderID, showBack }
            });
        } else
            if (replacingRoute) {
                NavigationService.NavigationActions.stack_actions.replace(route, { orderID, showBack }, replacingRoute);
            } else {
                NavigationService.NavigationActions.common_actions.navigate(route, { orderID, showBack });
            }
    };
    const goToOrderProcessing = () => navigationLogic(ROUTES.APP_DRAWER_ROUTES.OrderProcessing.screen_name);
    const goToOrderProcessingError = () => navigationLogic(ROUTES.APP_DRAWER_ROUTES.OrderProcessingError.screen_name);
    const goToOrderTracking = () => navigationLogic(ROUTES.APP_DRAWER_ROUTES.OrderTracking.screen_name);
    const orderStatusEnum = {
        [ORDER_STATUSES.VendorApproval]: goToOrderProcessing,
        [ORDER_STATUSES.VendorProblem]: goToOrderProcessing,
        [ORDER_STATUSES.CustomerApproval]: goToOrderProcessingError,
        [ORDER_STATUSES.CustomerProblem]: goToOrderProcessingError,
        [ORDER_STATUSES.FindingRider]: isFirstPitstopRestaurant ? goToOrderTracking : goToOrderProcessing,
        [ORDER_STATUSES.Initiated]: goToOrderTracking,
        [ORDER_STATUSES.Processing]: goToOrderTracking,
        [ORDER_STATUSES.RiderFound]: goToOrderTracking,
        [ORDER_STATUSES.RiderProblem]: isFirstPitstopRestaurant ? goToOrderTracking : goToOrderProcessing,
        [ORDER_STATUSES.TransferProblem]: goToOrderTracking,
    };
    orderStatusEnum[orderStatus ?? '']();
}

export const sharedGetDashboardCategoryIApi = () => {
    getRequest(
        Endpoints.GET_VENDOR_DASHBOARD_CATEGORY_ID,
        res => {
            dispatch(ReduxActions.setvendorDashboardCategoryIDAction(res.data?.vendorDashboardCatIDViewModelList ?? []));
        },
        err => {
            sharedExceptionHandler(err);
        },
        {},
        false,
    );
};
export const sharedSubStringText = (str = "", start = 0, end = 14) => {
    let _string = String(str).substring(start, end);
    _string = _string.length > end ? _string + "..." : _string
    return _string;
}

export const sharedAddToCartKeys = (restaurant = null, item = null) => {
    if (restaurant) {

    }
    if (item) {
        item._itemPrice = item.discountedPrice > 0 ? item.discountedPrice : item.gstAddedPrice > 0 ? item.gstAddedPrice : item.itemPrice;
        item._itemPriceWithoutDiscount = item.gstAddedPrice;
        item._totalDiscount = item?.discountType === ENUMS.DISCOUNT_TYPES.Percentage ? sharedDiscountsCalculator(item._itemPriceWithoutDiscount, item.discountAmount)._discountAmount : item.discountAmount; // if discount type is fixed then discount amount would be the discounted price
        item._totalGst = item.gstAmount;
    }
    return {
        restaurant,
        item
    }

}
export const uuidGenerator = () => {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};//end of uuidGenerator
export const sharedGenerateProductItem = (itemName, quantity = null, options = null) => {
    let title = itemName;
    if (options) {
        options.map((item, i) => {
            title = title + ' - ' + item.attributeName;
        });
    }
    if (quantity) {
        title = title + ' - x' + quantity;
    }
    return title;
}

export const sharedCalculatedTotals = () => {
    const { subTotal = 0, discount = 0, serviceCharges = 0, serviceTax = 0, genericDiscount = 0, total = 0, gst = 0 } = store.getState().cartReducer;
    const _serviceCharges = serviceCharges + serviceTax;
    return {
        gst,
        serviceTax,
        serviceCharges: _serviceCharges,
        discount: discount + genericDiscount,
        subTotal,
        total: total + _serviceCharges
    }

}

export const sharedOnVendorPress = (pitstop, index) => {
    const pitstopID = pitstop?.pitstopID ?? pitstop.vendorID ?? 0
    const routes = {
        4: ROUTES.APP_DRAWER_ROUTES.RestaurantProductMenu.screen_name,
        1: ROUTES.APP_DRAWER_ROUTES.ProductMenu.screen_name,
        2: ROUTES.APP_DRAWER_ROUTES.JoviJob.screen_name,
    }
    NavigationService.NavigationActions.common_actions.navigate(routes[pitstop.pitstopType], { ...pitstop, pitstopID });
}
export const   sharedNotificationHandlerForOrderScreens = (fcmReducer, fetchOrder = () => { }, orderCompletedOrCancelled = () => { }) => {
    // console.log("[Order Processing].fcmReducer", fcmReducer);
    // '1',  For job related notification
    // '11',  For rider allocated related notification
    // '12', For order cancelled by admin
    // '13' For order cancelled by system
    // '14' out of stock
    // '18' replaced
    // '17' jovi job completed at index 6
    // '16' order completed at index 7
    // '2' Chat message at INDEX 8

    const notificationTypes = ["1", "11", "12", "13", "14", "18", "17", "16", "2",]
    console.log('fcmReducer------OrderPitstops', fcmReducer);
    const jobNotify = fcmReducer.notifications?.find(x => (x.data && (notificationTypes.includes(`${x.data.NotificationType}`))) ? x : false) ?? false;
    if (jobNotify) {
        console.log(`[jobNotify]`, jobNotify)
        const { data, notifyClientID } = jobNotify;
        // const results = sharedCheckNotificationExpiry(data.ExpiryDate);
        // if (results.isSameOrBefore) {
        if (data.NotificationType == notificationTypes[1] || data.NotificationType == notificationTypes[0]) {
            // console.log("[Order Processing] Rider Assigned By Firbase...");
            fetchOrder();
        }
        else if (data.NotificationType == notificationTypes[2] || data.NotificationType == notificationTypes[3] || data.NotificationType == notificationTypes[7]) {
            // console.log("[Order Processing] Order Cancelled By Firbase...");
            orderCompletedOrCancelled({
                orderCompleted: data.NotificationType == notificationTypes[7]
            });
        }
        else if (data.NotificationType == notificationTypes[4] || data.NotificationType == notificationTypes[5] || data.NotificationType == notificationTypes[6]) {
            fetchOrder()
        }
        else if (data.NotificationType == notificationTypes[8]) {
            fetchOrder({
                loadChat: true,
                notificationData: jobNotify,
            })
        }
        else {

        }
        //  To remove old notification
        dispatch(actions.fcmAction({ notifyClientID }));
    } else console.log("[Order OrderPitstops] Job notification not found!!");
}
export const sharedOnCategoryPress = (item, index) => {
    const pitstopType = item.value;
    const routes = {
        4: ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name,
        1: ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name,
        2: ROUTES.APP_DRAWER_ROUTES.JoviJob.screen_name,
    }
    NavigationService.NavigationActions.common_actions.navigate(routes[pitstopType], { pitstopType });
}

export const sharedGetCurrentLocation = (onSuccess = () => { }, onError = () => { }) => {
    hybridLocationPermission();

    navigator.geolocation?.getCurrentPosition(({ coords }) => onSuccess(coords),
        (error) => {
            console.log("error==>", error);
            if (error) {
                // CustomToast.error("An error accured while fetching your current location, please try again.")
                onError(error)
            }
        },
        {
            timeout: 15000,
            enableHighAccuracy: true,
            showLocationDialog: true,
            forceRequestLocation: true,
        }
    );
}

var headersInfo = { coordinatesInfo: {}, appVersions: { live: constants.app_version, codepush: constants.app_version } };
export const sharedSetHeadersInfo = async () => {
    const _deviceInfo = await sharedGetDeviceInfo();
    sharedGetCurrentLocation(coords => headersInfo = { ...headersInfo, ..._deviceInfo, coordinatesInfo: coords })
};
export const sharedGetHeadersInfo = () => headersInfo;

export const makeArrayRepeated = (arr, repeats) => [].concat(...Array.from({ length: repeats }, () => arr));

export const sharedRiderRating = (orderID = 0, currentRoute = null) => {
    NavigationService.NavigationActions.common_actions.reset_with_filter_invert([ROUTES.APP_DRAWER_ROUTES.Home.screen_name], {
        name: ROUTES.APP_DRAWER_ROUTES.RateRider.screen_name,
        params: { orderID }
    });
    // if(currentRoute){
    //     NavigationService.NavigationActions.stack_actions.replace(ROUTES.APP_DRAWER_ROUTES.RateRider.screen_name,{orderID},currentRoute);
    // }else{
    //     NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.RateRider.screen_name,{orderID});
    // }
}
export const sharedAddUpdateFirestoreRecord = async (data = {}) => {

    try {
        // console.log("if sharedAddUpdateFirestoreRecord data=>>>", data);
        sharedGetCurrentLocation(async (coords) => {
            let adsCollection = null
            const db = firestore()
            let userID, hardwareID = ""
            let time = dayjs().format("DD-MM-YYYY  HH")
            const DATE_TIME_FORMATE = dayjs().format("DD-MM-YYYY  HH:mm:ss")
            hardwareID = (await sharedGetDeviceInfo()).deviceID
            const userReducer = store.getState().userReducer;
            const curentDateTime = new Date().getTime()
            if (!userID) {
                userID = userReducer.id
                concatedId = `${userID}-${hardwareID}-${curentDateTime}`
            }
            if (!adsCollection) adsCollection = db.collection(ENUMS.FIRESTORE_STRUCTURE[0].text)
            adsCollection.doc(time).set({ createdAt: DATE_TIME_FORMATE });
            adsCollection.doc(time).collection(ENUMS.FIRESTORE_STRUCTURE[1].text).doc(concatedId).set({ ...data, userID, latitude: coords.latitude, longitude: coords.longitude, createdAt: DATE_TIME_FORMATE })
        }, err => {
            console.log("err", err);
            sharedExceptionHandler(err)

        })

    } catch (error) {
        sharedExceptionHandler(error)
        console.log("firestore error=>", error);

    }
}

export const sharedGetFinalDestintionRequest = () => {
    const userReducer = store.getState().userReducer;
    return {
        latitude: userReducer.finalDestObj.latitude,
        longitude: userReducer.finalDestObj.longitude,
    };
}

export const getBottomPadding = (insets, bottom = 0, extraBottom = 0) => {
    if (Platform.OS === "ios") {
        return insets.bottom > 0 ? insets.bottom + extraBottom : bottom;
    } else {
        return bottom;
    }
}

export const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

export const validURL=(str)=> {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }