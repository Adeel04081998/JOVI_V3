export default {
    "SEND_OTP": "api/User/OTP/Send",
    "CHECK_PHONE_NUMBER": "api/User/PhoneNumberCheck",
    "OTP_VERIFY": "api/User/OTP/VerifyNLogin",
    "CREATE_UPDATE": "api/User/CreateUpdate",
    "EMAIL_CHECK": "api/User/EmailCheck/",
    "GET_ENUMS": "api/Common/Enums",
    "GET_USER_DETAILS": "api/User/Details",
    "GET_HOME_MSGS": "api/Menu/HomeScreen/GetData",
    "GET_USER_ADDRESSES": "api/Order/GetAddressV2",
    "GET_PROMOTIONS": "api/Dashboard/DashboardContent/List",
    "ADD_PITSTOPIMAGE": "api/Common/Image/AddOrUpdate",
    "DELETE_PITSTOPIMAGE": 'api/Common/Image/DeleteJoviImage/',
    "GET_VENDORS_GENERIC_LIST": "api/Menu/Vendor/Categorization",
    "GET_CATEGORIES_TAGS_LIST": "api/Restaurant/Tags/Categories/List",
    "GET_PITSTOPS": "api/Pitstop/ListOrSearch/V2",
    "GET_FILTERS": "api/Menu/Vendor/GetFilters",
    //RESTAURANT
    "GET_RESTAURANT_PRODUCT_MENU_LIST": "api/Restaurant/ProductsAndDeals/List/V2",// SCREEN_NAME: RestaurantProductMenu
    //PRODUCT DETAILS
    "PRODUCT_DETAILS": "api/Product/ProductOrDeal/DetailsV1",
    "GET_PITSTOPS_PROMOTIONS": "api/Menu/Vendor/CategorizationByID",
    "GET_ADVERTISEMENTS": "api/Advertisement/List",
    //RESTAURANT
    "GET_PRODUCT_MENU_LIST": "api/Product/Stock/List", //SCREEN_NAME: ProductMenu
    "GET_VOUCHERS_LIST": "api/Menu/Promotion/List",
    "SERVICE_CHARGES": "api/Order/EstimateServiceChargeV2", // Cart Screen
    "AddorUpdateAddress": "/api/Menu/Address/AddOrUpdate", //AddAdresses
    //Arearestriction
    "AreaRestriction": "api/Common/AreaRestriction/Pitstop",
    "FirebaseTokenAddLog": "/api/Common/FireBase/AddLog",
    //Add_Order
    "CreateUpdateOrder": "api/Order/CreateUpdateOrderV2",
    //Fetch Order Details
    "FetchOrder": "api/Order/OrderDetail",
    //Get Open Orders
    "GetOpenOrders": "/api/Dashboard/GetOpenOrderDetails/List",
    //Accept Reject Order
    "AcceptRejectOrder": "/api/Order/VendorJob/ConfirmStatus/Update",

    "GET_VENDOR_DASHBOARD_CATEGORY_ID": "api/Menu/Vendor/GetDashboardCatIDs",//USED IN SHARED ACTION FOR GETTING CATEGORY ID's AND STORING IN REDUCER
    "GET_VENDOR_DASHBOARD_CATEGORY_ID_DETAIL": "api/Menu/Vendor/CategorizationByID",//USED IN GENERIC LIST
    "SEND_ORDER_MESSAGE_TO_RIDER": "api/Order/Chat",//USED IN ORDER CHAT
    "GET_ORDER_MESSAGE": "api/Order/Chat/List/V2",//USED IN ORDER CHAT FOR GETTING CHAT 
    //Get Rider Location
    "GetRiderLocation": "api/User/Customer/GetRidersLatestLocation",
    "GET_RIDER_ORDER_RATING_REASON": "api/Order/Rating/Reasons", //USED IN RATE RIDER 
    "SUBMIT_RATING_FOR_RIDER_ORDER": "api/Order/OrderRating", //USED IN RATE RIDER 

    "GET_CUSTOMER_ORDER_HISTORY": "api/Order/HistoryV2",//USED IN ORDER HISTORY SCREEN for getting completed & cancelled order of customer
    "GET_CUSTOMER_ONGOING_ORDER": "api/Order/OnGoingOrdersListV2",//USED IN ORDER HISTORY SCREEN for getting ongoing order of customer
    "GET_CUSTOMER_ONGOING_COUNT": "api/Order/OnGoingOrdersV2",//USED IN ORDER HISTORY SCREEN for getting ongoing order of customer
    "OrderEstimateTime": "api/Order/OrderEstimateTimeV2", //Order Estimate Time

    "ADD_ORDER_FEEDBACK": "api/Order/Feedback/Add",//USED IN ORDER HISTORY DETAIL SCREEN for adding feedback for the order
    "GET_RECENT_SEARCHES": "api/Intellisense/GetRecentSearches",//USED IN SEARCH SCREEN FOR GETTING RECENT SEARCHED BY USER
    "CLEAR_RECENT_SEARCHES": "api/Intellisense/ClearUserSearchHistory",//USED IN SEARCH SCREEN FOR CLEAR RECENT SEARCHED BY USER
    "SEARCH": "api/Intellisense/MainSearch",//USED IN SEARCH SCREEN FOR SEARCH USER ENTER TEXT
    "VENDOR_SEARCH": "api/Intellisense/PitstopSearch",//USED IN SEARCH SCREEN FOR GETTING SEARCHED ITEM 
    "ADD_SEARCHED_TEXT": "api/Intellisense/UserSearchHistory/Add",//USED IN SEARCH SCREEN FOR saving data in database to get in recent item
    "ADD_ORDER_FEEDBACK": "api/Order/Feedback/Add",//USED IN ORDER HISTORY DETAIL SCREEN for adding feedback for the order
    "GET_LEGAL_CERTIFICATES": "api/Menu/Legal/ListByType/1",
    "GET_LEGAL_HTML": "api/Menu/Legal/List",
    "GET_FAQs": "api/Menu/FAQ/List",
    "GET_TRANSACTIONLIST": "api/Payment/Wallet/Transactions/List",
    "GET_PROMOS": "api/Menu/Promotion/List",
    "HBL_PAY": "api/Payment/HBLPay",
    "JAZZCASH_PAY": "api/Payment/JazzCashPay",
    "EASYPAISA_PAY": "api/Payment/EasyPaisaPay",
    "DELETE_ADDRESS": "api/Menu/Address/Delete",
    "VERIFY_CART_ITEMS": "api/Product/Cart/VerifyItems",
    "GET_COMPLAINT": "api/Menu/Complaint/List",//USED IN COMPLAINT SCREEN FOR GETTING ACTIVE AND SOLVED COMPLAINT's
    "GET_COMPLAINT_DETAIL": "api/Menu/ComplaintV2/Data/",//USED IN COMPLAINT DETAIL SCREEN FOR GETTING COMPLAINT DETAIL USING COMPLAINTID
    "SEND_COMPLAINT_MESSAGE_TO_ADMIN": "api/Menu/Complaint/ComplainDetails",//USED IN COMPLAINT DETAIL - CHAT COMPONENT SCREEN FOR SENDING MESSAGE TO ADMIN
    "CLOSE_COMPLAINT": "api/Order/Complaint/AddOrUpdate",//USED IN COMPLAINT DETAIL - TO CLOSE OPEN COMPLAINT
    "REFERRAL": "api/User/ReferalInvite/",// USED IN INVITE FRIENDS
    "CREATE_COMPLAINT": "api/Order/Complaint/AddOrUpdate",//USED IN ORDER HISTORY DETAIL - TO CREATE NEW COMPLAINT AGAINEST ORDER
    "GET_PENDING_ORDER_RATING": "api/Order/Rating/PendingOrders",//USED IN SHARED ACTION - TO SHOW PENDING ORDER's RATING
    "IGNORE_ORDER_FOR_ORDER_RATING": "api/Order/IgnoreRating",//USED IN RATE RIDER 
    "ERROR_LOGGER": "api/ErrorLog/FrontEndError/AddOrUpdate",
    "GET_COUNTRY_CODES_LIST": "api/Common/OTPCountryCodes",
    "GET_BALANCE": "api/Payment/Wallet/Balance",//USED IN TOP UP
    "LOGOUT_USER": "api/User/logout",
    "PAYMENT_RECONCILE": "api/Payment/ReconcileEasypaisaPayment",//USED IN SHARED ACTION
    "APP_VERSION_CHECK":"api/Common/CheckAppVersion",
}


// OLD ENDPOINTS

// PRODUCT_DETAILS
// api/Restaurant/ProductOrDeal/DetailsV1

// GET_PITSTOPS
// api/Restaurant/Pitstop/ListOrSearch/V2

// GET_PRODUCT_MENU_LIST
// api/SuperMarket/Stock/List



