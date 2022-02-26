import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, LogBox, StyleSheet, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
import useNetInfo from './src/hooks/useNetInfo';
import GV from './src/utils/GV';
import { _NavgationRef } from './src/navigations/NavigationService';
import View from './src/components/atoms/View';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Modal from './src/components/atoms/Modal';
import Geolocation from 'react-native-geolocation-service';

import CodePush from "react-native-code-push"; //for codepush
import { env } from './src/utils/configs';
import Robot from './src/components/organisms/Robot';
import { useSelector } from 'react-redux';
import { sharedGetEnumsApi, sharedGetFilters, sharedGetHomeMsgsApi, sharedGetPromotions, sharedGetUserAddressesApi, sharedGetUserDetailsApi, sharedLogoutUser, sharedSendFCMTokenToServer } from './src/helpers/SharedActions';
import PistopListing from './src/screens/PitstopListing';
import Filter from './src/components/atoms/Filter';
import BottomAllignedModal from './src/components/atoms/BottomAllignedModal';
import Maps from './src/components/atoms/GoogleMaps/Maps';
import Map from './src/screens/Map';
import AddAddress from './src/screens/AddAddress';
import CheckOut from './src/screens/CheckOut';
import { fcmService } from './src/utils/FCMServices';
import { localNotificationService } from './src/utils/LocalNotificationServices';
import actions from './src/redux/actions';
import { postRequest } from './src/manager/ApiManager';
AntDesign.loadFont();
Entypo.loadFont();
EvilIcons.loadFont();
Feather.loadFont();
FontAwesome.loadFont();
// FontAwesome5.loadFont();
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
        ios: env.CODE_PUSH_DEP_KEYS.JOVI_IOS.STAGING,
        android: env.CODE_PUSH_DEP_KEYS.JOVI_ANDROID.STAGING
    }),
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.IMMEDIATE,
    mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
    updateDialog: false
};

const App = () => {
    const netInfo = useNetInfo();
    const { visible } = useSelector(state => state.modalReducer)
    GV.NET_INFO_REF.current = netInfo;
    const [state, setState] = React.useState({ appLoaded: false });
    // console.log("netInfo", netInfo)
    const isDarkMode = useColorScheme() === "dark";
    const theme = isDarkMode ? {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
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
        // console.log("Codepush message", msg);
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
        // console.log("progress", progress);
    }
    useEffect(() => {
        setTimeout(() => {
            CodePush.sync(CODE_PUSH_OPTIONS, syncStatus => {
                // console.log("[CodePush.sync].syncStatus", syncStatus)
                codePushStatusDidChange(syncStatus)
            }, progress => {
                // console.log("[CodePush.sync].progress", progress)
                codePushDownloadDidProgress(progress)
            })
            RNSplashScreen.hide();
            setState(pre => ({ ...pre, appLoaded: true }));//if we run splash screen forcefully for 3 seconds, then the home page gets loaded without animation, this will stop that.
        }, 2000)
        return () => { }
    }, []);

    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
    ]);
    navigator.geolocation = Geolocation;

    if (!state.appLoaded) return null;
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
                <StatusBar backgroundColor={'#fff'} barStyle={"dark-content"} />
                {/* {
          Platform.OS === "ios" ?
            <StatusBar backgroundColor={'transparent'} barStyle={isDarkMode ? "light-content" : "dark-content"} />
            :
            <StatusBar backgroundColor={'#fff'} barStyle={"dark-content"} />
        } */}
                <NavigationContainer theme={theme} ref={_NavgationRef} >
                    <View style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
                        <RootStack />
                        {visible && <BottomAllignedModal />}
                    </View>
                </NavigationContainer>
                <Robot />
                <Toast />
            </SafeAreaView>
            <SharedGetApis />
        </SafeAreaProvider>
    );
};
export default App;
const SharedGetApis = ({ }) => {
    const { isLoggedIn } = useSelector(state => state.userReducer);
    React.useEffect(() => {
        sharedGetEnumsApi();
        // sharedLogoutUser();
        return () => {
            console.log('[App] cleared!!');
            localNotificationService.unRegister();
            fcmService.unRegister();
        };
    }, [])
    React.useEffect(() => {
        if (isLoggedIn) {
            sharedGetUserDetailsApi();
            sharedGetHomeMsgsApi();
            sharedGetUserAddressesApi();
            sharedGetPromotions();
            sharedGetFilters();
            const pushNotification = (notify = {}) => {
                if (notify.data) {
                    localNotificationService.showNotification(0, notify.notification.title, notify.notification.body, notify, {
                        soundName: Platform.select({ android: notify.data.soundName || "my_sound.mp3", ios: "default" }),
                        playSound: true,
                        userInteraction: true,
                    },
                        // actions array
                        [],

                    )
                } else {
                    localNotificationService.showNotification(0, notify.notification.title, notify.notification.body, notify, {
                        soundName: Platform.select({ android: "my_sound.mp3", ios: "default" }),
                        playSound: true,
                        userInteraction: true,
                    },
                        // actions array
                        [],

                    )
                }
            }
            const onRegister = (token) => {
                console.log('Registered--', token);
                sharedSendFCMTokenToServer(postRequest, token);

            }
            const onNotification = (notify) => {
                console.log('onNotification--', notify);
                console.log("===> onNotification.notify -> ", notify)
                dispatch(actions.fcmAction({ ...notify }));
                if (notify.data) {
                    console.log("notify.data", notify.data);
                    const results = true;
                    // const results = sharedCheckNotificationExpiry(notify.data.ExpiryDate);
                    pushNotification(notify);
                }
                else pushNotification(notify)
            }
            const onOpenNotification = (notify) => {
                console.log('onOpenNotification--', notify);
            }
            const onRegistrationError = (err) => {
                console.log('onRegistrationError--', err);
            }
            const onAction = (action) => {
                console.log('onAction--', action);
            }
            fcmService.registerAppWithFCM();
            fcmService.register(onRegister, onNotification, onOpenNotification)
            localNotificationService.configure(onRegister, onRegistrationError, onOpenNotification, onAction);
        }
    }, [isLoggedIn])
    return (<></>);
}