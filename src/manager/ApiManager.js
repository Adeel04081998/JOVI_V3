import Axios from './Axios';
// import CustomToast from "../components/toast/CustomToast";
// import NetInfo from "@react-native-community/netinfo";
import preference_manager from "../preference_manager";
import GV from '../utils/GV';

const CustomToast = {
    error: () => { },
}

const dispatch = () => { }; // import from store when redux is added

export const refreshTokenMiddleware = async (requestCallback, params) => {
    let prevToken = preference_manager.getSetUserAsync(GV.GET_VALUE);
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
                await preference_manager.getSetUserAsync(GV.SET_VALUE, res.data);
                requestCallback.apply(this, params);
            }
        },
        err => {
            console.log("refreshTokenMiddleware.err", err)
        },
    )


};

export const postRequest = async (url, data, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true, customLoader = null) => {
    if(customLoader){
        customLoader(true);
    }
    try {
        let res = await Axios.post(url, data, headers);
        onSuccess(res);
        
    } catch (error) {
        if (error?.response?.data?.StatusCode === 401) return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError, headers, false]);
        onError(error);
    }finally{
        if(customLoader){
            customLoader(false);
        }
    }
};
export const getRequest = async (url, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true) => {
    try {
        let res = await Axios.get(url, headers);
        onSuccess(res);
    } catch (error) {
        if (error?.response?.data?.StatusCode === 401) return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError, headers, showLoader], dispatch);
        onError(error);
    }
};