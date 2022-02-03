import Toast from '../components/atoms/Toast';
import { sharedLogoutUser } from '../helpers/SharedActions';
import ReduxActions from '../redux/actions';
import { store } from '../redux/store';
import configs from '../utils/configs';
import Axios from './Axios';
const dispatch = store.dispatch;

export const refreshTokenMiddleware = (requestCallback, params) => {
    Toast.error("Session Expired!");
    sharedLogoutUser();
    return;

    // BELOW CODE COMMENTED WILL BE IMPLMEMENT LATER
    const userReducer = store.getState().userReducer;
    console.log("[refreshTokenMiddleware].userReducer", userReducer);
    postRequest(
        "/api/User/RefreshToken",
        {
            "accessToken": userReducer.token.authToken,
            "refreshToken": userReducer.refreshToken
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