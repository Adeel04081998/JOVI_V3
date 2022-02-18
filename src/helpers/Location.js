import React from 'react'
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Toast from '../components/atoms/Toast';
import configs, { env } from '../utils/configs';
import { handleDeniedPermission } from './Camera';
import { sharedGetDeviceInfo } from './SharedActions';


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
    try {
        let addressResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&key=${env.GOOGLE_API_KEY}`);
        addressResponse = await addressResponse.json();
        console.log('addressResponse', addressResponse);
        if (addressResponse.error_message) {
            // CustomToast.error("Error while Fetching Address!", null, "long")
            Toast.error('Error while Fetching Address!')
        }
        else if (addressResponse) {
            const address = ((addressResponse?.results?.[0]?.name || "") + (addressResponse?.results?.[0]?.name ? ", " : "") + (addressResponse?.results?.[0]?.vicinity || ""));
            let city = null;
            let addressObj = addressResponse?.results?.[0] ?? {}
            if (addressObj?.plus_code?.compound_code) {
                city = addressObj.plus_code.compound_code.replace(/\,/gi, "")?.split(/\s/gi)?.[1];
            };
            return { city, address }
        }
    }
    catch (exp) {
        console.log('exp', exp);
    }
};

export const logGoogleApiHit = async (postRequest, apiKey) => {
    postRequest('api/Common/GoogleAPIHit/AddLog',
        {
            "userType": 1,
            "hardwareID": (await sharedGetDeviceInfo()).deviceID,
            "apiKey": apiKey,
            "orderID": null
        },
        (res) => {
            console.log('Google Api Log Success: ----- ', apiKey, res);
        },
        (err) => {
            console.log('Google Api Log Error: ----- ', apiKey, err);
        },

    );
}