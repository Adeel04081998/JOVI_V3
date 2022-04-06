import React from 'react';
import View from '../atoms/View';
// import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import constants from '../../res/constants';
import { WebView } from 'react-native-webview';
import CustomHeader from '../molecules/CustomHeader';
import SafeAreaView from '../atoms/SafeAreaView';
export default ({ screenStyles = {}, route }) => {
    const html = route?.params?.html;
    const title = route?.params?.title;
    const uri = route?.params?.uri;
    console.log('uri',uri);
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <CustomHeader
                    rightIconName={null}
                    title={title}
                />
                <WebView
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
                            return event.loading
                        }
                    }}
                    style={[{ flex: 1, minHeight: 200, width: constants.screen_dimensions.width, backgroundColor: 'transparent' }, { ...screenStyles }]}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    onError={(err) => console.log('err ==>>>', err)}
                    onHttpError={err => {
                        console.log("onHttpError ===>>> ", err);

                    }}
                    onNavigationStateChange={(event)=>{console.log('event ==>>>',event)}}
                />
            </View>
        </SafeAreaView>
    );
}