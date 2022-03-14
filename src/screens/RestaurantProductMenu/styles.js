import { StyleSheet } from "react-native";

export const stylesFunc = (colors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
    },
})

export const itemStylesFunc = (colors) => StyleSheet.create({
    discountTypeText: {
        color: colors.primary,
        fontSize: 10,
        maxWidth: "90%",
    },
    discountTypeText1: {
        color: colors.primary,
        fontSize: 10,
    },
    discountTypeIcon: { marginRight: 4, },
    discountTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        // marginTop: -6,
        marginLeft: 10,
        marginRight: 10,
    },
    discountPrice: {
        color: "#C1C1C1",
        fontSize: 12,
        textDecorationLine: "line-through",
        textDecorationColor: '#C1C1C1',
        textAlign: "center",
    },
    image: {
        width: 120,
        height: 90,
        resizeMode: "contain",
        borderRadius: 10,
    },
    price: {
        color: colors.primary,
        fontSize: 14,
    },
    description: {
        color: "#6B6B6B",
        fontSize: 12,
        marginBottom: 10,
        paddingRight: 9
    },
    name: {
        color: "#272727",
        fontSize: 16,
        paddingRight: 9, paddingVertical: 5
    },
    detailContainer: {
        flex: 1,
    },
    bodyContainer: {
        flexDirection: "row",
    },
    seperator: {
        backgroundColor: "#C1C1C1",
        height: 1,
        width: "100%",
        borderRadius: 5,
        marginVertical: 16,
    },
    primaryContainer2: {
        paddingHorizontal: 10,
    },
    primaryContainer: {
        marginTop: 2,
        marginBottom: 10,
        marginRight: 10,
    },

})

export const sectionHeaderStylesFunc = (colors) => StyleSheet.create({
    borderLine: {
        backgroundColor: colors.primary,
        height: 7,
        width: 26,
        borderRadius: 26,
    },
    text: {
        color: "#1D1D1D",
        fontSize: 18,
    },
    primaryContainer: {
        paddingHorizontal: 10,
        paddingTop: 26,
        paddingBottom: 20,
    },
    tesing: {
        paddingHorizontal: 10,
        paddingTop: 26,
        paddingBottom: 20,
    },
})