import * as React from "react";
import { Animated, Easing, GestureResponderEvent, TextProps, TextStyle } from "react-native";
import Text from "../atoms/Text";
import TouchableOpacity from "../atoms/TouchableOpacity";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Props = React.ComponentProps<typeof TouchableOpacity> & {
    children?: any;
    text?: string;
    textStyle?: TextStyle;
    activeOpacity?:number;

};

const defaultProps = {
    text: 'JOVI',
    activeOpacity:0.9,
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

    const animateOut = (event: GestureResponderEvent) => {
        Animated.timing(buttonMargin, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start((finished) => {
            if (finished && props.onPress) {
                props.onPress(event);
            }
        });
    };//end of animateOut

    return (
        <AnimatedTouchable 
        {...props}    
        onPressIn={animateIn}
            onPress={animateOut}
            activeOpacity={props.activeOpacity}
            style={[{
                backgroundColor: '#7359BE',
                width: "100%",
                height: 70,
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
            }]}>

            <Text {...textProps} style={[{
                fontSize: 18,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
            }, props.textStyle]}>{props.text}</Text>
        </AnimatedTouchable>
    );
}
Button.defaultProps = defaultProps;
export default Button;
