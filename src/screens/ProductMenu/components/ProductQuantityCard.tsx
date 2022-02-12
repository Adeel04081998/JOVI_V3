import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../../../components/atoms/Text';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import AppStyles from '../../../res/AppStyles';
import { initColors } from '../../../res/colors';

// #region :: INTERFACE START's FROM HERE 
interface Props {
    colors: typeof initColors;
    size?: number;
    updateQuantity?: (quantity: number) => void;
}

const defaultProps = {
    size: 25,
    updateQuantity: undefined,
};

// #endregion :: INTERFACE END's FROM HERE 

const ProductQuantityCard = (props: Props) => {
    const ITEM_SIZE = props?.size ?? defaultProps.size;
    const colors = props.colors;
    const styles = stylesFunc(colors, ITEM_SIZE);

    const [state, setState] = React.useState({ quantity: 0, });
    const delayCbRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (delayCbRef.current) {
            clearTimeout(delayCbRef.current);
        }
        delayCbRef.current = setTimeout(() => {
            props.updateQuantity && props.updateQuantity(state.quantity);
        }, 800);
    }, [state.quantity])

    const incrementQuantity = () => {
        setState(pre => ({ ...pre, quantity: pre.quantity + 1 }));
    }

    const decrementQuantity = () => {
        setState(pre => ({ ...pre, quantity: pre.quantity - 1 }));
    }

    return (
        <View style={{
            width: state.quantity !== 0 ? ITEM_SIZE * 0.8 : ITEM_SIZE * 0.15,
            height: state.quantity !== 0 ? ITEM_SIZE * 0.25 : ITEM_SIZE * 0.15,
            borderRadius: ITEM_SIZE * 0.25,
            justifyContent: state.quantity !== 0 ? "space-between" : "center",
            paddingHorizontal: state.quantity !== 0 ? 8 : 0,
            ...styles.primaryContainer
        }}>
            {(state.quantity !== 0) &&
                <>
                    <TouchableOpacity wait={0} onPress={decrementQuantity}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                        {state.quantity === 1 ?
                            <VectorIcon color={colors.primary} name={"delete"} type="MaterialCommunityIcons" size={19} />
                            :
                            <VectorIcon color={colors.primary} name="minus" type="Feather" />
                        }
                    </TouchableOpacity>
                    <Text>{state.quantity}</Text>
                </>
            }
            <TouchableOpacity wait={0} onPress={incrementQuantity}
                hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                <VectorIcon color={colors.primary} name="plus" type="Feather" />
            </TouchableOpacity>
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

})
