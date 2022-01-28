import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View, Text, LogBox } from 'react-native';
import RNSplashScreen from './NativeModules/RNSplashScreen';
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigations"

const size = 330;
export default App = () => {
  const isDarkMode = useColorScheme() === "dark";
  useEffect(() => {
      setTimeout(()=>{
          RNSplashScreen.hide();
      },3000)
    return () => { }
  }, []);
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#fff" />
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <RootStack />
        </View>
      </NavigationContainer>
    </SafeAreaView >
  );
}