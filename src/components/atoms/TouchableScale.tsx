
import * as React from "react";
import { TouchableOpacity as RNTouchableOpacity, Animated, GestureResponderEvent, Easing, } from "react-native";
import debounce from 'lodash.debounce'; // 4.0.8

const AnimatedTouchable = Animated.createAnimatedComponent(RNTouchableOpacity);

type Props = React.ComponentProps<typeof RNTouchableOpacity> & {
  children?: any;
  wait: number,
  activeOpacity?:number;
};

const defaultProps={
        wait: 0.3,
    activeOpacity:0.9,
};

const TouchableScale =(props: Props) =>{
    const buttonMargin = React.useRef(new Animated.Value(1)).current;

    const animateIn = (event: GestureResponderEvent) => {
        Animated.timing(buttonMargin, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start((finished) => {
            if (finished && props.onPressIn) {
                props.onPressIn(event);
            }
        });
    };//end of animateIn

    const animateOut = (event: GestureResponderEvent) => {
        Animated.timing(buttonMargin, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start((finished) => {
            if (finished && props.onPress) {
                onPressHandling();
            }
        });
    };//end of animateOut

    const mycallback = (event: GestureResponderEvent) => {
        props.onPress && props.onPress(event);
      };

    const onPressHandling = debounce(mycallback, props.wait * 1000, { leading: true, trailing: false, });
    return (
        <AnimatedTouchable {...props} 
        activeOpacity={props.activeOpacity}
        style={[props.style, {
            transform: [{
                scale: buttonMargin.interpolate({
                    inputRange: [1, 10],
                    outputRange: [1, 0.8]
                }),
            }]
        }]}
        onPressIn={animateIn}
        onPress={animateOut} />
    );
  }
  
  TouchableScale.defaultProps=defaultProps;
  export default TouchableScale;



