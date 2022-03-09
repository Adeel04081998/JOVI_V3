import { StyleSheet } from "react-native";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";

export const stylesFunc = (colors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },

})

export const sectionHeaderItemStyleFunc = (colors) => StyleSheet.create({
    primaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
        paddingTop: 20,
        paddingHorizontal: constants.spacing_horizontal,
    },
    title: {
        color: "#1D1D1D",
        fontSize: 18,
        fontFamily: FontFamily.Poppins.Medium,

    },
    titleViewmoreText: {
        color: colors.primary,
        fontSize: 12,
    },
})
