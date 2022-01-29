import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';


const sharedGetDevicInfo = ()=>{
    let deviceModel =  DeviceInfo.getModel();
    let deviceImei = DeviceInfo.getUniqueId();
    let deviceFirmware = DeviceInfo.getSystemVersion();
    let deviceHardWareId = Platform.OS === 'android'? DeviceInfo.getAndroidId() : deviceImei;
    
    return {deviceModel,deviceImei,deviceFirmware,deviceHardWareId}

}
export default {
    sharedGetDevicInfo
}