import * as React from "react";
import { Appearance, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { renderPrice, sharedGenerateProductItem, VALIDATION_CHECK } from "../../helpers/SharedActions";
import DefaultColors, { initColors } from "../../res/colors";
import { PITSTOP_TYPES } from "../../utils/GV";
import Text from "../atoms/Text";
import View from "../atoms/View";

interface Props {
    colors: typeof initColors;
    title?: string;
    totalPrice?: string | number;
    type?: typeof PITSTOP_TYPES;
    pitstopNumber?: number | string;
    itemData?: [];
    isJoviJob?: boolean;
    showDetail?: boolean;

    containerStyle?: StyleProp<ViewStyle>;
    titleContainerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;

    itemPrimaryContainerStyle?: StyleProp<ViewStyle>;
    itemContainerStyle?: StyleProp<ViewStyle>;
    itemTitleStyle?: StyleProp<TextStyle>;
    /** Price shown to user */
    itemDiscountedPriceStyle?: StyleProp<TextStyle>;
    /** Price with line through or Price before discount */
    itemActualPriceStyle?: StyleProp<TextStyle>;
}

const defaultProps = {
    title: '',
    totalPrice: '',
    type: PITSTOP_TYPES.DEFAULT,
    pitstopNumber: 1,
    isJoviJob: false,
    showDetail: true,
};

const ReceiptItem = (props: Props) => {

    // #region :: DOT COLOR using Pitstoptype START's FROM HERE 
    const defaultColors = Appearance.getColorScheme() === "dark" ? DefaultColors.light_mode : DefaultColors.light_mode;
    const dotColor = () => {
        const pitstopType = props?.type ?? defaultProps.type;
        let dotColor = defaultColors.default;
        if (pitstopType === PITSTOP_TYPES.DEFAULT) dotColor = defaultColors.restaurant
        if (pitstopType === PITSTOP_TYPES.JOVI) dotColor = defaultColors.jovi
        if (pitstopType === PITSTOP_TYPES.RESTAURANT) dotColor = defaultColors.restaurant
        if (pitstopType === PITSTOP_TYPES.SUPER_MARKET) dotColor = defaultColors.jovi_mart
        if (pitstopType === PITSTOP_TYPES.PHARMACY) dotColor = defaultColors.pharamcy
        if (pitstopType === PITSTOP_TYPES.JOVI_MART) dotColor = defaultColors.jovi_mart
        return dotColor.primary;
    }

    // #endregion :: DOT COLOR using Pitstoptype END's FROM HERE 

    // #region :: COLOR & STYLE START's FROM HERE 
    const isJoviJob = props?.isJoviJob ?? defaultProps.isJoviJob;
    const colors = props.colors;
    const styles = stylesFunc(colors, dotColor());
    const itemStyles = itemStylesFunc(colors);

    // #endregion :: COLOR & STYLE END's FROM HERE 

    // #region :: STATE, REF & EFFECT START's FROM HERE 
    const [showDetail, toggleShowDetail] = React.useState(defaultProps.showDetail);
    React.useEffect(() => {
        toggleShowDetail(props?.showDetail ?? !showDetail);
        return () => { };
    }, [props.showDetail])

    // #endregion :: STATE, REF & EFFECT END's FROM HERE 

    // #region :: sub item item getting START's FROM HERE 
    const getItemDetail = (item: any) => {
        const dp = item.price || item.discountedPrice || item.actualPrice;
        const p = item.price || item.actualPrice;
        let name = item.productItemName || item.pitStopItemName;
        let quantity = item.quantity;
        let actualPrice = dp ? p : '';
        let discountedPrice = dp ? dp : p;

        if (isJoviJob) {
            name = item.title;
            quantity = '';
            actualPrice = '';
            discountedPrice = item.estimatePrice;
        }

        return { name, quantity, actualPrice, discountedPrice };
    }

    // #endregion :: sub item item getting END's FROM HERE 

    // #region :: SUB ITEM UI START's FROM HERE 
    const renderSubItem = () => {

        return (
            <View style={[{ marginTop: 0, }, props.itemPrimaryContainerStyle]}>
                {(props?.itemData ?? []).map((item, index) => {
                    
                    const { name, quantity, discountedPrice, actualPrice, } = getItemDetail(item);
                    return (
                        <View key={index} style={[{ ...itemStyles.primaryContainer, paddingTop: index === 0 ? 0 : 4, }, props.itemContainerStyle]}>
                            <Text style={[itemStyles.name, props.itemTitleStyle]}>{sharedGenerateProductItem(name, quantity)}</Text>
                            <Text style={[itemStyles.discountedPrice, props.itemDiscountedPriceStyle]}>{renderPrice({ price: discountedPrice, showZero: true })}</Text>

                            {/* ****************** Start of WHEN DISCOUNT IS ADDED ****************** */}
                            <>
                                {VALIDATION_CHECK(actualPrice) &&
                                    <Text numberOfLines={3} style={[itemStyles.actualPrice, props.itemActualPriceStyle]}>{renderPrice(`${actualPrice}`.trim(), '', '.00')}</Text>
                                }
                            </>

                            {/* ****************** End of WHEN DISCOUNT IS ADDED ****************** */}

                        </View>
                    )
                })}

            </View>
        )
    }

    // #endregion :: SUB ITEM UI END's FROM HERE 

    return (
        <View style={[props.containerStyle]}>

            {/* ****************** Start of TITLE ****************** */}
            <View style={[styles.titlePrimaryContainer, props.titleContainerStyle]}>
                <View style={styles.titleDot} />
                <Text fontFamily="PoppinsMedium" style={[styles.title, props.titleStyle]} numberOfLines={1}>{`Pitstop ${`${props.pitstopNumber}`.padStart(2, '0')} - ${props.title}`}</Text>
                {(!showDetail && VALIDATION_CHECK(props.totalPrice)) && <>
                    <Text style={{ color: "#272727", fontSize: 12, }} fontFamily="PoppinsMedium">{renderPrice({ price: props.totalPrice, showZero: true })}</Text>
                </>}
            </View>

            {/* ****************** End of TITLE ****************** */}

            {showDetail && renderSubItem()}

        </View>
    );
}//end of FUNCTION

ReceiptItem.defaultProps = defaultProps;
export default ReceiptItem;

const itemStylesFunc = (colors: typeof initColors) => StyleSheet.create({
    actualPrice: {
        color: "#A9A9A9",
        fontSize: 12,
        paddingLeft: 6,
        textDecorationLine: "line-through",
        textDecorationColor: "#A9A9A9",
    },
    discountedPrice: {
        color: "#6B6B6B",
        fontSize: 12,
    },
    name: {
        color: "#6B6B6B",
        fontSize: 12,
        flex: 1,
        paddingHorizontal: 20,
    },
    primaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },


});//end of stylesFunc

const stylesFunc = (colors: typeof initColors, dotColor: any) => StyleSheet.create({
    title: {
        color: "#272727",
        fontSize: 12,
        flex: 1,
        paddingRight: 20,
    },
    titleDot: {
        backgroundColor: dotColor,
        height: 10,
        width: 10,
        borderRadius: 10,
        marginRight: 5,
    },
    titlePrimaryContainer: {
        paddingTop: 10,
        paddingBottom: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },


});//end of stylesFunc