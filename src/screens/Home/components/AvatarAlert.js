import { Platform } from 'react-native';
import React from 'react';
import AnimatedView from '../../../components/atoms/AnimatedView';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import LottieView from "lottie-react-native";
import constants from '../../../res/constants';
let numberOfLines = 2

export default ({ messagesReducer, homeStyles }) => {
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / (Platform.OS === 'ios' ? 10 : 8),
    }
    const { height, width, top } = SCALE_IMAGE;
    const alertMsgList = messagesReducer?.homeScreenDataViewModel?.alertMsgList;
    if (!alertMsgList?.length) return <View />
    else {
        const alertMessage = alertMsgList[0];
        return (
            <AnimatedView style={{ marginTop: 30, }}>
                <AnimatedView style={homeStyles.alertMsgPrimaryContainer}>
                    <AnimatedView style={homeStyles.alertMsgSecondaryContainer}>
                        <Text style={homeStyles.alertMsgHeaderText} numberOfLines={2} fontFamily='PoppinsMedium'>
                            {`${alertMessage.header}`}
                        </Text>
                        <Text style={[homeStyles.alertMsgBodyText, {}]} numberOfLines={Platform.OS === 'ios' ? numberOfLines : numberOfLines} fontFamily='PoppinsRegular'  >
                            {`${alertMessage.body}`}
                        </Text>
                    </AnimatedView>
                    <AnimatedView style={homeStyles.alertMsgSvgView()}>
                        <LottieView
                            source={require('../../../assets/gifs/animated_cat.json')}
                            style={{ position: 'absolute', height: height, bottom: Platform.OS === 'android' ? -1 : -1, opacity: 1, left: -5 }}
                            resizeMode='contain'
                            renderMode='SOFTWARE'
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
