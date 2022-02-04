import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import constants from '../../res/constants';
import { Animated, TouchableOpacity, Easing } from 'react-native';
import { connect } from 'react-redux';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Robot = ({messagesReducer}) => {
    const [state, setState] = useState({
        showRobot: false,
        lottieAnim: null
    });
    
    // RobotJson.p.toString().replace('')
    // RobotJson = JSON.parse(JSON.stringify(RobotJson)).toString().replace('&&&Text1&&&','Hello');
    // console.log('robot',RobotJson);
    const animatedTouchableValue = React.useRef(new Animated.Value(0)).current;
    const { width } = constants.window_dimensions;
    const hideRobot = () => {
        Animated.timing(animatedTouchableValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.ease
        }).start(finished => {
            if (finished) {
                setState(pre => ({ ...pre, showRobot: false }));
                animatedTouchableValue.setValue(0);
            }
        });
    }
    useEffect(() => {
        console.log('messageReducer',messagesReducer)
        if(messagesReducer?.robotJson &&messagesReducer?.showRobotFlag ){
            setState(pre => ({ ...pre, lottieAnim: messagesReducer?.robotJson, showRobot:true }));
            // fetch(messagesReducer.robotJson, {
            //     method: "GET",
            // })
            //     .then((response) => response.json())
            //     .then((responseData) => {
            // console.log(messagesReducer)
            // setState(pre => ({ ...pre, lottieAnim: responseData, showRobot:true }));
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
        }
    }, [messagesReducer?.showRobotFlag,messagesReducer?.showRobotFlag]);
    if (state.showRobot === false) return null;
    return (
        <AnimatedTouchable onPress={() => hideRobot()} activeOpacity={1} style={{
            width: width,
            height: 150,
            position: 'absolute',
            bottom: 60,
            opacity: animatedTouchableValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            })
        }}>
            {state.lottieAnim ? <LottieView style={{
            }}
                resizeMode={'contain'}
                onAnimationFinish={() => { setState(pre => ({ ...pre, showRobot: false })) }}
                source={state.lottieAnim}
                autoPlay loop={false} /> : null}
        </AnimatedTouchable>
    );

}
const mapStateToProps = (store) => {
    return {
        messagesReducer: store.messagesReducer
    }
}
export default connect(mapStateToProps)(Robot);