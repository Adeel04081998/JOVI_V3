import React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default ({ html, screenStyles, uri, webViewProps, }) => {
    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <WebView
                source={html ? { html: html } : Platform.select({
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
                style={[{ flex: 1, minHeight: 200, width: Dimensions.get('window').width, backgroundColor: 'transparent' }, { ...screenStyles }]}
                containerStyle={{
                    borderBottomRightRadius: 8, borderBottomLeftRadius: 8,
                }}
                scalesPageToFit={true}
                textZoom={105}
                startInLoadingState
                {...webViewProps}
              
            />
        </View>
    )
}
