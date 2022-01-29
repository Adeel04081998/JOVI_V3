import AsyncStorage from '@react-native-async-storage/async-storage';
import ENUMS from '../utils/ENUMS';
import PreferenceManagerKeys from './PreferenceManagerKeys';

export default {
    getSetUserAsync: async (type = ENUMS.SET_VALUE, data = {}) => {
        let result = null;
        if (type === ENUMS.SET_VALUE) await AsyncStorage.setItem(PreferenceManagerKeys.USER_INFO, JSON.stringify(data));
        else {
            result = await AsyncStorage.getItem(PreferenceManagerKeys.USER_INFO);
            if (result) result = JSON.parse(result)
        };
        return result;
    },
    getSetIntroScreenAsync: async (type = ENUMS.SET_VALUE, data = "") => {
        let result = null;
        if (type === ENUMS.SET_VALUE) await AsyncStorage.setItem(PreferenceManagerKeys.INTOR_SCREEN_VIEWED, JSON.stringify(data));
        else {
            result = await AsyncStorage.getItem(PreferenceManagerKeys.INTOR_SCREEN_VIEWED);
            if (result) result = JSON.parse(result)
        };
        return result;
    }
}


