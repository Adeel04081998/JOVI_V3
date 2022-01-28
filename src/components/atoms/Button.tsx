import * as React from "react";
import { Text, Animated, Easing, TouchableOpacity } from "react-native";
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
// type Props = React.ComponentProps<typeof TouchableOpacity> & {
//   children: any;
// };
interface Props{
    onPress: Function,
    parentTouchableStyle: Object,
    textStyle: Object,
    activeOpacity:number,
    title: string
}
const defaultProps = {
    activeOpacity:0.9
}
const Button =(props: Props) =>{
    const buttonMargin = React.useRef(new Animated.Value(1)).current;
    const onPressButton = () => {
        Animated.timing(buttonMargin,{
            toValue:1,
            duration:100,
            useNativeDriver:true,
            easing:Easing.ease,

        }).start((finished)=>{
            if(finished && props.onPress){
                props.onPress();
            }
        });
    }
    return (
        <AnimatedTouchable activeOpacity={props.activeOpacity} onPressIn={()=>{
            Animated.timing(buttonMargin,{
                toValue:10,
                duration:100,
                useNativeDriver:true,
                easing:Easing.ease,
            }).start();
        }} onPress={onPressButton} style={{transform: [{
            scale: buttonMargin.interpolate({
                inputRange:[1,10],
                outputRange:[1,0.8]
            }),
          }],...props.parentTouchableStyle}}>
                <Text style={[props.textStyle]}>{props.title}</Text>
        </AnimatedTouchable>
    );
}
Button.defaultProps = defaultProps;
export default Button;
