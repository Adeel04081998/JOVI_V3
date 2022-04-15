import * as React from "react";
import { Animated, Easing, TouchableOpacity, ActivityIndicator, GestureResponderEvent, TextProps, TextStyle, ColorValue } from "react-native";
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
    isLoading?: boolean;
    loaderSize?: number | 'small' | 'large' | undefined;
    loaderColor?: ColorValue;
    activeOpacity?: number;
    iconName?: string,
    iconType?: any,
    iconSize?: number,
    iconColor?: string,
    icon?: boolean,

    leftComponent?: () => React.ReactNode;
    rightComponent?: () => React.ReactNode;

};

const defaultProps = {
    text: 'JOVI',
    activeOpacity: 0.9,
    wait: 0.4,
    isLoading: false,
    loaderSize: "large",
    loaderColor: "white",
    leftComponent: undefined,
    rightComponent: undefined,
};

const Button = (props: ButtonProps, textProps: TextProps) => {
    // let onPressRef: NodeJS.Timeout;
    // let isAssigned = false;
    // const isPressed = React.useRef(false);
    // const onPressTimoutRef = React.useRef(onPressTimout);
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
    const onPressParent = debounce(props.onPress, props.wait * 1000, { leading: false, trailing: true, });
    const animateOut = (event: GestureResponderEvent) => {
        Animated.timing(buttonMargin, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start((finished) => {
            if (finished && props.onPress) {
                // if(isPressed.current){
                // return;
                // }
                // console.log('onPressParent',isPressed.current);
                onPressParent(event);
                // isPressed.current = true;
                // setTimeout(()=>{
                //     isPressed.current = false;
                // },(props.wait*1000)+200);
                //Dont Remove The code below, might be used in future.
                // if (isAssignedRef.current === true) {
                //     clearTimeout(onPressRef);
                //     // isAssignedRef.current = false;
                // } else {
                //     let abc = setTimeout(() => {
                //         if (props.onPress) {
                //             props.onPress(event);
                //         }
                //         // isAssignedRef.current = false;
                //     }, props.wait * 1000);
                //     parseInt(abc);
                //     isAssignedRef.current = true;
                //     // console.log('onPressRefBefores', isAssignedRef.current, onPressRef, props.wait * 1000)
                // }
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
                flexDirection: 'row'
            }, {
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
                <>
                    {props.leftComponent && props.leftComponent()}

                    <Text {...textProps} style={[{
                        fontSize: 18,
                        fontWeight: '500',
                        color: "#fff",
                        textAlign: "center",
                    }, props.textStyle]}>{props.isLoading ? <ActivityIndicator color={props.loaderColor} size={props.loaderSize} /> : props.text}</Text>

                    {props.rightComponent && props.rightComponent()}
                </>
            </View>
        </AnimatedTouchable>
    );
}
Button.defaultProps = defaultProps;
export default Button;
