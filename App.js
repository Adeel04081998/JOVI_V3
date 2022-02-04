import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, LogBox, StyleSheet, Platform } from 'react-native';
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
// import useNetInfo from './src/hooks/useNetInfo';
import GV from './src/utils/GV';
import { _NavgationRef } from './src/navigations/NavigationService';
import View from './src/components/atoms/View';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CodePush from "react-native-code-push"; //for codepush
import configs from './src/utils/configs';
import Robot from './src/components/organisms/Robot';

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
const CODE_PUSH_OPTIONS = {
  // `deploymentKey` should be dynamic according to environment like QA, STAGING, PRODUCTION before publish to staging and master
  //Currently QA Environment setup done 
  deploymentKey: Platform.select({
    ios: configs.CODE_PUSH_DEP_KEYS.JOVI_IOS_V2_QA.STAGING,
    android: configs.CODE_PUSH_DEP_KEYS.JOVI_ANDROID_V2_QA.STAGING
  }),
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: false
};

const App = () => {
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
  function message(msg) {
    console.log("Codepush message", msg);
  }
  function codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        // message("Checking for update.");
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        message("Downloading package.");
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        // message("Awaiting user action.");
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        message("Installing update...");
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        // message("App up to date.");
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        message("Update cancelled by user.");
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        message("Update installed and app will be restart shortly");
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        message("An unknown error occurred.");
        break;
    }
  }
  function codePushDownloadDidProgress(progress) {
    console.log("progress", progress);
  }
  useEffect(() => {
    CodePush.sync(CODE_PUSH_OPTIONS, syncStatus => {
      console.log("[CodePush.sync].syncStatus", syncStatus)
      codePushStatusDidChange(syncStatus)
    }, progress => {
      console.log("[CodePush.sync].progress", progress)
      codePushDownloadDidProgress(progress)
    })
    setTimeout(() => {
    }, 3000)
    RNSplashScreen.hide();
    return () => { }
  }, []);

  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
        <StatusBar backgroundColor={'transparent'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer theme={theme} ref={_NavgationRef} >
          <View style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
            <RootStack />
          </View>
        </NavigationContainer>
        <Robot />
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default App;
