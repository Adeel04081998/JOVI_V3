const initColors = {
    "primary": "#7359BE",
    "card": "#047A9E",
    "text": "#343434",
    "border": "#1D1D1D",
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
}
export default {

    "light_mode": {
        "default": initColors,
        "jovi": { ...initColors },
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