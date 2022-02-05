/**
 * @format
 */
import * as React from "react";
import { AppRegistry,Text,TextInput,Animated } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

Animated.Text.defaultProps = Animated.Text.defaultProps || {};
Animated.Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const RNRedux = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);
