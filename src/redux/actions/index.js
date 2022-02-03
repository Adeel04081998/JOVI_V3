import TYPES from "../TYPES"

const setUserAction = (payload = {}) => {
    return {
        type: TYPES.SET_USER_ACTION,
        payload: { ...payload }
    }
}
const clearUserAction = (payload = {}) => {
    return {
        type: TYPES.CLEAR_USER_ACTION,
        payload,
    }
}
const setCartAction = (payload = {}) => {
    return {
        type: TYPES.SET_CART_ACTION,
        payload: { ...payload }
    }
}
const clearCartAction = (payload = {}) => {
    return {
        type: TYPES.CLEAR_CART_ACTION,
        payload
    }
};
const getEnumsAction = (payload = {}) => {
    return {
        type: TYPES.CLEAR_CART_ACTION,
        payload: { ...payload }
    }
}
const setHomeMessagesAction = (payload = {}) => {
    return {
        type: TYPES.SET_HOME_MESSAGES_ACTION,
        payload: { ...payload }
    }
}
const setPromotionsAction = (payload = {}) => {
    return {
        type: TYPES.SET_PROMOTIONS_ACTION,
        payload: { ...payload }
    }
}
//...Rest of the actions would be here


export default {
    setUserAction,
    clearUserAction,
    setCartAction,
    clearCartAction,
    getEnumsAction,
    setHomeMessagesAction,
    setPromotionsAction
    //...
}