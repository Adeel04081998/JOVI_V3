import * as React from 'react';
import { StatusBar, StatusBarProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default (
    {
        backgroundColor = "red",
        barStyle = "dark-content",
        ...otherProps
    }: StatusBarProps
) => {

    const insets = useSafeAreaInsets();

    return (
        <View style={{ height: insets.top, backgroundColor }}>
            <StatusBar
                {...otherProps}
                animated={true}
                backgroundColor={backgroundColor}
                barStyle={barStyle} />
        </View>
    );
}
