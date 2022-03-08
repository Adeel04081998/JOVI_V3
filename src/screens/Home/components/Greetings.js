import React from 'react';
import { Animated, Easing } from 'react-native';
import AnimatedView from '../../../components/atoms/AnimatedView';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
export default ({ messagesReducer, homeStyles, userReducer, colors }) => {
    const greetingsList = messagesReducer?.homeScreenDataViewModel?.greetingsList;
    if (!greetingsList?.length) return <View style={{ paddingVertical: 5 }} />
    else {
        const greetingMessage = greetingsList[0];
        // const REGEX = /[<<Name>>, , <<phoneNumber>>]/g
        const REGEX = "<<Name>>";
        const greetingMessageSplitted = (greetingMessage.header ?? '').split(REGEX);
        const beforeName = greetingMessageSplitted[0];
        const afterName = greetingMessageSplitted[1];
        const isNameExists = (greetingMessage.header ?? '').includes(REGEX);
        const greetingAnimation = React.useRef(new Animated.Value(0)).current;
        React.useLayoutEffect(() => {
            Animated.timing(greetingAnimation, {
                toValue: 1,
                duration: 700,
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
                        scale: greetingAnimation.interpolate({
                            inputRange: [0, 1],
                            // outputRange: [-100, 0]
                            outputRange: [0.2, 1]
                        })
                    }]
                },
                { margin: 5 }
            ]} >
            <Text style={[homeStyles.greetingHeaderText,]} numberOfLines={1} fontFamily='PoppinsRegular' >
                {beforeName ? `${String(beforeName)}` : null}
                {isNameExists && <Text style={{ color: colors.BlueVoilet || "#6D51BB", alignSelf: 'center', fontSize: 16, fontWeight: 'normal', }} numberOfLines={1} fontFamily='PoppinsRegular'>
                    {`${userReducer["firstName"]}`}
                </Text>}
                {afterName ? `${String(afterName)}` : null}
            </Text>
            <Text style={homeStyles.greetingBodyText} numberOfLines={2} fosntFamily='PoppinsLight'>
                {`${String(greetingMessage.body.replace(REGEX, ""))}`}
            </Text>
        </AnimatedView>
    }

}

