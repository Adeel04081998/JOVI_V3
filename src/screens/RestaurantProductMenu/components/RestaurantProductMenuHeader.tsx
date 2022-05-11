import * as React from "react";
import { Alert, Animated, ImageSourcePropType, LayoutChangeEvent, ScrollView, StatusBar, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import svgs from "../../../assets/svgs";
import ImageBackground from "../../../components/atoms/ImageBackground";
import Text from "../../../components/atoms/Text";
import TouchableScale from "../../../components/atoms/TouchableScale";
import VectorIcon, { IconTypeProps } from "../../../components/atoms/VectorIcon";
import View from "../../../components/atoms/View";
import CustomHeader from "../../../components/molecules/CustomHeader";
import RecentOrder from "../../../components/organisms/RecentOrder";
import { renderDistance } from "../../../helpers/SharedActions";
import NavigationService from "../../../navigations/NavigationService";
import AppStyles from "../../../res/AppStyles";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";

// #region :: INTERFACE START's FROM HERE 
export interface ProductMenuHeaderItem {
    image: ImageSourcePropType;
    title?: string;
    description?: string;
    distance?: string;
    time?: string;
}

export const ProductMenuHeaderItemDefaultValue = { title: '', description: '', distance: '', time: '', image: constants.DEFAULT_JOVI_IMAGE };
type Props = React.ComponentProps<typeof Animated.View> & {
    children?: any;
    colors: typeof initColors;

    onLayout?: (event: LayoutChangeEvent) => void;
    item?: ProductMenuHeaderItem;

    hideHeader?: boolean;

};

const defaultProps = {
    onLayout: undefined,
    item: ProductMenuHeaderItemDefaultValue,

    hideHeader: false,
};

const WINDOW_WIDTH = constants.window_dimensions.width;
const WINDOW_HEIGHT = constants.window_dimensions.height;
// #endregion :: INTERFACE END's FROM HERE 

const RestaurantProductMenuHeader = (props: Props) => {
    const propItem: ProductMenuHeaderItem = props?.item ?? defaultProps.item;

    const colors = props.colors;
    const styles = stylesFunc(colors);

    // #region :: RENDER BOTTOM DETAIL START's FROM HERE 
    const _renderBottomDetail = (text: string, value: string, iconName: string | { xml: any }, iconType: IconTypeProps = "Ionicons") => {
        if(value){
            return (
                    <View style={styles.bottomDetailPrimaryContainer}>
                        {typeof iconName === "string" ?
                            <VectorIcon name={iconName} type={iconType} color={colors.primary} style={styles.bottomDetailIcon} />
                            :
                            <SvgXml xml={iconName.xml} height={20} width={20} style={{ top: -2, marginRight: 6, }} />
                        }
                        <Text fontFamily="PoppinsMedium" style={styles.bottomDetailText}>{`${`${text}`.replace(':', '')}: `}</Text>
                        <Text style={styles.bottomDetailValue}>{`${value}`}</Text>
                    </View>
                )
        } else return null    
    }; 

    // #endregion :: RENDER BOTTOM DETAIL END's FROM HERE 

    return (
        <View style={{}}
            onLayout={(e) => {
                props.onLayout && props.onLayout(e);
            }}>

            {/* ****************** Start of IMAGE BACKGROUND ****************** */}
            <ImageBackground
                source={propItem.image}
                style={{ ...styles.image }}

                tapToOpen={false}>
                {!(props?.hideHeader ?? defaultProps.hideHeader) &&
                    <CustomHeader containerStyle={styles.headerContainer}
                        hideFinalDestination
                        leftIconName="chevron-back"
                        leftContainerStyle={styles.headerIcon}
                        rightContainerStyle={styles.headerIcon}
                        leftIconColor={colors.primary}
                        rightIconColor={colors.primary}
                        onLeftIconPress={() => { NavigationService.NavigationActions.common_actions.goBack(); }}

                    />
                }

            </ImageBackground>

            {/* ****************** End of IMAGE BACKGROUND ****************** */}


            {/* ****************** Start of DETAIL CARD ****************** */}
            <View style={[styles.detailPrimaryContainer]}>

                <View style={styles.detailNamePrimaryContainer}>
                    <Text fontFamily="PoppinsBold"
                        style={styles.detailHeading} numberOfLines={1}>{propItem.title}</Text>

                    {/* <View style={styles.detailNameRightContainer}>
                        <TouchableScale
                            onPress={() => { console.log("Heart Press");
                             }}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 0 }}>
                            <VectorIcon name="heart-o" type="FontAwesome" color="#272727" style={styles.heartIcon} />
                        </TouchableScale>

                        <TouchableScale
                            onPress={() => { console.log("share Press") }}
                            hitSlop={{ top: 20, bottom: 20, left: 0, right: 20 }}>
                            <VectorIcon name="forward" type="Entypo" color="#272727" />
                        </TouchableScale>
                    </View> */}
                </View>

                <Text style={styles.detailTypeText}>{`${propItem.description}`}</Text>

                <View style={{ marginVertical: 6, }} />

                {_renderBottomDetail("Distance", renderDistance(propItem?.distance ?? defaultProps.item.distance), { xml: svgs.productMenuHeaderLocation(colors.primary) }, "Entypo")}

                {_renderBottomDetail("Time", propItem?.time ?? defaultProps.item.time, "clock-time-four-outline", "MaterialCommunityIcons")}

            </View>


            {/* ****************** End of DETAIL CARD ****************** */}

        </View>
    );
}

RestaurantProductMenuHeader.defaultProps = defaultProps;
export default RestaurantProductMenuHeader;


// #region :: STYLES START's FROM HERE 

const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    bottomDetailValue: {
        color: "#272727",
        fontSize: 12,
    },
    bottomDetailText: {
        color: "#272727",
        fontSize: 12,
        marginRight: 12,
    },
    bottomDetailIcon: { marginRight: 6, },
    bottomDetailPrimaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    detailTypeText: {
        color: "#C1C1C1",
        fontSize: 12,
    },
    heartIcon: { marginRight: 8, },
    detailNameRightContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    detailNamePrimaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    detailHeading: {
        color: "#0D0D0D",
        fontSize: 18,
        maxWidth: WINDOW_WIDTH * 0.65,
    },
    detailPrimaryContainer: {
        backgroundColor: colors.white,
        marginTop: -(WINDOW_HEIGHT * 0.115),
        width: WINDOW_WIDTH * 0.9,
        alignSelf: "center",
        borderRadius: 7,
        ...AppStyles.shadow,
        padding: 14,
    },
    headerIcon: {
        backgroundColor: colors.white,
    },
    image: {
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT * 0.3,
    },
    headerContainer: {
        backgroundColor: "transparent",
        borderBottomWidth: 0,
    },
});//end of stylesFunc



     // #endregion :: STYLES END's FROM HERE 