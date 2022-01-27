/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  NativeModules,
  SafeAreaView,
  Text
} from 'react-native';


const App = () => {

  useEffect(() => {
    setTimeout(() => {
      NativeModules.RNSplashModule.hideSplash();
    }, 3000);

    return () => { }
  }, [])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
      <Text>etesting</Text>

    </SafeAreaView>
  );
};


export default App;
