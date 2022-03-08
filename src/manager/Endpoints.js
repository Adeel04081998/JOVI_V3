export default {
    "SEND_OTP": "api/User/OTP/Send",
    "CHECK_PHONE_NUMBER": "api/User/PhoneNumberCheck",
    "OTP_VERIFY": "api/User/OTP/VerifyNLogin",
    "CREATE_UPDATE": "api/User/CreateUpdate",
    "EMAIL_CHECK": "api/User/EmailCheck/",
    "GET_ENUMS": "api/Common/Enums",
    "GET_USER_DETAILS": "api/User/Details",
    "GET_HOME_MSGS": "api/Menu/HomeScreen/GetData",
    "GET_USER_ADDRESSES": "api/Order/GetAddress",
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
    //Estimate Service Charge
    "EstimateServiceCharge": 'api/Order/EstimateServiceChargeV2',
    //Get Open Orders
    "GetOpenOrders": "/api/Dashboard/GetOpenOrderDetails/List",
    //Accept Reject Order
    "AcceptRejectOrder": "/api/Order/VendorJob/ConfirmStatus/Update",

    "GET_VENDOR_DASHBOARD_CATEGORY_ID": "api/Menu/Vendor/GetDashboardCatIDs",//USED IN SHARED ACTION FOR GETTING CATEGORY ID's AND STORING IN REDUCER
    "GET_VENDOR_DASHBOARD_CATEGORY_ID_DETAIL": "api/Menu/Vendor/CategorizationByID",//USED IN GENERIC LIST
    //Get Rider Location
    "GetRiderLocation":"api/User/Customer/GetRidersLatestLocation",
    "SEND_MESSAGE_TO_RIDER": "api/Order/Chat",//USED IN ORDER CHAT
}


// OLD ENDPOINTS

// PRODUCT_DETAILS
// api/Restaurant/ProductOrDeal/DetailsV1

// GET_PITSTOPS
// api/Restaurant/Pitstop/ListOrSearch/V2

// GET_PRODUCT_MENU_LIST
// api/SuperMarket/Stock/List



