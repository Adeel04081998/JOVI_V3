import { createStore } from 'redux';
import rootReducer from '../reducers/rootReducer';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/' // defaults to localStorage for web
export const appStore = createStore(
    rootReducer,
    {},
)
export default appStore;

// import rootReducer from './reducers'
 
// const persistConfig = {
//   key: 'root',
//   storage,
// }
 
// const persistedReducer = persistReducer(persistConfig, rootReducer)
 
// export default () => {
//   let store = createStore(persistedReducer)
//   let persistor = persistStore(store)
//   return { store, persistor }
// }