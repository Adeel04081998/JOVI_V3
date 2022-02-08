import GV from "../../../GV";
export const env = {
    name: "RELEASE",
    BASE_URL: GV.BASE_URL.current,
    CODE_PUSH_DEP_KEYS: {
        // JOVI V3 FOR RELEASE
        JOVI_ANDROID: {
            PRODUCTION: "Tu6S8KY75pYFn0M4_sOMypfZ-5UB3oARjUiPH",
            STAGING: "m4zES_hlAb6Y2yTXtIcJTp4e510spUXH22iwU",
        },
        JOVI_IOS: {
            PRODUCTION: "_PqU4HtTWf482ryQRwcqi8qYWEvSjL7qukgTu",
            STAGING: "ZixaikkIZZ5sheUv4WLJRPSUHkonJzHq84qCa",
        },
    }
}
