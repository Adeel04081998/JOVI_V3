import { NativeModules, Platform } from 'react-native';
const ChangeWindowManagerModule = NativeModules.ChangeWindowManagerModule;

export default {
    setAdjustPan() {
        if (Platform.OS === "android")
            ChangeWindowManagerModule.setAdjustPan();
    },
    setAdjustResize() {
        if (Platform.OS === "android")
            ChangeWindowManagerModule.setAdjustResize();
    }
}