import constants from '../../res/constants';
import TYPES from '../TYPES';
const INIT_CART_DATA = {
  pitstops: [],
  joviRemainingAmount: constants.max_jovi_order_amount,
  openOrdersList: [],
  subTotal: 0,
  discount: 0,
  serviceCharges: 0,
  total: 0,
  joviPitstopsTotal: 0,
  joviPrevOrdersPitstopsAmount: 0,
  joviCalculation: 0,
  gst: 0,
  itemsCount: 0,
  estimateTime: null,
  orderEstimateTime: null
};

const userReducer = (state = { prevOrders: [], finalDestObj: {} }, action) => {
  switch (action.type) {
    case TYPES.SET_USER_ACTION:
      return { ...state, ...action.payload };
    case TYPES.CLEAR_USER_ACTION:
      return action.payload;
    case TYPES.USER_FINAL_DESTINATION:
      return {
        ...state, ...action.payload
      };
    case TYPES.SET_PREV_ORDERS:
      return {
        ...state, prevOrders: [...state.prevOrders, action.payload]
      };
    default:
      return { ...state };
  }
};
const cartReducer = (state = INIT_CART_DATA, action) => {
  // console.log("action", action)
  switch (action.type) {
    case TYPES.SET_CART_ACTION:
      return { ...state, ...action.payload, pitstops: [...(action.payload.pitstops ?? state.pitstops)] };
    case TYPES.CLEAR_CART_ACTION:
      return {
        ...INIT_CART_DATA,
        ...action.payload,
        pitstops: [],
      }
    default:
      return { ...state };
  }
};
const modalReducer = (state = { visible: false, closeModal: false, ModalContent: null, }, action) => {

  switch (action.type) {
    case TYPES.SET_MODAL:
      return { ...state, ...action.payload, closeModal: false, disabled: "disabled" in action.payload ? action.payload.disabled : false };
    case TYPES.CLOSE_MODAL: {
      return { ...state, closeModal: true, }
    }
    case TYPES.CLEAR_MODAL_REDUCER:
      return { visible: false, closeModal: false, ModalContent: null }
    default:
      return { ...state };
  }
};
const enumsReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.SET_ENUMS_ACTION:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
};
const messagesReducer = (
  state = { robotJson: null, showRobotFlag: null, hideRobotFlag: null },
  action,
) => {
  switch (action.type) {
    case TYPES.SET_HOME_MESSAGES_ACTION:
      return { ...state, ...action.payload };
    case TYPES.SET_ROBOT_JSON:
      return { ...state, ...action.payload };
    case TYPES.SHOW_ROBOT:
      return {
        ...state,
        showRobotFlag: state.showRobotFlag ? state.showRobotFlag + 1 : 1,
      };
    case TYPES.HIDE_ROBOT:
      return {
        ...state,
        hideRobotFlag: state.hideRobotFlag ? state.hideRobotFlag + 1 : 1,
      };
    case TYPES.CLEAR_ROBOT_JSON:
      return { ...state, robotJson: null };
    default:
      return { ...state };
  }
};
const promotionsReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.SET_PROMOTIONS_ACTION:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
};

const categoriesTagsReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.SET_CATEGORIES_TAGS:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
}
const fcmReducer = (state = { "notifications": [] }, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case TYPES.SET_FCM_ACTION:
      let notifications = [{ notifyClientID: state.notifications.length + 1, ...payload }, ...state.notifications];
      if (state.notifications.length > 0) {
        if (payload.notifyClientID) notifications = notifications.filter(n => n.notifyClientID !== payload.notifyClientID)
        return { ...state, notifications };
      } else {
        return { ...state, notifications };
      }
    default:
      return state;
  }
}
//...Rest of the reducers would be here

const vendorDashboardCategoryIDReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case TYPES.SET_VENDOR_DASHBOARD_CATEGORY_ID_ACTION:
      const data = [...action.payload];
      return { ...state, data };
    default:
      return { ...state };
  }
}

export default {
  userReducer,
  cartReducer,
  enumsReducer,
  messagesReducer,
  promotionsReducer,
  categoriesTagsReducer,
  modalReducer,
  fcmReducer,
  //...
  vendorDashboardCategoryIDReducer,
}
