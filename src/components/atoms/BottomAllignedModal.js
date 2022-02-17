import { View, Text, Animated, Easing, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import constants from '../../res/constants';
import { useDispatch, useSelector } from 'react-redux';
import ReduxActions from '../../redux/actions';
import AnimatedKeyboardAwareScroll from '../molecules/AnimatedKeyboardAwareScroll';

const AnimatedToucableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
export default (props) => {
    const openAnimation = React.useRef(new Animated.Value(0)).current;
    const HEIGHT = constants.window_dimensions.height;
    const WIDTH = constants.window_dimensions.width;
    const dispatch = useDispatch();
    const { visible, ModalContent } = useSelector(state => state.modalReducer)
    const modalAnimation = (toValue = 1) => {
        Animated.timing(openAnimation, {
            toValue: toValue,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true
        }).start();
    }

    React.useEffect(() => {
        if (visible) {
            modalAnimation(1);
        } else if (!visible) {
            modalAnimation(0);
        }
    }, []);
    let modalContentToRender = null;
    if (ModalContent) {
        modalContentToRender = ModalContent
    }

    return (
        <View style={{ position: 'absolute', height: HEIGHT, width: WIDTH, top: 0, zIndex: 999 }}>
            <AnimatedToucableOpacity activeOpacity={1} onPress={() => { dispatch(ReduxActions.setModalAction({ visible: false })) }} style={{ flex: 1, opacity: openAnimation, backgroundColor: 'rgba(0,0,0,0.5)' }} />

            <Animated.View
                style={{
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    // maxHeight: HEIGHT * 0.3,
                    // height: HEIGHT * 0.3,
                    backgroundColor: 'white',
                    transform: [{
                        translateY: openAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [300, 0],
                        })
                    }]
                }}
            >
                {modalContentToRender}
            </Animated.View>
        </View>
    )
}