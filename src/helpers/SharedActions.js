import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Alert, AppState, Platform, StatusBar } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import Toast from '../components/atoms/Toast';
import { getRequest, multipartPostRequest, postRequest } from '../manager/ApiManager';
import configs from '../utils/configs';
import Endpoints from '../manager/Endpoints';
import NavigationService from '../navigations/NavigationService';
import ROUTES from '../navigations/ROUTES';
import { default as actions, default as ReduxActions } from '../redux/actions';
import { store } from '../redux/store';
import constants from '../res/constants';
import ENUMS from '../utils/ENUMS';
import GV, { isIOS, ORDER_STATUSES, PITSTOP_TYPES } from '../utils/GV';
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
export const sharedExceptionHandler = (err, skipToast = false) => {
    // console.log("[sharedExceptionHandler].err", err);
    const TOAST_SHOW = skipToast ? 0 : 3000;
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
            // console.log("[sharedGetUserAddressesApi].res", res);
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
    const userReducer = store.getState().userReducer;
    const finalDestination = userReducer.finalDestObj ?? {};
    postRequest(
        `${Endpoints.GET_PROMOTIONS}`,
        {
            isDashboard: true,
            isUserSpecific: false, // Need to discuss with Shakir
            "latitude": finalDestination.latitude ?? 0,
            "longitude": finalDestination.longitude ?? 0,
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

export const sharedConfirmationAlert = (title, message, buttons = [], options = { cancelable: true, onDismiss: () => { } }, customAlert = null) => {
    if (customAlert) {
        store.dispatch(actions.setCustomAlertAction({
            title,
            message,
            okButton: customAlert.okButton,
            cancelButton: customAlert.cancelButton,
            ...customAlert,
        }))
    } else {
        Alert.alert(title, message, buttons, options)
    }
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
    if (price) {
        return parseInt(`${price}`) < 1 ? showZero ? `${prefix} ${price}${suffix}` : '' : suffix.length > 0 ? `${prefix} ${price}${suffix}` : `${prefix} ${price}`;
    } else {
        price = `${0}`.trim().replace(reg, '').trim();
        return `${prefix} ${price}${suffix}`
    }
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
    // let joviRemainingAmount = constants.max_jovi_order_amount,
    let joviRemainingAmount = cartReducer.joviRemainingAmount,
        subTotal = 0,
        discount = 0,
        itemsCount = 0,
        joviPitstopsTotal = 0,
        joviPrevOrdersPitstopsAmount = 0,
        joviCalculation = 0,
        vendorMaxEstTime = "",
        estimateTime = "",
        itemsTotalWithDiscounts = 0,
        gst = 0,
        total = 0;
    pitstops = pitstops.map((pitstop, index) => {
        let _pitstop = { ...pitstop }
        if (_pitstop.pitstopType === PITSTOP_TYPES.JOVI) {
            itemsCount += 1;
            _pitstop.individualPitstopTotal = _pitstop.estimatePrice || 0;
            joviPitstopsTotal = _pitstop.individualPitstopTotal;
            let openOrdersList = cartReducer.openOrdersList;
            if (openOrdersList.length) {
                joviPrevOrdersPitstopsAmount += openOrdersList.map((orderInfo, index) => orderInfo?.estimatePrice ?? 0).reduce((a, b) => a + b);
            }
        } else if (_pitstop.pitstopType === PITSTOP_TYPES.PHARMACY) {
            itemsCount += 1;
            _pitstop.individualPitstopTotal = _pitstop.estimatePrice || 0;
            joviPitstopsTotal += _pitstop.individualPitstopTotal;
            let openOrdersList = cartReducer.openOrdersList;
            if (openOrdersList.length) {
                joviPrevOrdersPitstopsAmount += openOrdersList.map((orderInfo, index) => orderInfo?.estimatePrice ?? 0).reduce((a, b) => a + b);
            }
        } else if (!_pitstop.isPickupPitstop) {
            let _pitTotal = 0;
            let individualPitstopGst = 0;
            vendorMaxEstTime = sharedCalculateMaxTime(_pitstop.pitstopType === PITSTOP_TYPES.RESTAURANT ? _pitstop.checkOutItemsListVM : [], "estimatePrepTime");
            // console.log("vendorMaxEstTime", vendorMaxEstTime);
            _pitstop.vendorMaxEstTime = vendorMaxEstTime;
            _pitstop.checkOutItemsListVM.map((product, j) => {

                // gst += (product.gstAmount || 0) * product.quantity;
                // discount += (product.discountAmount || 0) * product.quantity;
                // _pitTotal = ((product.gstAddedPrice || product.itemPrice || 0) + (product.totalAddOnPrice || 0)) * product.quantity;

                gst += product._totalGst * product.quantity;
                individualPitstopGst += product._totalGst * product.quantity;
                discount += product._totalDiscount * product.quantity;
                _pitTotal += product._itemPrice * product.quantity;
                // subTotal += _pitTotal + discount;
                // itemsTotalWithDiscounts += _pitTotal;
                itemsTotalWithDiscounts += product._itemPrice * product.quantity;
                subTotal += product._priceForSubtotals * product.quantity;
                itemsCount += product.quantity;

            })
            _pitstop.individualPitstopTotal = _pitTotal;
            _pitstop.individualPitstopGst = individualPitstopGst;
        }
        return _pitstop;
    })
    console.log("pitstops...", pitstops);
    // console.log("joviPitstopsTotal", joviPitstopsTotal);
    estimateTime = sharedCalculateMaxTime([...pitstops].filter(_p => _p.pitstopType === PITSTOP_TYPES.RESTAURANT), "vendorMaxEstTime")
    // console.log("estimateTime", estimateTime);
    subTotal = subTotal + joviPitstopsTotal;
    console.log("subTotal", subTotal);

    total = itemsTotalWithDiscounts + joviPitstopsTotal;
    console.log("total", total);
    console.log("joviPitstopsTotal", joviPitstopsTotal);
    console.log("joviPrevOrdersPitstopsAmount", joviPrevOrdersPitstopsAmount);

    joviCalculation = joviRemainingAmount - (joviPitstopsTotal + joviPrevOrdersPitstopsAmount)
    console.log("joviCalculation", joviCalculation);

    joviRemainingAmount = joviCalculation <= 0 ? 0 : joviCalculation;
    console.log("joviRemainingAmountInside", joviRemainingAmount);

    dispatch(ReduxActions.setCartAction({ pitstops, joviRemainingAmount, subTotal, itemsTotalWithDiscounts, itemsCount, joviPitstopsTotal, joviPrevOrdersPitstopsAmount, joviCalculation, total, estimateTime, gst, discount }));
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
const checkSameProduct = (currentCheckoutItems, newP, productEditCase = false) => {
    let newProductOptionsListIds = newP.selectedOptions.map(item => (item.itemOptionID)).slice().sort();
    currentCheckoutItems.map((item, i) => {
        let isOptionsSame = item.selectedOptions.map(x => (x.itemOptionID)).slice().sort().every(function (value, index) {
            return value === newProductOptionsListIds[index];
        });
        let isNotesSame = item.notes.toString().toLowerCase() === newP.notes.toString().toLowerCase();
        if (isOptionsSame && isNotesSame) {
            newP = { ...newP, quantity: productEditCase ? newP.quantity : newP.quantity + item.quantity, alreadyExisted: true, checkoutIndex: i };
        }
    });
    return {
        newP
    };
}
export const sharedAddUpdatePitstop = (
    pitstopDetails = {},
    isDeletePitstop = false,
    swappedPitstops = [],
    forceAddNewItem = false,
    fromCart = false,
    cb = () => { },
    forceUpdate = false,
    incDec = false,
) => {
    const cartReducer = store.getState().cartReducer;
    if (swappedPitstops.length) {
        dispatch(ReduxActions.setCartAction({ pitstops: swappedPitstops }));
        sharedCalculateCartTotals(swappedPitstops, cartReducer);
        return;
    }
    let pitstops = cartReducer.pitstops;
    // if (pitstops.length >= constants.max_pitstops_limit) {
    //     sharedConfirmationAlert("Alert", `Maximum pitstops ${pitstops.length} limit reached!`,
    //         [],
    //     )
    //     return;
    // }
    console.log("pitstopDetails", pitstopDetails);
    const pitstopIndex = (pitstopDetails?.pitstopIndex >= 0 ? pitstopDetails.pitstopIndex : null);
    if (pitstopIndex !== null && isDeletePitstop) {
        console.log('[DELETE PITSTOP FROM CART]');
        if (pitstops[pitstopIndex].pitstopType === PITSTOP_TYPES.JOVI || pitstops[pitstopIndex].pitstopType === PITSTOP_TYPES.PHARMACY) {
            cartReducer.joviRemainingAmount += pitstops[pitstopIndex].estimatePrice ?? 0;
        }
        pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIndex);
    } else if (pitstopDetails.pitstopType === PITSTOP_TYPES.PHARMACY) {
        console.log('[Pharmacy PITSTOP]');
        if (pitstopIndex !== null) {
            console.log('[INDEX] EXIST');
            console.log('[UPDATE Pharmacy PITSTOP]');
            if (pitstopDetails.isPickupPitstop) {
                pitstops[pitstopIndex] = { ...pitstopDetails.pickUpPitstop, parentPitstop: { ...pitstopDetails }, }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS
                const indexOfLinkedPitstop = pitstops.findIndex(item => item.pitstopID === pitstopDetails.pickUpPitstop.linkedPitstopId);
                if (indexOfLinkedPitstop !== -1) {
                    pitstops[indexOfLinkedPitstop] = { ...pitstops[indexOfLinkedPitstop], ...pitstopDetails, pitstopIndex: pitstopIndex, }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS
                }
            } else {
                pitstops[pitstopIndex] = { ...pitstops[pitstopIndex], ...pitstopDetails, pitstopIndex: pitstopIndex, }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS
                const indexOfLinkedPitstop = pitstops.findIndex(item => item.pitstopID === pitstopDetails.linkedPitstopId);
                console.log('indexOfLinkedPitstop', indexOfLinkedPitstop, { ...pitstopDetails.pickUpPitstop, parentPitstop: { ...pitstopDetails }, });
                if (indexOfLinkedPitstop !== -1) {
                    pitstops[indexOfLinkedPitstop] = { ...pitstops[indexOfLinkedPitstop], ...pitstopDetails.pickUpPitstop, parentPitstop: { ...pitstopDetails }, }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS
                }
            }
            pitstops[pitstopIndex] = { ...pitstopDetails, isPharmacy: true, isJoviJob: false, }; // TO RETAIN OLD PROPERTIES AS IT IS WITH UPDATED VAUES YOU NEED TO PASS SPREADED (...) OLD ITEM'S FULL DATA WITH UPDATED FIELDS
            // pitstops[pitstopIndex] = { ...pitstops[index], ...pitstopDetails }; // ...pitstops[index] IF YOU DON'T HAVE ITEM'S PREVIOUS DATA (VERY RARE CASE)
        } else {
            // ADD NEW PITSTOP
            console.log('[NEW CREATE]');
            const pharmacyId = sharedUniqueIdGenerator();
            const pickupPitstopId = sharedUniqueIdGenerator();
            if (pitstopDetails.pickUpPitstop) {
                pitstops.push({ ...pitstopDetails.pickUpPitstop, parentPitstop: { ...pitstopDetails }, pitstopType: 3, pitstopName: ENUMS.PharmacyPitstopTypeServer['1'].text, linkedPitstopId: pharmacyId, pitstopID: pickupPitstopId, isPharmacy: true, isPickupPitstop: true, isJoviJob: false, isRestaurant: false });
            }
            pitstops.push({ ...pitstopDetails, linkedPitstopId: pickupPitstopId, pitstopID: pharmacyId, isPharmacy: true, isJoviJob: false, isRestaurant: false });
            console.log('[NEW CREATE]', pitstops, pitstopDetails);
        }
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
        console.log('[PITSTOP ID ACTION KEY]', pitstopActionKey);
        console.log('[ITEM ID ACTION KEY]', actionKey);
        const pitstopIdx = pitstops.findIndex(x => x[pitstopActionKey] === upcomingVendorDetails[pitstopActionKey]); //(x.pitstopID === pitstopDetails.pitstopID || x.smid === pitstopDetails.smid))
        if (pitstopIdx !== -1) {
            let currentPitstopItems = pitstops[pitstopIdx].checkOutItemsListVM;
            console.log('[PITSTOP FOUND]', pitstops[pitstopIdx]);
            let itemIndex = currentPitstopItems.findIndex(item => item[actionKey] === upcomingItemDetails[actionKey]);
            console.log('[itemIndex]', itemIndex);
            if (!fromCart && upcomingItemDetails.selectedOptions?.length && itemIndex >= 0) {
                console.log('[SELECTED OPTIONS EXIST]');
                if (pitstopDetails.productEditCase) {
                    console.log('[EDIT CASE -> UPDATE EXISTING CHECKOUT ITEMS]');
                    currentPitstopItems[itemIndex] = { ...upcomingItemDetails, alreadyExisted: undefined, checkoutIndex: undefined, checkOutItemID: currentPitstopItems[itemIndex].checkOutItemID };
                    pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                } else {
                    upcomingItemDetails = checkSameProduct(currentPitstopItems, upcomingItemDetails, pitstopDetails.productEditCase).newP;
                    if (upcomingItemDetails.alreadyExisted) {
                        console.log('[CHECKOUT ITEMS ALREADY EXIST]');
                        itemIndex = upcomingItemDetails.checkoutIndex;
                        if (!upcomingItemDetails.quantity) {
                            console.log('[QUANTITY LESS THAN OR EQUAL TO ZERO]');
                            if ((currentPitstopItems.length - 1) <= 0) pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIdx);
                        } else {
                            console.log('[UPDATE EXISTING CHECKOUT ITEMS]');
                            currentPitstopItems[itemIndex] = { ...upcomingItemDetails, alreadyExisted: undefined, checkoutIndex: undefined, checkOutItemID: currentPitstopItems[itemIndex].checkOutItemID };
                            pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                        }
                    } else {
                        currentPitstopItems.push({ checkOutItemID: sharedUniqueIdGenerator(), ...upcomingItemDetails, });
                        pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                    }
                }
            }
            // else if (itemIndex !== -1 && !forceAddNewItem) {
            else if (itemIndex !== -1) {
                if (!upcomingItemDetails.quantity) {
                    console.log('[QUANTITY LESS THAN OR EQUAL TO ZERO]');
                    if ((currentPitstopItems.length - 1) <= 0) {
                        pitstops = pitstops.filter((pitstop, idx) => idx !== pitstopIdx);
                        console.log('[NO ITEMS EXIST IN PITSTOP SO PITSTOP HAS BEEN REMOVED FROM PITSTOSP]', pitstops);
                    }
                    else {
                        console.log('[REMOVE SINGLE ITEM FROM CHECKOUT LIST..]');
                        currentPitstopItems = currentPitstopItems.filter((_item, idx) => idx !== itemIndex);
                        pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                    }
                } else {
                    if (incDec) {
                        console.log('[INCREAMETN DECREACMENT QUANTITY]');
                        currentPitstopItems[itemIndex] = { ...upcomingItemDetails, checkOutItemID: currentPitstopItems[itemIndex].checkOutItemID };
                        pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                    } else {
                        console.log('[UPDATE QUANTITY OF AN EXISTING ITEM]');
                        currentPitstopItems[itemIndex] = { ...upcomingItemDetails, quantity: pitstopDetails.productEditCase ? upcomingItemDetails.quantity : currentPitstopItems[itemIndex].quantity + upcomingItemDetails.quantity, checkOutItemID: currentPitstopItems[itemIndex].checkOutItemID };
                        pitstops[pitstopIdx].checkOutItemsListVM = currentPitstopItems;
                    }
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
                latitude: upcomingItemDetails?.latitude ?? upcomingVendorDetails.latitude,
                longitude: upcomingItemDetails?.longitude ?? upcomingVendorDetails.longitude,
                pitstopType: pitstopDetails.pitstopType,
                isRestaurant: pitstopDetails.pitstopType === PITSTOP_TYPES.RESTAURANT,
                pitstopID: pitstopDetails.vendorDetails.marketID ?? pitstopDetails.vendorDetails.pitstopID,
                checkOutItemsListVM: [{ pitstopType: pitstopDetails.pitstopType, ...upcomingItemDetails, checkOutItemID: sharedUniqueIdGenerator() }],
            });
        }
    }
    console.log('[TO CALCULATE PITSTOPS]', pitstops);
    cb && cb();
    cartReducer.forceUpdate = forceUpdate;
    if (!pitstops.length) {
        dispatch(ReduxActions.clearCartAction({ pitstops: [], forceUpdate }));
        if (fromCart) setTimeout(() => {
            NavigationService.NavigationActions.common_actions.goBack();
        }, 0);
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
        // console.log("[sharedGetFiltersApi].res ====>>", res);
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
    const pitstopItems = [];
    [...cartReducer.pitstops].map((item, i) => {
        if (item.checkOutItemsListVM) {
            item.checkOutItemsListVM.map((product, j) => {
                // console.log("product here...", product);
                pitstopItems.push({
                    "itemPrice": product._itemPrice,
                    "gstAddedPrice": product._priceForSubtotals,
                    "gstPercentage": product.gstPercentage,
                    "itemDiscount": (product._totalDiscount - product._totalJoviDiscount),
                    "joviDiscount": product._totalJoviDiscount,
                    "actualPrice": product._priceForSubtotals - product.gstAmount,
                    // "gstAddedPrice": item.pitstopType === PITSTOP_TYPES.SUPER_MARKET ? product.gstAddedPrice : product.gstAddedPrice + product.totalJoviDiscount + product._totalDiscount,
                    // "itemDiscount": product.itemDiscount,
                    // "joviDiscount": product.joviDiscount,
                    // "actualPrice": item.pitstopType === 1 ? product.actualPrice : product.gstAddedPrice + product.totalJoviDiscount + product._totalDiscount,
                    "gstAmount": product._totalGst,
                    "quantity": product.quantity,
                    "pitStopType": item.pitstopType,
                    "pitstopID": item.marketID || item.pitstopID || 0,
                    "pitstopItemID": product.pitStopItemID
                });
            });
        }
    });
    // #region :: Handling Promo Code START's FROM HERE 
    let promoCodeApplied = null;
    if (payload && typeof payload === "object") {
        if (Object.keys(payload).length === 1) {
            if ("promoCodeApplied" in payload) {
                promoCodeApplied = payload.promoCodeApplied;
                payload = null;
            }
        }
    }

    // #endregion :: Handling Promo Code END's FROM HERE 
    payload = payload ? payload : {
        "joviJobAmount": cartReducer.joviPitstopsTotal,
        "estimateTime": estimateTime || null,
        "pitstops": [...cartReducer.pitstops, { ...(userReducer?.finalDestObj ?? {}) }].map((_pitstop, pitIndex) => ({
            "isRestaurant": _pitstop.isRestaurant || false,
            "latLng": `${_pitstop.latitude},${_pitstop.longitude}`,
            "pitStopType": _pitstop.pitstopType || 0,
        })),
        "skipEstAmountAndGst": cartReducer.pitstops.every(pt => pt.pitstopType === 2 || pt.pitstopType === undefined) ? true : false,
        ...promoCodeApplied && {
            promoCodeApplied,
        }
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
    console.log('[sharedGetServiceCharges].payload', payload);
    postRequest(
        Endpoints.SERVICE_CHARGES,
        payload,
        (response) => {
            const { statusCode, serviceCharge, serviceTax, chargeBreakdown, genericDiscount, orderEstimateTime } = response.data;
            console.log('[sharedGetServiceCharges].response', response);
            if (statusCode === 200)
                dispatch(ReduxActions.setCartAction({ orderEstimateTime, serviceCharges: serviceCharge, serviceTax, genericDiscount, chargeBreakdown: chargeBreakdown ?? {} }))
            successCb(response);
        },
        (error) => {
            console.log('[sharedGetServiceCharges].error', error);
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
                // console.log("sharedSendFCMTokenToServer.success :", res)
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
            // console.log('sharedFetchOrder', response);
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
        if (isFirstPitstopRestaurant === null && !ignoredStatuses.includes(item?.joviJobStatus)) {
            isFirstPitstopRestaurant = item?.pitstopType === 4;
        }
    });
    return isFirstPitstopRestaurant;
}
export const sharedOrderNavigation = (orderID = null, orderStatus = null, replacingRoute = null, newOrder = null, showBack = false, pitstopsList = []) => {
    // console.log('orderID', orderID);
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

export const sharedCalculateJoviDiscount = (item) => {
    // Base Price 375
    // Jovi discount percentage 35%
    // Jovi discountedAmount 131
    let totalJoviDiscount = 0;
    if (item.isJoviDiscount) {
        totalJoviDiscount = Math.round((item.itemPrice || item.actualPrice || item.price) * (item.joviDiscount / 100));
    }
    return totalJoviDiscount;
}

export const sharedAddToCartKeys = (restaurant = null, item = null) => {
    if (restaurant) {

    }
    if (item) {
        item._itemPrice = item.discountedPrice > 0 ? item.discountedPrice : item.gstAddedPrice > 0 ? item.gstAddedPrice : item.itemPrice;
        item._priceForSubtotals = item.gstAddedPrice > 0 ? item.gstAddedPrice : item.itemPrice;
        item._itemPriceWithoutDiscount = item.gstAddedPrice;
        item._toCalculateDiscountOnAmount = item.actualPrice || item.itemPrice || item.gstAddedPrice;
        item._totalDiscount = item?.discountType === ENUMS.DISCOUNT_TYPES.Percentage ? sharedDiscountsCalculator(item._toCalculateDiscountOnAmount, item.discountAmount)._discountAmount : item.discountAmount; // if discount type is fixed then discount amount would be the discounted price
        item._totalGst = item.gstAmount;
        item._clientGstAddedPrice = item.gstAddedPrice;
        item._totalJoviDiscount = sharedCalculateJoviDiscount(item);
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
        title = title + ' - x ' + quantity;
    }
    return title;
}

export const sharedCalculatedTotals = () => {
    const { subTotal = 0, discount = 0, serviceCharges = 0, serviceTax = 0, genericDiscount = 0, total = 0, gst = 0, itemsTotalWithDiscounts = 0 } = store.getState().cartReducer;
    const _serviceCharges = serviceCharges + serviceTax;
    return {
        gst: Math.round(gst),
        serviceTax: Math.round(serviceTax),
        serviceCharges: Math.round(_serviceCharges),
        discount: Math.round(discount + genericDiscount), // ref => Mudassir: Because we are calculating discounts on frontend so we are adding just genericDiscount.
        genericDiscount: Math.round(genericDiscount),
        subTotal: Math.round(subTotal),
        // total: Math.round(total + _serviceCharges),
        total: Math.round((total - genericDiscount) + _serviceCharges),
        itemsTotalWithDiscounts: Math.round(itemsTotalWithDiscounts + _serviceCharges),
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
export const sharedNotificationHandlerForOrderScreens = (fcmReducer, fetchOrder = () => { }, orderCompletedOrCancelled = () => { }, orderID = null) => {
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
    // '21' Chat message at INDEX 9
    // "22" Final Destination changed at index 10
    const notificationTypes = ["1", "11", "12", "13", "14", "18", "17", "16", "2", "21", "22"]
    console.log('fcmReducer------OrderPitstops', fcmReducer);
    const jobNotify = fcmReducer.notifications?.find(x => (x.data && (notificationTypes.includes(`${x.data.NotificationType}`))) ? x : false) ?? false;
    if (jobNotify) {
        console.log(`[jobNotify]`, jobNotify)
        const { data, notifyClientID } = jobNotify;
        if (orderID && parseInt(orderID) !== parseInt(data.OrderID)) { return; }
        // const results = sharedCheckNotificationExpiry(data.ExpiryDate);
        // if (results.isSameOrBefore) {
        if (data.NotificationType == notificationTypes[1] || data.NotificationType == notificationTypes[0] || data.NotificationType === notificationTypes[10]) {
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
        else if (data.NotificationType == notificationTypes[9]) {
            NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.OrderPitstops.screen_name, { orderID: (data.OrderID || data.orderId || data.orderID || data.OrderId || orderID), isFinalDestinationCompleted: true });
        }
        else {

        }
        //  To remove old notification
        dispatch(actions.fcmAction({ notifyClientID }));
    } else console.log("[Order OrderPitstops] Job notification not found!!");
}
export const sharedOnCategoryPress = (item, index, useReplace = false) => {
    const pitstopType = item.value;
    const routes = {
        4: ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name,
        1: ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name,
        2: ROUTES.APP_DRAWER_ROUTES.JoviJob.screen_name,
        3: ROUTES.APP_DRAWER_ROUTES.Pharmacy.screen_name,
    }
    if (useReplace) {
        NavigationService.NavigationActions.stack_actions.replace(routes[pitstopType], { pitstopType });
    } else {
        NavigationService.NavigationActions.common_actions.navigate(routes[pitstopType], { pitstopType });
    }
}

export const sharedGetCurrentLocation = (onSuccess = () => { }, onError = () => { }) => {
    hybridLocationPermission();

    navigator.geolocation?.getCurrentPosition(({ coords }) => onSuccess(coords),
        (error) => {
            console.log("error==>", error);
            if (error) {
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

export const sharedForegroundCallbackHandler = (cb = () => { }) => {
    return AppState.addEventListener('change', nextAppState => {
        if (nextAppState === 'active' || nextAppState === 'inactive') {
            cb();
        }
    });
}
export const getBottomPadding = (insets, bottom = 0, extraBottom = 0) => {
    if (Platform.OS === "ios") {
        return insets.bottom > 0 ? insets.bottom + extraBottom : bottom;
    } else {
        return bottom;
    }
}

export const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

export const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

export const splitArray = (array, n) => {
    let [...arr] = array;
    let res = [];
    while (arr.length) {
        res.push(arr.splice(0, n));
    }
    return res;
};

export const sharedVerifyCartItems = () => {
    sharedGetServiceCharges()
    return;
    const pitstops = [...store.getState().cartReducer.pitstops];
    let payload = {
        itemIDs: []
    };
    pitstops.map((pitstop, index) => {
        if (pitstop.checkOutItemsListVM) {
            payload = {
                "itemIDs": [...payload.itemIDs, ...pitstop.checkOutItemsListVM.map(_item => ({
                    "pitStopItemID": _item.pitStopDealID > 0 ? 0 : _item.pitStopItemID, // Condition added because we are using `pitStopItemID` in case of deals in some cases.
                    "pitStopDealID": _item.pitStopDealID || 0
                }))]
            }
        }
    });
    if (pitstops.length > 0) {
        // console.log("[VERIFY_CART_ITEMS].payload", payload);
        postRequest(
            Endpoints.VERIFY_CART_ITEMS,
            payload,
            res => {
                console.log("[VERIFY_CART_ITEMS].res", res);
                const { statusCode = 200, productList = [] } = res.data;
                if (statusCode === 200) {
                    let is_difference = false;
                    let removedItems = [];
                    // console.log("Pitstops", pitstops);
                    let modifiedPitstops = pitstops.map((_pitstop, j) => {
                        const checkOutItemsListVM = _pitstop.checkOutItemsListVM || null;
                        if (checkOutItemsListVM) {
                            for (let index = 0; index < _pitstop.checkOutItemsListVM.length; index++) {
                                for (let j = 0; j < productList.length; j++) {
                                    const clientItem = checkOutItemsListVM[index];
                                    const serverItem = productList[j];
                                    const clientItemID = clientItem && (clientItem.pitStopItemID || clientItem.pitStopDealID);
                                    const serverItemID = serverItem && (serverItem.pitStopItemID || serverItem.pitStopDealID);
                                    if ((clientItem && serverItem && (clientItemID || serverItemID)) && clientItemID === serverItemID) {
                                        // 1725 => Desi Ghee 1kg,  439 => The Chicken Wooper, 234 => "Cheese Tomato"
                                        const condition = (serverItem.availabilityStatus === ENUMS.AVAILABILITY_STATUS.Available && serverItem.gstAddedPrice === clientItem._clientGstAddedPrice && serverItem.discountType === clientItem.discountType && serverItem.pitStopStatus === 1);
                                        console.log("condition", condition)
                                        if (!condition) {
                                            console.log("clientItem", clientItem)
                                            console.log("serverItem", serverItem)
                                            is_difference = true;
                                            _pitstop['checkOutItemsListVM'] = checkOutItemsListVM.filter((item, index) => {
                                                const cartItemID = item.pitStopItemID || item.pitStopDealID;
                                                if (cartItemID !== serverItemID) {
                                                    removedItems.push({ ...item, marketName: _pitstop.pitstopName });
                                                    return item;
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        return _pitstop;
                    }).filter(_p => _p.isJoviJob ? _p : _p.checkOutItemsListVM.length)

                    // let modifiedPitstops = pitstops.map((_pitstop, j) => {
                    //     if (_pitstop.checkOutItemsListVM) {
                    //         let modifiedCheckOutItemsListVM = [..._pitstop.checkOutItemsListVM];
                    //         const findItem = productList.find(x => modifiedCheckOutItemsListVM.find(y => {
                    //             if ((y.pitStopItemID && (y.pitStopItemID === x.pitStopItemID)) || (y.pitStopDealID && (y.pitStopDealID === x.pitStopDealID))) {
                    //                 return x; // Because we need server's item to check statuses
                    //             }
                    //         }))
                    //         console.log("findItem", findItem);
                    //         if (findItem) {
                    //             modifiedCheckOutItemsListVM = modifiedCheckOutItemsListVM.filter((item, index) => {
                    //                 console.log("item", item);
                    //                 const condition = (findItem.availabilityStatus == ENUMS.AVAILABILITY_STATUS.Available && item.gstAddedPrice == findItem.gstAddedPrice && item.discountType == findItem.discountType && findItem.pitStopStatus == 1);
                    //                 if ((item.pitStopItemID && (item.pitStopItemID === findItem.pitStopItemID) && condition) || (item.pitStopDealID && (item.pitStopDealID === findItem.pitStopDealID && condition))) {
                    //                     console.log("Came...");
                    //                     return item;
                    //                 } else {
                    //                     removedItems.push(item)
                    //                     is_difference = true;
                    //                 }
                    //             })
                    //         }
                    //         console.log("modifiedCheckOutItemsListVM", modifiedCheckOutItemsListVM);
                    //         _pitstop.checkOutItemsListVM = modifiedCheckOutItemsListVM;

                    //     }
                    //     return _pitstop;
                    // })
                    console.log("is_difference,  modifiedPitstops,removedItems ", is_difference, modifiedPitstops, removedItems);
                    if (is_difference) {
                        if (!modifiedPitstops.length) {
                            Toast.info(`Items no more available`);
                            dispatch(ReduxActions.clearCartAction({ pitstops: [] }));
                            NavigationService.NavigationActions.common_actions.goBack();
                        }
                        else if (removedItems.length) {
                            const alertStr = removedItems.map(item => (`${item.marketName}: \n ${item.pitStopItemName || item.pitStopDealName}`)).join(", \n");
                            Toast.info(`${alertStr} no more available in market!`, 5000)
                            sharedAddUpdatePitstop(null, false, modifiedPitstops)
                        }
                    } else {
                        console.log("Not any difference");

                    }


                }
            },
            err => {
                console.log("[VERIFY_CART_ITEMS].err", err);
            },
            {},
            true,
        ).finally(() => {
            sharedGetServiceCharges()
        });

    } else {
        sharedGetServiceCharges()
    }
};
export const randomDate = (start = new Date(2019, 2, 1), end = new Date()) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
export const sharedSendFileToServer = (list = [], onSuccess = () => { }, type = 4, extension = 1,) => {
    const userReducer = store.getState().userReducer;
    let formData = new FormData();
    let index = 0;
    for (const item of list) {
        formData.append(`JoviImageList[${index}].JoviImage`, {
            uri: !isIOS ? item.uri : item.uri.replace("file://", ""),
            name: item.uri.split('/').pop(),
            type: item.type,
        });
        formData.append(`JoviImageList[${index}].JoviImageID`, 0);
        formData.append(`JoviImageList[${index}].FileType`, type);
        formData.append(`JoviImageList[${index}].FileExtensionType`, extension);
        if (type === 21) {
            formData.append(`JoviImageList[${index}].audioDuration`, item.duration);
        }
        index += 1;
    }
    multipartPostRequest(Endpoints.ADD_PITSTOPIMAGE, formData, (res) => {
        // console.log('[sendFileToServer]res', res);
        const statusCode = (res?.statusCode ?? 400);
        if (statusCode === 200) {
            onSuccess(res);
        }
    }, (err) => {
        sharedExceptionHandler(err);
    }, false, { Authorization: `Bearer ${userReducer?.token?.authToken}` });
};

export const sharedGetPendingOrderRating = () => {
    // NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.RateRider.screen_name, { orderID: 86208765, });
    // return
    getRequest(Endpoints.GET_PENDING_ORDER_RATING,
        res => {
            const statusCode = res?.data?.statusCode ?? 404;
            if (statusCode === 200) {
                let data = res?.data?.pendingRatings ?? [];
                data = data.filter(i => `${i.orderStatus}`.toLowerCase().trim() === `closed`.toLowerCase().trim());
                if (data.length > 0) {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.RateRider.screen_name, { orderID: data[0].customOrderID, orderArray: data, });
                }
            }
        },
        err => {
            sharedExceptionHandler(err);
        }, {}, false);
};//end of sharedGetPendingOrderRating
export const sharedGetPromoList = (onSuccess = () => { },) => {
    getRequest(Endpoints.GET_PROMOS, (res) => {
        console.log('[GET_PROMOS]', res);
        if (res.data.statusCode === 200) {
            dispatch(ReduxActions.setUserAction({ promoList: res.data.promoList || [] }));


        }
    }, err => {
        sharedExceptionHandler(err);
    });


};
export const sharedGetRiderRatingReasonsList = () => {
    const params = {
        ratingLevel: 0
    };

    const settingsReducer = store.getState().settingsReducer;
    let currentTime = new Date().getTime()
    let ratingTimeStamp = settingsReducer.timeStamps.ratingsTimeStamp;
    if (ratingTimeStamp) {
        let seconds = (currentTime - ratingTimeStamp) / 1000
        let hours = (seconds / 60) / 60
        if (hours < 24) return
    }
    postRequest(Endpoints.GET_RIDER_ORDER_RATING_REASON, params, (res) => {
        console.log("res", res);
        if (res.data.statusCode === 200) {
            const resData = (res.data.reasonsList?.ratingLevels ?? []);
            dispatch(ReduxActions.setUserAction({ ratingReasonsList: resData }));
            dispatch(ReduxActions.setSettingsAction({
                timeStamps: {
                    ratingsTimeStamp: currentTime
                }
            }))
        } else {
            return
        }
    }, (err) => {
        sharedExceptionHandler(err);
    })
};






export const sharedExpectedMarketID = (pitstop = {}) => {
    console.log("[sharedExpectedMarketID].pitstop", pitstop);
    let _id = pitstop.pitstopID || pitstop.marketID || pitstop.vendorID
    return {
        pitstopID: _id,
        vendorID: _id,
        marketID: _id,
    }
}


