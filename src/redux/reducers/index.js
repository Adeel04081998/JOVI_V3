import constants from '../../res/constants';
import GV, {PITSTOP_TYPES} from '../../utils/GV';
import TYPES from '../TYPES';
const CART_DATA = {
  pitstops: [
    {
      title: "H#39, ST 45 G-11, ISLAMABAD",
      pitstopType: 2, // jovi
      pitstopName: 'Jovi Job',
      pitstopID: 123, // on update will got from params,
      nameval: "nameval",
      locationVal: "locationVal",
      imageData: "imageData",
      voiceNote: "voiceNote",
      description: "Pickup parcel from the address",
      estTime: "estTime",
      estVal: "estVal"
    },
    {
      pitstopID: 346912, //new
      pitstopName: 'RELX - I8',
      smid: 346912,
      smName: 'RELX - I8',
      smLatLng: '33.6684071,73.0749215',
      porductsQuantityCount: 2,
      estPrepTime: '',
      pitstopType: 4, // restaurant
      pitstopTypeDesc: 'Groceries',
      totalDiscount: 0,
      actualTotal: 9000,
      prescriptionImages: [],
      prescriptionImageList: [],
      checkOutItemsListVM: [
        {
          checkOutItemID: 1323,
          pitstopItemID: 121502,
          pitstopProductID: 73898,
          pitstopDealID: 0,
          pitstopID: 346912,
          title: "Infinity Black Device",
          productItemName: 'Infinity Black Device',
          description: "No olives, only use tomatoes, Don't put too",
          isActive: true,
          isPrescriptionRequired: false,
          isRestaurant: false,
          quantity: 1,
          favoritePitstopItemID: 0,
          price: 4500,
          productAttribute: '',
          productAttributeID: 0,
          brandName: 'Relx',
          restaurantProductNotFound: 1,
          restaurantProductNotFoundDesc: 'Call me & confirm',
          estPrepTime: '',
          discount: 0,
          discountPrice: 4500,
          actualPrice: 4500,
          discountType: 0,
          totalDiscount: 0,
          itemDescription: '',
          gstAddedPrice: 4500,
          productImages: [
            'staging/SupermarketItem/2021/10/1/Relx Infinity Device Black Color_142330.jpg',
          ],
          productImageList: [
            {
              joviImageID: 147683,
              joviImage:
                'staging/SupermarketItem/2021/10/1/Relx Infinity Device Black Color_142330.jpg',
              joviImageThumbnail:
                'staging/SupermarketItem/2021/10/1/Thumbnail_Relx Infinity Device Black Color_142330.jpg',
              fileType: 1,
              fileTypeStr: 'Image',
            },
          ],
          prescriptionDesc: '',
        },
      ],
    },
    {
      pitstopID: 4387, //new
      pitstopName: 'Chesious', // new
      pitstopClientID: 1,
      smName: 'Tayto - I8',
      smid: 4387,
      smLatLng: '33.6682142,73.0752718',
      porductsQuantityCount: 1,
      estPrepTime: '00:10',
      pitstopType: 1, // restaurant
      pitstopTypeDesc: 'Restaurants',
      totalDiscount: 0,
      actualTotal: 876,
      prescriptionImages: [],
      prescriptionImageList: [],
      checkOutItemsListVM: [
        {
          checkOutItemID: 7878,
          title: "Grocery store",
          description: "Store description",
          pitstopItemID: 121875,
          pitstopProductID: 74128,
          pitstopDealID: 0,
          pitstopID: 4387,
          productItemName: 'Wings Platter',
          isActive: true,
          isPrescriptionRequired: false,
          isRestaurant: true,
          quantity: 1,
          favoritePitstopItemID: 0,
          price: 680,
          productAttribute: '',
          productAttributeID: 0,
          brandName: '',
          restaurantProductNotFound: 1,
          restaurantProductNotFoundDesc: 'Call me & confirm',
          estPrepTime: '00:10',
          discount: 0,
          discountPrice: 876,
          actualPrice: 749,
          discountType: 0,
          totalDiscount: 0,
          itemDescription: '',
          gstPercentage: 17,
          gstAddedPrice: 876,
          productImages: [
            'staging/RestaurantProduct/2021/10/4/Product image coming soon_135024.jpg',
          ],
          productImageList: [
            {
              joviImageID: 148138,
              joviImage:
                'staging/RestaurantProduct/2021/10/4/Product image coming soon_135024.jpg',
              joviImageThumbnail:
                'staging/RestaurantProduct/2021/10/4/Thumbnail_Product image coming soon_135024.jpg',
              fileType: 0,
              fileTypeStr: '',
            },
          ],
          prescriptionDesc: '',
        },
      ],
    },
  ],
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
