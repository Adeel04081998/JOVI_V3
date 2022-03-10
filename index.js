/**
 * @format
 */
import * as React from "react";
import { AppRegistry, Text, TextInput, Animated, LogBox, ScrollView, FlatList } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { sharedSetHeadersInfo } from "./src/helpers/SharedActions";
import messaging from '@react-native-firebase/messaging';
import actions from "./src/redux/actions";


ScrollView.defaultProps = ScrollView.defaultProps || {};
FlatList.defaultProps = FlatList.defaultProps || {};

Animated.FlatList.defaultProps = Animated.FlatList.defaultProps || {};
Animated.ScrollView.defaultProps = Animated.ScrollView.defaultProps || {};

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

Animated.FlatList.defaultProps.showsHorizontalScrollIndicator = false;
Animated.FlatList.defaultProps.showsVerticalScrollIndicator = false;

Animated.ScrollView.defaultProps.showsHorizontalScrollIndicator = false;
Animated.ScrollView.defaultProps.showsVerticalScrollIndicator = false;

ScrollView.defaultProps.showsHorizontalScrollIndicator = false;
ScrollView.defaultProps.showsVerticalScrollIndicator = false;

FlatList.defaultProps.showsVerticalScrollIndicator = false;
FlatList.defaultProps.showsVerticalScrollIndicator = false;

Animated.Text.defaultProps = Animated.Text.defaultProps || {};
Animated.Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreLogs([
    'Please report: Excessive number of pending callbacks: 501.',//BECAUSE OF LISTHEADERCOMPONENT IN FLATLIST
])
LogBox.ignoreAllLogs();
sharedSetHeadersInfo();
const RNRedux = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    store.dispatch(actions.fcmAction({ ...remoteMessage }));

});
