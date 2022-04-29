import AnimatedLottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import { SvgXml, Text } from 'react-native-svg';
import View from './View';

export default (props) => {

    return (
        <View style={[{
            flex: 1,
            marginTop: -80,
            alignItems: "center",
            justifyContent: "center",
        }, props.customStyle]}>
            <AnimatedLottieView
                source={require('../../assets/LoadingView/OrderChat.json')}
                autoPlay
                loop
                style={{
                    height: 120,
                    width: 120,
                }}
            />
        </View>
    );
}

