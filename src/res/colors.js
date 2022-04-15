export const initColors = {
    // XD Colors Start Mudassir
    "primary": "#6D51BB",
    "greyish_black": "#272727",
    "lightBlack": "#212121",
    "card": "#047A9E",
    // "grey": "#7D7D7D",
    "white": "#FFFFFF",
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
    "light_input_border": "#CACDD1",
    "green": 'green',
    "Transparent_Green ": '#D8FFD8',
    "Bitter_Lime_green_Shade": "#27C72C",
    "Husky_light_blue_Shade": '#E1E9FF',
    "Brak_Bay_Dark_blue_Shade": '#2D5AD5',
    "Pink_Sparkle_Pink_Shade": '#FFE8EC',
    "Red_Surrection": '#D80D0D',
    "DoeSkin_LightSkinShade": '#FFF3E2',
    "light_orange_Shade": '#FF9C07'

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