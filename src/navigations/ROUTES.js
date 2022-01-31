
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
};
const APP_ROUTES = {
    "Home": {
        screen_name: "HOME",
        options: null,
    },
};
const AUTH_STACKS = Object.keys(AUTH_ROUTES).map((key, index) => ({ id: `init-${index}-${key}`, screen_name: AUTH_ROUTES[key].screen_name, componenet: key }));
const APP_STACKS = Object.keys(APP_ROUTES).map((key, index) => ({ id: `init-${index}-${key}`, screen_name: APP_ROUTES[key].screen_name, componenet: key }));
export default {
    AUTH_ROUTES,
    AUTH_STACKS,
    APP_ROUTES,
    APP_STACKS,
    INIT_ROUTES
}

