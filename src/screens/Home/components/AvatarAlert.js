import { Platform } from 'react-native';
import React from 'react';
import AnimatedView from '../../../components/atoms/AnimatedView';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import LottieView from "lottie-react-native";

export default ({ messagesReducer, homeStyles }) => {
    const alertMsgList = messagesReducer?.homeScreenDataViewModel?.alertMsgList;
    if (!alertMsgList?.length) return <View />
    else {
        const alertMessage = alertMsgList[0];
        return (
            <AnimatedView style={{ marginTop: 30 }}>
                <AnimatedView style={homeStyles.alertMsgPrimaryContainer}>
                    <AnimatedView style={homeStyles.alertMsgSecondaryContainer}>
                        <Text style={homeStyles.alertMsgHeaderText} numberOfLines={2}>
                            {`${alertMessage.header}`}
                        </Text>
                        <Text style={homeStyles.alertMsgBodyText} numberOfLines={2}>
                            {`${alertMessage.body}`}
                        </Text>
                    </AnimatedView>
                    <AnimatedView style={homeStyles.alertMsgSvgView}>
                        <LottieView
                            source={require('../../../assets/gifs/animated_cat.json')}
                            style={{ position: 'absolute', right: 15, height: 80, bottom: Platform.OS === 'android' ? 2 : 1 }}
                            hardwareAccelerationAndroid={true}
                            autoPlay
                            loop
                        />
                    </AnimatedView>
                </AnimatedView>
            </AnimatedView>
        );
    }
}
