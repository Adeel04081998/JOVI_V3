import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import Button from '../../components/molecules/Button';
import View from '../../components/atoms/View';
import AsyncStorage from '@react-native-async-storage/async-storage';
import introStyles from './styles';
const IntroScreen = () => {
    const { height, width } = Dimensions.get('window')
    const onGetStarted = () => {
        AsyncStorage.setItem('IntroScreenViewed','true');
        
    }
    return (
        <View style={introStyles.topView}>
            <LottieView style={{
              width: 300, 
              aspectRatio: 300 / 585,
              flexGrow: 1, 
              alignSelf: 'center',
            }}
            resizeMode='cover' source={require('../../assets/Onboarding.json')} autoPlay loop/>
           
            <Button 
                onPress={()=>{console.log('Hello')}}
                parentTouchableStyle={{backgroundColor:'#7359BE',position:'absolute',justifyContent:'center',alignItems:'center',bottom:70,width:220,height:70,borderWidth:1,borderRadius:100}}
                textStyle={{color:'white',fontSize:16,fontWeight:'bold'}}
            />
        </View>
    );
}

export default IntroScreen;