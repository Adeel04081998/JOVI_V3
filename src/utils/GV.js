import React from "react";
import svgs from "../assets/svgs";
import constants from "../res/constants";
let initUrlRef = React.createRef(null);
initUrlRef.current = __DEV__ ? constants.url_dev : constants.url_qasprint_v1;
export const PITSTOP_TYPES = {
    DEFAULT: 0,
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
    JOVI_MART: 5,
    ALL: 10,//To Get Every Theme
};

export const ToastRef = React.createRef(null);
export const hblRequestRef = React.createRef(null);

export const TOPUP_ENUMS = Object.freeze({
    "MODE_TYPES_ENUM": { "ENTER_AMOUNT": 1, "PAYMENT_GATEWAY": 2 },
    "PAYMENT_TYPES_ENUM": { "EASYPAISA": 1, "JAZZCASH": 2, "CREDIT_DEBIT_CARD": 3, "OVER_THE_COUNTER": 4 },
    "EASY_PAISA_PAYMENT_OPTS": { "CC": 1, "OTC": 2, "MA": 3 },
    "JAZZ_CASH_PAYMENT_OPTS": { "ALL": 0, "MA": 1, "CC": 2 },
    "TNX_TYPES_ENUMS": { "DISABLED": 0, "ALL": 1, "CARD_SUCCESS": 2, "CARD_FAILUR": 3, "MA_SUCCESS": 4, "MA_FAILURE": 5, },
})
export const PITSTOP_TYPES_INVERTED = {
    0: 'DEFAULT',
    1: 'SUPER_MARKET',
    2: 'JOVI',
    3: 'PHARMACY',
    4: 'RESTAURANT',
    5: 'JOVI_MART',
    10: 'ALL',
};
export const FILTER_TAGS_PITSTOP_LISTING = [{ vendorDashboardCatID: 1, name: 'Discounts', image: svgs.filterDicount("#6B6B6B") }];
export const ORDER_STATUSES = {
    'VendorApproval': 'VendorApproval',
    'VendorProblem': 'VendorProblem',
    'CustomerApproval': 'CustomerApproval',
    'CustomerProblem': 'CustomerProblem',
    'FindingRider': 'FindingRider',
    'Initiated': 'Initiated',
    'Processing': 'Processing',
    'RiderFound': 'RiderFound',
    'RiderProblem': 'RiderProblem',
    'TransferProblem': 'TransferProblem',
}
export const isIOS = Platform.OS === 'ios';
export default {
    BASE_URL: initUrlRef,
    SET_VALUE: 1,
    GET_VALUE: 2,
    NET_INFO_REF: React.createRef(null),
    OTP_INTERVAL: 30, // SECONDS
    THEME_VALUES: { ...PITSTOP_TYPES },
    MAX_PITSTOP_IMAGE_LIMIT: 3,
    MAX_JOVI_AMOUNT: 10000,
    RIDER_INSTRUCTIONS: React.createRef("")
} 
