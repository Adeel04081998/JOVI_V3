import { StyleSheet } from "react-native";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";

export const stylesFunc = (colors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
    },
    cardContainer: {
        ...AppStyles.shadow,
        ...AppStyles.borderRadius,
        paddingVertical: constants.spacing_vertical,
        marginVertical: constants.spacing_vertical,
        marginHorizontal: constants.spacing_horizontal,
        marginBottom: 0,
        backgroundColor: colors.white,
    },
    greyCardContainer: {
        backgroundColor: "#F5F5F5",
        borderRadius: 5,
        marginHorizontal: constants.spacing_horizontal,
        marginTop: constants.spacing_vertical,
        padding: constants.spacing_horizontal - 2,

    },

});//end of stylesFunc
