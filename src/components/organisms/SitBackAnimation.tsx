import React from 'react';
import { ImageSourcePropType, Image, Animated, StyleProp, ViewStyle, Easing } from 'react-native';
import colors from '../../res/colors';
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
            duration: 500,
            easing: Easing.ease,
        }).start();
    }
    React.useEffect(() => {
        animateBottom();
        setTimeout(()=>{
            if(props.onComplete){
                props.onComplete();
            }
        },3200);
    }, []);
    return (
        <View style={{ height, width, position: 'absolute', top: 0, zIndex: 9999 }}>
            <Animated.View style={{
                height: '60%',
                width: '100%',
                backgroundColor: colors.light_mode.default.primary,
                opacity: bottomAnimation,
            }}>
                <Image source={require('../../assets/gifs/RiderAllocation-Day(New).gif')} resizeMode={'contain'} style={{ width: '100%', height: '100%' }} />
            </Animated.View>
            <Animated.View
                style={{
                    position: 'absolute',
                    top:100,
                    width:'100%',
                    transform: [{
                        translateY: bottomAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [200, 0],
                        })
                    }],
                }}>
                <Image source={require('../../assets/images/sitBackSlide.png')} style={{ width: '100%'}} resizeMode={'cover'} />
            </Animated.View>
            <Animated.View style={{
                height: '30%',
                width: '100%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                paddingTop: 100,
                transform: [{
                    translateY: bottomAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                    })
                }],
            }}>
                <Text fontFamily={'PoppinsBold'} style={{ fontSize: 20, color: 'black' }}>Sit Back & Relax</Text>
            </Animated.View>
        </View>
    );
}
SitBackAnimation.defaultProps = defaultProps;
export default SitBackAnimation;