import React, { useEffect } from 'react';
import { Animated, Easing, StyleProp, TextStyle, GestureResponderEvent, ViewStyle } from 'react-native';
import { NumberProp, SvgXml } from 'react-native-svg';
import { VALIDATION_CHECK } from '../../helpers/SharedActions';
import sharedStyles from '../../res/sharedStyles';
import AnimatedView from '../atoms/AnimatedView';
import Text from '../atoms/Text';
import TouchableOpacity from '../atoms/TouchableOpacity';
import View from '../atoms/View';

type Props = React.ComponentProps<typeof TouchableOpacity> & {
    children?: any;
    containerStyle?: StyleProp<ViewStyle>;
    imageContainerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;

    xml: string | null;
    width?: NumberProp;
    height?: NumberProp;

    title?: string;
    containerStyleOverride: boolean;
    containerOverrideStyle: Object;
    pressBackgroundColor:string;
};

const defaultProps = {
    xml: null,
    imageContainerStyle: {},
    containerStyle: {},
    textStyle: {},
    width: 95,
    height: 130,
    title: '',
    containerStyleOverride: false,
    containerOverrideStyle: {},
    pressBackgroundColor:'transparent'
}

const CategoryCardItem = (props: Props) => {
    const transFormAngle = React.useRef(new Animated.Value(0)).current;
    const animatedBackground = React.useRef(new Animated.Value(0)).current;
    const animateBackgroundColorPressIn = (event: GestureResponderEvent) => {
        Animated.timing(animatedBackground,{
            toValue:1,
            duration:20,
            easing: Easing.ease,
            useNativeDriver:true,
        }).start();
        if(props.onPressIn){
            props.onPressIn(event);
        }
    }
    const animateBackgroundColorPressOut = (event: GestureResponderEvent) => {
        Animated.timing(animatedBackground,{
            toValue:0,
            duration:20,
            easing: Easing.ease,
            useNativeDriver:true,
        }).start();
        if(props.onPressIn){
            props.onPressIn(event);
        }
    }
    useEffect(() => {
        Animated.timing(transFormAngle, {
            duration: 600,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <TouchableOpacity 
        {...props} 
        // onPressIn={animateBackgroundColorPressIn}
        // onPressOut={animateBackgroundColorPressOut}
        style={props.containerStyleOverride ? {
            backgroundColor: '#fff',
            borderRadius: 10,
            ...props.containerOverrideStyle
        } : [{
            ...sharedStyles._styles().shadow,
            backgroundColor: '#fff',
            borderRadius: 10,

        }, props.containerStyle, {
            height: props.height,
            width: props.width,

        }]}
        activeOpacity={.9}
        >
            <AnimatedView style={{position:'absolute',width:'100%',height:'100%',borderRadius: 10,backgroundColor:props.pressBackgroundColor,opacity:animatedBackground.interpolate({
                inputRange:[0,1],
                outputRange:[0,0.7]
            })}} />
            <AnimatedView style={[{
                opacity: transFormAngle.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1]
                }),
                transform: [{
                    rotate: transFormAngle.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['270deg', '360deg']
                    })
                }]
            }, props.imageContainerStyle, {
                justifyContent: 'center',
                alignItems: "center",
            }]}>
                <SvgXml xml={props.xml} height={"80%"} width={"90%"} />
            </AnimatedView>
            {VALIDATION_CHECK(props.title) &&
                <Text
                    numberOfLines={1}
                    style={[{
                        opacity: transFormAngle.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.2, 1]
                        }),
                        color: "#272727",
                        textAlign: "center",
                        fontSize: 16,
                    }, props.textStyle]}
                    fontFamily={"PoppinsMedium"} >{props.title}</Text>
            }
        </TouchableOpacity>
    );
}
export const CategoryCardItemSimple = (props: Props) => {


    return (
        <TouchableOpacity {...props} style={props.containerStyleOverride ? {
            backgroundColor: '#fff',
            borderRadius: 10,
            ...props.containerOverrideStyle
        } : [{
            ...sharedStyles._styles().shadow,
            backgroundColor: '#fff',
            borderRadius: 10,

        }, props.containerStyle, {
            height: props.height,
            width: props.width,

        }]}>
            <View style={[props.imageContainerStyle, {
                justifyContent: 'center',
                alignItems: "center",
            }]}>
                <SvgXml xml={props.xml} height={"80%"} width={"90%"} />
            </View>
            {VALIDATION_CHECK(props.title) &&
                <Text
                    numberOfLines={1}
                    style={[{
                        color: "#272727",
                        textAlign: "center",
                        fontSize: 16,
                    }, props.textStyle]}
                    fontFamily={"PoppinsMedium"} >{props.title}</Text>
            }
        </TouchableOpacity>
    );
}

CategoryCardItem.defaultProps = defaultProps;
CategoryCardItemSimple.defaultProps = defaultProps;
export default CategoryCardItem;