import React from 'react';
import { GestureResponderEvent, ImageSourcePropType, ImageBackground as RNImageBackground, ImageURISource, StyleSheet, StyleProp, ViewStyle, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../assets/svgs';
import ImageBackground from '../../../components/atoms/ImageBackground';
import Text from '../../../components/atoms/Text';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import TouchableScale from '../../../components/atoms/TouchableScale';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import { renderFile, renderPrice, uniqueKeyExtractor, VALIDATION_CHECK } from '../../../helpers/SharedActions';
import AppStyles from '../../../res/AppStyles';
import { initColors } from '../../../res/colors';
import FontFamily from '../../../res/FontFamily';
import ENUMS from '../../../utils/ENUMS';
import ProductQuantityCard from './ProductQuantityCard';

// #region :: INTERFACE START's FROM HERE 
interface ProductMenuItemCardItem {
    /** PITSTOP ITEM ID  */
    pitstopItemID: number | string,
    marketID: number | string,
    image: ImageSourcePropType,
    isOutOfStock: boolean,
    quantity: number,
    /** Actual Price before discount  */
    price: number,
    /** Main price OR Bold Price  */
    discountedPrice?: any,
    name: string,
    discountType?: any,
    /** PERCENTAGE OF DISCOUNT  */
    discountAmount?: any,
}
interface Props {
    index: number;
    itemImageSize: number;
    colors: typeof initColors;
    item: ProductMenuItemCardItem,
    updateQuantity?: (quantity: number) => void;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;

    disabled?: boolean;

    seeAll?: boolean;
    additionalCount?: number;
    itemContainerStyle?: StyleProp<ViewStyle>;
}

const defaultProps = {
    itemContainerStyle: {},
    updateQuantity: undefined,
    onPress: undefined,
    disabled: false,
    seeAll: false,
    additionalCount: 1,
};

// #endregion :: INTERFACE END's FROM HERE 

const ProductMenuItemCard = (props: Props) => {
    const ITEM_IMAGE_SIZE = props.itemImageSize;

    const itemStyles = itemStylesFunc(props.colors, ITEM_IMAGE_SIZE);

    return (
        <TouchableScale wait={0} style={[{
            ...itemStyles.primaryContainer,
        }, props.itemContainerStyle]} key={uniqueKeyExtractor()}
            onPress={(event) => {
                props.onPress && props.onPress(event);
            }}
            disabled={props.disabled || !VALIDATION_CHECK(props.onPress)}>
            {props.seeAll ?
                <>
                    {(VALIDATION_CHECK(props.additionalCount) && parseInt(`${props.additionalCount}`) > 0) &&
                        <>
                            <View style={{
                                ...itemStyles.image,
                                borderColor: props.colors.primary,
                                borderWidth: 1,
                                elevation: 0,
                                shadowOpacity: 0,
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Text fontFamily='PoppinsSemiBold' style={{
                                    color: props.colors.primary,
                                    fontSize: 24,
                                    textAlign: "center",
                                }}>{`${props.additionalCount}`}</Text>

                                <Text style={{
                                    color: "#272727",
                                    fontSize: 12,
                                    textAlign: "center",
                                }}>{`Additional products`}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 18, }}>
                                <Text fontFamily='PoppinsBold' style={{
                                    color: props.colors.primary,
                                    fontSize: 14,
                                    textAlign: "center",
                                }}>{`See all`}</Text>
                                <VectorIcon name='chevron-right-circle' type='MaterialCommunityIcons' color={props.colors.primary} style={{ marginLeft: 6, marginTop: -4, }} />
                            </View>
                        </>
                    }
                </>
                :
                <>
                    {/* ****************** Start of IMAGE & QUANTITY ****************** */}
                    <View style={itemStyles.imageContainer}>
                        <ImageBackground
                            source={props.item.image}
                            style={itemStyles.image}
                            borderRadius={8}
                            tapToOpen={false}
                        >
                            {props.item.isOutOfStock &&
                                <View style={{
                                    ...StyleSheet.absoluteFillObject,
                                    backgroundColor: 'black',
                                    opacity: 0.5,
                                    borderRadius: 8,
                                }} />
                            }
                            <ProductQuantityCard
                                marketID={props.item.marketID}
                                pitstopItemID={props.item.pitstopItemID}
                                outOfStock={props.item.isOutOfStock}
                                initialQuantity={props.item.quantity}
                                colors={props.colors}
                                size={ITEM_IMAGE_SIZE}
                                updateQuantity={(quantity) => {
                                    props.updateQuantity && props.updateQuantity(quantity);
                                }}
                            />


                        </ImageBackground>
                    </View>

                    {/* ****************** End of IMAGE & QUANTITY ****************** */}

                    {/* ****************** Start of NAME/TITLE ****************** */}
                    <Text style={itemStyles.name} numberOfLines={2}>{`${props.item.name}`}</Text>

                    {/* ****************** End of NAME/TITLE ****************** */}


                    {/* ****************** Start of MAIN PRICE  ****************** */}
                    <Text fontFamily='PoppinsBold' style={itemStyles.price}>{renderPrice({price:props.item.discountedPrice,showZero:true})}</Text>

                    {/* ****************** End of MAIN PRICE  ****************** */}


                    <View style={{ flexDirection: "row", alignItems: "center", }}>


                        {/* ****************** Start of ACTUAL PRICE BEFORE DISCOUNT ****************** */}
                        {(VALIDATION_CHECK(props.item.price) && parseInt(`${props.item.price}`) > 0 && parseInt(`${props.item.discountType}`) !== parseInt(`${ENUMS.PROMO_VALUE_TYPE.Empty.value}`)) &&
                            <Text style={{
                                ...itemStyles.discountPrice,
                                ...parseInt(`${props.item.discountType}`) !== parseInt(`${ENUMS.PROMO_VALUE_TYPE.Empty.value}`) && {
                                    maxWidth: "50%",
                                }
                            }} numberOfLines={1}>{renderPrice(props.item.price)}</Text>
                        }

                        {/* ****************** End of ACTUAL PRICE BEFORE DISCOUNT ****************** */}



                        {/* ****************** Start of DISCOUNT TYPE ****************** */}
                        {parseInt(`${props.item.discountType}`) !== parseInt(`${ENUMS.PROMO_VALUE_TYPE.Empty.value}`) &&
                            <View style={itemStyles.discountTypeContainer}>
                                {parseInt(`${props.item.discountType}`) === parseInt(`${ENUMS.PROMO_VALUE_TYPE.Percentage.value}`) && (
                                    <>
                                        <SvgXml xml={svgs.discount(props.colors.primary)} height={15} width={15} style={itemStyles.discountTypeIcon} />
                                        <Text style={itemStyles.discountTypeText} numberOfLines={1}>{`${renderPrice(props.item.discountAmount, '-', '%', /[^\d.]/g)}`}</Text>
                                    </>
                                )

                                }
                            </View>
                        }

                        {/* ****************** End of DISCOUNT TYPE ****************** */}

                    </View>


                </>
            }

        </TouchableScale>
    )
};//end of ProductMenuItemCard

ProductMenuItemCard.defaultProps = defaultProps;
export default ProductMenuItemCard; // React.memo(ProductMenuItemCard, (n, p) => n === p);


export const itemStylesFunc = (colors: typeof initColors, ITEM_IMAGE_SIZE: number) => StyleSheet.create({
    discountTypeText: {
        color: colors.primary,
        fontSize: 10,
        maxWidth: "90%",
    },
    discountTypeText1: {
        color: colors.primary,
        fontSize: 10,
    },
    discountTypeIcon: { marginRight: 4, },
    discountTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        // marginTop: -6,
        marginLeft: 10,
    },
    name: {
        color: "#6B6B6B",
        fontSize: 9,
        paddingTop: 4,
        paddingBottom: 4,
        maxWidth: ITEM_IMAGE_SIZE - 20,
    },
    discountPrice: {
        color: "#C1C1C1",
        fontSize: 12,
        maxWidth: "100%",
        textDecorationLine: "line-through",
        textDecorationColor: '#C1C1C1',
        textAlign: "center",
    },
    price: {
        color: "#272727",
        fontSize: 14,
        maxWidth: ITEM_IMAGE_SIZE - 20,
    },
    priceDiscountContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: ITEM_IMAGE_SIZE,
        marginTop: 6,
    },
    quantityIconContainer: {
        position: 'absolute',
        bottom: 6,
        right: 8,

        borderRadius: ITEM_IMAGE_SIZE * 0.25,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: colors.white,
        ...AppStyles.shadow,
    },
    image: {
        width: ITEM_IMAGE_SIZE,
        height: ITEM_IMAGE_SIZE,
        borderWidth: 0,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.20,
        // shadowRadius: 1.41,

        // elevation: 2,
        backgroundColor: colors.white,
    },
    imageContainer: {
        width: ITEM_IMAGE_SIZE,
        height: ITEM_IMAGE_SIZE,
    },
    primaryContainer: {
        marginRight: 10,
        marginTop: 2,
    },
    titleViewmoreText: {
        color: colors.primary,
        fontSize: 12,
    },
    titlePrimaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
        paddingTop: 20,
        paddingHorizontal: 10,
    },


})