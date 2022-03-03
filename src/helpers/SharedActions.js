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
import constants from '../res/constants';
import NavigationService from '../navigations/NavigationService';
import actions from '../redux/actions';
import preference_manager from '../preference_manager';
import ROUTES from '../navigations/ROUTES';
import ENUMS from '../utils/ENUMS';
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
        if (err.data) {
            if (err.data.errors) {
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

export const renderFile = picturePath => {
    const userReducer = store.getState().userReducer;
    return `${GV.BASE_URL.current}/api/Common/S3File/${encodeURIComponent(
        picturePath,
    )}?access_token=${userReducer?.token?.authToken}`;
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
    prefix = `${prefix}`.trim();
    suffix = `${suffix}`.trim();
    distance = `${distance}`.trim().replace(reg, '').trim();
    return prefix.length > 0 ? `${prefix} ${distance}${suffix}` : `${distance}${suffix}`;
}

export const isNextPage = (totalItem, itemPerRequest, currentRequestCount) => {
    const total = itemPerRequest * currentRequestCount;

    return totalItem - total > 0 ? true : false;
};//end of isNextPage

export const sharedCalculateMaxTime = (dataArr = [], key = "estimatePrepTime") => {
    let estimateTime = "",
        arr = [];
    dataArr.map((_resItem, _resIndex) => {
        if (VALIDATION_CHECK(_resItem[key])) {
            let splitTime = String(_resItem[key]).split(":");
            let now = new Date();
            let _dateSpan = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...splitTime);
            arr.push(_dateSpan.getTime())
        }
    })
    estimateTime = arr.length ? new Date(Math.max(...arr)).toLocaleTimeString().replace(Regex.time, '$1') : "";
    return estimateTime;
}
export const sharedCalculateCartTotals = (pitstops = [], cartReducer) => {
    console.log("[sharedCalculateCartTotals]", pitstops);
    let joviRemainingAmount = constants.max_jovi_order_amount,
        subTotal = 0,
        discount = 0,
        serviceCharges = cartReducer.serviceCharges || 0,
        itemsCount = 0,
        joviPitstopsTotal = 0,
        joviPrevOrdersPitstopsAmount = 0,
        joviCalculation = 0,
        vendorMaxEstTime = "",
        estimateTime = "",
        gst = 0,
        total = 0;
    pitstops.map((pitstop, index) => {
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
            // itemsCount += _pitstop.checkOutItemsListVM.length;
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
    subTotal = subTotal + joviPitstopsTotal;
    total = (subTotal - discount) + serviceCharges;
    joviCalculation = joviRemainingAmount - (joviPitstopsTotal + joviPrevOrdersPitstopsAmount)
    joviRemainingAmount = joviCalculation <= 0 ? 0 : joviCalculation;
    // console.log('[TO STORE DATA => PITSTOPS,joviRemainingAmount, subTotal,discount, total,itemsCount, serviceCharges]', pitstops, joviRemainingAmount, subTotal, discount, total, itemsCount, serviceCharges);
    if (!pitstops.length) {
        dispatch(ReduxActions.clearCartAction({ pitstops: [] }));
        NavigationService.NavigationActions.common_actions.goBack();
    } else {
        dispatch(ReduxActions.setCartAction({ pitstops, joviRemainingAmount, subTotal, itemsCount, joviPitstopsTotal, joviPrevOrdersPitstopsAmount, joviCalculation, total, estimateTime, gst, discount }));
    }
};
export const sharedDiscountsCalculator = (
    originalPrice = 0,
    discount = 0
) => {
    let afterDiscount = Math.round(
        originalPrice - (originalPrice * (discount / 100)),
    );
    return afterDiscount;
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
    swappedArray = [],
    forceAddNewItem = false,
    fromCart = false,
    cb = () => { },
    forceUpdate = false,
) => {
    console.log("pitstopDetails", pitstopDetails);
    if (false) return dispatch(ReduxActionss.clearCartAction({}));
    const cartReducer = store.getState().cartReducer;
    if (swappedArray.length) return sharedCalculateCartTotals(swappedArray, cartReducer);
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
    console.log('[TO CALCULATE PITSTOPS]', pitstops);
    cb();
    
    cartReducer.forceUpdate = forceUpdate;
    sharedCalculateCartTotals(pitstops, cartReducer)

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

export const sharedGetServiceCharges = (payload = null, successCb = () => { }) => {
    const cartReducer = store.getState().cartReducer;
    const userReducer = store.getState().userReducer;
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
        "estimateTime": cartReducer.estimateTime || null,
        "pitstops": [...cartReducer.pitstops, { ...(userReducer?.finalDestObj ?? {}) }].map((_pitstop, pitIndex) => ({
            "isRestaurant": _pitstop.isRestaurant,
            "latLng": `${_pitstop.latitude},${_pitstop.longitude}`,
            "pitStopType": _pitstop.pitstopType,
        })),
        pitstopItems,
        "skipEstAmountAndGst": cartReducer.pitstops.every(pt => pt.pitstopType === 2) ? true : false,
        // "hardwareID": "string",
        // "promoCodeApplied": "string",
        // "adminID": "string",
        // "isAdmin": true,
        // "orderID": 0
    }
    console.log('payload--sharedGetServiceCharges', payload);
    postRequest(
        Endpoints.SERVICE_CHARGES,
        payload,
        (response) => {
            const { statusCode, serviceCharge, chargeBreakdown, discount } = response.data;
            console.log('service charges response -----', response);
            if (statusCode === 200)
                // NEED TO MODIFY THESE LOGIC FOR FUTURE CASES LIKE CHECKOUT SCREEN...
                if (!cartReducer.serviceCharges) {
                    dispatch(ReduxActions.setCartAction({ serviceCharges: serviceCharge, total: cartReducer.total + serviceCharge, chargeBreakdown: chargeBreakdown ?? {} }))
                }
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
        _price = item.gstAddedPrice || item.itemPrice || item.price || 0;
    } else {
        _price = item.discountedPrice || item.gstAddedPrice || item.itemPrice || item.price || 0;
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
            if (response.data.order.orderStatus === 3) {
                NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
                return;
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
export const sharedOrderNavigation = (orderID = null, orderStatus = null, replacingRoute = null) => {
    console.log('orderID', orderID);
    const navigationLogic = (route) => {
        if (replacingRoute) {
            NavigationService.NavigationActions.stack_actions.replace(route, { orderID }, replacingRoute);
        } else {
            NavigationService.NavigationActions.common_actions.navigate(route, { orderID });
        }
    };
    const goToOrderProcessing = () => navigationLogic(ROUTES.APP_DRAWER_ROUTES.OrderProcessing.screen_name);
    const goToOrderProcessingError = () => navigationLogic(ROUTES.APP_DRAWER_ROUTES.OrderProcessingError.screen_name);
    const goToOrderTracking = () => navigationLogic(ROUTES.APP_DRAWER_ROUTES.OrderProcessingError.screen_name);
    const orderStatusEnum = {
        'VendorApproval': goToOrderProcessing,
        'VendorProblem': goToOrderProcessing,
        'CustomerApproval': goToOrderProcessingError,
        'CustomerProblem': goToOrderProcessingError,
        'FindingRider': goToOrderTracking,
        'Initiated': goToOrderTracking,
        'Processing': goToOrderTracking,
        'RiderFound': goToOrderTracking,
        'RiderProblem': goToOrderTracking,
        'TransferProblem': goToOrderTracking,
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
        item._itemPrice = item.discountedPrice || item.gstAddedPrice || item.itemPrice;
        item._itemPriceWithoutDiscount = item.gstAddedPrice;
        item._totalDiscount = item.discountType === ENUMS.DISCOUNT_TYPES.Percentage ? sharedDiscountsCalculator(item._itemPriceWithoutDiscount, item.discountAmount) : item.discountAmount; // if discount type is fixed then discount amount would be the discounted price
        item._totalGst = item.gstAmount;
    }
    return {
        restaurant,
        item
    }

}
