import Toast from '../components/atoms/Toast';
import { sharedExceptionHandler, sharedLogoutUser } from '../helpers/SharedActions';
import ReduxActions from '../redux/actions';
import { store } from '../redux/store';
import GV from '../utils/GV';
import Axios from './Axios';
const dispatch = store.dispatch;

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
    if (!GV.NET_INFO_REF?.current?.isConnected) return Toast.info("No Internet connection!", 5000)
    if (customLoader) {
        customLoader(true);
    }
    try {
        let res = await Axios.post(url, data, headers,);
        // console.log("[ApiManager].postRequest.res", JSON.stringify(res));
        onSuccess(res);

    } catch (error) {
        console.log("[ApiManager].postRequest.error", JSON.stringify(error));
        if (error?.data?.StatusCode === 401) return refreshTokenMiddleware(postRequest, [url, data, onSuccess, onError, headers, false, customLoader]);
        // onError(error); // Hide 401 message
    } finally {
        if (customLoader) {
            customLoader(false);
        }
    }
};
export const getRequest = async (url, onSuccess = () => { }, onError = () => { }, headers = {}, showLoader = true) => {
    if (!GV.NET_INFO_REF?.current?.isConnected) return Toast.info("No Internet connection!", 5000)
    try {
        let res = await Axios.get(url, headers);
        // console.log("[ApiManager].getRequest.res", JSON.stringify(res));
        onSuccess(res);
    } catch (error) {
        console.log("[ApiManager].getRequest.error wqoieuoiqwueioquweiouqw", error);
        if (error?.data?.StatusCode === 401) return refreshTokenMiddleware(getRequest, [url, onSuccess, onError, headers, false]);
        // onError(error); // Hide 401 message
    }
};
export const multipartPostRequest = (url, formData, onSuccess = () => { }, onError = () => { }, showLoader = false) => {
    if (!GV.NET_INFO_REF?.current?.isConnected) return Toast.info("No Internet connection!", 5000)
    fetch(`${GV.BASE_URL.current}/${url}`, {
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