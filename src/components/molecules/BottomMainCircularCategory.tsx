import * as React from "react";
import { Animated, Appearance, ColorValue, Easing, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { sharedOnCategoryPress } from "../../helpers/SharedActions";
import ROUTES from "../../navigations/ROUTES";
import AppStyles from "../../res/AppStyles";
import constants from "../../res/constants";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import GV, { PITSTOP_TYPES_INVERTED } from "../../utils/GV";
import AnimatedCircle from "../atoms/AnimatedCircle";
import TouchableScale from "../atoms/TouchableScale";
import View from "../atoms/View";

type Props = React.ComponentProps<typeof AnimatedCircle> & {
    onClose?: () => void;
    isShown: boolean;
    screenName: string;
    pitstopType: string | number;
};

const defaultProps = {
    onClose: undefined,
    isShown: false
};

const WINDOW_WIDTH = constants.window_dimensions.width;
const WINDOW_HEIGHT = constants.window_dimensions.height;
const ITEM_CARD_SIZE = WINDOW_WIDTH * 0.13;
const POSITIONING = {
    top: {
        left: {
            bottom: WINDOW_WIDTH * 0.3,
            left: WINDOW_WIDTH * 0.36,
        },
        right: {
            bottom: WINDOW_WIDTH * 0.3,
            right: WINDOW_WIDTH * 0.36,
        }
    },
    bottom: {
        left: {
            bottom: WINDOW_WIDTH * 0.2,
            left: WINDOW_WIDTH * 0.25,
        }, right: {
            bottom: WINDOW_WIDTH * 0.2,
            right: WINDOW_WIDTH * 0.25,
        }
    }
}

const BottomMainCircularCategory = (props: Props) => {
    //@ts-ignore
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[props.pitstopType]], Appearance.getColorScheme() === "dark");

    // #region :: SHOW & HIDE HANDLING START's FROM HERE 

    const animate = React.useRef(new Animated.Value(0)).current;
    const [state, setState] = React.useState({
        circleShown: false
    })
    React.useEffect(() => {
        if (props.isShown) {
            setState(pre => ({ ...pre, circleShown: true }));
            Animated.timing(animate, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        } else {
            Animated.timing(animate, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if (finished) {
                    setState(pre => ({ ...pre, circleShown: false }));
                }
            });
        }

    }, [props.isShown])

    // #endregion :: SHOW & HIDE HANDLING END's FROM HERE 

    // #region :: STYLING FOR CARD ITEM START's FROM HERE 
    const cardItemSize = (position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | number = "bottomRight", useIndex: boolean = false) => {
        let basicStyle: StyleProp<ViewStyle> = {
            height: ITEM_CARD_SIZE,
            width: ITEM_CARD_SIZE,
            borderRadius: ITEM_CARD_SIZE,
            position: "absolute",
        };
        if (useIndex) {
            if (position === 0) {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.bottom.left,
                };
            } else if (position === 1) {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.top.left,
                };
            } else if (position === 2) {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.top.right,
                };
            } else {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.bottom.right,
                };
            }
        } else {
            if (position === "topLeft") {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.top.left,
                };
            } else if (position === "topRight") {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.top.right,
                };
            } else if (position === "bottomLeft") {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.bottom.left,
                };
            } else {
                basicStyle = {
                    ...basicStyle,
                    ...POSITIONING.bottom.right,
                };
            }
        }

        return basicStyle;
    }

    // #endregion :: STYLING FOR CARD ITEM END's FROM HERE 

    const onRequestClose = () => {
        props.onClose && props.onClose();
    }

    if (!props.isShown && !state.circleShown) return null;
    return (
        <Animated.View style={{
            ...styles.primaryContainer,
            opacity: animate,
            transform: [{
                translateY: animate.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0]
                })
            }]
        }}>

            {ENUMS.PITSTOP_TYPES.filter(x => x.isActive).map((item: any, index: number) => {

                const isDisabled = props.screenName === ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name && props.pitstopType === item.value;
                return (
                    <TouchableScale
                        wait={0}
                        style={{
                            ...isDisabled && {
                                borderColor: colors.primary,
                                borderWidth: 2,
                            },
                            ...styles.cardPrimaryContainer,
                            ...cardItemSize(index, true),
                        }}
                        disabled={isDisabled}
                        key={index}
                        onPress={() => {
                            onRequestClose();
                            sharedOnCategoryPress(item, index, true)
                        }}>
                        <SvgXml xml={item.icon} height={"70%"} width={"70%"} />
                    </TouchableScale>
                )
            })}

        </Animated.View>
    );
}

BottomMainCircularCategory.defaultProps = defaultProps;
export default BottomMainCircularCategory;

const styles = StyleSheet.create({
    cardPrimaryContainer: {
        ...AppStyles.shadow,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
    },
    primaryContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: `rgba(0,0,0,0.4)`,
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 30,
    },

});