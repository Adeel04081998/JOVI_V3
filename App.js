import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View, Text, LogBox } from 'react-native';
import RNSplashScreen from './NativeModules/RNSplashScreen';
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigations"

export default App = () => {
  const isDarkMode = useColorScheme() === "dark";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#fff" />
      <NavigationContainer>
        <View style={{ flex: 1 }}>
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
