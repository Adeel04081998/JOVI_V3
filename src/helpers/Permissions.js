import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { handleDeniedPermission } from './Camera';

export const askForContactPermissions = async (successCb, errorCb) => {

    if (Platform.OS === "android") {
        let result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.',
                'buttonPositive': 'accept'
            }
        )
        if (result !== RESULTS.GRANTED) {
            console.log("Permission denied and result is", result);
            handleDeniedPermission('Contacts permission is not granted!', 'If you want to give access to your contacts, then go to Settings and allow Contacts permission!', () => { });
            return;
        } else {
            successCb()
        }
    } else {
        let iosResult = await request(PERMISSIONS.IOS.CONTACTS);
        if (iosResult !== RESULTS.GRANTED) {
            console.log("Permission denied and result is", iosResult);
            handleDeniedPermission('Contacts permission is not granted!', 'If you want to give access to your contacts, then go to Settings and allow Contacts permission!', () => { });
            return;
        } else {
            successCb()
        }
    }
}
