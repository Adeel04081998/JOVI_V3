import React from 'react';
import { ImageSourcePropType,Image, Animated, StyleProp, ViewStyle, Easing } from 'react-native';
import constants from '../../res/constants';
import Text from '../atoms/Text';
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
    const bottomAnimation = React.useRef<Animated.Value>(new Animated.Value(0)).current;
    const animateBottom = (toValue = 1) => {
        Animated.timing(bottomAnimation, {
            toValue,
            useNativeDriver: true,
            duration: 300,
            easing: Easing.ease,
        }).start();
    }
    React.useEffect(() => {
        animateBottom();
    }, []);
    return (
        <View style={{ height, width, position: 'absolute', top: 0, zIndex: 9999 }}>
            <View style={{
                height:'50%',
                width: '100%',
            }}>
                {/* <Image source={require('../../assets/gifs/Rider-Allocation---Day-2.gif')} resizeMode={'cover'} style={{ width: '100%', height: '100%' }} /> */}
            </View>
            <Animated.View style={{
                height:'50%',
                width: '100%',
                backgroundColor: 'white',
                display:'flex',
                alignItems:'center',
                paddingTop:100,
                transform: [{
                    translateY: bottomAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                    })
                }],
            }}>
                <Text fontFamily={'PoppinsBold'} style={{fontSize:20,color:'black'}}>Sit Back & Relax</Text>
            </Animated.View>
        </View>
    );
}
export default SitBackAnimation;