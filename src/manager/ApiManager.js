import React from "react";
import Toast from '../components/atoms/Toast';
import { sharedExceptionHandler, sharedLogoutUser } from '../helpers/SharedActions';
import ReduxActions from '../redux/actions';
import { store } from '../redux/store';
import GV from '../utils/GV';
import Axios from './Axios';
const _toastRef = React.createRef(null);
const dispatch = store.dispatch;
const noInternetHandler = (requestCallback, params) => {
    const DELAY = 5000;
    if (!GV.NET_INFO_REF?.current?.isConnected) {
        let _timeoutID = setTimeout(() => {
            requestCallback.apply(this, params);
            clearTimeout(_timeoutID);
        }, DELAY);
        if (!_toastRef.current) {
            _toastRef.current = true
            Toast.info("No Internet connection!", DELAY);
        }
        return;
    } else _toastRef.current = null;
}

export const refreshTokenMiddleware = (requestCallback, params) => {
    const userReducer = store.getState().userReducer;
    console.log("[refreshTokenMiddleware].userReducer", userReducer);
    postRequest(
        "/api/User/RefreshToken",
        {
            "accessToken": userReducer?.token?.authToken,
            "refreshToken": userReducer?.refreshToken
        },
        res => {
            console.log("refreshTokenMiddleware.Res :", res);
            if (res?.data?.statusCode === 202) {
                requestCallback.apply(this, params);
                return;
            }
            else if (res?.data?.statusCode === 403) {
                Toast.error("Session Expired!");
                sharedLogoutUser();
                return;
            }
            else {
                dispatch(ReduxActions.setUserAction({ ...res.data }))
                requestCallback.apply(this, params);
                if (__DEV__) Toast.success("Its only for DEV => User session refreshed....", 10000)
            }
        },
        err => {
            console.log("refreshTokenMiddleware.err", err)
            sharedExceptionHandler(err)
        },
    )


};

export const postRequest = async (url, data, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true, customLoader = null) => {
    noInternetHandler(postRequest, [url, data, onSuccess, onError = () => { }, headers, showLoader, customLoader])
    if (customLoader) {
        customLoader(true);
    }
    try {
        let res = await Axios.post(url, data, headers,);
        // console.log("[ApiManager].postRequest.res", JSON.stringify(res));
        onSuccess(res);

    } catch (error) {
        // console.log("[ApiManager].postRequest.error", JSON.stringify(error));
        if (error?.data?.StatusCode === 401) {
            return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError, headers, false, customLoader]);
        } else {
            onError(error);
        }
    } finally {
        if (customLoader) {
            customLoader(false);
        }
    }
};
export const getRequest = async (url, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true) => {
    noInternetHandler(getRequest, [url, onSuccess, onError = () => { }, headers, showLoader])
    try {
        let res = await Axios.get(url, headers);
        // console.log("[ApiManager].getRequest.res", JSON.stringify(res));
        onSuccess(res);
    } catch (error) {
        console.log("[ApiManager].getRequest.error wqoieuoiqwueioquweiouqw", error);
        if (error?.data?.StatusCode === 401) {
            return refreshTokenMiddleware(getRequest, [url, onSuccess, onError, headers, false]);
        } else {
            onError(error);
        }
    }
};
export const multipartPostRequest = (url, formData, onSuccess = () => { }, onError = () => { }, showLoader = false, header = {}) => {
    noInternetHandler(multipartPostRequest,[url, formData, onSuccess, onError = () => { }])
    fetch(`${GV.BASE_URL.current}/${url}`, {
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
            ...header,
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