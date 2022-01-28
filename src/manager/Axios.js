import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/configs';
Axios.interceptors.request.use(
    async config => {
        config.baseURL = BASE_URL;
        let res = await AsyncStorage.getItem('User');
        if (!res) config.headers['content-type: application/json'];
        else {
            res = JSON.parse(res);
            config.headers['Authorization'] = 'Bearer ' + res.token.authToken;
            config.headers['content-type: application/json'];
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });
// Axios.interceptors.response.use(function (response) {
//     return response;
// }, function (error) {
//     return Promise.reject(error);
// });
export default Axios;