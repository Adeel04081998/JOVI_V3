import { StyleSheet } from "react-native";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";

export const stylesFunc = (colors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
    },

});//end of stylesFunc


export const headerStyles = StyleSheet.create({
    containerStyle: {
        paddingBottom: 10,
    },
    name: {
        fontSize: 15,
        color: "#272727",
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    imageNameContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    primaryContainer: {
        flex: 0,
    },
});