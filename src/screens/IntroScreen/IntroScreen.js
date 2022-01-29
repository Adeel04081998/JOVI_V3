import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import GV from '../../utils/GV';
import introStyles from './styles';
const { NAVIGATION_LISTENER } = GV;
const IntroScreen = () => {
    const { width } = Dimensions.get('window')
    const onGetStarted = () => {
        AsyncStorage.setItem('IntroScreenViewed', 'true');
        NAVIGATION_LISTENER.auth_handler(true)
    }
    return (
        <View style={introStyles.topView}>
            <StatusBar
                translucent
                backgroundColor="#637EBF"//to be moved to theme file once that is created
                barStyle="light-content"
            />
            <LottieView style={{
                width: width,
                ...introStyles.lottieView
            }}
                resizeMode='cover' source={require('../../assets/Onboarding.json')} autoPlay loop />
            <Button
                onPress={onGetStarted}
                style={introStyles.buttonTopView}
                textStyle={introStyles.buttonText}
                text={'Get Started'}
                wait={0}
            />
        </View>
    );
}

export default IntroScreen;