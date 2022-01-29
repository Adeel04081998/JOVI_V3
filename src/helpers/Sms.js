import { PermissionsAndroid, Platform } from "react-native";

export default {
    requestReadSmsPermission: Platform.select({
        android: async () => {
            try {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_SMS,
                    {
                        title: "(title)",
                        message: "Why you're asking for..."
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