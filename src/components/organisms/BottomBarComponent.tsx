import * as React from "react";
import { Alert, Animated, Appearance, ColorValue, Dimensions, Easing, StyleSheet, TouchableOpacity as TC, View } from "react-native";
import Svg, { Color, Path } from 'react-native-svg';
import { VALIDATION_CHECK } from "../../helpers/SharedActions";
import { useDeviceOrientation } from "../../hooks/useDeviceOrientation";
import constants from "../../res/constants";
import theme from "../../res/theme";
import GV from "../../utils/GV";
import { getPath } from '../../utils/Path';
import AnimatedView from "../atoms/AnimatedView";
import Text from "../atoms/Text";
import TouchableOpacity from "../atoms/TouchableOpacity";
import VectorIcon from "../atoms/VectorIcon";
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TC);



interface BottomBarItem {
    id: number;
    iconName: string;
    key: any;
    iconType?: 'Ionicons' | 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Fontisto' | 'MaterialCommunityIcons' | 'MaterialIcons' | "Foundation" | "SimpleLineIcons" | 'Zocial' | 'Octicons';
    iconSize?: number;
    iconColor?: ColorValue;
    title: string;
    onPress?: () => void;
    customComponent?: () => void;
}

type Props = React.ComponentProps<typeof View> & {
    children?: any;
    width?: number;
    height?: number;
    circleWidth?: number;
    borderTopLeftRight?: boolean;
    backgroundColor?: Color;
    strokeWidth?: number;

    leftData?: BottomBarItem[];
    rightData?: BottomBarItem[];

    buttonSize?: number;
};

const defaultProps = {
    width: constants.window_dimensions.width,
    height: 65,
    circleWidth: 55,
    borderTopLeftRight: false,
    backgroundColor: "#fff",
    strokeWidth: 0,

    leftData: [],
    rightData: [],

    buttonSize: 60,
};

