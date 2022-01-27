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
let svg = ``
  useEffect(() => {
    RNSplashScreen.hide();
    return () => { }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "purple" }}>
      <Text>Jovi</Text>

    </SafeAreaView>
  );
};


export default App;
