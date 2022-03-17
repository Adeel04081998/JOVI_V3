import * as React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppStyles from "../../../res/AppStyles";
import constants from "../../../res/constants";
import TouchableOpacity from "../../atoms/TouchableOpacity";
import TouchableScale from "../../atoms/TouchableScale";
import View from "../../atoms/View";

// #region :: INTERFACE START's FROM HERE 
type Props = React.ComponentProps<typeof TouchableOpacity> & {

    children?: any;
    contentContainerStyle?: StyleProp<ViewStyle>;
    onPress?: () => void;
    useScale?: boolean;
};

const defaultProps = {
    onPress: undefined,
    useScale: false,
};
// #endregion :: INTERFACE END's FROM HERE 

const OrderEstTimeCard = (props: Props) => {

    const styles = stylesFunc();
    const Wrapper = props.onPress ? props.useScale ? TouchableScale : TouchableOpacity : View;
    return (
        <Wrapper {...props}  style={[styles.primaryContainer, props.contentContainerStyle]} >
            {props.children}
        </Wrapper>
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