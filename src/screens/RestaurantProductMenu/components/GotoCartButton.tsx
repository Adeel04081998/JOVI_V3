import * as React from "react";
import { StyleSheet } from "react-native";
import Text from "../../../components/atoms/Text";
import View from "../../../components/atoms/View";
import Button, { ButtonProps } from "../../../components/molecules/Button";
import { renderPrice, VALIDATION_CHECK } from "../../../helpers/SharedActions";
import { initColors } from '../../../res/colors';
import FontFamily from "../../../res/FontFamily";

// #region :: INTERFACE START's FROM HERE 

interface Props extends ButtonProps {
    children?: any;
    colors: typeof initColors;
    text?: string;
    count?: any;
    price?: any;
}


const defaultProps = {
    text: "Go to cart",
    count: 1,
    price: 'Rs. 500',
};
// #endregion :: INTERFACE END's FROM HERE 

const GotoCartButton = (props: Props) => {
    const propText = props?.text ?? defaultProps.text;
    const colors = props.colors;
    const styles = stylesFunc(colors);



    return (
        <Button
            style={[styles.button, props.style]}
            //@ts-ignore
            textStyle={[styles.textStyle, props.textStyle]}
            text={propText}
            {...VALIDATION_CHECK(props.count) && {
                leftComponent: () => (
                    <View style={styles.leftContainer}>
                        <Text style={styles.leftText}>{props.count}</Text>
                    </View>
                )
            }}

            {...VALIDATION_CHECK(props.price) && {
                rightComponent: () => (
                    <View style={styles.rightContainer}>
                        <Text style={styles.rightText}>{renderPrice(props.price)}</Text>
                    </View>
                )
            }}
            {...props}

        />
    );
}

GotoCartButton.defaultProps = defaultProps;
export default GotoCartButton;


// #region :: STYLES START's FROM HERE 

const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    rightText: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
    },
    rightContainer: {
        padding: 10,
        paddingRight: 0,
        marginRight: 16,
    },
    leftText: {
        color: colors.primary,
        fontSize: 16,
        textAlign: 'center',
    },
    leftContainer: {
        paddingHorizontal: 14,
        paddingVertical: 4,
        backgroundColor: "#fff",
        borderRadius: 6,
        marginLeft: 16,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center",
    },
    textStyle: {
        color: colors.white,
        fontSize: 16,
        fontFamily: FontFamily.Poppins.Medium,
        textAlign: "center",
        flex: 1,
    },
    button: {
        flex: 1,
        position: 'absolute',
        bottom: 10,
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: "flex-start",
    },

});//end of stylesFunc



     // #endregion :: STYLES END's FROM HERE 