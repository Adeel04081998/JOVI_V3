import DeviceInfo from 'react-native-device-info';


export const sharedGetDevicInfo = ()=>{
    let deviceModel = ""
    let deviceImei = ""
    let deviceFirmware = ""
    deviceModel = DeviceInfo.getDeviceId(),
    deviceImei = DeviceInfo.getUniqueId(),
    deviceFirmware = DeviceInfo.getSystemVersion()
    return (deviceModel,deviceImei,deviceFirmware)

}