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
        flex: 1,
        ...AppStyles.shadow,
        ...AppStyles.borderRadius,
        paddingVertical: constants.spacing_vertical,
        marginVertical: constants.spacing_vertical,
        marginHorizontal: constants.spacing_horizontal,
        backgroundColor: colors.white,
    },

});//end of stylesFunc
