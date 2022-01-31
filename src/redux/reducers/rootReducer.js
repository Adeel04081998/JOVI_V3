import { combineReducers } from 'redux';
import Reducers from './index';

const rootReducer = combineReducers({
    userReducer: Reducers.userReducer,
});

export default rootReducer;