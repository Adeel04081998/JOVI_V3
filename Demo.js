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
import RNSplashScreen from './NativeModules/RNSplashScreen';
import ProductMenu from './src/screens/ProductMenu';

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


                <ProductMenu />

            </SafeAreaView>
        </SafeAreaProvider>
    );
};
