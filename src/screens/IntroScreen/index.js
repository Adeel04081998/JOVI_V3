import LottieView from 'lottie-react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import { focusAwareStatusBar } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import preference_manager from '../../preference_manager';
import constants from '../../res/constants';
import ReduxAction from '../../redux/actions/index'
import GV from '../../utils/GV';
import introStyles from './styles';
const IntroScreen = ({ navigation }) => {
    const { width } = constants.WINDOW_DIMENSIONS;
    const dispatch = useDispatch()
    const { AUTH_ROUTES } = ROUTES;
    const { common_actions, stack_actions } = NavigationService.NavigationActions;
    React.useEffect(() => {
        const save = async () => {
            dispatch(ReduxAction.setUserAction({ introScreenViewed: true }));
        };
        // const save = async () => await preference_manager.getSetIntroScreenAsync(GV.SET_VALUE, true);
        save();
    }, [])
    const onGetStarted = () => {
        stack_actions.replace(AUTH_ROUTES.EnterOTP.screen_name,{},AUTH_ROUTES.Introduction.screen_name);
    }
    return (
        <View style={introStyles.topView}>
            {
                focusAwareStatusBar({
                    translucent: true,
                    barStyle: "light-content"
                })
            }
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