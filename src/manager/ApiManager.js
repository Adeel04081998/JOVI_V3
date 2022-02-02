import Axios from './Axios';
// import Toast from "../components/atoms/Toast";
// import NetInfo from "@react-native-community/netinfo";
import preference_manager from "../preference_manager";
import GV from '../utils/GV';
import { store } from '../redux/store';
import configs from '../utils/configs';

const CustomToast = {
    error: () => { },
}

const dispatch = store.dispatch;

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
    if (customLoader) {
        customLoader(true);
    }
    try {
        let res = await Axios.post(url, data, headers);
        onSuccess(res);

    } catch (error) {
        console.log("[ApiManager].postRequest.error", JSON.stringify(error));
        if (error?.response?.data?.StatusCode === 401) return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError, headers, false, customLoader]);
        onError(error);
    } finally {
        if (customLoader) {
            customLoader(false);
        }
    }
};
export const getRequest = async (url, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true) => {
    try {
        let res = await Axios.get(url, headers);
        onSuccess(res);
    } catch (error) {
        console.log("[ApiManager].getRequest.error", error);
        if (error?.response?.data?.StatusCode === 401) return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError, headers, false]);
        onError(error);
    }
};
export const multipartPostRequest = (url, formData, onSuccess = () => { }, onError = () => { }, showLoader = false) => {
    // const appStorePersist = persistor.getState();
    // const appStore = store.getState();
    // console.log("appStore", appStore);
    // console.log("appStorePersist", appStorePersist);
    fetch(`${configs.BASE_URL}/${url}`, {
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData
    })
        .then((res) => {
            console.log("[multipartPostRequest].res", res);
            return res.json();
        })
        .then((data) => {
            console.log("[multipartPostRequest].data", data);
            onSuccess(data)
        })
        .catch(err => {
            console.log("[multipartPostRequest].err", err);
            onError(err)
        })
}