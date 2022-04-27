import React from 'react';
import View from '../atoms/View';
import { Platform } from 'react-native';
import constants from '../../res/constants';
import { WebView } from 'react-native-webview';
import CustomHeader from '../molecules/CustomHeader';
import SafeAreaView from '../atoms/SafeAreaView';
import { postRequest } from '../../manager/ApiManager';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import Endpoints from '../../manager/Endpoints';
export default ({ screenStyles = {}, route }) => {
    const html = route?.params?.html;
    const title = route?.params?.title;
    const uri = route?.params?.uri;
    const _ref = React.useRef(null);
    const jsCode = `window.ReactNativeWebView.postMessage(document.getElementsByTagName("body")[0].innerText)`;
    // const cb = (data = {}) => {
    //     console.log("data..".data);
    //     postRequest(
    //         `/api/Payment/JazzCashTransactionStatus`,
    //         JSON.parse(data),
    //         success => {
    //             console.log('success1', success);
    //             const { statusCode, jazzCashAuthViewModel } = success.data;
    //             if (statusCode === 200) {

    //             } else sharedExceptionHandler(success)
    //         },
    //         fail => {
    //             console.log('fail', fail);
    //             sharedExceptionHandler(fail)
    //         })
    // }
    const getDerivedStateFromError = (error) => {
        if (__DEV__) return;
        postRequest(Endpoints.ERROR_LOGGER, {
            "userID": null,
            "frontEndErrorID": 0,
            "description": `${JSON.stringify({ error })}`,
            "creationDate": null
        },
            success => {
                console.log('success', success);
            },
            fail => {
                console.log('fail', fail);
            }
        )


    }
    console.log('uri ==>>>>', uri);
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <CustomHeader
                    rightIconName={null}
                    title={title}
                />
                <WebView
                    ref={_ref}
                    source={html ? { html } : Platform.select({
                        ios: {
                            ...uri,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        },
                        android: {
                            ...uri,
                        }
                    })}
                    {...Platform.OS === "ios" && {
                        onShouldStartLoadWithRequest: (event) => {
                            console.log("[onShouldStartLoadWithRequest].event");
                            return event.loading
                        }
                    }}
                    style={[{ flex: 1, minHeight: 200, width: constants.screen_dimensions.width, backgroundColor: 'transparent' }, { ...screenStyles }]}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    onError={(err) =>
                        getDerivedStateFromError(err)
                    }
                    onHttpError={err => {
                        console.log("[onHttpError.err", err);
                        getDerivedStateFromError(err)
                    }}
                    onMessage={(event) => {
                        console.log('[onMessage].event', event.nativeEvent.data)
                        getDerivedStateFromError(event.nativeEvent)

                    }}
                    onNavigationStateChange={(event) => {
                        console.log('[onNavigationStateChange].event', event)
                    }}
                    injectedJavaScript={jsCode}
                />
            </View>
        </SafeAreaView>
    );
}