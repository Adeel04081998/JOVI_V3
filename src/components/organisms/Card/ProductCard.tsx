import * as React from "react";
import { Animated, Dimensions, ImageStyle, StyleProp, StyleSheet, Image as RNImage, ImageSourcePropType } from "react-native";
import Image from "../../atoms/Image";
import TouchableScale from "../../atoms/TouchableScale";
import View from "../../atoms/View";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";
import AppStyles from "../../../res/AppStyles";
import Text from "../../atoms/Text";
import FontFamily from "../../../res/FontFamily";
import { renderPrice, VALIDATION_CHECK } from "../../../helpers/SharedActions";
import ENUMS from "../../../utils/ENUMS";

// #region :: INTERFACE START's FROM HERE 
const WINDOW_WIDTH = Dimensions.get('window').width;

interface ProductCardItem {
    title?: string;
    description?: string;
    price?: string;
    discount?: string | number;
    discountAmount?: string | number;
    image: ImageSourcePropType;
    discountType?: typeof ENUMS.PROMO_VALUE_TYPE,
}

type Props = React.ComponentProps<typeof Animated.View> & {
    children?: any;
    color: typeof initColors,
    cardWidth?: number,
    cardHeight?: number,
    imageStyle?: StyleProp<ImageStyle>,
    containerStyle?: StyleProp<ImageStyle>,

    customItem?: () => React.Component;

    item?: ProductCardItem;
    onItemPress?: (item: ProductCardItem) => void;
};

const defaultProps = {
    cardWidth: WINDOW_WIDTH * 0.8,
    cardHeight: WINDOW_WIDTH * 0.6,
    imageStyle: {},
    containerStyle: {},
    item: { title: '', description: '', price: '', image: constants.DEFAULT_JOVI_IMAGE },
    customItem: undefined,
    onItemPress: undefined,
};
// #endregion :: INTERFACE END's FROM HERE 

const ProductCard = (props: Props) => {
    const propItem: ProductCardItem = props?.item ?? defaultProps.item;
    const colors = props.color;
    const styles = stylesFunc(colors);
    const cardWidth = props.cardWidth ?? defaultProps.cardWidth;
    const cardHeight = props.cardHeight ?? defaultProps.cardHeight;

    return (
        <TouchableScale activeOpacity={0.8}
            style={[{
                minHeight: cardHeight,
                width: cardWidth,
                ...styles.primaryContainer,
            }, props.containerStyle]}
            onPress={() => {
                props.onItemPress && props.onItemPress(propItem);
            }}>

            {VALIDATION_CHECK(props.customItem) ?
                props.customItem && props.customItem()
                :
                <>
                    <Image
                        source={propItem.image}
                        style={[{
                            height: cardHeight * 0.55,
                            width: cardWidth - 20,
                            borderRadius: 10,
                            resizeMode: 'contain',
                        }, props.imageStyle]}
                        tapToOpen={false}
                    />

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ ...styles.title, flex: 1 }} numberOfLines={1}>{`${propItem.title}`}</Text>
                        {/* ****************** Start of DISCOUNT TYPE ****************** */}
                        {parseInt(`${propItem.discountType}`) !== parseInt(`${ENUMS.PROMO_VALUE_TYPE.Empty.value}`) &&
                            <View style={styles.discountTypeContainer}>
                                {(parseInt(`${propItem.discountType}`) === parseInt(`${ENUMS.PROMO_VALUE_TYPE.Percentage.value}`) && (propItem?.discountAmount ?? 0) > 0) && (
                                    <>
                                        <Text style={styles.discountTypeText} numberOfLines={1}>{`${renderPrice({ price: propItem.discountAmount, showZero: true }, '-', '%', /[^\d.]/g)}`}</Text>
                                    </>
                                )

                                }
                            </View>
                        }

                        {/* ****************** End of DISCOUNT TYPE ****************** */}
                    </View>

                    <Text style={{
                        ...styles.description,
                        height: 40,
                    }} numberOfLines={2}>{`${propItem.description}`}</Text>

                    {VALIDATION_CHECK(propItem.price) &&
                        <View style={{ flexDirection: "row", alignItems: "center", }}>

                            {/* ****************** Start of PRICE CHARGE FROM CUSTOMER ****************** */}
                            <Text style={styles.price}>{`${propItem.price}`}</Text>

                            {/* ****************** End of PRICE CHARGE FROM CUSTOMER ****************** */}


                            {/* ****************** Start of DISCOUNT PRICE ****************** */}
                            {((propItem?.discount ?? 0) > 0 && (propItem?.discountAmount ?? 0) > 0) &&
                                <Text style={{
                                    ...styles.discountPrice,
                                    marginLeft: 6,
                                }} numberOfLines={1}>{renderPrice(propItem.discount)}</Text>
                            }

                            {/* ****************** End of DISCOUNT PRICE ****************** */}

                        </View>
                    }

                    {/* <Text style={styles.price}>{`${propItem.price}`}</Text> */}

                </>
            }
        </TouchableScale>
    );
}

ProductCard.defaultProps = defaultProps;
export default React.memo(ProductCard);

// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    discountPrice: {
        color: "#C1C1C1",
        fontSize: 12,
        textDecorationLine: "line-through",
        textDecorationColor: '#C1C1C1',
        textAlign: "center",
    },
    discountTypeText: {
        color: colors.primary,
        fontSize: 10,
    },
    discountTypeIcon: { marginRight: 4, },
    discountTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        // marginTop: -6,
        marginLeft: 10,
        marginRight: 10,
    },

    price: {
        color: colors.primary,
        fontSize: 15,
        fontFamily: FontFamily.Poppins.Medium,
    },
    description: {
        color: "#212121",
        opacity: 0.6,
        fontSize: 12,
        fontFamily: FontFamily.Poppins.Regular,
    },
    title: {
        color: "#212121",
        fontSize: 14,
        marginTop: 8,
        fontFamily: FontFamily.Poppins.Medium,
    },
    primaryContainer: {
        padding: 10,
        backgroundColor: colors?.white ?? "#fff",
        ...AppStyles.shadow,
        ...AppStyles.borderRadius,
    },

});//end of stylesFunc

// #endregion :: STYLES END's FROM HERE 