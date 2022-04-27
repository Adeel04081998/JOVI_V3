import * as React from "react";
import { GestureResponderEvent, Keyboard, Platform, StyleProp, StyleSheet, TextStyle, View as RNView, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import svgs from "../../assets/svgs";
import { VALIDATION_CHECK } from "../../helpers/SharedActions";
import NavigationService from "../../navigations/NavigationService";
import ROUTES from "../../navigations/ROUTES";
import ReduxActions from "../../redux/actions";
import constants from "../../res/constants";
import AddressesList from "../atoms/FinalDestination/AddressesList";
import Text from "../atoms/Text";
import TouchableOpacity from "../atoms/TouchableOpacity";
import TouchableScale from "../atoms/TouchableScale";
import VectorIcon from "../atoms/VectorIcon";
import View from "../atoms/View";
type Props = React.ComponentProps<typeof RNView> & {
    children?: any;

    containerStyle?: StyleProp<ViewStyle>;


    //LEFT SIDE PROP's
    leftCustom?: React.Component;
    leftDot?: boolean | number;
    leftDotStyle?: StyleProp<ViewStyle>;
    leftDotTextStyle?: StyleProp<TextStyle>;
    leftContainerStyle?: StyleProp<ViewStyle>;
    leftSideContainer?: StyleProp<ViewStyle>;
    leftIconName?: string;
    leftIconType?: 'Ionicons' | 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Fontisto' | 'MaterialCommunityIcons' | 'MaterialIcons' | "Foundation" | "SimpleLineIcons" | 'Zocial' | 'Octicons';
    leftIconStyle?: StyleProp<ViewStyle>;
    leftIconSize?: number;
    leftIconColor?: any;
    onLeftIconPress?: (event: GestureResponderEvent) => void;

    //LEFT SIDE PROP's ENDING 

    //RIGHT SIDE PROP's
    rightCustom?: React.Component;
    rightDot?: boolean | number;
    rightDotStyle?: StyleProp<ViewStyle>;
    rightDotTextStyle?: StyleProp<TextStyle>;
    rightContainerStyle?: StyleProp<ViewStyle>;

    rightIconName?: string;
    rightIconType?: 'Ionicons' | 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Fontisto' | 'MaterialCommunityIcons' | 'MaterialIcons' | "Foundation" | "SimpleLineIcons" | 'Zocial' | 'Octicons';
    rightIconStyle?: StyleProp<ViewStyle>;
    rightSideContainer?: StyleProp<ViewStyle>;
    rightIconSize?: number;
    rightIconColor?: any;
    onRightIconPress?: (event: GestureResponderEvent) => void;
    //RIGHT SIDE PROP's ENDING 

    //CENTER PROP's
    centerCustom?: () => React.ReactNode;
    title?: string;
    finalDest?: string,
    onTitlePress?: (event: GestureResponderEvent) => void;
    titleStyle?: StyleProp<TextStyle>;
    defaultColor: string;
    hideFinalDestination?: boolean;
    renderLeftIconAsDrawer?: boolean;
    renderRightIconForHome?: boolean;
    //CENTER PROP's ENDING

    centerRightCustom?: () => React.ReactNode;
};

const defaultProps = {
    containerStyle: {},


    //LEFT SIDE PROP's
    leftCustom: undefined,
    leftDot: false,
    renderLeftIconAsDrawer: false,
    leftDotStyle: {},
    leftDotTextStyle: {},
    leftContainerStyle: {},

    leftIconName: "chevron-back",//"ios-menu",
    leftIconType: 'Ionicons',
    leftIconStyle: {},
    leftIconSize: 25,
    leftIconColor: null,
    onLeftIconPress: () => { NavigationService.NavigationActions.common_actions.goBack() },

    //LEFT SIDE PROP's ENDING 


    //RIGHT SIDE PROP's
    rightCustom: undefined,
    rightDot: false,
    rightDotStyle: {},
    rightDotTextStyle: {},
    rightContainerStyle: {},

    rightIconName: constants.cart_icon,
    rightIconType: Platform.OS === 'android' ? 'FontAwesome5' : 'FontAwesome',
    rightIconStyle: {},
    rightIconSize: 25,
    rightIconColor: "#272727",
    onRightIconPress: undefined,

    //RIGHT SIDE PROP's ENDING 

    //CENTER PROP's
    centerCustom: null,
    title: null,
    onTitlePress: undefined,
    titleStyle: {},
    hideFinalDestination: false,
    defaultColor: "#6D51BB",
    finalDest: '',
    //CENTER PROP's ENDING

    centerRightCustom: undefined,
};//end of defaultProps

const CustomHeader = (props: Props) => {
    const DEFAULT_COLOR = props.defaultColor;//REDUX.THEME.background;
    const styles = headerStyles(DEFAULT_COLOR);
    const dispatch = useDispatch();
    const cartReducer = useSelector((store: any) => store.cartReducer);
    const userReducer = useSelector((store: any) => store.userReducer);
    const finalDestination = userReducer.finalDestObj ? userReducer.finalDestObj : { title: 'Set your location' };
    const IS_CART_ICON = props.rightIconName === constants.cart_icon;

    // React.useEffect(()=>{

    // },[cartReducer.itemsCount])



    const _renderFinalDestination = () => {
        return props.hideFinalDestination ? <></> : (
            <TouchableOpacity style={{ alignItems: "center" }} activeOpacity={0.5}
                onPress={(event) => {
                    dispatch(ReduxActions.setModalAction({
                        visible: true,
                    }))
                    props.onTitlePress && props.onTitlePress(event);
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <Text style={styles.deliverToText}
                        fontFamily={"PoppinsLight"}>
                        Deliver to
                    </Text>
                    <VectorIcon name={"chevron-down"} type={"EvilIcons"} />
                </View>
                <Text style={styles.finalDestinationText} numberOfLines={1}>
                    {VALIDATION_CHECK(finalDestination.title) ? finalDestination.title : `Set your location`}
                    {/* {"version-2.1"} */}
                </Text>
            </TouchableOpacity>
        )
    };//end of _renderFinalDestination

    const _renderDot = (value: boolean | number = false, styleForParent: StyleProp<ViewStyle> = {}, numberStyleForParent: StyleProp<TextStyle> = {}) => {

        if (typeof value === "number") {
            return (
                <View style={[styles.numberDot, styleForParent,]} >
                    <Text style={[styles.numberDotText, numberStyleForParent]}>{value > 99 ? `99+` : value}</Text>
                </View>
            )
        }
        return (
            <View style={[styles.dot, styleForParent,]} />
        )

    };//end of _renderDot
    const _renderLeftIconForDrawer = () => {
        return <TouchableScale wait={0} onPress={() => {
            NavigationService.NavigationActions.drawer_actions.toggleDrawer();
            Keyboard.dismiss();
        }} style={[styles.iconContainer, props.leftContainerStyle]}>
            <SvgXml xml={svgs.hamburgerMenu()} height={props.leftIconSize} width={props.leftIconSize} />
        </TouchableScale>
    }
    const _renderRightIconForHome = () => {
        return  <TouchableScale wait={0} onPress={() => {
            NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
        }} style={styles.iconContainer}>
            <SvgXml xml={svgs.hamburgerHome(props.defaultColor)} height={props.rightIconSize} width={props.rightIconSize} />
        </TouchableScale>
    }
    return (
        <View style={[styles.primaryContainer, props.containerStyle]}>


            {/* ****************** Start of LEFT SIDE ICON ****************** */}
            <View style={[styles.sideContainer, props.leftSideContainer]}>

                {props.renderLeftIconAsDrawer ? _renderLeftIconForDrawer() : VALIDATION_CHECK(props.leftCustom) ?
                    props.leftCustom
                    : (VALIDATION_CHECK(props.leftIconName) || props.leftDot) &&
                    <TouchableScale wait={0} style={[styles.iconContainer, props.leftContainerStyle]}
                        {...props.onLeftIconPress ? {
                            onPress: (event) => props.onLeftIconPress && props.onLeftIconPress(event)
                        } : {
                            disabled: true
                        }}>
                        {VALIDATION_CHECK(props.leftIconName) &&
                            <VectorIcon
                                name={props.leftIconName}
                                type={props.leftIconType}
                                color={props.leftIconColor || props.defaultColor}
                                size={props.leftIconSize} />
                        }
                        {props.leftDot && _renderDot(props.leftDot, props.leftDotStyle, props.leftDotTextStyle)}
                    </TouchableScale>
                }
            </View>

            {/* ****************** End of LEFT SIDE ICON ****************** */}
            {props.centerRightCustom ? <View style={{ flex: 1, }}>
                {props.centerRightCustom()}
            </View> : <>

                {/* ****************** Start of CENTER ****************** */}
                <View style={styles.middleContainer}>
                    {props.centerCustom ? props.centerCustom() : <>
                        {VALIDATION_CHECK(props.title) ?
                            <Text numberOfLines={1} style={[styles.title, props.titleStyle]} fontFamily={"PoppinsBold"}>{props.title}</Text> :
                            _renderFinalDestination()
                        }
                    </>
                    }
                </View>

                {/* ****************** End of CENTER ****************** */}

                {/* ****************** Start of RIGHT SIDE ICON ****************** */}
                <View style={[styles.sideContainer, {
                    alignItems: "flex-end",
                }, props.rightSideContainer]}>
                    {props.renderRightIconForHome ? _renderRightIconForHome() : VALIDATION_CHECK(props.rightCustom) ? props.rightCustom : (VALIDATION_CHECK(props.rightIconName) || props.rightDot) &&
                        <TouchableScale wait={0} style={[styles.iconContainer, props.rightContainerStyle]}
                            {...props.onRightIconPress ? {
                                onPress: (event) => props.onRightIconPress && props.onRightIconPress(event)
                            } : {
                                onPress: () => {
                                    if (IS_CART_ICON && cartReducer.itemsCount > 0) {
                                        // NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Cart.screen_name)
                                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Cart.screen_name)
                                    }
                                },
                                disabled: (cartReducer.itemsCount > 0 && IS_CART_ICON) ? false : true
                            }}>
                            {VALIDATION_CHECK(props.rightIconName) &&
                                <VectorIcon
                                    name={props.rightIconName}
                                    type={props.rightIconType}
                                    color={props.rightIconColor || props.defaultColor}
                                    size={props.rightIconSize} />
                            }
                            {cartReducer.itemsCount > 0 && IS_CART_ICON && _renderDot(cartReducer.itemsCount, props.rightDotStyle, props.rightDotTextStyle)}
                            {/* {props.rightDot && _renderDot(props.rightDot, props.rightDotStyle, props.rightDotTextStyle)} */}
                        </TouchableScale>
                    }
                </View>


                {/* ****************** End of RIGHT SIDE ICON ****************** */}
            </>}
        </View >
    );
};//end of CUSTOM HEADER

CustomHeader.defaultProps = defaultProps;
export default CustomHeader;

const PADDING_HEIGHT = 10;
const ICON_BORDER = {
    color: "#E5E2F5",
    width: 0.5,
    size: 38,
    borderRadius: 6,
};

const DOT = {
    size: 10,
    color: "#FA3E3E",
};
export const CustomHeaderIconBorder = ICON_BORDER;
export const CustomHeaderStyles = (primaryColor = "#FA3E3E") => headerStyles(primaryColor);
const headerStyles = (primaryColor = "#FA3E3E") => StyleSheet.create({
    primaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: 'wrap',

        backgroundColor: '#FFFFFF',
        borderBottomWidth: 3,
        borderBottomColor: primaryColor,

        paddingTop: PADDING_HEIGHT,
        paddingBottom: PADDING_HEIGHT * 1.5,
    },
    sideContainer: {
        width: "20%",
    },
    middleContainer: {
        width: "60%",
        alignItems: "center",
    },
    iconContainer: {
        height: ICON_BORDER.size,
        width: ICON_BORDER.size,

        borderColor: ICON_BORDER.color,
        borderWidth: ICON_BORDER.width,
        borderRadius: ICON_BORDER.borderRadius,

        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 8,
    },
    dot: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: DOT.color,
        width: DOT.size,
        height: DOT.size,
        borderRadius: DOT.size,
    },
    numberDot: {
        position: 'absolute',

        // bottom: 0,
        // left: 0,
        top: -5,
        right: -5,
        backgroundColor: DOT.color,
        width: DOT.size * 2,
        height: DOT.size * 2,

        borderRadius: DOT.size * 2,
        alignItems: "center",
        justifyContent: "center",
    },
    numberDotText: {
        fontSize: 10,
        color: "#fff",
        paddingTop: (DOT.size * 2) / 6
    },
    deliverToText: {
        color: "#272727",
        fontSize: 14,
    },
    finalDestinationText: {
        color: primaryColor,
        fontSize: 14,
        marginTop: Platform.OS === "ios" ? -4 : -8,
    },
    title: {
        color: primaryColor,
        fontSize: 18,
    },

})