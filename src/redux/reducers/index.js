import TYPES from "../TYPES";
const userReducer = (state = {}, action) => {
    switch (action.type) {
        case TYPES.USER_ACTION:
            return { ...state, ...action.payload };
        default:
            return { ...state };
    }
}
//...Rest of the reducers would be here


export default {
    userReducer
    //...
}
