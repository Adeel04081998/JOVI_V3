import React from 'react';
import { Animated, Easing, Platform, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import constants from '../../res/constants';
const AnimatedToucableOpacity = Animated.createAnimatedComponent(TouchableOpacity);


// #region :: CONSTANT's START's FROM HERE 
const HEIGHT = constants.window_dimensions.height;
const WIDTH = constants.window_dimensions.width;

// #endregion :: CONSTANT's END's FROM HERE 


interface Props {
    children?: any;
    visible?: boolean;
    onRequestClose?: () => void;

    disableOutsidePress?: boolean;

    containerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    position: "bottom" | "top" | "center" | "full",

    skipStatusBar?: boolean;
    /** ios only  */
    skipBottom?: boolean;
    /** android only */
    androidSkipBottom?: number;
}

const defaultProps = {
    visible: false,
    onRequestClose: undefined,
    disableOutsidePress: false,
    position: "bottom",
    skipStatusBar: true,
    androidSkipBottom: 30,
}

const AnimatedModal = (props: Props) => {
    const openAnimation = React.useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    const modalAnimation = (toValue = 1) => {
        Animated.timing(openAnimation, {
            toValue: toValue,
            duration: 300,
            easing: Easing.bezier(0.77, 0.0, 0.175, 1.0),
            useNativeDriver: true
        }).start(finished => {
            if (finished && toValue === 0) {
                props.onRequestClose && props.onRequestClose();
            }
        });
    }

    React.useEffect(() => {
        if (props.visible) {
            modalAnimation(1);
        } else if (!props.visible) {
            modalAnimation(0);
        }
    }, [props.visible]);

    // #region :: POSITION STYLING START's FROM HERE 
    const getPositionStyle = () => {
        let positionStyle = {};
        if (props.position === "bottom") {
            positionStyle = {
                position: 'absolute',
                bottom: 0,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                width: '100%',
            };
        } else if (props.position === "top") {
            positionStyle = {
                position: 'absolute',
                top: 0,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                width: '100%',
            };
        } else if (props.position === "center") {
            positionStyle = {
                position: 'absolute',
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: 'rgba(0,0,0,0.5)',
            };
        } else {
            positionStyle = {
                position: 'absolute',
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                width: '100%',
                height: "100%",
                backgroundColor: '#fff',
            };
        }

        return positionStyle;
    }

    // #endregion :: POSITION STYLING END's FROM HERE 

    return (
        <View style={{ position: 'absolute', height: HEIGHT, width: WIDTH, top: 0, zIndex: 999, }}>
            <AnimatedToucableOpacity
                activeOpacity={1}
                disabled={props.disableOutsidePress}
                onPress={() => {
                    props.onRequestClose && props.onRequestClose();
                }}
                style={[{
                    flex: 1, opacity: openAnimation, backgroundColor: 'rgba(0,0,0,0.5)',


                },
                props.containerStyle
                ]} />

            <View
                style={[
                    getPositionStyle(),
                    props.skipStatusBar && {
                        marginTop: getStatusBarHeight(true),
                    },
                ]}>
                <Animated.View style={[{
                    width: '100%',
                    backgroundColor: '#fff',
                    transform: [{
                        translateY: openAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [900, 0],
                        })
                    }],
                }, props.contentContainerStyle,
                (props.skipBottom && Platform.OS === "ios") && {
                    //@ts-ignore
                    paddingBottom: "paddingBottom" in (props?.contentContainerStyle ?? {}) ? insets.bottom + parseInt(`${props?.contentContainerStyle?.paddingBottom ?? 0}`) : insets.bottom,
                },

                //@ts-ignore
                (props.androidSkipBottom && Platform.OS === "android") && {
                    //@ts-ignore
                    paddingBottom: "paddingBottom" in (props?.contentContainerStyle ?? {}) ? props.androidSkipBottom + parseInt(`${props?.contentContainerStyle?.paddingBottom ?? 0}`) : props.androidSkipBottom,
                }
                ]}>
                    {props.children}
                </Animated.View>
            </View>
        </View>
    )
}

AnimatedModal.defaultProps = defaultProps;
export default AnimatedModal;