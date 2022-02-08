import { Alert } from "react-native";
import preference_manager from "../../../../preference_manager";
import GV from "../../../GV";
// SOLUTIN FOR QA BASE URL CHANGEABLE
preference_manager.getSetBaseUrlAsync(GV.GET_VALUE)
    .then(url => {
        if (url) {
            GV.BASE_URL.current = url;
            Alert.alert(`Your base url is \n ${GV.BASE_URL.current}`);
        }
        else {
            if (!__DEV__) {
                Alert.prompt("Base url!", "Write your base url.", async (text) => {
                    await preference_manager.getSetBaseUrlAsync(GV.SET_VALUE, text)
                    Alert.alert(`Your base url is saved as ${text}. Please reload your App.`);
                })
            }
        }
    })
    .catch(err => console.log("[getSetBaseUrlAsync].catch", err))

export const env = {
    name: "STAGING",
    BASE_URL: GV.BASE_URL.current,
    CODE_PUSH_DEP_KEYS: {
        // JOVI V2 FOR QA
        JOVI_ANDROID: {
            PRODUCTION: "k2aeQQq0SFLscT6kVwRDSbNbYXJdtc_jQflY6",
            STAGING: "_GRa1yIMZMnXLsmTzeWjiZ16SQAh5nPQ7e6JE",
        },
        JOVI_IOS: {
            PRODUCTION: "lfJ5xU07bIrEAzYOQvYc1R_fJlNhzNTo8OBY3",
            STAGING: "TihkfsImoWk_JHk7VKUNLkN1ZJROo7arkii6L",
        },
    }
}
