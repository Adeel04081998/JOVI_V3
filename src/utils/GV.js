import React from "react";
import constants from "../res/constants";
let initUrlRef = React.createRef(null);
initUrlRef.current = __DEV__ ? constants.url_qasprint_v1 : constants.url_qasprint_v1;
export const PITSTOP_TYPES = {
    DEFAULT: 0,
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
    JOVI_MART: 5,
};
export const PITSTOP_TYPES_INVERTED = {
    0:'DEFAULT',
    1:'SUPER_MARKET',
    2:'JOVI',
    3:'PHARMACY',
    4:'RESTAURANT',
    5:'JOVI_MART',
};
export default {
    BASE_URL: initUrlRef,
    SET_VALUE: 1,
    GET_VALUE: 2,
    NET_INFO_REF: React.createRef(null),
    OTP_INTERVAL: 30, // SECONDS
    THEME_VALUES: { ...PITSTOP_TYPES },
    MAX_PITSTOP_IMAGE_LIMIT: 3,
    MAX_JOVI_AMOUNT: 10000
} 
