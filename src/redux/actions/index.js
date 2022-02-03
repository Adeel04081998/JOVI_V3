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
//...Rest of the actions would be here


export default {
    setUserAction,
    clearUserAction,
    setCartAction,
    clearCartAction,
    getEnumsAction
    //...
}