import React from 'react';
import View from '../atoms/View';
import { Platform, Keyboard } from 'react-native';
import constants from '../../res/constants';
import { WebView } from 'react-native-webview';
import CustomHeader from '../molecules/CustomHeader';
import SafeAreaView from '../atoms/SafeAreaView';
import { postRequest } from '../../manager/ApiManager';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import Endpoints from '../../manager/Endpoints';
export default ({ screenStyles = {}, route, onNavigationStateChange = null }) => {
    const ERROR_HTML = `
<html lang='en'><head> <meta charset='UTF-8'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>HBL - POPUP</title> <!-- Latest compiled and minified CSS --> <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'> <style> body { width: 100%; height: 100%; padding: 0; margin: 0; font-family: Arial, Helvetica, sans-serif; position: relative; height: 100vh; } body#positive { display: block; overflow: hidden; width: 100%; background-color: #6d51BB; background-image: url('https://jovipublic.s3.me-south-1.amazonaws.com/topup-images/strips_bg.png'); background-repeat: repeat-y; background-position: center center; } body#nagative{ display: block; overflow: hidden; width: 100%; background-color: #F26464; background-image: url('https://jovipublic.s3.me-south-1.amazonaws.com/topup-images/strips_bg.png'); background-repeat: repeat-y; background-position: center center; } div.jovi_face_placeholder { display: block; overflow: hidden; width: 200px; height: 200px; margin: 30px auto 0; background: url('https://jovipublic.s3.me-south-1.amazonaws.com/topup-images/circle_placeHolder.png') no-repeat center center; padding: 43px; } div.img_place_holder { display: block; overflow: hidden; width: 110px; height: 110px; border: 4px solid #fff; border-radius: 50%; margin: 0px auto; } img { width: 100%; height: auto; } h1.successful { display: block; overflow: hidden; text-align: center; margin: 0; padding: 0; color: #fff; font-size: 1.2em; } p.success_msg { display: block; overflow: hidden; text-align: center; margin: 0; padding: 5px 0; color: #fff; font-size: 0.9em; } body#positive button.btn_area { display: inline-block; overflow: hidden; width: 100%; margin: 0 auto; text-align: center; color: #fff; text-transform: uppercase; border: none; padding: 20px; position: absolute; background: #B09DE6; bottom: 0; margin: 10px 0; border-radius: 50px; outline: none !important; box-shadow: none; } body#nagative button.btn_area { display: inline-block; overflow: hidden; width: 100%; margin: 0 auto; text-align: center; color: #fff; text-transform: uppercase; border: none; padding: 20px; position: absolute; background: #E28080; bottom: 0; margin: 10px 0; border-radius: 50px; outline: none !important; box-shadow: none; } .mob_container { display: block; overflow: hidden; height: 100vh; position: relative; } </style></head><body id='positive'> <div class='container'> <div class='mob_container'> <div class='row'> <div class='col-lg-12'> <div class='jovi_face_placeholder'> <div class='img_place_holder'> <img src='https://jovipublic.s3.me-south-1.amazonaws.com/topup-images/sad_jovi.png'> </div> </div> <h1 class='successful'>Failed</h1> <p class='success_msg'>Sorry! Your transaction was not successful. Please try again. </p> </div> </div> </div> </div></body></html>
`
    const html = route?.params?.html ?? '';
    const title = route?.params?.title ?? '';
    const uri = route?.params?.uri ?? '';
    const _ref = React.useRef(null);
    const jsCode = `window.ReactNativeWebView.postMessage(document.getElementsByTagName("body")[0].innerText)`;
    const [_html, setHtml] = React.useState(html);
    const [_uri, setUri] = React.useState(uri);
    const source = _html ? { html: _html } : Platform.select({
        ios: {
            ..._uri,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        android: {
            ..._uri,
        }
    })
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
    const logErrorOnServer = (error) => {
        if (__DEV__) return;
        postRequest(Endpoints.ERROR_LOGGER, {
            "userID": null,
            "frontEndErrorID": 0,
            "description": `${JSON.stringify({ error, request: source })}`,
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
                    source={source}
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
                    // onError={(err) => {
                    //     // logErrorOnServer(err)
                    // }}
                  //onhttperror commented because app crash
                    // onHttpError={err => {
                    //     console.log("[onHttpError.err", err);
                    //     // logErrorOnServer(err)
                    // }}
                    onMessage={(event) => {
                        // console.log('[onMessage].event', event.nativeEvent.data)
                        // logErrorOnServer(event.nativeEvent)
                    }}
                    onNavigationStateChange={(event) => {
                        console.log('[onNavigationStateChange].event', event)
                        Keyboard.dismiss();
                        const statusCode = event.title && event.title.trim().split("-")[0] || 0;
                        if (parseInt(statusCode) === 403) {
                            setUri(null);
                            setHtml(ERROR_HTML);
                            // console.log("Recursive call ran...", callCount.current);
                            // setUri(null)
                            // setHtml(`<h1>Please wait...!</h1>`)
                            // setShowOverlay(true)
                            // if (callCount.current < HBL_MAX_REQ_COUNT) {
                            //     callCount.current = callCount.current + 1;
                            //     HBLHandler()
                            // } else {
                            //     setShowOverlay(false);
                            //     // setUri({ uri: `https://www.google.com/` })
                            //     setHtml(ERROR_HTML)
                            // }
                        }
                        else {
                            // setShowOverlay(false)
                        }
                        onNavigationStateChange && onNavigationStateChange(event)
                    }}
                    injectedJavaScript={jsCode}
                />
            </View>
        </SafeAreaView>
    );
}