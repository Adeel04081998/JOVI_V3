import React from 'react';
import { Animated, Easing } from 'react-native';
import AnimatedView from '../../../components/atoms/AnimatedView';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
export default ({ messagesReducer, homeStyles, userReducer, colors }) => {
    const greetingsList = messagesReducer?.homeScreenDataViewModel?.greetingsList;
    if (!greetingsList?.length) return <View style={{ paddingVertical: 10 }} />
    else {
        const greetingMessage = greetingsList[0];
        // const REGEX = /[<<Name>>, , <<phoneNumber>>]/g
        const REGEX = "<<Name>>"
        const greetingAnimation = React.useRef(new Animated.Value(0)).current;
        React.useLayoutEffect(() => {
            Animated.timing(greetingAnimation, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        }, [greetingMessage]);
        return <AnimatedView style={
            [
                {
                    ...homeStyles.greetingMainContainer,
                    opacity: greetingAnimation,
                    transform: [{
                        translateX: greetingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-100, 0]
                        })
                    }]
                },
                { margin: 5 }
            ]} >
            <Text style={[homeStyles.greetingHeaderText]} numberOfLines={1} fontFamily='PoppinsRegular' >
                {`${String(greetingMessage.header.replace(REGEX, ""))}`}
                <Text style={{ color: colors.BlueVoilet || "#6D51BB", alignSelf: 'center', fontSize: 16 }} numberOfLines={1} >
                    {userReducer["firstName"]}
                </Text>
            </Text>
            <Text style={homeStyles.greetingBodyText} numberOfLines={2}>
                {`${String(greetingMessage.body.replace(REGEX, ""))}`}
            </Text>
        </AnimatedView>
    }

}
