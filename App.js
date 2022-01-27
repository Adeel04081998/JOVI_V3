/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { SafeAreaView, Text,NativeModules } from 'react-native';
import RNSplashScreen from './NativeModules/RNSplashScreen';
import IntroScreen from './src/screens/IntroScreen/IntroScreen';


const App = () => {
  useEffect(() => {
      setTimeout(()=>{
          RNSplashScreen.hide();
      },3000)
    return () => { }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <IntroScreen />
    </SafeAreaView>
  );
};


export default App;
