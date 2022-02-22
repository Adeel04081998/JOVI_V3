import React, { useEffect } from 'react';
import { LogBox, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useDispatch } from 'react-redux';
import RNSplashScreen from './NativeModules/RNSplashScreen';
import ReduxActions from "./src/redux/actions";
import OrderProcessing from './src/screens/OrderProcessing';
import OrderProcessingError from './src/screens/OrderProcessingError';

AntDesign.loadFont();
Entypo.loadFont();
EvilIcons.loadFont();
Feather.loadFont();
FontAwesome.loadFont();
Fontisto.loadFont();
Ionicons.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();
Foundation.loadFont();
SimpleLineIcons.loadFont();


export default () => {
    const dispatch = useDispatch();
    dispatch(ReduxActions.setUserAction({
        finalDestination: {
            "latitude": 33.654227,
            "longitude": 73.044831
        }
    }))
    useEffect(() => {
        RNSplashScreen.hide();
        return () => { }
    }, []);

    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
        "Animated: `useNativeDriver` was not specified.",
    ]);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
                <StatusBar backgroundColor={'#fff'} barStyle={"dark-content"} />

                <OrderProcessingError />

            </SafeAreaView>
        </SafeAreaProvider>
    );
};
