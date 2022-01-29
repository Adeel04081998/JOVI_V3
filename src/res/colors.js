// Color values needs to be update according to xd design color scheme
const lightColorsArr = [
    {
        key: "primary",
        value: "rgb(255, 45, 85)",
    },
    {
        key: "background",
        value: "rgb(242, 242, 242)",
    },
    {
        key: "card",
        value: "rgb(255, 255, 255)",
    },
    {
        key: "text",
        value: "rgb(28, 28, 30)",
    },
    {
        key: "border",
        value: "rgb(255, 69, 58)",
    },
    {
        key: "notification",
        value: "rgb(255, 69, 58)",
    }]
const darkColorsArr = [
    {
        key: "primary",
        value: "rgb(10, 132, 255)",
    },
    {
        key: "background",
        value: "rgb(1, 1, 1)",
    },
    {
        key: "card",
        value: "rgb(229, 229, 231)",
    },
    {
        key: "text",
        value: "rgb(28, 28, 30)",
    },
    {
        key: "border",
        value: "(39, 39, 41)",
    },
    {
        key: "notification",
        value: "rgb(255, 69, 58)",
    }]
const fillLighColorObject = (array = lightColorsArr) => {
    let results = {}
    for (let index = 0; index < array.length; index++) {
        results = {
            ...results,
            [array[index].key]: array[index].value
        }
    }
    return results;
};
const fillDarkColorObject = (array = darkColorsArr) => {
    let results = {}
    for (let index = 0; index < array.length; index++) {
        results = {
            ...results,
            [array[index].key]: array[index].value
        }
    }
    return results;
};
export default {
    LightMode: {
        Default: { ...fillLighColorObject([...lightColorsArr, { key: "lightColorKey", value: "#fff" }]) }, // Example: add key, value pair object in lightColorsArr for new colors
        Jovi: { ...fillLighColorObject([...lightColorsArr, { key: "primay", value: "#fff" }]) }, // Example: add key, value pair object in lightColorsArr for new colors
        Supermarket: { ...fillLighColorObject() },
        Pharmacy: { ...fillLighColorObject() },
        Restaurant: { ...fillLighColorObject() },
        JoviMart: { ...fillLighColorObject() },
    },
    DarkMode: {
        Default: { ...fillDarkColorObject([...darkColorsArr, { key: "darkColorKey", value: "#000" }]) }, // Example: add key, value pair object in darkColorsArr for new colors
        Jovi: { ...fillDarkColorObject([...darkColorsArr, { key: "darkColorKey", value: "#000" }]) }, // Example: add key, value pair object in darkColorsArr for new colors
        Supermarket: { ...fillDarkColorObject() },
        Pharmacy: { ...fillDarkColorObject() },
        Restaurant: { ...fillDarkColorObject() },
        JoviMart: { ...fillDarkColorObject() },
    }

}