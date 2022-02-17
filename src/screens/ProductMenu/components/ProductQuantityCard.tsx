import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../../../components/atoms/Text';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import AppStyles from '../../../res/AppStyles';
import { initColors } from '../../../res/colors';
import FontFamily from '../../../res/FontFamily';

// #region :: INTERFACE START's FROM HERE 
interface Props {
    colors: typeof initColors;
    size?: number;
    updateQuantity?: (quantity: number) => void;
    initialQuantity?: string | number;
    outOfStock?: boolean;
    outOfStockText?: string;
}

const defaultProps = {
    size: 25,
    updateQuantity: undefined,
    initialQuantity: 0,
    outOfStock: false,
    outOfStockText: 'Out of stock'
};

// #endregion :: INTERFACE END's FROM HERE 

const ProductQuantityCard = (props: Props) => {
    const ITEM_SIZE = props?.size ?? defaultProps.size;


    const colors = props.colors;
    const styles = stylesFunc(colors, ITEM_SIZE);

    const [state, setState] = React.useState({ quantity: parseInt(`${props?.initialQuantity ?? defaultProps.initialQuantity}`), });
    const delayCbRef = React.useRef<any>(null);
    const skipEffect = React.useRef<boolean>(false);

    React.useEffect(() => {
        setState(pre => ({ ...pre, quantity: parseInt(`${props?.initialQuantity ?? defaultProps.initialQuantity}`), }));
        skipEffect.current = true;
    }, [props.initialQuantity])

    React.useEffect(() => {
        if (skipEffect.current) {
            skipEffect.current = false;
            return;
        }
        if (delayCbRef.current) {
            clearTimeout(delayCbRef.current);
        }
        delayCbRef.current = setTimeout(() => {
            props.updateQuantity && props.updateQuantity(state.quantity);
        }, 800);

    }, [state.quantity])



    const incrementQuantity = () => {
        setState(pre => ({ ...pre, quantity: pre.quantity + 1 }))
    }

    const decrementQuantity = () => {
        setState(pre => ({ ...pre, quantity: pre.quantity - 1 }));
    }


    return (
        <View style={{
            width: state.quantity > 0 || props.outOfStock ? ITEM_SIZE * 0.8 : ITEM_SIZE * 0.15,
            height: state.quantity > 0 || props.outOfStock ? ITEM_SIZE * 0.25 : ITEM_SIZE * 0.15,
            borderRadius: ITEM_SIZE * 0.25,
            justifyContent: state.quantity > 0 && !props.outOfStock ? "space-between" : "center",
            paddingHorizontal: state.quantity > 0 || props.outOfStock ? 8 : 0,
            ...styles.primaryContainer
        }}>
            {props.outOfStock ?
                <Text style={styles.text}>{props.outOfStockText}</Text>
                :
                <>
                    {(state.quantity > 0) &&
                        <>
                            <TouchableOpacity wait={0} onPress={decrementQuantity}
                                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                                {state.quantity === 1 ?
                                    <VectorIcon color={colors.primary} name={"delete"} type="MaterialCommunityIcons" size={ITEM_SIZE * 0.15} />
                                    :
                                    <VectorIcon color={colors.primary} name="minus" type="Feather" size={ITEM_SIZE * 0.15} />
                                }
                            </TouchableOpacity>
                            <Text style={styles.text}>{state.quantity}</Text>
                        </>
                    }
                    <TouchableOpacity wait={0} onPress={incrementQuantity}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <VectorIcon color={colors.primary} name="plus" type="Feather" size={ITEM_SIZE * 0.15} />
                    </TouchableOpacity>
                </>
            }
        </View>
    )
};//end of ProductQuantityCard

ProductQuantityCard.defaultProps = defaultProps;
export default React.memo(ProductQuantityCard);

export const stylesFunc = (colors: typeof initColors, ITEM_SIZE: number = defaultProps.size) => StyleSheet.create({

    primaryContainer: {
        position: 'absolute',
        bottom: 6,
        right: 8,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: colors.white,
        ...AppStyles.shadow,
    },
    text: {
        fontSize: 12,
        fontFamily: FontFamily.Poppins.Medium,
        color: "#272727",

    },
})
