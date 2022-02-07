import { Alert } from "react-native";
import preference_manager from "../preference_manager";
import constants from "../res/constants"
import GV from "./GV";
let baseUrl = __DEV__ ? constants.url_dev : constants.url_live;
// SOLUTIN FOR QA BASE URL CHANGEABLE
// preference_manager.getSetBaseUrlAsync(GV.GET_VALUE)
//     .then(url => {
//         if (url) {
//             baseUrl = url;
//             Alert.alert(`Your base url is \n ${baseUrl}`);
//         }
//         else {
//             if (!__DEV__) {
//                 Alert.prompt("Base url!", "Write your base url.", async (text) => {
//                     await preference_manager.getSetBaseUrlAsync(GV.SET_VALUE, text)
//                     Alert.alert(`Your base url is saved as ${text}. Please reload your App.`);
//                 })
//             }
//         }
//     })
//     .catch(err => console.log("[getSetBaseUrlAsync].catch", err))
export default {
    BASE_URL: baseUrl,
    CODE_PUSH_DEP_KEYS: {
        JOVI_ANDROID_V3: {
            PRODUCTION: "Tu6S8KY75pYFn0M4_sOMypfZ-5UB3oARjUiPH",
            STAGING: "m4zES_hlAb6Y2yTXtIcJTp4e510spUXH22iwU",
        },
        JOVI_IOS_V3: {
            PRODUCTION: "_PqU4HtTWf482ryQRwcqi8qYWEvSjL7qukgTu",
            STAGING: "ZixaikkIZZ5sheUv4WLJRPSUHkonJzHq84qCa",
        },
        JOVI_ANDROID_V2_QA: {
            PRODUCTION: "k2aeQQq0SFLscT6kVwRDSbNbYXJdtc_jQflY6",
            STAGING: "_GRa1yIMZMnXLsmTzeWjiZ16SQAh5nPQ7e6JE",
        },
        JOVI_IOS_V2_QA: {
            PRODUCTION: "lfJ5xU07bIrEAzYOQvYc1R_fJlNhzNTo8OBY3",
            STAGING: "TihkfsImoWk_JHk7VKUNLkN1ZJROo7arkii6L",
        },
    }
} 