import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import Button from '../../components/molecules/Button';
import View from '../../components/atoms/View';
import AsyncStorage from '@react-native-async-storage/async-storage';
import introStyles from './styles';
import GV from '../../utils/GV';
const { NAVIGATION_LISTENER } = GV;
const IntroScreen = () => {
    const { width } = Dimensions.get('window')
    const onGetStarted = () => {
        AsyncStorage.setItem('IntroScreenViewed', 'true');
        NAVIGATION_LISTENER.auth_handler(true)
    }
    return (
        <View style={introStyles.topView}>
            <StatusBar backgroundColor={'#637EBF'}/>
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
            />
        </View>
    );
}

export default IntroScreen;