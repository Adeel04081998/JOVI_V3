import React from 'react';
import Toast from '../components/atoms/Toast';
import { sharedExceptionHandler, sharedLogoutUser } from '../helpers/SharedActions';
import ReduxActions from '../redux/actions';
import { store } from '../redux/store';
import GV from '../utils/GV';
import Axios from './Axios';
const dispatch = store.dispatch;
const noInternetHandler = (requestCallback, params) => {
    if ((GV.NET_INFO_REF.current?.isConnected && GV.NET_INFO_REF.current?.isInternetReachable)) {
        //WHEN INTERNET IS CONNECTED BUT THERE WAS SOME ERROR FROM SERVER
        Toast.error('Something went wrong!')
        return;
    }
    const DELAY = 5000;
    let _timeoutID = setTimeout(() => {
        requestCallback.apply(this, params);
        clearTimeout(_timeoutID);
    }, DELAY);
}

const handleErrorBanner = (error) => {
    dispatch(ReduxActions.setSettingsAction({ banner: error?.data.areaLock?.bannerURL }));

}
const successErrorBanner = (response) => {
    // console.log("response",response);
    dispatch(ReduxActions.setSettingsAction({ banner: response?.data.areaLock?.bannerURL }));

}

const pendingApiCalls = React.createRef(null);
export const refreshTokenMiddleware = (requestCallback, params) => {
    const userReducer = store.getState().userReducer;
    console.log("[refreshTokenMiddleware].userReducer", userReducer);
    if (pendingApiCalls.current && pendingApiCalls.current?.length) {
        pendingApiCalls.current.push({ requestCallback, params });
        return;
    } else {
        pendingApiCalls.current = [{
            requestCallback, params
        }];
    }
    const callApis = () => {
        if (pendingApiCalls.current) {
            console.log('[refreshTokenMiddleware]-ApiCalls', pendingApiCalls.current);
            pendingApiCalls.current.map((item) => {
                item.requestCallback.apply(this, item.params);
            });
            pendingApiCalls.current = null;
        }
    }
    postRequest(
        "/api/User/RefreshToken",
        {
            "accessToken": userReducer?.token?.authToken,
            "refreshToken": userReducer?.refreshToken
        },
        res => {
            console.log("refreshTokenMiddleware.Res :", res);

            if (res?.data?.statusCode === 202) {
                callApis();
                return;
                requestCallback.apply(this, params);
            }
            else if (res?.data?.statusCode === 403) {
                Toast.error("Session Expired!");
                sharedLogoutUser();
                return;
            }
            else {
                dispatch(ReduxActions.setUserAction({ ...res.data }))
                callApis();
                if (__DEV__) Toast.success("Its only for DEV => User session refreshed....", 3000)
                return;
                requestCallback.apply(this, params);
            }
        },
        err => {
            console.log("refreshTokenMiddleware.err", err)
            sharedExceptionHandler(err)
        },
    )


};

export const postRequest = async (url, data, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true, customLoader = null) => {
    if (customLoader) {
        customLoader(true);
    }
    try {
        let res = await Axios.post(url, data, headers,);
        // console.log("[ApiManager].postRequest.res", JSON.stringify(res));
        if (res?.data?.areaLock) {
            successErrorBanner(res);
        }
        onSuccess(res);

    } catch (error) {
        // console.log("[ApiManager].postRequest.error", error);
        if (error?.data?.areaLock) {
            handleErrorBanner(error);
        }
        if (error?.data?.StatusCode === 401) {
            return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError, headers, false, customLoader]);
        } else {
            if (error === "Network Error" || error?.message === 'Network Error') {
                noInternetHandler(postRequest, [url, data, onSuccess, onError, headers, showLoader, customLoader])
            } else onError(error);
        }
    } finally {
        if (customLoader) {
            customLoader(false);
        }
    }
};
export const getRequest = async (url, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true) => {
    try {
        let res = await Axios.get(url, headers);
        // console.log("[ApiManager].getRequest.res", JSON.stringify(res));
        if (res?.data?.areaLock) {
            successErrorBanner(res);
        }
        onSuccess(res);
    } catch (error) {
        // console.log("[ApiManager].getRequest.error", error);
        if (error?.data?.areaLock) {
            handleErrorBanner(error);
        }
        if (error?.data?.StatusCode === 401) {
            return refreshTokenMiddleware(getRequest, [url, onSuccess, onError, headers, false]);
        } else {
            if (error === "Network Error" || error?.message === 'Network Error') {
                noInternetHandler(getRequest, [url, onSuccess, onError, headers, showLoader])
            } else onError(error)
        };
    }
};
export const multipartPostRequest = (url, formData, onSuccess = (res) => { }, onError = (err) => { }, showLoader = false, header = {}) => {
    fetch(`${GV.BASE_URL.current}/${url}`, {
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
            ...header,
        },
        body: formData
    })
        .then((res) => {
            // console.log("[multipartPostRequest].res", res);

            return res.json();
        })
        .then((data) => {
            // console.log("[multipartPostRequest].data", data);
            if (data?.areaLock) {
                successErrorBanner(res);
            }
            if (data?.StatusCode === 401 || data?.data?.StatusCode === 401) {
                return refreshTokenMiddleware(multipartPostRequest, [url, formData, onSuccess, onError, showLoader, header]);
            } else {
                if (data === "Network Error" || data?.message === 'Network Error') {
                    noInternetHandler(multipartPostRequest, [url, formData, onSuccess, onError, showLoader, header])
                } else {
                    onSuccess(data)
                }
            }

        })
        .catch(err => {
            // console.log("[multipartPostRequest].err", err);
            if (error?.response?.data?.areaLock) {
                handleErrorBanner(error, dispatch);
            }
            if (err?.data?.StatusCode === 401) {
                return refreshTokenMiddleware(multipartPostRequest, [url, formData, onSuccess, onError, showLoader, header]);
            } else {
                if (err === "Network Error" || err?.message === 'Network Error') {
                    noInternetHandler(multipartPostRequest, [url, formData, onSuccess, onError, showLoader, header])
                } else {
                    onError(err)
                }
            }
        })
}