import TYPES from "../TYPES";
const userReducer = (state = {}, action) => {
    switch (action.type) {
        case TYPES.SET_USER_ACTION:
            return { ...state, ...action.payload };
        case TYPES.CLEAR_USER_ACTION:
            return action.payload;
        default:
            return { ...state };
    }
}
const cartReducer = (state = {}, action) => {
    switch (action.type) {
        case TYPES.SET_CART_ACTION:
            return { ...state, ...action.payload };
        case TYPES.CLEAR_CART_ACTION:
            return action.payload;
        default:
            return { ...state };
    }
}
const enumsReducer = (state = {}, action) => {
    switch (action.type) {
        case TYPES.GET_ENUMS_ACTION:
            return { ...state, ...action.payload };
        default:
            return { ...state };
    }
}
const messagesReducer = (state = {}, action) => {
    switch (action.type) {
        case TYPES.SET_HOME_MESSAGES_ACTION:
            return { ...state, ...action.payload };
        default:
            return { ...state };
    }
}
const promotionsReducer = (state = {}, action) => {
    switch (action.type) {
        case TYPES.SET_PROMOTIONS_ACTION:
            return { ...state, ...action.payload };
        default:
            return { ...state };
    }
}
//...Rest of the reducers would be here


export default {
    userReducer,
    cartReducer,
    enumsReducer,
    messagesReducer,
    promotionsReducer
    //...
}
