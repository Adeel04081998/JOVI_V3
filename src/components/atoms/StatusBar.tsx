import * as React from 'react';
import { StatusBar, StatusBarProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default (
    {
        backgroundColor = "red",
        barStyle = "dark-content",
        height = -1,
        ...otherProps
    }: any
) => {


    if (height === -1) {
        const insets = useSafeAreaInsets();
        height = insets.top;
    }

    return (
        <View style={{ height: height, backgroundColor }}>
            <StatusBar
                {...otherProps}
                animated={true}
                backgroundColor={backgroundColor}
                barStyle={barStyle} />
        </View>
    );
}
