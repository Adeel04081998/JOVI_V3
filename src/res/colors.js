export const initColors = {
    // XD Colors Start Mudassir
    "primary": "#6D51BB",
    "black": "#272727",
    "lightBlack": "#212121",
    "card": "#047A9E",
    "grey": "#7D7D7D",
    "white": "#FFFFFF",
    "card": "#047A9E",
    "input_background": "#EFEFEF",
    "screen_background": "#F6F5FA",
    "gradient_array": ["#FFFFFF00", "#FFFFFFB3"],
    "disabled_button": "#707070",
    // XD Colors End Mudassir
    "text": "#343434",
    "border": "#707070",
    "notification": "#7359BE",
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
    "pinBall": "#D3D3D3",
    "black": "#000",
    "lightGreyBorder": '#BBBBBB',
    "light_grey": "#F6F5FA",
    "oldFlame": "#F3B8B4",
    "drWhite": "#FAFAFA",
    "subTextGreyColor": '#464646',
    "light_primary_color": '#E2DCF1',
    "grey": "#6B6B6B",
    "ASH_TO_ASH": "#4D4D4D",
    "dull_primary": '#F0F4F9',
    "light_input_border": "#CACDD1"
}
export default {

    "light_mode": {
        "default": {
            ...initColors,
            "primary": "#6D51BB",
        },
        "jovi": {
            ...initColors,
            "primary": "#6D51BB",
        },
        "grocieries": {
            ...initColors,
            "primary": "#27C787",
            "grey": "#6B6B6B"
        },
        "pharamcy": {
            ...initColors,
            "primary": "#1945BE",
            "grey": "#6B6B6B"
        },
        "restaurant": {
            ...initColors,
            "primary": "#F94E41",
            "black": "#0D0D0D",
        },
        "jovi_mart": {
            ...initColors,
            "primary": "#27C787",
            "grey": "#6B6B6B"
        }
    },
    "dark_mode": {
        "default": {
            ...initColors
        },
        "jovi": {
            ...initColors

        },
        "grocieries": {
            ...initColors
        },
        "pharamcy": {
            ...initColors
        },
        "restaurant": {
            ...initColors
        },
        "jovi_mart": {
            ...initColors
        }
    }
}