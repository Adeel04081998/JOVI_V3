import { PermissionsAndroid, Platform } from "react-native";

export default {
    requestReadSmsPermission: Platform.select({
        android: async () => {
            try {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_SMS,
                    {
                        title: "SMS Permission",
                        message: "Allow JOVI to read SMS messages?",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                return result;
            } catch (err) {
                console.log(`[requestReadSmsPermission].catch`, JSON.stringify(err));
            }
        },
        ios: async () => { }
    })
}