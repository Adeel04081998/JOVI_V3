import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Toast from "../components/atoms/Toast";
export const sharedGetDeviceInfo = () => {
    let model = DeviceInfo.getModel();
    let deviceID = Platform.OS === "ios" ? DeviceInfo.getUniqueId() : DeviceInfo.getAndroidId();
    let systemVersion = DeviceInfo.getSystemVersion();
    return { deviceID, model, systemVersion }
}
export default {
    navigation_listener: null,
    sharedExceptionHandler: (err) => {
        if (err) {
            if (err.errors && typeof err.errors === "object") {
                var errorKeys = Object.keys(err.errors),
                    errorStr = "";
                for (let index = 0; index < errorKeys.length; index++) {
                    if (index > 0) errorStr += err.errors[errorKeys[index]][0] + "\n"
                    else errorStr += err.errors[errorKeys[index]][0]
                }
                Toast.error(errorStr, null, 3000);
            }
            else if (err && typeof err === "string") {
                Toast.error(err, null, 3000);
            }
            else if (err.message && typeof err.message === "string") {
                Toast.error(err.message, null, 3000);
            }
            else if (err.Error && typeof err.Error === "string") {
                Toast.error(err.Error, null, 3000);
            }
            else if (err.error && typeof err.error === "string") {
                Toast.error(err.error, null, 3000);
            }
            else {
                Toast.error('Something went wrong', null, 3000);
            }
        }
    }
}