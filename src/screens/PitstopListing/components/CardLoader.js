import React from 'react';
import View from '../../../components/atoms/View';
import LottieView from "lottie-react-native";

export default ({styles={},loaderStyles={},type=1}) => {
    const loaderTypes = {
        1: ()=>require('../../../assets/gifs/RestaurantMenuLoading.json'),//Menu Loading,
        2: ()=>require('../../../assets/gifs/RestaurantCardsLoading.json')//Card Loading
    }
    const path = loaderTypes[type];
    return <View style={styles.gifLoader}>
        <LottieView
            autoSize={true}
            resizeMode={'contain'}
            style={{ width: '100%',...loaderStyles }}
            source={path()}
            autoPlay
            loop
        />
    </View>
}