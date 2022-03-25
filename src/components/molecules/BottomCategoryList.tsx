import * as React from "react";
import { Animated, ColorValue, Easing, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Circle, Color, Path, SvgXml } from "react-native-svg";
import { makeArrayRepeated, sharedOnCategoryPress, splitArray, VALIDATION_CHECK } from "../../helpers/SharedActions";
import NavigationService from "../../navigations/NavigationService";
import ROUTES from "../../navigations/ROUTES";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import { PITSTOP_TYPES } from "../../utils/GV";
import Text from "../atoms/Text";
import TouchableScale from "../atoms/TouchableScale";
import View from "../atoms/View";
import BottomCategoryListStaticData from "./BottomCategoryListStaticData";
import FlatListCarousel from "./FlatListCarousel";
import ImageCarousel from "./ImageCarousel";

const data = makeArrayRepeated(BottomCategoryListStaticData, 1);

const WINDOW_WIDTH = constants.window_dimensions.width;
const WINDOW_HEIGHT = constants.window_dimensions.height;

interface Props {
    isShown?: boolean;
    onClose?: () => void;
};

const defaultProps = {
    isShown: false,
    onClose: undefined,
};

const CIRCLE_SIZE = 70;
const width = WINDOW_WIDTH * 0.95;

const BottomCategoryList = (props: Props) => {
    // #region :: COLOR's & STLES's START's FROM HERE 
    const colors = initColors;
    const styles = stylesFunc(colors);

    // #endregion :: COLOR's & STLES's END's FROM HERE 

    // #region :: STATE & REF's START's FROM HERE 
    const animate = React.useRef(new Animated.Value(0)).current;
    const [state, setState] = React.useState({
        circleShown: false
    })

    // #endregion :: STATE & REF's END's FROM HERE 

    React.useEffect(() => {
        if (props.isShown) {
            setState(pre => ({ ...pre, circleShown: true }));
            Animated.timing(animate, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        } else {
            Animated.timing(animate, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if (finished) {
                    setState(pre => ({ ...pre, circleShown: false }));
                }
            });
        }

    }, [props.isShown])

    const onRequestClose = () => {
        props.onClose && props.onClose();
    }

    if (!props.isShown && !state.circleShown) return null;
    return (
        <Animated.View style={[styles.primaryContainer, {
            opacity: animate,
            transform: [{
                translateY: animate.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0]
                })
            }]
        }]}>

            <View style={styles.bodyContainer}>
                <Text style={styles.heading}>{`Categories`}</Text>

                <FlatListCarousel
                    contentContainerStyle={{ paddingVertical: 2, }}
                    colors={colors}
                    width={WINDOW_WIDTH}
                    data={splitArray(data, 16,)}
                    renderItem={({ item, index }) => {
                        return (
                            <RenderCardSingleRow itemData={item} onPress={(item, index) => {
                                onRequestClose();
                                NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name, {
                                    pitstopType: PITSTOP_TYPES.SUPER_MARKET, categoryItem: {
                                        item, index
                                    }
                                })
                            }} />
                        )
                    }} />
            </View>


            {/* ****************** Start of CRICLE ****************** */}
            <Svg height={`${CIRCLE_SIZE}`} width={`${CIRCLE_SIZE}`} style={{ marginBottom: 0, }}>
                <Circle cx={`${CIRCLE_SIZE / 2}`} cy={`${CIRCLE_SIZE / 2}`} r={`${CIRCLE_SIZE / 2}`} fill="#fff" />
            </Svg>

            {/* ****************** End of CRICLE ****************** */}


        </Animated.View>
    );
}

BottomCategoryList.defaultProps = defaultProps;
export default BottomCategoryList;

// #region :: RENDER SINGLE ROW OF ITEM START's FROM HERE 
const RenderCardSingleRow = ({ itemData = [], onPress = (item: any, index: number) => { } }) => {

    return (
        <View>
            {splitArray(itemData, 4).map((item, index) => {
                return (
                    <View key={index} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginHorizontal: constants.spacing_horizontal,
                        paddingLeft: 1,
                        paddingBottom: 4,
                        paddingTop: 4,
                        width: WINDOW_WIDTH - 50,
                    }}>
                        {item.map((subItem: any, subIndex: number) => {
                            return (
                                <CardItemUI text={subItem.tag} svgXml={subItem.tagImage} key={subIndex} isLastIndex={(item.length - 1) === subIndex}
                                    onPress={() => {
                                        onPress && onPress(subItem, subIndex);
                                    }} />
                            )
                        })}
                    </View>
                )
            })}
        </View>

    )
}

// #endregion :: RENDER SINGLE ROW OF ITEM END's FROM HERE 

// #region :: CARD ITEM UI START's FROM HERE 
const CARD_ITEM_SIZE = (WINDOW_WIDTH - 90) / 4;
const CardItemUI = ({ svgXml = '', text = '', isLastIndex = false, onPress = () => { } }) => {
    return (
        <TouchableScale wait={0} style={{
            backgroundColor: '#fff',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,

            elevation: 2,

            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            height: CARD_ITEM_SIZE,
            width: CARD_ITEM_SIZE,
            marginRight: isLastIndex ? 0 : 10,

        }} onPress={() => {
            onPress && onPress();
        }}>
            {VALIDATION_CHECK(svgXml) &&
                <SvgXml height={CARD_ITEM_SIZE * 0.45} width={CARD_ITEM_SIZE * 0.45} xml={svgXml} fill={initColors.primary} />
            }

            {VALIDATION_CHECK(text) &&
                <Text style={{
                    paddingTop: 5,
                    fontSize: 12,
                    textAlign: "center",
                    color: "#272727",
                    paddingHorizontal: 3,
                }} numberOfLines={1}>{`${text}`}</Text>
            }
        </TouchableScale>
    )
}

// #endregion :: CARD ITEM UI END's FROM HERE 

// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors = initColors) => StyleSheet.create({
    heading: {
        fontSize: 16,
        color: "#272727",
        paddingTop: constants.spacing_vertical,
        paddingBottom: constants.spacing_vertical,
        paddingHorizontal: constants.spacing_horizontal,
    },
    bodyContainer: {
        backgroundColor: '#fff',
        width: width,
        borderRadius: 30,
        paddingTop: 5,
        paddingHorizontal: 10,
        marginBottom: -20,
        paddingBottom: 30,
    },
    primaryContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 30,
    },

})

// #endregion :: STYLES END's FROM HERE 