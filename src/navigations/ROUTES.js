
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
        options: null,
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
    "ShelvesDetail": {
        screen_name: "SHELVES_DETAIL",
        options: null,
    },
    "ProductMenuItem": {
        screen_name: "PRODUCT_MENU_ITEM",
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
const APP_DRAWER_STACK = Object.keys(APP_DRAWER_ROUTES).map((key, index) => ({ id: `init-${index}-${key}`, screen_name: APP_DRAWER_ROUTES[key].screen_name, componenet: key }));
export default {
    AUTH_ROUTES,
    AUTH_STACKS,
    APP_ROUTES,
    APP_STACKS,
    INIT_ROUTES,
    APP_DRAWER_STACK,
    APP_DRAWER_ROUTES
}

