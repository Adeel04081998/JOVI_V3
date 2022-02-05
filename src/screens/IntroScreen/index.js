// import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {Image} from 'react-native';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import { focusAwareStatusBar } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import ReduxAction from '../../redux/actions/index';
import constants from '../../res/constants';
import introStyles from './styles';
const IntroScreen = ({ }) => {
    const [state,setState] = useState({disabled:false});
    const { width } = constants.window_dimensions;
    const dispatch = useDispatch()
    const { AUTH_ROUTES } = ROUTES;
    const {  stack_actions,common_actions } = NavigationService.NavigationActions;
    const save = async () => {
        dispatch(ReduxAction.setUserAction({ introScreenViewed: true }));
    };
    // React.useEffect(() => {
    //     // const save = async () => await preference_manager.getSetIntroScreenAsync(GV.SET_VALUE, true);
    //     // save();
    // }, [])
    const onGetStarted = () => {
        console.log('onGetStarted')
        if(state.disabled === true) return;
        setState(pre=>({...pre,disabled:true}));
        // save();
        stack_actions.replace(AUTH_ROUTES.EnterOTP.screen_name,{},AUTH_ROUTES.Introduction.screen_name);
    }
    return (
        <View style={introStyles.topView}>
            {
                focusAwareStatusBar({
                    translucent: true,
                    backgroundColor:'transparent',
                    barStyle: "light-content"
                })
            }
            <Image source={require('../../assets/gifs/onboarding.gif')} resizeMethod={'resize'} resizeMode={'cover'} style={{width:width-120, ...introStyles.lottieView}} />
            {/* <LottieView style={{
                // width,
                // ...introStyles.lottieView
            }}
                cacheComposition={true}
            cacheStrategy={'strong'}
                renderMode={'SOFTWARE'}
                resizeMode='cover' source={require('../../assets/Onboarding.json')} autoPlay loop /> */}
            <Button
                onPress={onGetStarted}
                style={introStyles.buttonTopView}
                textStyle={introStyles.buttonText}
                text={'Get Started'}
                wait={0.7}
            />
        </View>
    );
}

export default IntroScreen;