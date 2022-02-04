import * as React from "react";
import { Animated, Easing,TouchableOpacity,ActivityIndicator, GestureResponderEvent, TextProps, TextStyle } from "react-native";
import Text from "../atoms/Text";
// import TouchableOpacity from "../atoms/TouchableOpacity";
import debounce from 'lodash.debounce'; // 4.0.8

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Props = React.ComponentProps<typeof TouchableOpacity> & {
    children?: any;
    text?: string;
    textStyle?: TextStyle;
    wait:number,
    isLoading?:boolean,
    activeOpacity?:number;

};

const defaultProps = {
    text: 'JOVI',
    activeOpacity:0.9,
    wait:0.3,
    isLoading:false
};

const Button = (props: Props, textProps: TextProps) => {
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
    const onPressParent = debounce(props.onPress,props.wait * 1000,{ leading: true, trailing: false, });
    const animateOut = (event: GestureResponderEvent) => {
        Animated.timing(buttonMargin, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start((finished) => {
            if (finished && props.onPress) {
                onPressParent(event);
            }
        });
    };//end of animateOut

    return (
        <AnimatedTouchable 
        {...props}
        disabled={props.disabled !== undefined && props.disabled !== null?props.disabled:props.isLoading}
        onPressIn={animateIn}
            onPress={animateOut}
            activeOpacity={props.activeOpacity}
            style={[{
                backgroundColor: props.isLoading?'grey':'#7359BE',
                width: "100%",
                height: 55,
                borderRadius: 12,
            }, props.style, {
                alignItems: "center",
                justifyContent: "center",
                transform: [{
                    scale: buttonMargin.interpolate({
                        inputRange: [1, 10],
                        outputRange: [1, 0.8]
                    }),
                }]
            },props.isLoading || props.disabled?{
                backgroundColor:'grey',
            }:{}]}>

            <Text {...textProps} style={[{
                fontSize: 18,
                fontWeight: '500',
                color: "#fff",
                textAlign: "center",
            }, props.textStyle]}>{props.isLoading?<ActivityIndicator color="white"  size="large" /> : props.text}</Text>
        </AnimatedTouchable>
    );
}
Button.defaultProps = defaultProps;
export default Button;
