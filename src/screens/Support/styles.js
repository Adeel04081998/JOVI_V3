import { Platform, StyleSheet } from "react-native";
import { getStatusBarHeight } from "../../helpers/StatusBarHeight";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";

export const stylesFunc = (colors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },

});//end of stylesFunc

