import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { number } from 'yargs';
import Text from '../../../components/atoms/Text';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import { _NavgationRef } from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import AppStyles from '../../../res/AppStyles';
import { initColors } from '../../../res/colors';
import constants from '../../../res/constants';
import FontFamily from '../../../res/FontFamily';

// #region :: INTERFACE START's FROM HERE 
interface Props {
    colors: typeof initColors;
    size?: number;
    cardSize?: number;
    textSize?: number;
    updateQuantity?: (quantity: number) => void;
    listener?: (quantity: number) => void;
    initialQuantity?: string | number;
    outOfStock?: boolean;
    outOfStockText?: string;
    pitstopItemID: number | string;
    marketID: number | string;
    screenName: number,
    fromCart: boolean,
}

const defaultProps = {
    size: 30,
    updateQuantity: undefined,
    initialQuantity: 0,
    outOfStock: false,
    outOfStockText: 'Out of stock',
    screenName: 1,
    fromCart: false

};

// #endregion :: INTERFACE END's FROM HERE 

const ProductQuantityCard = (props: Props) => {
    const ITEM_SIZE = props?.size ?? defaultProps.size;
    const CARD_ITEM_SIZE = props?.cardSize ?? ITEM_SIZE;
    const TEXT_ICON_SIZE = props?.textSize ?? ITEM_SIZE;

    // const ITEM_SIZE = props.screenName === 2? constants.window_dimensions.width * 0.35 : props.size;

    const cartReducer = useSelector((store: any) => { return store.cartReducer; });
    const isFocused = useIsFocused();
    const colors = props.colors;
    const styles = stylesFunc(colors, ITEM_SIZE);

    const [state, setState] = React.useState({ quantity: parseInt(`${props?.initialQuantity ?? defaultProps.initialQuantity}`), });
    const delayCbRef = React.useRef<any>(null);
    const skipEffect = React.useRef<boolean>(false);
    const firstPitstop = React.useRef<boolean>(false);
    const userPressed = React.useRef<boolean>(false);

    React.useEffect(() => {
        setState(pre => ({ ...pre, quantity: parseInt(`${props?.initialQuantity ?? defaultProps.initialQuantity}`), }));
        skipEffect.current = true;
    }, [props.initialQuantity])

    React.useEffect(() => {
        if (firstPitstop.current) {
            firstPitstop.current = false;
            console.log("firstPitstop.current");
            props.updateQuantity && props.updateQuantity(1);
            return;
        }
        if (skipEffect.current) {
            skipEffect.current = false;
            return;
        }
        if (delayCbRef.current) {
            clearTimeout(delayCbRef.current);
        }
        delayCbRef.current = setTimeout(() => {
            console.log("setTimeout");
            props.updateQuantity && props.updateQuantity(state.quantity);
        }, 800);

    }, [state.quantity])

    React.useEffect(() => {
        const forceUpdate = cartReducer.pitstops.length < 1 ? true : cartReducer?.forceUpdate ?? false;
        if (((!isFocused && state.quantity > 0) || forceUpdate) && _NavgationRef.current.getCurrentRoute().name === ROUTES.APP_DRAWER_ROUTES.Cart.screen_name) {
            const pitstops = cartReducer.pitstops;
            let updatedQuantity = 0;//state.quantity;

            const currentPitstop = pitstops.find((item: any) => `${item.pitstopID}` === `${props.marketID}`);
            (currentPitstop?.checkOutItemsListVM ?? []).map((item: any) => {
                if (`${item["pitStopItemID"]}` === `${props.pitstopItemID}`) {
                    updatedQuantity = item.quantity;
                }
            });

            if ((!isFocused && updatedQuantity > 0) || updatedQuantity === state.quantity || !currentPitstop) {
                skipEffect.current = true;
            }

            // ref => https://cibak.atlassian.net/browse/JV3-1337
            // if ((updatedQuantity < 1)) {
            //     skipEffect.current = true;
            // }
            console.log("updatedQuantity", updatedQuantity);
            if (!isFocused) {
                setState(pre => ({ ...pre, quantity: updatedQuantity }));
            }
        } else {
            skipEffect.current = false;
        }
    }, [cartReducer]);


    React.useEffect(() => {
        if (!state.quantity && userPressed.current) {
            props.listener && props.listener(state.quantity)
        }
    }, [state.quantity])




    const incrementQuantity = () => {
        userPressed.current = true;
        setState(pre => ({ ...pre, quantity: pre.quantity + 1 }))
        if (cartReducer.pitstops.length < 1) {
            // props.updateQuantity && props.updateQuantity(1);
            firstPitstop.current = true;
        }
    }

    const decrementQuantity = () => {
        userPressed.current = true;
        setState(pre => ({ ...pre, quantity: pre.quantity - 1 }));
    }


    // if(props.fromCart && state.quantity <= 0) return <View style={{
    //     justifyContent:  "center",
    //     paddingHorizontal: 0,
    //     position: 'absolute',
    //     bottom: 6,
    //     right: 8,
    //     alignItems: "center",
    //     flexDirection: "row",
    //     backgroundColor: colors.white,
    // }}><Text>Deleting...</Text></View>;
    // if(props.fromCart && state.quantity <= 0) return null;
    // console.log("state=>", state);

    return (
        <View style={{
            width: state.quantity > 0 || props.outOfStock ? CARD_ITEM_SIZE * 0.88 : defaultProps.size,
            height: state.quantity > 0 || props.outOfStock ? CARD_ITEM_SIZE * 0.25 : defaultProps.size,
            borderRadius: ITEM_SIZE,
            justifyContent: state.quantity > 0 && !props.outOfStock ? "space-between" : "center",
            paddingHorizontal: state.quantity > 0 || props.outOfStock ? 8 : 0,
            ...styles.primaryContainer,
            ...props.outOfStock && {
                left: ITEM_SIZE * 0.1,
                right: ITEM_SIZE * 0.1,
            },

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
                                    <VectorIcon color={colors.primary} name={"delete"} type="MaterialCommunityIcons" size={TEXT_ICON_SIZE} />
                                    :
                                    <VectorIcon color={colors.primary} name="minus" type="Feather" size={TEXT_ICON_SIZE} />
                                }
                            </TouchableOpacity>
                            <Text style={{ ...styles.text, fontSize: TEXT_ICON_SIZE * 0.7 }}>{state.quantity}</Text>
                        </>
                    }
                    <TouchableOpacity wait={0} onPress={incrementQuantity} style={{}}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <VectorIcon color={colors.primary} name="plus" type="Feather" size={TEXT_ICON_SIZE} />
                    </TouchableOpacity>
                </>
            }
        </View>
    )
};//end of ProductQuantityCard

ProductQuantityCard.defaultProps = defaultProps;
export default ProductQuantityCard;//React.memo(ProductQuantityCard, (n, p) => n === p);

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
        fontSize: 10,
        fontFamily: FontFamily.Poppins.Medium,
        color: colors.primary,// "#272727",

    },
})
