import { StyleSheet, Appearance } from "react-native";
import { initColors } from "../../res/colors";

const SPACING_VERTICAL = 10;

export default (colors = initColors, width, height) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    cardView: {
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: colors.cardBorder || '#BBBBBB',
        borderRadius: 5,
        marginVertical: 5
    },

    /**  start of Card Header Component Styles */

    header: {
        flexDirection: 'row',
        marginHorizontal: 5,
        marginVertical: 10,
        alignItems: 'center'
    },

    svg: {
        backgroundColor: colors.white || '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        width: width * 0.18

    },
    pitstopTextContainer: {
        // justifyContent: 'center',
        // alignItems:'center',
        justifyContent: 'flex-start',
        width: width * 0.67,
        paddingHorizontal: 10
    },

    pitstopText: {
        fontSize: 14,
        color: colors.black || '#000'
    },
    pitStopLoc: {
        fontSize: 10,
        color: colors.subTextColor || '#272727',
        opacity: 0.8
    },
    arrow: {
        borderRadius: 5,
        backgroundColor: colors.primary,
        padding: 5,
        justifyContent: "center",
        alignItems: 'center',
        height: 30,
        width: 30,
        // width: width * 0.2
        position: 'absolute',
        top: 0,
        right: 0
    },
    /**  end of Card Header Component Styles */

    /**  start of PitStopLocation Styles Component Styles */
    pitStopLocationContainer: {
        marginHorizontal: 5,
        marginVertical: 10,
        // alignItems: 'center',
    },
    locButton: {
        width: width - 40,
        height: 40,
        borderRadius: 8,
        alignSelf: 'center'
    },
    btnText: {
        fontSize: 12,
        fontWeight: 'normal'
    },
    attachment: {
        textAlign: 'left',
        marginLeft: 10,
        paddingVertical: 5,
        color: colors.black || '#000'
    },
    galleryIcon: {
        flexDirection: 'row',
        marginLeft: 10,
        paddingVertical: 5
    },
    voiceNoteContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        paddingVertical: 5,
        alignItems: 'center'
    },
    voiceNote: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: 'center'
    },
    otpDropdownView: {
        backgroundColor: "#fff",
        // alignItems: "center",
        flexDirection: "row",
        // justifyContent: "center",
        alignSelf: 'center',
        borderRadius: 10,
        paddingVertical: SPACING_VERTICAL,
        borderWidth: 1,
        borderColor: '#000',
        width: width - 40,
    },
    textAlignCenter: {
        paddingLeft: 15
    },
    //end of pitcstop location styles

    //start of buy for me styles

    buyForMeContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        padding: 15,
        justifyContent: 'space-between',
        // paddingHorizontal: 10,
        alignItems: 'center',
        width: width - 40,
        alignSelf:'center'
    },
    
    //end of buy for me styles
})