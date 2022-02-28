import { combineReducers } from 'redux';
import Reducers from './index';
// https://blog.jscrambler.com/how-to-use-redux-persist-in-react-native-with-asyncstorage
import { persistReducer } from 'redux-persist';
import { RNAsyncStorage } from '../../preference_manager';
import PreferenceManagerKeys from '../../preference_manager/PreferenceManagerKeys';

const persistUserConfig = {
    key: PreferenceManagerKeys.PERSIST_USER,
    storage: RNAsyncStorage,
    // whitelist: [""] // whitelist would be used if we want to persist specific keys of a reducer
};

const persistCartConfig = {
    key: PreferenceManagerKeys.PERSIST_CART,
    storage: RNAsyncStorage,
    // whitelist: [""] // whitelist would be used if we want to persist specific keys of a reducer
};


const rootReducer = combineReducers({
    enumsReducer: Reducers.enumsReducer,
    messagesReducer: Reducers.messagesReducer,
    promotionsReducer: Reducers.promotionsReducer,
    categoriesTagsReducer: Reducers.categoriesTagsReducer,
    userReducer: persistReducer(persistUserConfig, Reducers.userReducer),
    cartReducer: persistReducer(persistCartConfig, Reducers.cartReducer),
    modalReducer: Reducers.modalReducer,
    // cartReducer: Reducers.cartReducer,
});

export default rootReducer;