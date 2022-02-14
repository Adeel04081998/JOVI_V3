import React from 'react'
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

const cameraResponseHandler = (response, cb, next) => {
    console.log('response ==>>>', response);
    // debugger;
    if (response.didCancel) {
        console.log('User cancelled image picker', response.didCancel);
        cb();
    } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        cb();
    } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        cb();
    } else {
        console.log(response);
        next(response);
    }
}

export const handleDeniedPermission = (msgHeader = "", msgText = "", cb, settingsOnly = false, cancelOnly = false) => {
    let buttons = [];
    if (settingsOnly) buttons.push({
        text: 'Settings',
        onPress: () => {
            openSettings();
        }
    })
    if (cancelOnly) buttons.push({
        text: 'Cancel',
        onPress: () => {
            cb && cb(false);
        },
        style: 'cancel'
    })
    else if (!settingsOnly && !cancelOnly) buttons.push({
        text: 'Cancel',
        onPress: () => {
            cb && cb(false);
        },
        style: 'cancel'
    },
        {
            text: 'Settings',
            onPress: () => {
                openSettings();
            }
        })

    Alert.alert(
        msgHeader,
        msgText,
        buttons,
        { cancelable: false }
    );
};

export const sharedLaunchCameraorGallery = async (pressType, cb, next) => {
    // console.log("Here")
    // debugger;
    try {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                handleDeniedPermission('You have not allowed access to the camera!', 'If you would like to grant access to the camera, then tap settings to give permission.', cb);
                return;
            }
        }
        if (Platform.OS === 'ios') {
            const result = await request(PERMISSIONS.IOS.CAMERA);
            console.log("result", result);
            if (result !== RESULTS.GRANTED) {
                handleDeniedPermission('You have not allowed access to the camera!', 'If you would like to grant access to the camera, then tap settings to give permission.', cb);
                return;
            }
        }
        if (pressType === 1) {
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
            }).then(image => {
                cameraResponseHandler([{ ...image }], cb, next)
            }).catch((e) => {
                console.log('e ==>>>', e);
            })
        } else {
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: true
            }).then(image => {
                cameraResponseHandler(image, cb, next)
            }).catch((e) => {
                console.log('e ==>>>', e);
            })
        }
    } catch (error) {
        console.log('Catch error :', error)
    }
}
export const askForAudioRecordPermission = async (cb) => {
    try {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

            if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                handleDeniedPermission('Microphone permission is not granted!', 'If you want to send Voice Messages, then go to Settings and allow Microphone permission.', cb);
                return;
            }
            else {
                cb && cb(true);
                return;
            }
        }
        else if (Platform.OS === 'ios') {
            const result = await request(PERMISSIONS.IOS.MICROPHONE);

            if (result !== RESULTS.GRANTED) {
                handleDeniedPermission('Microphone permission is not granted!', 'If you want to send Voice Messages, then go to Settings and allow Microphone permission.');
                return;
            }
            else {
                cb && cb(true);
                return;
            }
        }
    } catch (error) {
        console.log('Catch error :', error)
    }
};