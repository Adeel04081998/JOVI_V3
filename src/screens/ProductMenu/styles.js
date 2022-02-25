import { StyleSheet } from "react-native";
import AppStyles from "../../res/AppStyles";
import FontFamily from "../../res/FontFamily";

export const stylesFunc = (colors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
    },
    title: {
        color: "#212121",
        fontSize: 18,
        fontFamily: FontFamily.Poppins.Medium,

    },
    shelvesTitle: {
        color: "#1D1D1D",
        fontSize: 18,
        fontFamily: FontFamily.Poppins.Medium,
        paddingBottom: 10,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
})

export const itemStylesFunc = (colors, ITEM_IMAGE_SIZE) => StyleSheet.create({
    discountTypeText: {
        color: colors.primary,
        fontSize: 10,
        maxWidth: "90%",
    },
    discountTypeIcon: { marginRight: 4, },
    discountTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    name: {
        color: "#6B6B6B",
        fontSize: 9,
        maxWidth: "90%",
        paddingTop: 4,
        paddingBottom: 4,
    },
    discountPrice: {
        color: "#C1C1C1",
        fontSize: 12,
        maxWidth: "50%",
        textDecorationLine: "line-through",
        textDecorationColor: '#C1C1C1',
        textAlign: "right"
        ,
    },
    price: {
        color: "#272727",
        fontSize: 14,
        maxWidth: "50%",
    },
    priceDiscountContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: ITEM_IMAGE_SIZE,
        marginTop: 6,
    },
    quantityIconContainer: {
        position: 'absolute',
        bottom: 6,
        right: 8,

        borderRadius: ITEM_IMAGE_SIZE * 0.25,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: colors.white,
        ...AppStyles.shadow,
    },
    image: {
        width: ITEM_IMAGE_SIZE,
        height: ITEM_IMAGE_SIZE,
        borderWidth: 0,
        borderColor: '#C0C0C0',
        borderRadius: 8,
        ...AppStyles.shadow,
        backgroundColor: colors.white,
    },
    imageContainer: {
        width: ITEM_IMAGE_SIZE,
        height: ITEM_IMAGE_SIZE,
    },
    primaryContainer: {
        marginRight: 0,
        marginTop: 2,
    },
    titleViewmoreText: {
        color: colors.primary,
        fontSize: 12,
    },
    titlePrimaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 0,
        paddingTop: 0,
        paddingHorizontal: 10,
    },


})
