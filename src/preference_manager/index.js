import AsyncStorage from '@react-native-async-storage/async-storage';
import GV from '../utils/GV';
import PreferenceManagerKeys from './PreferenceManagerKeys';
import { store } from '../redux/store';
import ReduxActions from '../redux/actions';

export const RNAsyncStorage = AsyncStorage;
const dispatch = store.dispatch;

export default {
    getSetUserAsync: async (type = GV.SET_VALUE, data = {}) => {
        let result = null;
        if (type === GV.SET_VALUE) await AsyncStorage.setItem(PreferenceManagerKeys.USER_INFO, JSON.stringify(data));
        else {
            result = await AsyncStorage.getItem(PreferenceManagerKeys.USER_INFO);
            if (result) result = JSON.parse(result)
        };
        return result;
    },
    getSetIntroScreenAsync: async (type = GV.SET_VALUE, data = "") => {
        let result = null;
        if (type === GV.SET_VALUE) { await AsyncStorage.setItem(PreferenceManagerKeys.INTOR_SCREEN_VIEWED, JSON.stringify(data)); await AsyncStorage.setItem(PreferenceManagerKeys.INTOR_SCREEN_VIEWED_CHECK_FOR_OTP, 'true') }
        else {
            result = await AsyncStorage.getItem(PreferenceManagerKeys.INTOR_SCREEN_VIEWED);
            if (result) result = JSON.parse(result)
        };
        return result;
    },
    getSetBaseUrlAsync: async (type = GV.SET_VALUE, url = "") => {
        let result = null;
        if (type === GV.SET_VALUE) await AsyncStorage.setItem(PreferenceManagerKeys.BASE_URL, url)
        else {
            url = await AsyncStorage.getItem(PreferenceManagerKeys.BASE_URL);
            if (url) result = url;
        };
        return result;
    },
    clearAllCacheAsync: async () => {
        try {
            dispatch(ReduxActions.clearCartAction({ pitstops: [] }))
            const keys = Object.keys(PreferenceManagerKeys).map(key => PreferenceManagerKeys[key])
            await AsyncStorage.multiRemove(keys);
            console.log('Cache cleaned successfully...');
        } catch (error) {
            console.log(`An error occured during cache cleanup..`, error)
        }
    }
}


