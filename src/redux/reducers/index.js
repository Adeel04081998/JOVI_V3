import constants from '../../res/constants';
import GV, {PITSTOP_TYPES} from '../../utils/GV';
import TYPES from '../TYPES';
const CART_DATA = {
  pitstops: [],
  shippingCharges: 0,
  totalProducts: 9876,
  delivery: 150,
  total: 10176,
  isPrescriptionRequired: false,
  isRestaurant: false,
  prescriptionCheckOutID: 0,
  estPrepTime: '00:10',
  totalDiscount: 0,
  actualTotal: 9876,
  itemsCount: 3,
  totalProductGST: 0,
  showPopup: false,
  serviceTax: 0,
  gst: 0,
  // CustomKeys
  joviRemainingAmount: constants.max_jovi_order_amount,
  openOrdersList: [{joviJobId: 123, estimatePrice: 300}],
  shippingCharges: 0,
  totalProducts: 9876,
  delivery: 150,
  total: 10176,
  isPrescriptionRequired: false,
  isRestaurant: false,
  prescriptionCheckOutID: 0,
  estPrepTime: '00:10',
  totalDiscount: 0,
  actualTotal: 9876,
  itemsCount: 3,
  totalProductGST: 0,
  showPopup: false,
  serviceTax: 0,
  gst: 0,
  // CustomKeys
  joviRemainingAmount: constants.max_jovi_order_amount,
  openOrdersList: [{joviJobId: 123, estimatePrice: 300}],
};
const userReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.SET_USER_ACTION:
      return {...state, ...action.payload};
    case TYPES.CLEAR_USER_ACTION:
      return action.payload;
    default:
      return {...state};
  }
};
const cartReducer = (state = CART_DATA, action) => {
  // console.log("action", action)
  switch (action.type) {
    case TYPES.SET_CART_ACTION:
      return {...state, ...action.payload};
    case TYPES.CLEAR_CART_ACTION:
      return action.payload;
    default:
      return {...state};
  }
};
const enumsReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.SET_ENUMS_ACTION:
      return {...state, ...action.payload};
    default:
      return {...state};
  }
};
const messagesReducer = (
  state = {robotJson: null, showRobotFlag: null},
  action,
) => {
  switch (action.type) {
    case TYPES.SET_HOME_MESSAGES_ACTION:
      return {...state, ...action.payload};
    case TYPES.SET_ROBOT_JSON:
      return {...state, ...action.payload};
    case TYPES.SHOW_ROBOT:
      return {
        ...state,
        showRobotFlag: state.showRobotFlag ? state.showRobotFlag + 1 : 1,
      };
    case TYPES.CLEAR_ROBOT_JSON:
      return {...state, robotJson: null};
    default:
      return {...state};
  }
};
const promotionsReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.SET_PROMOTIONS_ACTION:
      return {...state, ...action.payload};
    default:
      return {...state};
  }
};
//...Rest of the reducers would be here

export default {
  userReducer,
  cartReducer,
  enumsReducer,
  messagesReducer,
  promotionsReducer,
  //...
};
