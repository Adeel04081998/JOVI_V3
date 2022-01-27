import React, { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import RNSplashScreen from './NativeModules/RNSplashScreen';
import Image from './src/components/atoms/Image';

const size = 330;
export default App = () => {

  useEffect(() => {
    RNSplashScreen.hide();
    return () => { }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text>Jovi</Text>
      <View style={{ height: size, width: size, backgroundColor: 'red', alignSelf: "center", borderRadius: 0, overflow: "hidden", }}>
        <Image
          source={{ uri: 'https://www.ppic.org/wp-content/uploads/Crowd-of-Diverse-People_800x528-768x512.jpg' }}
        />
      </View>

    </SafeAreaView >
  );
};
