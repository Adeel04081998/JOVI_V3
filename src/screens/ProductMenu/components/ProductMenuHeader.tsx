import * as React from "react";
import { Alert, Animated, StyleSheet, StatusBar, ScrollView } from "react-native";
import Image from "../../../components/atoms/Image";
import ImageBackground from "../../../components/atoms/ImageBackground";
import Text from "../../../components/atoms/Text";
import TouchableScale from "../../../components/atoms/TouchableScale";
import VectorIcon, { IconTypeProps } from "../../../components/atoms/VectorIcon";
import View from "../../../components/atoms/View";
import CustomHeader from "../../../components/molecules/CustomHeader";
import AppStyles from "../../../res/AppStyles";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";
import SafeAreaView from '../../../components/atoms/SafeAreaView';

// #region :: INTERFACE START's FROM HERE 
type Props = React.ComponentProps<typeof Animated.View> & {
    children?: any;
    colors: typeof initColors;
};

const defaultProps = {

};
const WINDOW_WIDTH = constants.window_dimensions.width;
const WINDOW_HEIGHT = constants.window_dimensions.height;
// #endregion :: INTERFACE END's FROM HERE 

const ProductMenuHeader = (props: Props) => {
    const colors = props.colors;
    const styles = stylesFunc(colors);
    const recentOrderStyles = recentOrderStylesFunc(colors);

    // #region :: RENDER BOTTOM DETAIL START's FROM HERE 
    const _renderBottomDetail = (text: string, value: string, iconName: string, iconType: IconTypeProps = "Ionicons") => {
        return (
            <View style={styles.bottomDetailPrimaryContainer}>
                <VectorIcon name={iconName} type={iconType} color={colors.primary} style={styles.bottomDetailIcon} />
                <Text fontFamily="PoppinsMedium" style={styles.bottomDetailText}>{`${`${text}`.replace(':', '')}: `}</Text>
                <Text style={styles.bottomDetailValue}>{`${value}`}</Text>
            </View>
        )
    };

    // #endregion :: RENDER BOTTOM DETAIL END's FROM HERE 

    return (<View style={{flex:1}}>
        <StatusBar translucent backgroundColor='transparent' />
        <ImageBackground
            source={{ uri: `https://media.istockphoto.com/photos/selection-of-american-food-picture-id931308812?k=20&m=931308812&s=612x612&w=0&h=Tudia4RSCvfpWZhli0ehScrzeCtbwvTqB9BZaCta_qA=` }}
            style={{ ...styles.image }}

            tapToOpen={false}>
            <CustomHeader containerStyle={styles.headerContainer}
                hideFinalDestination
                leftIconName="chevron-back"
                leftContainerStyle={styles.headerIcon}
                rightContainerStyle={styles.headerIcon}
                leftIconColor={colors.primary}
                rightIconColor={colors.primary}

            />

        </ImageBackground>

        <View style={styles.detailPrimaryContainer}>

            <View style={styles.detailNamePrimaryContainer}>
                <Text fontFamily="PoppinsBold"
                    style={styles.detailHeading} numberOfLines={1}>{`Savour Foods - Blue Area`.repeat(1)}</Text>

                <View style={styles.detailNameRightContainer}>
                    <TouchableScale
                        onPress={() => { Alert.alert('heartPress') }}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 0 }}>
                        <VectorIcon name="heart-o" type="FontAwesome" color="#272727" style={styles.heartIcon} />
                    </TouchableScale>

                    <TouchableScale
                        onPress={() => { Alert.alert('share Press') }}
                        hitSlop={{ top: 20, bottom: 20, left: 0, right: 20 }}>
                        <VectorIcon name="forward" type="Entypo" color="#272727" />
                    </TouchableScale>
                </View>
            </View>

            <Text style={styles.detailTypeText}>{`Pakistani • Fast Food`}</Text>

            <View style={{ marginVertical: 12, }} />

            {_renderBottomDetail("Distance", "375m", "location-pin", "Entypo")}

            {_renderBottomDetail("Time", "10 AM - 8 PM", "clock-time-four-outline", "MaterialCommunityIcons")}

        </View>

        <Text fontFamily="PoppinsMedium" style={recentOrderStyles.heading}>{`Recent orders`}</Text>

        <ScrollView
            horizontal
            style={recentOrderStyles.scrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {new Array(10).fill({}).map((item, index) => {
                return (
                    <View key={index} style={{
                        ...recentOrderStyles.primaryContainer,
                        marginLeft: index === 0 ? 10 : 2,
                    }}>
                        <Text fontFamily="PoppinsMedium" style={recentOrderStyles.title}>{`Beef Patty Burger`}</Text>
                        <Text style={recentOrderStyles.description}>{`2 More Products`}</Text>

                        <View style={recentOrderStyles.priceReorderContainer}>
                            <Text fontFamily="PoppinsMedium" style={recentOrderStyles.price}>{`Rs. 750`}</Text>

                            <TouchableScale style={recentOrderStyles.reorderContainer}>
                                <Text style={recentOrderStyles.reorderText}>{`Reorder`}</Text>
                            </TouchableScale>
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    </View>
    );
}

ProductMenuHeader.defaultProps = defaultProps;
export default ProductMenuHeader;


// #region :: STYLES START's FROM HERE 
const recentOrderStylesFunc = (colors: typeof initColors) => StyleSheet.create({
    heading: {
        color: "#1D1D1D",
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    reorderText: {
        color: colors.primary,
        fontSize: 12,
    },
    reorderContainer: {
        borderWidth: 1,
        borderColor: colors.primary,
        // paddingHorizontal: 10,
        // paddingVertical: 4,
        height: 25,
        width: 70,
        borderRadius: 25,
        marginLeft: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    price: {
        color: colors.primary,
        fontSize: 12,
    },
    priceReorderContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    description: {
        color: "#C1C1C1",
        fontSize: 10,
    },
    title: {
        color: "#272727",
        fontSize: 14,
    },
    primaryContainer: {
        padding: 10,
        backgroundColor: colors.white,
        marginBottom: 10,
        marginRight: 10,
        marginTop: 2,
        ...AppStyles.shadow,
        ...AppStyles.borderRadius,
    },
    scrollView: {
        flexGrow: 0,
        flex: 0,
    },

});//end of recentOrderStylesFunc


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
        maxWidth: WINDOW_WIDTH * 0.8,
    },
    detailPrimaryContainer: {
        backgroundColor: colors.white,
        marginTop: -(WINDOW_HEIGHT * 0.15),
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
        height: WINDOW_HEIGHT * 0.35,
    },
    headerContainer: {
        backgroundColor: "transparent",
        borderBottomWidth: 0,
    },
});//end of stylesFunc



     // #endregion :: STYLES END's FROM HERE 