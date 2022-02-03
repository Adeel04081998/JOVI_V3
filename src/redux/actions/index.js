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
const setEnumsActions = (payload = {}) => {
    return {
        type: TYPES.CLEAR_CART_ACTION,
        payload: { ...payload }
    }
}
const setMessagesAction = (payload = {}) => {
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
const setRobotJsonAction = (payload = {}) => {
    return {
        type: TYPES.SET_ROBOT_JSON,
        payload: { ...payload }
    }
}
const clearRobotJsonAction = (payload = {}) => {
    return {
        type: TYPES.SET_ROBOT_JSON,
        payload: { ...payload }
    }
}
const showRobotAction = () => {
    return {
        type: TYPES.SHOW_ROBOT,
    }
}
//...Rest of the actions would be here


export default {
    setUserAction,
    clearUserAction,
    setCartAction,
    clearCartAction,
    setEnumsActions,
    setMessagesAction,
    setPromotionsAction,
    setRobotJsonAction,
    clearRobotJsonAction,
    showRobotAction,
    //...
}