const BottomBarComponent = (props: Props) => {
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

    // #region :: PROP VAIABLE START's FROM HERE 
    const width = props.width ?? defaultProps.width;
    const height = props.height ?? defaultProps.height;
    const circleWidth = props.circleWidth ?? defaultProps.circleWidth;
    const borderTopLeftRight = props.borderTopLeftRight ?? defaultProps.borderTopLeftRight;
    const bgColor = props.backgroundColor ?? defaultProps.backgroundColor;
    const strokeWidth = props.strokeWidth ?? defaultProps.strokeWidth;

    const centerButtonSize = props.buttonSize ?? defaultProps.buttonSize;
    const centerButtonQuaterSize = centerButtonSize / 3.5;

    // #endregion :: PROP VAIABLE END's FROM HERE 

    // #region :: STATE & REF's START's FROM HERE 
    const orientation = useDeviceOrientation();
    const transFormAngle = React.useRef(new Animated.Value(0)).current;
    const crossIconAnimation = React.useRef(new Animated.Value(0)).current;
    const [maxWidth, setMaxWidth] = React.useState<any>(width);
    const [activeRoute, updateActiveRoute] = React.useState<any>(null);
    const [isCloseIcon, toggleCloseIcon] = React.useState(false);

    // #endregion :: STATE & REF's END's FROM HERE 

    const animateCenterButtonPress = () => {
        const revertAnimation = () => {
            Animated.timing(crossIconAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if (finished) {
                }
            });
        }
        Animated.timing(crossIconAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.ease
        }).start(finished => {
            if (finished) {
                toggleCloseIcon(!isCloseIcon);
                revertAnimation();
            }
        });

    };//end of animateCenterButtonPress

    // #region :: EFFECT's START's FROM HERE 
    React.useEffect(() => {
        Animated.timing(transFormAngle, {
            duration: 500,
            toValue: 1,
            easing: Easing.ease,
            useNativeDriver: true
        }).start(finished => {
        });
    }, []);//end of START ANIMATION


    React.useEffect(() => {
        const { width: w, height: h } = Dimensions.get('window');
        if (!width) {
            setMaxWidth(w);
        }
    }, [orientation]);//end of dimension Effect


    // #endregion :: EFFECT's END's FROM HERE 

    // #region :: CENTER BUTTON START's FROM HERE 
    const _renderButtonCenter = () => {
        return (
            <AnimatedView style={{
                //@ts-ignore
                backgroundColor: colors?.primary ?? 'red',
                alignSelf: 'center',
                height: centerButtonSize,
                width: centerButtonSize,
                borderRadius: centerButtonSize,
                alignItems: "center",
                justifyContent: "center",
                transform: [{
                    rotate: transFormAngle.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['180deg', '360deg']
                    })
                },
                {
                    scale: transFormAngle
                }
                ],
            }}>
                {isCloseIcon ? _renderClose() : _renderCircle()}

            </AnimatedView>
        )
    };//end of _renderButtonCenter

    const _renderQuaterCircle = (positon = 1, size = 20,) => {
        return (
            <AnimatedView style={{
                opacity: transFormAngle.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1]
                }),
                backgroundColor: '#fff',
                height: size,
                width: size,
                borderTopLeftRadius: positon === 1 ? size : size / 3,
                borderTopRightRadius: positon === 2 ? size : size / 3,
                borderBottomLeftRadius: positon === 3 ? size : size / 3,
                borderBottomRightRadius: positon === 4 ? size : size / 3,
                marginRight: positon === 1 || positon === 3 ? size * 0.2 : 0,
            }} />
        )
    };//end of _renderQuaterCircle

    const _renderCircle = () => {
        return (
            <AnimatedTouchableOpacity onPress={animateCenterButtonPress} style={{
                transform: [{
                    scale: crossIconAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0]
                    })
                }, {
                    rotate: crossIconAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['270deg', '360deg']
                    })
                }]
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                    {_renderQuaterCircle(1, centerButtonQuaterSize)}
                    {_renderQuaterCircle(2, centerButtonQuaterSize)}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: centerButtonQuaterSize * 0.2 }}>
                    {_renderQuaterCircle(3, centerButtonQuaterSize)}
                    {_renderQuaterCircle(4, centerButtonQuaterSize)}
                </View>

            </AnimatedTouchableOpacity>
        )
    };//end of _renderCircle

    const _renderClose = () => {
        return (
            <AnimatedTouchableOpacity onPress={animateCenterButtonPress} style={{
                transform: [{
                    scale: crossIconAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0]
                    })
                }, {
                    rotate: crossIconAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['360deg', '270deg']
                    })
                }]
            }}>
                <VectorIcon size={centerButtonSize * 0.7} type={"MaterialCommunityIcons"} name={"window-close"} color={"#fff"} />

            </AnimatedTouchableOpacity>
        )
    };//end of _renderClose


    // #endregion :: CENTER BUTTON END's FROM HERE 

    // #region :: SIDE ITEM START's FROM HERE 
    const _renderSideItem = (item: BottomBarItem, index: number) => {
        const iconType = VALIDATION_CHECK(item?.iconType ?? '') ? item.iconType : 'Ionicons';
        const iconSize = VALIDATION_CHECK(item?.iconSize ?? '') ? item.iconSize : 22;
        const iconColor = VALIDATION_CHECK(item?.iconColor ?? '') ? item.iconType : '#A3ABB4';

        const isActive = (item?.key ?? '') === activeRoute;

        return (
            <TouchableOpacity style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',

            }} key={index}
                disabled={!VALIDATION_CHECK(item.onPress)}
                onPress={() => {
                    item.onPress && item.onPress();
                }}>
                {VALIDATION_CHECK(item.customComponent) ?
                    item.customComponent
                    :
                    <VectorIcon name={item.iconName} type={iconType} size={iconSize} color={iconColor} />
                }
                <Text style={{ fontSize: 11, }}
                    fontFamily="PoppinsRegular">{item.title}</Text>
            </TouchableOpacity>
        )
    };//end of _renderSideItem


    // #endregion :: SIDE ITEM END's FROM HERE 


    const reald = getPath(maxWidth, height, circleWidth >= 50 ? circleWidth : 50, borderTopLeftRight);
    return (
        <View style={{ flex: 1 }}>

            <View style={[styles.container, {}]}>

                {/* ****************** Start of BACKGROUND WITH CURVE ****************** */}
                <Svg width={maxWidth} height={height + (0)}>
                    <Path fill={bgColor} stroke="#DDDDDD" strokeWidth={strokeWidth} d={reald} />
                </Svg>

                {/* ****************** End of BACKGROUND WITH CURVE ****************** */}


                <View style={[styles.main, { width: maxWidth, }]}>

                    {/* ****************** Start of LEFT SIDE ****************** */}
                    <View style={[styles.rowLeft, { height: height }]}>
                        {(props.leftData ?? []).map((item: BottomBarItem, index) => _renderSideItem(item, index))}
                    </View>

                    {/* ****************** End of LEFT SIDE ****************** */}

                    <View style={styles.btnCircle}>
                        {_renderButtonCenter()}
                    </View>
                    {/* ****************** Start of RIGHT SIDE ****************** */}
                    <View style={[styles.rowRight, { height: height }]}>
                        {(props.rightData ?? []).map((item: BottomBarItem, index) => _renderSideItem(item, index))}
                    </View>

                    {/* ****************** End of RIGHT SIDE ****************** */}

                </View>



            </View>
        </View>
    );
}

BottomBarComponent.defaultProps = defaultProps;
export default BottomBarComponent;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        // shadowColor: "#ac3232",
        // shadowOffset: {
        //     width: 0,
        //     height: -12,
        // },
        // shadowOpacity: 0.58,
        // shadowRadius: 16.00,

        // elevation: 24,
    },
    main: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: 'red',
        borderTopWidth: 0,
    },
    rowLeft: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnCircle: {
        bottom: 30,
    },
});