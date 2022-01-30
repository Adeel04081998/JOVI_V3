import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View, Text, LogBox, StyleSheet } from 'react-native';
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
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import RootStack from "./src/navigations";
import AppTheme from './src/res/theme';
import useNetInfo from './src/hooks/useNetInfo';
import GV from './src/utils/GV';

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


export default App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const netInfo = useNetInfo();
  const theme = isDarkMode ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...AppTheme.getTheme(GV.THEME_VALUES.JOVI)
    }

  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...AppTheme.getTheme(GV.THEME_VALUES.JOVI)
    }
  }
  useEffect(() => {
    setTimeout(() => {
      RNSplashScreen.hide();
    }, 3000)
    return () => { }
  }, []);

  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);
  console.log("netInfo", netInfo)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={theme}>
        <View style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
          <RootStack />
        </View>
      </NavigationContainer>
    </SafeAreaView >
  );
}