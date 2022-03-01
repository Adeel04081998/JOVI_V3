import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import Text from "../../../components/atoms/Text";
import View from "../../../components/atoms/View";
import Button, { ButtonProps } from "../../../components/molecules/Button";
import { renderPrice, VALIDATION_CHECK } from "../../../helpers/SharedActions";
import { getStatusBarHeight } from "../../../helpers/StatusBarHeight";
import { initColors } from '../../../res/colors';
import FontFamily from "../../../res/FontFamily";
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import NavigationService from "../../../navigations/NavigationService";
import ROUTES from "../../../navigations/ROUTES";


// #region :: INTERFACE START's FROM HERE 

interface Props extends ButtonProps {
    children?: any;
    colors: typeof initColors;
    text?: string;
    count?: any;
    price?: any;
    bottom?: any;
}


const defaultProps = {
    text: "Go to cart",
    count: null,
    price: null,
    bottom:0
};
// #endregion :: INTERFACE END's FROM HERE 

const GotoCartButton = (props: Props) => {
    const propText = props?.text ?? defaultProps.text;
    const colors = props.colors;

    const insets = useSafeAreaInsets();
    const styles = stylesFunc(colors, insets, props);

    const cartReducer = useSelector((store: any) => store.cartReducer);
    const { itemsCount, subTotal } = cartReducer;
    const price = props?.price ?? subTotal;
    const count = props?.count ?? itemsCount;


    if (!VALIDATION_CHECK(count)) return null;
    return (
        <View style={{
            ...styles.primaryContainer,
        }}>
            <Button
                style={[styles.button, props.style]}
                //@ts-ignore
                textStyle={[styles.textStyle, props.textStyle]}
                text={propText}
                {...VALIDATION_CHECK(count) && {
                    leftComponent: () => (
                        <View style={styles.leftContainer}>
                            <View style={{
                                backgroundColor: colors.white,
                                borderRadius: 6,
                                paddingVertical: 1,
                                paddingHorizontal: 12,
                            }}>
                                <Text style={styles.leftText}>{count}</Text>
                            </View>
                        </View>
                    )
                }}

                {...VALIDATION_CHECK(price) && {
                    rightComponent: () => (
                        <View style={styles.rightContainer}>
                            <Text style={styles.rightText}>{renderPrice(price)}</Text>
                        </View>
                    )
                }}
                onPress={() => {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Cart.screen_name);
                }}
                {...props}
                wait={0}

            />
        </View>
    );
}

GotoCartButton.defaultProps = defaultProps;
export default GotoCartButton;


// #region :: STYLES START's FROM HERE 

const stylesFunc = (colors: typeof initColors, insets: EdgeInsets, props: Props) => StyleSheet.create({
    rightText: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
    },
    rightContainer: {
        flex: 1,
        marginRight: 16,
        alignItems: "flex-end",
    },


    leftText: {
        color: colors.primary,
        fontSize: 16,
        top: 2,
        textAlign: 'center',
    },
    leftContainer: {
        marginLeft: 16,
        alignItems: "flex-start",
        flex: 1,
    },


    textStyle: {
        color: colors.white,
        fontSize: 16,
        fontFamily: FontFamily.Poppins.Medium,
        textAlign: "center",
        flex: 2,
    },


    button: {
        flex: 1,
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: colors.primary,
    },
    primaryContainer: {
        backgroundColor: colors.white,
        position: 'absolute',
        paddingTop: 10,
        paddingBottom: insets.bottom > 0 ? insets.bottom : getStatusBarHeight() * 0.4,
        bottom: props?.bottom,

        width: "100%",
    },

});//end of stylesFunc



     // #endregion :: STYLES END's FROM HERE 