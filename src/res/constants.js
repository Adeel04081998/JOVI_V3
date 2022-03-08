import { Dimensions } from "react-native";
export default {
    DEFAULT_JOVI_IMAGE: require('../assets/Logo/image_default.png'),
    app_version: '3.4',
    url_qa: "https://qa-api.jovi-app.com",
    url_qasprint_v1: "https://qasprintv1-api.jovi-app.com",
    url_ngRok: "https://tabish.ngrok.io",
    url_dev: "https://dev-api.jovi-app.com",
    url_staging: "https://staging-api.jovi-app.com",
    url_live: "https://live-api.jovi-app.com",
    url_ngrok: "https://zeeshan.ngrok.io",
    screen_dimensions: Dimensions.get("screen"),
    window_dimensions: Dimensions.get("window"),
    horizontal_margin: 10,
    spacing_horizontal: 10,
    spacing_vertical: 10,
    max_jovi_order_amount: 10000,
    cart: {
        items_key: "checkOutItemsListVM",
        options_key: "optionList",
        line_through_key: "gstAddedPrice",
        discounted_price_key: "discountedPrice",
        price_key: "gstAddedPrice",
    },
    cart_icon: "shopping-bag",
    colors: {
        "name": "Default",
        "backgroundColor": "#1D1D1D",
        "navBackgroundColor": "#343434",
        "blueColor": "#05b7ed",
        "redColor": "#FF5757",
        "darkBlueColor": "#047A9E",
        "placeholderColor": "#545454",
        "buttonTextColor": "white",
        "textColor": "white",
        "iconColor": "#047A9E",
        "iconActiveColor": "#05B7ED",
        "navTextColor": "#C1C1C1",
        "navActiveTextColor": "white",
        "mudassir": "white"
    },
    sharedStartingRegionPK: {
        latitude: 25.96146850382255,
        latitudeDelta: 24.20619842968337,
        longitude: 69.89856876432896,
        longitudeDelta: 15.910217463970177
    },
    i8_markaz: { latitude: 33.6685534, longitude: 73.0727673 }
}