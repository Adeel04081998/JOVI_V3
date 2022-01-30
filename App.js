import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View, Text, LogBox, StyleSheet, Dimensions } from 'react-native';
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
import { _NavgationRef } from './src/navigations/NavigationService';
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
  // const netInfo = useNetInfo();
  // console.log("netInfo", netInfo)
  const isDarkMode = useColorScheme() === "dark";
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={theme} ref={_NavgationRef}>
        <View style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
          <RootStack />
        </View>
      </NavigationContainer>
    </SafeAreaView >
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 25,
  },
  dropdown: {
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 2,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: 'white'
  },
  overlay: {
    marginHorizontal: 0,
    zIndex: 999,
    position: 'absolute',
    width: Dimensions.get('window').width - 30,
    top: 50
  },
  item: (index) => {
    return {
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: index == 4 ? 0 : 1,
      borderBottomColor: 'lightgrey'
    }
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    height: 50,
    zIndex: 1,
    width: '100%'
  },
});
