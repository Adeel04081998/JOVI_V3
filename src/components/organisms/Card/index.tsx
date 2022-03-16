import * as React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppStyles from "../../../res/AppStyles";
import constants from "../../../res/constants";
import View from "../../atoms/View";

// #region :: INTERFACE START's FROM HERE 
interface Props {
    children?: any;
    contentContainerStyle?: StyleProp<ViewStyle>;

};

const defaultProps = {
};
// #endregion :: INTERFACE END's FROM HERE 

const OrderEstTimeCard = (props: Props) => {

    const styles = stylesFunc();

    return (
        <View style={[styles.primaryContainer, props.contentContainerStyle]}>
            {props.children}
        </View>
    );
}

OrderEstTimeCard.defaultProps = defaultProps;
export default React.memo(OrderEstTimeCard);

// #region :: STYLES START's FROM HERE 
const stylesFunc = () => StyleSheet.create({

    primaryContainer: {
        ...AppStyles.shadow,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: constants.spacing_vertical,
        paddingHorizontal: constants.spacing_horizontal,
        minHeight: 50,

    },


});//end of stylesFunc

// #endregion :: STYLES END's FROM HERE 