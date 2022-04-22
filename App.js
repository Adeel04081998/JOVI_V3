import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from 'react';
import { LogBox, Platform, StatusBar, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import CodePush from "react-native-code-push"; //for codepush
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from "react-native-svg";
import Toast, { BaseToast } from 'react-native-toast-message';
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
import { useDispatch, useSelector } from 'react-redux';
import RNSplashScreen from './NativeModules/RNSplashScreen';
import svgs from "./src/assets/svgs";
import BottomAllignedModal from './src/components/atoms/BottomAllignedModal';
import NoInternetModal from "./src/components/atoms/NoInternetModal";
import { _toastRef } from "./src/components/atoms/Toast";
import View from './src/components/atoms/View';
import BaseUrlPrompt from "./src/components/molecules/BaseUrlPrompt";
import Robot from './src/components/organisms/Robot';
import { sharedClearReducers, sharedGetDashboardCategoryIApi, sharedGetEnumsApi, sharedGetFilters, sharedGetHomeMsgsApi, sharedGetPromotions, sharedGetRiderRatingReasonsList, sharedGetUserAddressesApi, sharedGetUserDetailsApi, sharedSendFCMTokenToServer } from './src/helpers/SharedActions';
import { postRequest } from './src/manager/ApiManager';
import RootStack from "./src/navigations";
import { _NavgationRef } from './src/navigations/NavigationService';
import actions from './src/redux/actions';
import constants from "./src/res/constants";
import FontFamily from "./src/res/FontFamily";
import sharedStyles from "./src/res/sharedStyles";
import AppTheme from './src/res/theme';
import GenericPopUp from "./src/screens/GenericPopUp";
import { env } from './src/utils/configs';
import ENUMS from "./src/utils/ENUMS";
import { fcmService } from './src/utils/FCMServices';
import GV from './src/utils/GV';
import { localNotificationService } from './src/utils/LocalNotificationServices';
// Alert.alert("ENV", JSON.stringify(env));

// #region :: VECTOR ICON LOAD START's FROM HERE 
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

// #endregion :: VECTOR ICON LOAD END's FROM HERE 

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
    const { visible } = useSelector(state => state.modalReducer)
    const [state, setState] = React.useState({ appLoaded: false });
    const userReducer = useSelector(state => state.userReducer);
    const isFinalDestinationSelected = userReducer.finalDestObj;

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
    const colors = theme.colors

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
    const RenderToastSvgUi = (uri, color) => {
        return (
            <View style={{}}>


                <SvgXml
                    xml={uri}
                    style={{ position: 'absolute', bottom: 5, marginHorizontal: 5 }}
                    height={30}
                />

            </View>
        )
    }
    const RenderToastCrossUi = () => {
        return (
            <TouchableOpacity onPress={() => { Toast.hide() }} style={{ marginHorizontal: 8, justifyContent: "center" }}>
                <SvgXml
                    xml={svgs.CrossToastIcon()}
                    height={40}
                />
            </TouchableOpacity>
        )
    }

    const toastConfig = {
        success: ({ text1, ...rest }) => {
            if (!(rest.text2)) return
            return <BaseToast
                text1NumberOfLines={10}
                text2NumberOfLines={5}
                {...rest}
                text1Style={{ fontWeight: "500", fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                text2Style={{ color: '#272727', fontSize: 14, fontFamily: FontFamily.Poppins.Regular, }}
                style={{ ...sharedStyles._styles().toastContainer(theme.colors["Transparent_Green "], theme.colors.Bitter_Lime_green_Shade), }}
                contentContainerStyle={{ paddingLeft: 45, margin: 0, }}
                text1={text1}
                text2={rest.text2}
                onTrailingIconPress={() => Toast.hide()}
                renderLeadingIcon={() => { return (RenderToastSvgUi(svgs.SuccesToastIcon(), "#217E3D")) }}
                renderTrailingIcon={() => { return (RenderToastCrossUi()) }}




            />
        },
        error: ({ text1, ...rest }) => {
            if (!(rest.text2)) return
            return <BaseToast
                text1NumberOfLines={10}
                text2NumberOfLines={5}
                {...rest}
                style={{ ...sharedStyles._styles().toastContainer(theme.colors.Pink_Sparkle_Pink_Shade, theme.colors.Red_Surrection), }}
                contentContainerStyle={{ paddingLeft: 51, margin: 0, }}
                text1Style={{ fontWeight: '500', fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                text2Style={{ color: '#272727', fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                text1={text1}
                text2={rest.text2}
                onTrailingIconPress={() => Toast.hide()}
                renderLeadingIcon={() => { return (RenderToastSvgUi(svgs.ErrorToastIcon(), "#a40a0a")) }}
                renderTrailingIcon={() => { return (RenderToastCrossUi()) }}

            />
        }
        ,
        info: ({ text1, ...rest }) => {
            if (!(rest.text2)) return
            return <BaseToast
                text1NumberOfLines={10}
                text2NumberOfLines={5}
                {...rest}
                style={{ ...sharedStyles._styles().toastContainer(theme.colors.Husky_light_blue_Shade, theme.colors.Brak_Bay_Dark_blue_Shade), }}
                contentContainerStyle={{ paddingLeft: 51, margin: 0, }}
                text1Style={{ fontWeight: '500', fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                text2Style={{ color: '#272727', fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                text1={text1}
                text2={rest.text2}
                onTrailingIconPress={() => Toast.hide()}
                renderLeadingIcon={() => { return (RenderToastSvgUi(svgs.InformationToastIcon(), "#05478a")) }}
                renderTrailingIcon={() => { return (RenderToastCrossUi()) }}
            />
        },
        warning: ({ text1, ...rest }) => {
            if (!(rest.text2)) return
            return <BaseToast
                text1NumberOfLines={10}
                text2NumberOfLines={5}
                {...rest}
                style={{ ...sharedStyles._styles().toastContainer(theme.colors.DoeSkin_LightSkinShade, theme.colors.light_orange_Shade), }}
                contentContainerStyle={{ paddingLeft: 51, margin: 0, }}
                text1Style={{ fontWeight: '500', fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                text2Style={{ color: '#272727', fontSize: 14, fontFamily: FontFamily.Poppins.Regular }}
                text1={text1}
                text2={rest.text2}
                onTrailingIconPress={() => Toast.hide()}
                renderLeadingIcon={() => { return (RenderToastSvgUi(svgs.WarningToastIcon(), "#c57701")) }}
                renderTrailingIcon={() => { return (RenderToastCrossUi()) }}
            />
        },

    };
    if (!state.appLoaded) return null;
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>
                <StatusBar backgroundColor={'#fff'} barStyle={"dark-content"} />
                {env.name === ENUMS.ENVS.STAGING ? <BaseUrlPrompt /> : null}
                <NavigationContainer theme={theme} ref={_NavgationRef} >
                    <View style={{ flex: 1, ...StyleSheet.absoluteFillObject }}>

                        <RootStack />
                        {visible && <BottomAllignedModal />}
                        {isFinalDestinationSelected && <GenericPopUp />}
                    </View>
                </NavigationContainer>
                <Robot />
                <Toast
                    config={toastConfig}
                // ref={ref => {
                //     _toastRef.current = ref;
                //     Toast.setRef(ref);
                // }}//Function components cannot be given refs. Attempts to access this ref will fail
                />
                <NoInternetModal />
            </SafeAreaView>
            <SharedGetApis />
        </SafeAreaProvider>
    );
};
export default App;
const SharedGetApis = ({ }) => {
    const [state, setState] = React.useState({
        appLoaded: false
    });
    const { isLoggedIn } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    React.useEffect(() => {
        sharedGetEnumsApi();
        // sharedLogoutUser();
        return () => {
            // console.log('[App] cleared!!');
            sharedClearReducers();//modal reducer wasn't clearing when the app was closed on back press.
            localNotificationService.unRegister();
            fcmService.unRegister();
        };
    }, [])
    React.useEffect(() => {
        if (isLoggedIn) {
            sharedGetUserDetailsApi();
            sharedGetDashboardCategoryIApi();
            sharedGetHomeMsgsApi();
            sharedGetUserAddressesApi();
            sharedGetPromotions();
            sharedGetFilters();
            sharedGetRiderRatingReasonsList()
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
                // console.log('Registered--', token);
                sharedSendFCMTokenToServer(postRequest, token);

            }
            const onNotification = (notify) => {
                // console.log('onNotification--', notify);
                // console.log("===> onNotification.notify -> ", notify)
                dispatch(actions.fcmAction({ ...notify }));
                if (notify.data) {
                    // console.log("notify.data", notify.data);
                    const results = true;
                    // const results = sharedCheckNotificationExpiry(notify.data.ExpiryDate);
                    pushNotification(notify);
                }
                else pushNotification(notify)
            }
            const onOpenNotification = (notify) => {
                // console.log('onOpenNotification--', notify);
            }
            const onRegistrationError = (err) => {
                // console.log('onRegistrationError--', err);
            }
            const onAction = (action) => {
                // console.log('onAction--', action);
            }
            fcmService.registerAppWithFCM();
            fcmService.register(onRegister, onNotification, onOpenNotification)
            localNotificationService.configure(onRegister, onRegistrationError, onOpenNotification, onAction);
            setState(pre => ({ ...pre, appLoaded: true }));
        }
    }, [isLoggedIn])
    return (<></>);
}