import Axios from 'axios';
import Toast from '../components/atoms/Toast';
import { store } from '../redux/store';
import GV from '../utils/GV';
// import perf from '@react-native-firebase/perf';


Axios.interceptors.request.use(
    config => {
        try {
            if (!GV.NET_INFO_REF?.current?.isConnected) return Toast.info("No Internet connection!", 5000);
            config.baseURL = GV.BASE_URL.current;
            config.timeout = 15000;
            config.timeoutErrorMessage = "Request Timeout..."
            config.headers['clientInfo'] = {}; // for device and app info in future
            const userReducer = store.getState().userReducer;
            const authToken =userReducer?.token?.authToken; // [?.] Added becuase of before login api request when we dont have auth token...
            if (authToken) {
                config.headers['Authorization'] = 'Bearer ' + authToken;
            }
            // if (getLocalSettings().app_perf_enabled) {
            //     const httpMetric = perf().newHttpMetric(config.url, String(config.method).toUpperCase());
            //     const trace = await perf().startTrace(config.url);
            //     // trace.putAttribute('user', 'zulfiqar');
            //     // trace.putMetric('credits', 20);
            //     console.log("[axios].httpMetric, trace", httpMetric, trace)
            //     config.metadata = { httpMetric, trace };
            //     // add any extra metric attributes, if required
            //     // httpMetric.putAttribute('userId', '12345678');
            //     // Define & start a trace
            //     // Stop the trace
            //     await httpMetric.start();
            //     await trace.start();
            // }
        }
        catch (error) {
            console.log("[axios].request.catch.error", error)
        }
        finally {
            // console.log("[axios].config", config)
            return config;
        }

    },
    error => {
        console.log("[Axios.Request.Error]", JSON.stringify(error))
        return Promise.reject(error)
    });

Axios.interceptors.response.use(
    async (response) => {
        // console.log("[axios].response", response)
        try {
            // if (response.config.metadata) {
            //     // Request was successful, e.g. HTTP code 200

            //     const { httpMetric, trace } = response.config.metadata;

            //     // add any extra metric attributes if needed
            //     // httpMetric.putAttribute('userId', '12345678');

            //     httpMetric.setHttpResponseCode(response.status);
            //     httpMetric.setResponseContentType(response.headers['content-type']);
            //     await httpMetric.stop();
            //     await trace.stop();
            // }
        }
        catch (error) {
            console.log("[axios].response.catch.error", error)
        }
        finally {
            return response
        }
    },
    async (error) => {
        try {
            console.log("[Axios.Reponse.Error]", JSON.stringify(error))
            // if (error?.response?.status === 400) Toast.error('Bad Request!');
            // else if (error?.response?.status === 404) Toast.error('Bad Request!');
            if (error?.response?.status === 500) Toast.error('Something went wrong!');
            // if (error.config.metadata) {
            //     // Request failed, e.g. HTTP code 500

            //     const { httpMetric, trace } = error.config.metadata;

            //     // add any extra metric attributes if needed
            //     // httpMetric.putAttribute('userId', '12345678');

            //     httpMetric.setHttpResponseCode(error.response.status);
            //     httpMetric.setResponseContentType(error.response.headers['content-type']);
            //     await httpMetric.stop();
            //     await trace.stop();
            // }
        } catch (error) {
            console.log("[axios].response.error.catch.error", error)

        } finally {
            return Promise.reject(error.response);
        }
    });
export default Axios;