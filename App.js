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


const App = () => {

  useEffect(() => {
    RNSplashScreen.hide();
    return () => { }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
      <Text>etesting</Text>

    </SafeAreaView>
  );
};


export default App;
