import React from "react";
import constants from "../res/constants";
let initUrlRef = React.createRef(null);
initUrlRef.current = __DEV__ ? constants.url_dev : constants.url_live;
export default {
    BASE_URL: initUrlRef,
    netInfoRef: React.createRef(null),
    SET_VALUE: 1,
    GET_VALUE: 2,
    NET_INFO_REF: React.createRef(null),
    OTP_INTERVAL: 30, // SECONDS
    THEME_VALUES: {
        DEFAULT: 0,
        SUPER_MARKET: 1,
        JOVI: 2,
        PHARMACY: 3,
        RESTAURANT: 4,
        JOVI_MART: 5,
    },
    MAX_PITSTOP_IMAGE_LIMIT: 3,
    MAX_JOVI_AMOUNT: 10000
} 
