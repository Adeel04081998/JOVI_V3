import * as React from "react";
import { Animated, ImageSourcePropType,TouchableOpacity, LayoutChangeEvent, StyleSheet } from "react-native";
import Image from "../../../components/atoms/Image";
import ImageBackground from "../../../components/atoms/ImageBackground";
import Text from "../../../components/atoms/Text";
import { IconTypeProps } from "../../../components/atoms/VectorIcon";
import View from "../../../components/atoms/View";
import CustomHeader from "../../../components/molecules/CustomHeader";
import NavigationService from "../../../navigations/NavigationService";
import AppStyles from "../../../res/AppStyles";
import { initColors } from '../../../res/colors';
import SafeAreaView from '../../../components/atoms/SafeAreaView';
import constants from "../../../res/constants";
import sharedStyles from "../../../res/sharedStyles";
import ENUMS from "../../../utils/ENUMS";

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
    onPressParent:any;

};
type ContainerProps = React.ComponentProps<typeof Animated.View> & {
    children?: any;
    colors: typeof initColors;

    animScroll?: any;
    headerHeight?: any;
    setHeaderHeight?: any;
    headerTop?: any;
};

const defaultProps = {
    onLayout: undefined,
    item: ProductMenuHeaderItemDefaultValue,
    onPressParent:()=>{},

    hideHeader: false,
};

const WINDOW_WIDTH = constants.window_dimensions.width;
const WINDOW_HEIGHT = constants.window_dimensions.height;
// #endregion :: INTERFACE END's FROM HERE 

const PharmacyHeader = (props: Props) => {
    const propItem: ProductMenuHeaderItem = props?.item ?? defaultProps.item;

    const colors = props.colors;
    const styles = stylesFunc(colors);
    const [state,setState] = React.useState({
        selectedType:ENUMS.PharmacyPitstopType[0]
    });
    // #region :: RENDER BOTTOM DETAIL START's FROM HERE 

    // #endregion :: RENDER BOTTOM DETAIL END's FROM HERE 
    return (
        <View style={{ zIndex: 9999 }}
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

            <View style={[styles.detailPrimaryContainer, { position: 'relative', overflow: 'hidden', zIndex: 9999 }]}>
                <Image source={require('../../../assets/images/Wave_Lines.png')} style={{ position: 'absolute', height: 130, opacity: 0.2, width: '100%', }} width={'130%'} resizeMode={'stretch'} tapToOpen={false} />
                <View style={{ ...styles.detailNamePrimaryContainer, marginTop: 14, marginHorizontal: 14 }}>
                    <Text fontFamily="PoppinsBold"
                        style={styles.detailHeading} numberOfLines={1}>Pharmacy</Text>
                </View>
                <View style={{ width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {
                        ENUMS.PharmacyPitstopType.map((item,i)=>{
                            return <TouchableOpacity key={i} onPress={()=>{
                                setState(pre=>({...pre,selectedType:item}))
                                if(props.onPressParent){
                                    props.onPressParent(item)
                                }
                            }} style={{ height: 50, width: '45%', backgroundColor:item.value === state.selectedType.value? colors.primary:colors.white, borderRadius: 12, ...sharedStyles._styles(colors).placefor_specific_shadow, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, color:item.value === state.selectedType.value? colors.white:colors.primary }} fontFamily={'PoppinsLight'}>{item.text}</Text>
                        </TouchableOpacity>
                        })
                    }
                    {/* <TouchableOpacity style={{ height: 50, width: '45%', backgroundColor: colors.primary, borderRadius: 12, ...sharedStyles._styles(colors).placefor_specific_shadow, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: colors.white }} fontFamily={'PoppinsLight'}>Prescribed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: '45%', backgroundColor: colors.white, borderRadius: 12, ...sharedStyles._styles(colors).placefor_specific_shadow, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: colors.primary }} fontFamily={'PoppinsLight'}>OTC</Text>
                    </TouchableOpacity> */}
                </View>
            </View>

            {/* ****************** End of DETAIL CARD ****************** */}

        </View>
    );
}

PharmacyHeader.defaultProps = defaultProps;

export const PharmacyHeaderContainer = (props: ContainerProps) => {
    return (
        <SafeAreaView>
            <Animated.View style={{
                // ...StyleSheet.absoluteFill,
                zIndex: 999,
                position: 'absolute',
                backgroundColor: props.colors.screen_background,
                transform: [{
                    translateY: props.headerTop
                }],
            }}>
                {/* RECENT ORDER IS ALSO IN PRODUCT MENU HEADER */}
                <PharmacyHeader colors={props.colors}
                    onLayout={(e) => {
                        props.setHeaderHeight(e.nativeEvent.layout.height);
                    }}
                    hideHeader
                    item={{
                        image: require('../../../assets/images/pharmacyHeaderImage.jpg'),
                        title: 'Pharmacy',
                    }}
                />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', top: 0, zIndex: 9999, }}>
                <CustomHeader
                    hideFinalDestination
                    title={'Pharmacy'}
                    titleStyle={{
                        color: props.colors.primary,
                        opacity: props.animScroll.interpolate({
                            inputRange: [0, props.headerHeight],
                            outputRange: [0, 1]
                        }),
                    }}
                    leftIconName="chevron-back"
                    leftContainerStyle={{
                        backgroundColor: props.colors.white,
                    }}
                    rightContainerStyle={{
                        backgroundColor: props.colors.white,
                    }}
                    leftIconColor={props.colors.primary}
                    rightIconColor={props.colors.primary}
                    onLeftIconPress={()=>{
                        NavigationService.NavigationActions.common_actions.goBack();
                    }}
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderBottomWidth: 0,
                    }}
                />
            </Animated.View>
            {/* ****************** Start of UPPER HEADER TILL RECENT ORDER ****************** */}

        </SafeAreaView>
    );
}
export default PharmacyHeader;


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