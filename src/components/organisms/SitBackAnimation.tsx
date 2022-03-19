import React from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import constants from '../../res/constants';
import View from '../atoms/View';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    onComplete: Function;
}//end of INTERFACE 

const defaultProps = {
    containerStyle: {},
    onComplete: () => { },

};
const { width, height } = constants.screen_dimensions;
const SitBackAnimation = (props: Props) => {

    return(
        <View style={{height,width,position:'absolute',top:0,backgroundColor:'red'}}>

        </View>
    );
}