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
import { VALIDATION_CHECK } from "../../../helpers/SharedActions";

// #region :: INTERFACE START's FROM HERE 
const WINDOW_WIDTH = Dimensions.get('window').width;

interface ProductCardItem {
    title?: string;
    description?: string;
    price?: string;
    image: ImageSourcePropType;
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
    onItemPress?:(item:ProductCardItem)=>void;
};

const defaultProps = {
    cardWidth: WINDOW_WIDTH * 0.8,
    cardHeight: WINDOW_WIDTH * 0.6,
    imageStyle: {},
    containerStyle: {},
    item: { title: '', description: '', price: '', image: constants.DEFAULT_JOVI_IMAGE },
    customItem: undefined,
    onItemPress:undefined,
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
            onPress={()=>{
                props.onItemPress && props.onItemPress(propItem);
                
                // Alert.alert('hy')
            }}
            >

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

                    <Text style={styles.title} numberOfLines={1}>{`${propItem.title}`}</Text>

                    <Text style={styles.description}>{`${propItem.description}`}</Text>

                    <Text style={styles.price}>{`${propItem.price}`}</Text>

                </>
            }
        </TouchableScale>
    );
}

ProductCard.defaultProps = defaultProps;
export default ProductCard;

// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
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