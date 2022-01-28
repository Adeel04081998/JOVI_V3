import React, { useEffect } from 'react';
import { Animated,Easing, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

const AnimatedTab = ({ parentTouchableProps={},textStyle={},tabTitle="",textProps={},svgProps={}}) => { 
    const transFormAngle = React.useRef(new Animated.Value(0)).current;
    useEffect(()=>{
        Animated.timing(transFormAngle,{
            duration:500,
            toValue:1,
            easing:Easing.ease,
            useNativeDriver:true
        }).start();
    },[])
    return (
        <TouchableOpacity {...parentTouchableProps}>
            <Animated.View style={{height:'80%',justifyContent:'center',opacity:transFormAngle.interpolate({
                inputRange:[0,1],
                outputRange:[0.2,1]
            }), transform:[{rotate:transFormAngle.interpolate({
                inputRange:[0,1],
                outputRange:['270deg','360deg']
            })}]}}>
                <SvgXml xml={svgProps.svgXmlSrc} {...svgProps.svgOtherProps}  height={svgProps.svgHeight} width={svgProps.svgWidth} />
            </Animated.View>
            <Animated.Text style={{opacity:transFormAngle.interpolate({
                inputRange:[0,1],
                outputRange:[0.2,1]
            }),...textStyle}} {...textProps}>{tabTitle}</Animated.Text>
        </TouchableOpacity>
    );
}

export default AnimatedTab;