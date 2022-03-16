
import React, { useRef, useState } from 'react';
import { Appearance, StyleSheet, Platform, Animated, Easing } from 'react-native';
import constants from '../../res/constants';
import theme from '../../res/theme';
import styles from '../../screens/IntroScreen/styles';
import GV from '../../utils/GV';
import TouchableOpacity from './TouchableOpacity';
import View from './AnimatedView';
import Toast from './Toast';
import { useSelector } from 'react-redux';

export default (props) => {
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

    const switchStyles = switchStylesFunc(colors, width, height)
    const [active, toggleActive] = useState(props.switchVal);
    const width = props.width || 55;
    const height = props.height || 30;
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
    const animatedValue = useRef(new Animated.Value(props.switchVal ? width / 1.8 : 4)).current
    const cartReducer = useSelector((store) => {
        return store.cartReducer;
    });
    const remainingAmount = cartReducer.joviRemainingAmount;

    const onPressParentEvent = (bool) => {
        toggleActive(bool);
        props.onToggleSwitch(bool)
    }
    const onPress = () => {
        if (props.type === 1) {
            if (remainingAmount === 0) return Toast.error('Maximum amount reached!')
        }
        if (active) {
            Animated.timing(animatedValue, {
                toValue: 4,
                duration: 100,
                easing: Easing.ease,
                useNativeDriver: true
            }).start((finished) => {
                if (finished && props.onToggleSwitch) {
                    onPressParentEvent(false)
                }
            })
        } else {
            Animated.timing(animatedValue, {
                toValue: width / 1.8,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true
            }).start((finished) => {
                if (finished && props.onToggleSwitch) {
                    onPressParentEvent(true)
                }
            })
        }


    }

    const animatedStyles = {
        transform: [
            { translateX: animatedValue }
        ]
    }
    return (
        <AnimatedTouchable activeOpacity={1} style={[
            active ?
                props.switchContainerActive || switchStyles.switchContainerActive
                : props.switchContainerInActive || switchStyles.switchContainerInActive
            , {
                width,
                height
            },]} onPress={onPress} >
            <View style={[
                active ?
                    props.subSwitchContainerActive || switchStyles.subSwitchContainerActive :
                    props.subSwitchContainerInActive || switchStyles.subSwitchContainerInActive, animatedStyles, {
                },]} >

            </View>
        </AnimatedTouchable>
    );
}


//styles declararation

const switchStylesFunc = (colors, width, height) => StyleSheet.create({
    switchContainerInActive: {
        backgroundColor: '#FF4651',
        borderRadius: 20,
        justifyContent: 'center',
        // alignItems: 'center'
    },
    switchContainerActive: {
        backgroundColor: '#48EA8B',
        borderRadius: 20,
        justifyContent: 'center',
        // alignItems: 'center'
    },
    subSwitchContainerInActive: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        borderColor: 'white',
        borderWidth: 5.5,
        // marginHorizontal: 10,
    },
    subSwitchContainerActive: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        borderColor: 'white',
        borderWidth: 5.5,
        // marginHorizontal: 5,
    },
    inactiveClr: {
        backgroundColor: '#FF4651'
    },
    activeClr: {
        backgroundColor: '#48EA8B'
    }

})