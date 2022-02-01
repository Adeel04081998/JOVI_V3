/**
 * @format
 */
import * as React from "react";
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import appStore from './src/redux/store';
const RNRedux = () => (
    <Provider store={appStore}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);
