import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
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
  useEffect(() => {
    setTimeout(() => {
      RNSplashScreen.hide();
    }, 3000)
    return () => { }
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text>Jovi</Text>

      
      


            {/* <VectorIcon type='AntDesign' name={"stepbackward"}/> */}

      
      

    </SafeAreaView >
  );
}