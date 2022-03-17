import { StyleSheet } from "react-native";
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


export const headerFuncStyles = StyleSheet.create({
    primaryContainer: {
        flex: 0,
    },
});

export const onGoingItemFuncStyles = (colors = initColors, TYPE_COLOR) => StyleSheet.create({
    value: {
        color: "#272727",
        fontSize: 14,
        fontFamily: FontFamily.Poppins.Medium,
    },
    valueContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
    },
    text: {
        color: "#818181",
        fontSize: 10,
    },
    headingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    barSelectedIconContainer: {
        height: 20,
        width: 20,
        borderRadius: 20,
        backgroundColor: TYPE_COLOR.inProgress,
        alignItems: "center",
        justifyContent: "center",
    },
    noPitstopText: {
        fontSize: 12,
        color: "#272727",
    },
    inProgressText: {
        textAlign: "right",
        fontSize: 12,
        color: TYPE_COLOR.inProgress,
    },
    orderIDText: {
        fontSize: 14,
        color: "#272727",
        flex: 1,
    },
    orderDetailContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    contentContainerStyle: {
        margin: constants.spacing_vertical,
        padding: 18,
    },

});

export const historyItemFuncStyles = (colors = initColors) => StyleSheet.create({
    dateTimeText: {
        color: "#FFFFFF",
        fontSize: 12,
    },
    datetimeContainer: {
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    orderDeliveredText: {
        color: "#6B6B6B",
        fontSize: 12,
    },
    orderDeliveredDot: {
        height: 10,
        width: 10,
        borderRadius: 10,
        marginRight: 5,
    },
    orderDeliveredContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 4,
    },
    deliveryStatusContainer: { alignItems: "flex-end", },
    noPitstopText: {
        color: "#272727",
        fontSize: 16,
    },
    orderText: {
        color: "#6B6B6B",
        fontSize: 12,
        paddingBottom: 4,
    },
    orderPitstopContainer: {
        flex: 1,
    },
    bodyPrimaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "space-between",
        marginHorizontal: constants.spacing_horizontal,
    },
    cubeIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
    },
    contentContainerStyle: {
        margin: constants.spacing_vertical,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
    },

})