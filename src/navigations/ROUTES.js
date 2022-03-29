
const INIT_ROUTES = {
    "INIT_APP": "INIT_APP",
};
const AUTH_ROUTES = {
    "Introduction": {
        screen_name: "INTRODUCTION",
        options: null,
    },
    "EnterOTP": {
        screen_name: "ENTER_OTP",
        options: null,
    },
    "VerifyOTP": {
        screen_name: "VERIFY_OTP",
        options: null,
    },
    "SignUp": {
        screen_name: "SIGN_UP",
        options: null,
    },
};
const APP_DRAWER_ROUTES = {
    "Home": {
        screen_name: "HOME",
        options: null,
    },
    "ProductDetails": {
        screen_name: "ProductDetails",
        options: { animation: 'slide_from_bottom' },
    },
    "JoviJob": {
        screen_name: 'JOVIJOB',
        options: null
    },
    "Map": {
        screen_name: "MAP",
        options: null,
    },

    "PitstopListing": {
        screen_name: "VENDORS",
        options: null,
    },
    "Filter": {
        screen_name: "FILTER",
        options: null,
    },
    "PitstopsVerticalList": {
        screen_name: "PitstopsVerticalList",
        options: null,
    },
    "RestaurantProductMenu": {
        screen_name: "RESTAURANTMENU",
        options: null,
    },
    "ProductMenu": {
        screen_name: "SUPERMARKET_MENU",
        options: null,
    },
    "Shelves": {
        screen_name: "Shelves",
        options: null,
    },
    "AddAddress": {
        screen_name: "ADDADDRESS",
        options: null,
    },
    "CheckOut": {
        screen_name: "CheckOut",
        options: null,
    },
    "Cart": {
        screen_name: "cart",
        options: null,
    },
    "ShelvesDetail": {
        screen_name: "SHELVES_DETAIL",
        options: null,
    },
    "ProductMenuItem": {
        screen_name: "PRODUCT_MENU_ITEM",
        options: null,
    },
    "OrderProcessing": {
        screen_name: "ORDER_PROCESSING",
        options: null,
    },
    "OrderProcessingError": {
        screen_name: "ORDER_PROCESSING_ERROR",
        options: null,
    },
    "OrderTracking": {
        screen_name: "ORDER_TRACKING",
        options: null,
    },
    "SharedMapView": {
        screen_name: "SHARED_MAP_VIEW",
        options: null,
    },
    "OrderChat": {
        screen_name: "ORDER_CHAT",
        options: null,
    },

    "OrderPitstops": {
        screen_name: "ORDER_PITSTOPS",
        options: null
    },
    "RateRider": {
        screen_name: "RATE_RIDER", // || Rate your jovi
        options: { animation: 'slide_from_bottom' },
    },
    "OrderHistory": {
        screen_name: "ORDER_HISTORY",
        options: null,
    },
    "OrderHistoryDetail": {
        screen_name: "ORDER_HISTORY_DETAIL",
        options: { animation: 'slide_from_bottom' },
    },
    "Legal": {
        screen_name: "LEGAL",
        options: null,
    },
    "WebView": {
        screen_name: "WEBVIEW",
        options: { animation: 'slide_from_bottom' },
    },
    "FAQ": {
        screen_name: "FAQ",
        options: { animation: 'slide_from_bottom' },
    },
    "ContactUs": {
        screen_name: "CONTACT_US",
        options: null,
    },
    "GoodyBag": {
        screen_name: "GOODY_BAG",
        options: null,
    },


}
const APP_ROUTES = {
    "AppDrawerStack": {
        screen_name: "APP_DRAWER_STACK",
        options: null,
    }
};
const AUTH_STACKS = Object.keys(AUTH_ROUTES).map((key, index) => ({ id: `init-${index}-${key}`, screen_name: AUTH_ROUTES[key].screen_name, componenet: key }));
const APP_STACKS = Object.keys(APP_ROUTES).map((key, index) => ({ id: `init-${index}-${key}`, screen_name: APP_ROUTES[key].screen_name, componenet: key }));
const APP_DRAWER_STACK = Object.keys(APP_DRAWER_ROUTES).map((key, index) => ({ id: `init-${index}-${key}`, options: APP_DRAWER_ROUTES[key].options, screen_name: APP_DRAWER_ROUTES[key].screen_name, componenet: key }));
export default {
    AUTH_ROUTES,
    AUTH_STACKS,
    APP_ROUTES,
    APP_STACKS,
    INIT_ROUTES,
    APP_DRAWER_STACK,
    APP_DRAWER_ROUTES
}

