import GV from "../../../GV";
export const env = {
    name: "DEBUG",
    BASE_URL: GV.BASE_URL.current,
    GOOGLE_API_KEY: "AIzaSyDjL10bWGX7XL65Np6izZTFagOlz2vzgOA",
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