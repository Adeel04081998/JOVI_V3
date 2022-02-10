import * as React from "react";
import { Animated, Easing, TouchableOpacity, ActivityIndicator, GestureResponderEvent, TextProps, TextStyle } from "react-native";
import Text from "../atoms/Text";
// import TouchableOpacity from "../atoms/TouchableOpacity";
import debounce from 'lodash.debounce'; // 4.0.8
import View from "../atoms/View";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export type ButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
    children?: any;
    text?: string;
    textStyle?: TextStyle;
    wait: number,
    isLoading?: boolean,
    activeOpacity?: number;

    leftComponent?: () => React.ReactNode;
    rightComponent?: () => React.ReactNode;

};

const defaultProps = {
    text: 'JOVI',
    activeOpacity: 0.9,
    wait: 0.3,
    isLoading: false,

    leftComponent: undefined,
    rightComponent: undefined,
};


const Button = (props: ButtonProps, textProps: TextProps) => {
    let onPressRef: NodeJS.Timeout;
    let isAssigned = false;
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
    // const onPressParent = debounce(props.onPress,props.wait * 1000,{ leading: true, trailing: false, });
    const animateOut = (event: GestureResponderEvent) => {
        Animated.timing(buttonMargin, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start((finished) => {
            if (finished && props.onPress) {
                if (isAssigned === true) {
                    console.log('onPressRefBefores', onPressRef, props.wait * 1000)
                    clearTimeout(onPressRef);
                    isAssigned = false;
                } else {
                    onPressRef = setTimeout(() => {
                        if (props.onPress) {
                            props.onPress(event);
                        }
                    }, props.wait * 1000);
                    isAssigned = true;
                }
            }
        });
    };//end of animateOut
    const animateOutOnTouchOut = (event: GestureResponderEvent) => {
        Animated.timing(buttonMargin, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start((finished) => {
            if (finished && props.onPressOut) {
                props.onPressOut(event);
            }
        });
    };//end of animateOut

    return (
        <AnimatedTouchable
            {...props}
            disabled={props.disabled !== undefined && props.disabled !== null ? props.disabled : props.isLoading}
            onPressIn={animateIn}
            onPressOut={animateOutOnTouchOut}
            onPress={animateOut}
            activeOpacity={props.activeOpacity}
            style={[{
                backgroundColor: props.isLoading ? 'grey' : '#7359BE',
                width: "100%",
                height: 55,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
            }, props.style, {
                transform: [{
                    scale: buttonMargin.interpolate({
                        inputRange: [1, 10],
                        outputRange: [1, 0.8]
                    }),
                }]
            }, props.isLoading || props.disabled ? {
                backgroundColor: 'grey',
            } : {}]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {props.leftComponent && props.leftComponent()}

                <Text {...textProps} style={[{
                    fontSize: 18,
                    fontWeight: '500',
                    color: "#fff",
                    textAlign: "center",
                }, props.textStyle]}>{props.isLoading ? <ActivityIndicator color="white" size="large" /> : props.text}</Text>

                {props.rightComponent && props.rightComponent()}
            </View>
        </AnimatedTouchable>
    );
}
Button.defaultProps = defaultProps;
export default Button;
