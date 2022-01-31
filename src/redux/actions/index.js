import TYPES from "../TYPES"

const userAction = (payload) => {
    return {
        type: TYPES.USER_ACTION,
        payload: { ...payload }
    }
}
//...Rest of the actions would be here


export default {
    userAction
    //...
}