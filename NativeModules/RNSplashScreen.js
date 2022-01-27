import { NativeModules, Platform } from "react-native";

export default {
    hide() {
        if (Platform.OS === "ios") {
            NativeModules.RNSplashModule.hideSplash();
            return
        } else {
            NativeModules.SplashScreen.hide();
            return;
        }

    },
}