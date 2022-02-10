import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import {Animated,Easing} from 'react-native';
const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView); 

const AnimatedKeyboardAwareScroll = ({data,scrollProps,animatedTabs=7,animationType='each',itemContainerStyle={}}) => {
    const animatedValues = [
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
    ]//currently animated Tabs are here in array, due to some issue, dynamic animated tabs couldn't be used right now, in future it will be implemented IA

    const RenderItemParent = ({item,index}) => {
        const isAnimateable = index <= animatedValues.length -1;
        const loadEach = () => {
            setTimeout(()=>{
                Animated.timing(animatedValues[index],{
                    toValue:1,
                    duration:400,
                    useNativeDriver:true,
                    easing:Easing.ease 
                }).start();
            },index === 0? 50:((index/10)*1000)+(200*index))
        }
        const loadAll = () => {
            Animated.timing(animatedValues[index],{
                toValue:1,
                duration:400,
                useNativeDriver:true,
                easing:Easing.ease 
            }).start();
        }
        React.useEffect(()=>{
            if(isAnimateable&&animatedValues.length === animatedTabs){
                if(animationType === 'each'){
                    loadEach();
                }else{
                    loadAll();
                }
            }
        },[]);
        return <Animated.View style={isAnimateable?{
            opacity:animatedValues[index],
            transform:[{
                scale:animatedValues[index].interpolate({
                    inputRange:[0,1],
                    outputRange:[0.6,1]
                })
            }],
            ...itemContainerStyle
        }:{}}>
            {item}
        </Animated.View>
    }
    return (
        <AnimatedKeyboardAwareScrollView {...scrollProps}>
            {data&&data.map((item,index)=>{
                return <RenderItemParent key={index} item={item} index={index} />
            })}
        </AnimatedKeyboardAwareScrollView>
    );
}

export default AnimatedKeyboardAwareScroll;