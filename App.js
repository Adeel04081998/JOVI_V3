import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet,  Dimensions } from 'react-native';
import RNSplashScreen from './NativeModules/RNSplashScreen';
import OTPCode from './src/screens/OtpScreen/OTPCode';
import OtpScreen from './src/screens/OtpScreen/OtpScreen';

export default App = () => {
  useEffect(() => {
    setTimeout(() => {
      RNSplashScreen.hide();
    }, 3000)
    return () => { }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* <OtpScreen /> */}
      <OTPCode/>
    </SafeAreaView>
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
