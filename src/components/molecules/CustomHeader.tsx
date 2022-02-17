import * as React from "react";
import { GestureResponderEvent, Platform, StyleProp, StyleSheet, TextStyle, View as RNView, ViewStyle } from "react-native";
import { VALIDATION_CHECK } from "../../helpers/SharedActions";
import NavigationService from "../../navigations/NavigationService";
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
    rightIconSize?: number;
    rightIconColor?: any;
    onRightIconPress?: (event: GestureResponderEvent) => void;
    //RIGHT SIDE PROP's ENDING 

    //CENTER PROP's
    title?: string;
    finalDest?: string,
    onTitlePress?: (event: GestureResponderEvent) => void;
    titleStyle?: StyleProp<TextStyle>;
    hideFinalDestination?:boolean;
    defaultColor:string;
    //CENTER PROP's ENDING
};

const defaultProps = {
    containerStyle: {},

    
    //LEFT SIDE PROP's
    leftCustom: undefined,
    leftDot: false,
    leftDotStyle: {},
    leftDotTextStyle: {},
    leftContainerStyle: {},

    leftIconName: "chevron-back",//"ios-menu",
    leftIconType: 'Ionicons',
    leftIconStyle: {},
    leftIconSize: 25,
    leftIconColor: "#272727",
    onLeftIconPress: ()=>{NavigationService.NavigationActions.common_actions.goBack()},

    //LEFT SIDE PROP's ENDING 


    //RIGHT SIDE PROP's
    rightCustom: undefined,
    rightDot: false,
    rightDotStyle: {},
    rightDotTextStyle: {},
    rightContainerStyle: {},

    rightIconName: "shopping-bag",
    rightIconType: Platform.OS === 'android'? 'FontAwesome5':'FontAwesome',
    rightIconStyle: {},
    rightIconSize: 25,
    rightIconColor: "#272727",
    onRightIconPress: undefined,

    //RIGHT SIDE PROP's ENDING 

    //CENTER PROP's
    title: null,
    onTitlePress: undefined,
    titleStyle: {},
    hideFinalDestination:false,
    defaultColor:"#6D51BB",
    finalDest: ''
    //CENTER PROP's ENDING


};//end of defaultProps

const CustomHeader = (props: Props) => {
    const DEFAULT_COLOR =props.defaultColor;//REDUX.THEME.background;
    const styles = headerStyles(DEFAULT_COLOR);
    const finalDestination = props.finalDest ? props.finalDest : 'Set your location';


    const _renderFinalDestination = () => {
        return props.hideFinalDestination ? <></> : (
            <TouchableOpacity style={{ alignItems: "center" }} activeOpacity={0.5}
                {...props.onTitlePress ? {
                    onPress: (event) => props.onTitlePress && props.onTitlePress(event)
                } : {
                    disabled: true
                }}>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <Text style={styles.deliverToText}
                        fontFamily={"PoppinsLight"}>
                        Deliver to
                    </Text>
                    <VectorIcon name={"chevron-down"} type={"EvilIcons"} />
                </View>
                <Text style={styles.finalDestinationText} numberOfLines={1}>
                    {VALIDATION_CHECK(finalDestination) ? finalDestination : `Set your location`}
                    {/* {"version-2.1"} */}
                </Text>
            </TouchableOpacity>
        )
    };//end of _renderFinalDestination

    const _renderDot = (value: boolean | number = false, styleForParent: StyleProp<ViewStyle> = {}, numberStyleForParent: StyleProp<TextStyle> = {}) => {
        console.log('value ', value);

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
    return (
        <View style={[styles.primaryContainer, props.containerStyle]}>


            {/* ****************** Start of LEFT SIDE ICON ****************** */}
            <View style={styles.sideContainer}>

                {VALIDATION_CHECK(props.leftCustom) ?
                    props.leftCustom
                    : (VALIDATION_CHECK(props.leftIconName) || props.leftDot) &&
                    <TouchableScale style={[styles.iconContainer, props.leftContainerStyle]}
                        {...props.onLeftIconPress ? {
                            onPress: (event) => props.onLeftIconPress && props.onLeftIconPress(event)
                        } : {
                            disabled: true
                        }}>
                        {VALIDATION_CHECK(props.leftIconName) &&
                            <VectorIcon
                                name={props.leftIconName}
                                type={props.leftIconType}
                                color={props.leftIconColor}
                                size={props.leftIconSize} />
                        }
                        {props.leftDot && _renderDot(props.leftDot, props.leftDotStyle, props.leftDotTextStyle)}
                    </TouchableScale>
                }
            </View>

            {/* ****************** End of LEFT SIDE ICON ****************** */}


            {/* ****************** Start of CENTER ****************** */}
            <View style={styles.middleContainer}>
                {VALIDATION_CHECK(props.title) ?
                    <Text numberOfLines={1} style={[styles.title, props.titleStyle]} fontFamily={"PoppinsBold"}>{props.title}</Text> :
                    _renderFinalDestination()
                }
            </View>

            {/* ****************** End of CENTER ****************** */}

            {/* ****************** Start of RIGHT SIDE ICON ****************** */}
            <View style={[styles.sideContainer, {
                alignItems: "flex-end",
            }]}>
                {VALIDATION_CHECK(props.rightCustom) ? props.rightCustom : (VALIDATION_CHECK(props.rightIconName) || props.rightDot) &&
                    <TouchableScale style={[styles.iconContainer, props.rightContainerStyle]}
                        {...props.onRightIconPress ? {
                            onPress: (event) => props.onRightIconPress && props.onRightIconPress(event)
                        } : {
                            disabled: true
                        }}>
                        {VALIDATION_CHECK(props.rightIconName) &&
                            <VectorIcon
                                name={props.rightIconName}
                                type={props.rightIconType}
                                color={props.rightIconColor}
                                size={props.rightIconSize} />
                        }
                        {props.rightDot && _renderDot(props.rightDot, props.rightDotStyle, props.rightDotTextStyle)}
                    </TouchableScale>
                }
            </View>


            {/* ****************** End of RIGHT SIDE ICON ****************** */}


        </View>
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
        fontSize: 7,
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