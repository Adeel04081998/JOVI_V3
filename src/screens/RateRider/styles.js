import { Platform, StyleSheet } from "react-native";
import { getStatusBarHeight } from "../../helpers/StatusBarHeight";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";

export const stylesFunc = (colors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    jsonContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    optionHeading: {
        fontSize: 16,
        color: colors.white,
        textAlign: "center",
        marginBottom: 20,
    },
    reciptSubmitButton: {
        width: "48%",
        marginBottom: 0,
    },
    reciptSubmitButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2%",
        marginHorizontal: "10%",
    },
    helpUsText: {
        fontSize: 16,
        textAlign: "center",
        color: colors.white,
    },
    rateJoviHeading: {
        fontSize: 25,
        textAlign: "center",
        color: colors.white,
    },
    switchContainer: {
        marginHorizontal: 10,
    },
    switchText: {
        fontSize: 14,
        color: colors.white,
    },
    tipSwitchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
    },
    tipSwitchText: {
        color: colors.white,
        fontSize: 12,
        flex: 1.5,
    },
    tipSwitchPrimaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: "10%",
    },
});//end of stylesFunc


export const headerStyles = (colors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 0,
    },
    containerStyle: {
        paddingBottom: 10,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
    },
    iconContainer: {
        zIndex: 9999,
        position: 'absolute',
        right: constants.spacing_horizontal,
        top: Platform.OS === "android" ? getStatusBarHeight(false) : getStatusBarHeight(false) * 1.5,

    }
});


export const sliderStylesFunc = (colors = initColors) => StyleSheet.create({
    subSwitchContainerInActive: {
        width: 13,
        height: 13,
        borderRadius: 10,
        borderColor: 'white',
        backgroundColor: 'white',
        borderWidth: 0,
        right: 1,
    },
    subSwitchContainerActive: {
        width: 13,
        height: 13,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 0,
        right: 2,
        backgroundColor: 'white',
    },
    switchContainerInActive: {
        backgroundColor: '#C1C1C1',
        borderRadius: 20,
        justifyContent: 'center',
    },
    switchContainerActive: {
        backgroundColor: '#48EA8B',
        borderRadius: 20,
        justifyContent: 'center',
    },


});//end of stylesFunc