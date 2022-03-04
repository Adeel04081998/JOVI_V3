import TYPES from "../TYPES"

const setUserAction = (payload = {}) => {
    return {
        type: TYPES.SET_USER_ACTION,
        payload: { ...payload }
    }
}

const setUserFinalDestAction = (payload = {}) => {
    return {
        type: TYPES.USER_FINAL_DESTINATION,
        payload: { ...payload }
    }
}

const setModalAction = (payload = {}) => {
    return {
        type: TYPES.SET_MODAL,
        payload: { ...payload }
    }
}
const clearModalAction = () => {
    return {
        type: TYPES.CLEAR_MODAL_REDUCER,
    }
}
const closeModalAction = () => {
    return {
        type: TYPES.CLOSE_MODAL,
        payload: { closeModal: true }
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
        type: TYPES.SET_ENUMS_ACTION,
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
const hideRobotAction = () => {
    return {
        type: TYPES.HIDE_ROBOT,
    }
}
const setCategoriesTagsAction = (payload = {}) => {
    return {
        type: TYPES.SET_CATEGORIES_TAGS,
        payload: { ...payload }
    }
}


const setUserPrevOrdersAction = (payload = {}) => {
    return {
        type: TYPES.SET_PREV_ORDERS,
        payload: { ...payload }
    }
}
const fcmAction = (payload = {}) => {
    return {
        type: TYPES.SET_FCM_ACTION,
        payload: { ...payload }
    }
}
//...Rest of the actions would be here

const setvendorDashboardCategoryIDAction = (payload = []) => {
    return {
        type: TYPES.SET_VENDOR_DASHBOARD_CATEGORY_ID_ACTION,
        payload: payload 
    }
}

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
    setCategoriesTagsAction,
    setModalAction,
    clearModalAction,
    setUserFinalDestAction,
    closeModalAction,
    setUserPrevOrdersAction,
    fcmAction,
    setvendorDashboardCategoryIDAction,
    hideRobotAction,
    //...
}