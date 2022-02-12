import React from 'react';
import { Animated, Easing } from 'react-native';
const View = Animated.View;
const Flatlist = Animated.FlatList;


const animatedTabs = 7;
const AnimatedFlatlist = ({ horizontal = false, data = [], animationType = 'each', itemContainerStyle = {}, renderItem = () => { }, flatlistProps = {}, ListCustomHeaderComponent = null }) => {
    // const animatedValues = Array(animatedTabs).fill(React.useRef(new Animated.Value(0)).current);
    // const animatedValues = React.useRef([...Array(animatedTabs).fill(React.useRef(new Animated.Value(0)).current)]).current;
    const animatedValues = [
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
    ]//currently animated Tabs are here in array, due to some issue, dynamic animated tabs couldn't be used right now, in future it will be implemented IA
    const RenderItemParent = ({ item, index }) => {
        const isAnimateable = index <= animatedValues.length - 1;
        const loadEach = () => {
            setTimeout(() => {
                Animated.timing(animatedValues[index], {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                    easing: Easing.ease
                }).start();
            }, index === 0 ? 50 : ((index / 10) * 1000) + (100 * index))
        }
        const loadAll = () => {
            Animated.timing(animatedValues[index], {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        }
        React.useEffect(() => {
            if (isAnimateable && animatedValues.length === animatedTabs) {
                if (animationType === 'each') {
                    loadEach();
                } else {
                    loadAll();
                }
            }
        }, []);
        return <Animated.View style={isAnimateable ? {
            opacity: animatedValues[index],
            transform: [{
                scale: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1]
                })
            }],
            ...itemContainerStyle
        } : {}}>
            {renderItem(item, index)}
        </Animated.View>
    }
    return (
        <Flatlist
            data={data}
            horizontal={horizontal}
            ListHeaderComponent={ListCustomHeaderComponent}
            renderItem={({ item, index }) => <RenderItemParent item={item} index={index} />}
            keyExtractor={(_, index) => `FlatList-key-${index}-${new Date().getTime()}`}
            {...flatlistProps}
        />
    );
}

export default AnimatedFlatlist;