import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StatusBar } from 'react-native';
import Button from '../../components/molecules/Button';
import View from '../../components/atoms/View';
import introStyles from './styles';
import GV from '../../utils/GV';
import preference_manager from '../../preference_manager';
import ENUMS from '../../utils/ENUMS';
import constants from '../../res/constants';
const IntroScreen = () => {
    const { width } = constants.WINDOW_DIMENSIONS;;
    React.useEffect(() => {
        const save = async () => await preference_manager.getSetIntroScreenAsync(ENUMS.SET_VALUE, true);
        save();
    }, [])
    const onGetStarted = () => {
        GV.NAVIGATION_LISTENER.auth_handler(true);
        // THEME_LISTENER.set_theme(2);
    }
    return (
        <View style={introStyles.topView}>
            <StatusBar backgroundColor={'#637EBF'}/>
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
            />
        </View>
    );
}

export default IntroScreen;