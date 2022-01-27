import { Platform } from "react-native";
import Axios from './Axios';
// import CustomToast from "../components/toast/CustomToast";
// import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomToast = {
    error:()=>{},
}

const dispatch = ()=>{}; // import from store when redux is added

export const refreshTokenMiddleware = async (requestCallback, params, dispatch) => {
    let prevToken = await AsyncStorage.getItem('User');
    postRequest(
        "/api/User/RefreshToken",
        {
            "accessToken": JSON.parse(prevToken).token.authToken,
            "refreshToken": JSON.parse(prevToken).refreshToken
        },
        async res => {
            console.log("refreshTokenMiddleware.Res :", res);
            if (res?.data?.statusCode === 202) {
                requestCallback.apply(this, params);
                return;
            }
            else if (res?.data?.statusCode === 403) {
                CustomToast.error("Session Expired!");
                clearEverythingInStorageAndLogoutUser();
                return;
            }
            else {
                await AsyncStorage.setItem('User', JSON.stringify(res.data));
                requestCallback.apply(this, params);
            }
        },
        err => {
            console.log("refreshTokenMiddleware.err", err)
        },
    )


};

export const postRequest = async (url, data, onSuccess= () => {}, onError=()=>{},headers={}, showLoader = true, middleWareCallback = () => { },) => {
    // let internetConnectivity = await NetInfo.fetch();
    // if (Platform.OS === "ios") {
    //     //In iOS sometime we have internet reacheable is null that's why we are using below (3 lines of code)
    //     if (internetConnectivity.isInternetReachable === null) {
    //         await sleep();
    //         internetConnectivity = await NetInfo.fetch();
    //     }
    // }
    // if (!internetConnectivity.isConnected || !internetConnectivity.isInternetReachable) {
    //     runLoaderActions && dispatch(showHideLoader(false, ''));
    //     onError({ response: "No internet connection", statusCode: 651 });
    //     runLoaderActions && CustomToast.error('No internet connection');
    //     return;
    // };
    //Uncomment when the internet connectivity implemented
    middleWareCallback(true);
    // showLoader && dispatch();//uncomment when loader added

    try {
        let res = await Axios.post(url, data, headers);
        if (res.status === 200) {
            // showLoader && dispatch();//uncomment when loader added
            onSuccess(res);
            middleWareCallback(false);
        }
    } catch (error) {
        middleWareCallback(false);
        if (error?.response?.data) {
            if (error.response.data.StatusCode === 401) return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError,headers, showLoader , middleWareCallback ], dispatch);
            else if (error.response.data.statusCode === 500){
                 CustomToast.error('Something went wrong!!');
            }
            // showLoader && dispatch();//uncomment when loader added
            onError(error.response.data);
        }
        else if (error?.response?.status) {
            if (error.response.status === 400) CustomToast.error('Bad Request!');
            else if (error.response.status === 404) CustomToast.error('Bad Request!');
            else if (error.response.status === 500) CustomToast.error('Something went wrong!');
        }

        // showLoader && dispatch();//uncomment when loader added
    }
};
export const getRequest = async (url, onSuccess= () => {}, onError=()=>{},headers={}, showLoader = true, middleWareCallback = () => { },) => {
    // let internetConnectivity = await NetInfo.fetch();
    // if (Platform.OS === "ios") {
    //     //In iOS sometime we have internet reacheable is null that's why we are using below (3 lines of code)
    //     if (internetConnectivity.isInternetReachable === null) {
    //         await sleep();
    //         internetConnectivity = await NetInfo.fetch();
    //     }
    // }
    // if (!internetConnectivity.isConnected || !internetConnectivity.isInternetReachable) {
    //     runLoaderActions && dispatch(showHideLoader(false, ''));
    //     onError({ response: "No internet connection", statusCode: 651 });
    //     runLoaderActions && CustomToast.error('No internet connection');
    //     return;
    // };
    //Uncomment when the internet connectivity implemented
    middleWareCallback(true);
    // showLoader && dispatch();//uncomment when loader added

    try {
        let res = await Axios.get(url, headers);
        if (res.status === 200) {
            // showLoader && dispatch();//uncomment when loader added
            onSuccess(res);
            middleWareCallback(false);
        }
    } catch (error) {
        middleWareCallback(false);
        if (error?.response?.data) {
            if (error.response.data.StatusCode === 401) return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError,headers, showLoader , middleWareCallback ], dispatch);
            else if (error.response.data.statusCode === 500){
                 CustomToast.error('Something went wrong!!');
            }
            // showLoader && dispatch();//uncomment when loader added
            onError(error.response.data);
        }
        else if (error?.response?.status) {
            if (error.response.status === 400) CustomToast.error('Bad Request!');
            else if (error.response.status === 404) CustomToast.error('Bad Request!');
            else if (error.response.status === 500) CustomToast.error('Something went wrong!');
        }

        // showLoader && dispatch();//uncomment when loader added
    }
};