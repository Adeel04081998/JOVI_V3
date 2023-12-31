import { StyleSheet } from "react-native";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import FontFamily from "../../res/FontFamily";

export const walletStyles = (colors = initColors) => StyleSheet.create({
    container: {
        flex: 1,
    },
    balanceContainer: {
        backgroundColor: colors.white,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 25
    },
    availableCreditText: {
        fontSize: 14,
        color: colors.black
    },
    availableCreditAmount: {
        fontSize: 25,
        color: colors.black
    },
    topupTitleText: {
        fontSize: 14,
        color: colors.white,
        fontFamily: FontFamily.Poppins.Medium
    },
    topupButton: {
        width: 105,
        // alignSelf: 'center',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 220,
        height: 45,
        backgroundColor: colors.primary
    },
    viewAllRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    recentActivityText: {
        fontSize: 16,
        color: colors.black,
        paddingLeft: 8,
        // paddingTop: 2
    },
    viewAllText: {
        fontSize: 12,
        color: colors.primary
    },
    filterButton: {
        width: 80,
        // alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 220,
        height: 35,
        marginHorizontal: 5
    },
    filterButtonText: {
        fontSize: 12,
        color: colors.white,
        fontFamily: FontFamily.Poppins.Medium
    },
    dataContainerStyle: {
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    svgCircle: {
        height: 26,
        width: 26,
        backgroundColor: '#E2E2E2',
        borderRadius: 26 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterTypeStyle: {
        fontSize: 14,
        color: colors.black,
    },
    filterDateStyle: {
        color: '#ABABAB',
        fontSize: 12,
    }
})
