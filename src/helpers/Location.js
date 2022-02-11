import React from 'react'
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Toast from '../components/atoms/Toast';
import configs from '../utils/configs';
import { handleDeniedPermission } from './Camera';


export const hybridLocationPermission = async (cb) => {
    // try {
    if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            handleDeniedPermission('Location permission is not granted!', 'Please allow Location permission by visiting the Settings.');
            return;
        }
        else if (result === PermissionsAndroid.RESULTS.GRANTED) {
            cb && cb();
        }
    }
    else if (Platform.OS === 'ios') {
        const resultAlways = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        const resultWhenInUse = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (resultAlways !== RESULTS.GRANTED && resultWhenInUse !== RESULTS.GRANTED) {
            handleDeniedPermission('Location permission is not granted!', 'Please allow Location permission by visiting the Settings.');
            return;
        }
        else if (resultAlways === RESULTS.GRANTED || resultWhenInUse === RESULTS.GRANTED) {
            cb && cb();
        }
    }
    // } catch (error) {
    //     console.log('Catch error :', error)
    // }
};

export const addressInfo = async (latitude, longitude) => {
    console.log('latitude ==>>>>',latitude, 'longitude ===>>>>>',longitude);
    try {
        let addressResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&key=${configs.GOOGLE_API_KEY}`);
        addressResponse = await addressResponse.json();
        console.log('addressResponse',addressResponse);
        if (addressResponse.error_message) {
            console.log('error_message', addressResponse.error_message)
            // CustomToast.error("Error while Fetching Address!", null, "long")
            Toast.error('Error while Fetching Address!')
        }
        else if (addressResponse) {
            const address = ((addressResponse?.results?.[0]?.name || "") + (addressResponse?.results?.[0]?.name ? ", " : "") + (addressResponse?.results?.[0]?.vicinity || ""));
            return address
        }
    }
    catch (exp) {
        console.log('exp',exp);
    }
};