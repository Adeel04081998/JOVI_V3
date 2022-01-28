// Color values needs to be update according to xd design color scheme
const colorsArr = [
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
const fillColorObject = (array = colorsArr) => {
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
        Default: { ...fillColorObject([...colorsArr, { key: "colorKey", value: "#fff" }]) }, // Example add key, value pair object in colorsArr for new colors
        Supermarket: { ...fillColorObject() },
        Pharmacy: { ...fillColorObject() },
        Restaurant: { ...fillColorObject() },
        JoviMart: { ...fillColorObject() },
    },
    DarkMode: {
        Default: { ...fillColorObject([...colorsArr, { key: "colorKey", value: "#fff" }]) }, // Example add key, value pair object in colorsArr for new colors
        Supermarket: { ...fillColorObject() },
        Pharmacy: { ...fillColorObject() },
        Restaurant: { ...fillColorObject() },
        JoviMart: { ...fillColorObject() },
    }

}