import { StyleSheet } from "react-native";
import { getBottomPadding } from "../../helpers/SharedActions";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";

export const stylesFunc = (colors = initColors, insets) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    cardContentContainerStyle: {
        margin: constants.spacing_vertical,
        padding: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        flexDirection: "row",
        // alignItems: "center",
    },
    buttonPrimaryContainer: {
        marginBottom: getBottomPadding(insets, 10),
        marginLeft: constants.spacing_vertical,
        marginRight: constants.spacing_vertical,
        backgroundColor: colors.white,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 7,
        ...AppStyles.shadow,
        paddingVertical: 10,
    },
    buttonContainerLeft: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        borderRightColor: colors.primary,
        borderRightWidth: 1,

    },
    buttonContainerRight: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        borderLeftColor: colors.primary,
        borderLeftWidth: 1,

    },
    buttonText: {
        fontSize: 14,
        color: colors.primary,
        fontFamily: FontFamily.Poppins.Medium
    },
    dashlineContentContainerStyle: {
        width: "95%",
        alignSelf: 'center',
        paddingBottom: 4,
    },
    itemSeperator: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: 1.5,
        width: "100%",
    },

});//end of stylesFunc


export const headerFuncStyles = StyleSheet.create({
    primaryContainer: {
        flex: 0,
    },
});
