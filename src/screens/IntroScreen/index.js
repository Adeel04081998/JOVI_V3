import LottieView from 'lottie-react-native';
import React from 'react';
import { StatusBar } from 'react-native';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import preference_manager from '../../preference_manager';
import constants from '../../res/constants';
import GV from '../../utils/GV';
import introStyles from './styles';
const IntroScreen = () => {
    const { width } = constants.WINDOW_DIMENSIONS;
    React.useEffect(() => {
        const save = async () => await preference_manager.getSetIntroScreenAsync(GV.SET_VALUE, true);
        save();
    }, [])
    const onGetStarted = () => {
        GV.NAVIGATION_LISTENER.auth_handler(true);
    }
    return (
        <View style={introStyles.topView}>
            <StatusBar
                translucent
                backgroundColor="#637EBF"//to be moved to theme file once that is created
                barStyle="light-content"
            />
            <LottieView style={{
                width,
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