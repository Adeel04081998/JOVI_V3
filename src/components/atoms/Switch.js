
import React, { useState } from 'react';
import { Appearance, StyleSheet, Platform, Animated, Easing } from 'react-native';
import constants from '../../res/constants';
import theme from '../../res/theme';
import styles from '../../screens/IntroScreen/styles';
import GV from '../../utils/GV';
import TouchableOpacity from './TouchableOpacity';
import View from './AnimatedView';

export default (props) => {
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

    const switchStyles = switchStylesFunc(colors, width, height)
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0))
    const [active, toggleActive] = useState(false);

    console.log('active', active);
    const onPressParentEvent = (bool) => {
        console.log('bool', bool);
        toggleActive(bool);
        props.onToggleSwitch(bool)
    }
    const onPress = () => {
        if (active) {
            console.log("1");
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true
            }).start((finished) => {
                if (finished && props.onToggleSwitch) {
                    onPressParentEvent(false)
                }
            })
        } else {
            console.log("2");

            Animated.timing(animatedValue, {
                toValue: width / 1.8,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true
            }).start((finished) => {
                if (finished && props.onToggleSwitch) {
                    onPressParentEvent(true)
                }
            })
        }


    }
    const width = props.width || 85;
    const height = props.height || 40;
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
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
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        borderColor: 'white',
        borderWidth: 6.5,
        marginHorizontal: 10,
    },
    subSwitchContainerActive: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        borderColor: 'white',
        borderWidth: 6.5,
        marginHorizontal: 5,
    },
    inactiveClr: {
        backgroundColor: '#FF4651'
    },
    activeClr: {
        backgroundColor: '#48EA8B'
    }

})