import { StyleSheet, Appearance } from "react-native";
import { initColors } from "../../res/colors";
import FontFamily from "../../res/FontFamily";

const SPACING_VERTICAL = 10;

export default (colors = initColors, width, height) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // justifyContent: 'center',
        flexGrow: 1,
    },
    cardContainer: {
        flexGrow: 1,
    },
    card: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 38,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: -2,
    },
    body: {
        fontSize: 20,
        lineHeight: 20 * 1.5,
        textAlign: 'center',
    },
    subCategoriesList: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    cardView: {
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.cardBorder || '#BBBBBB',
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: colors.dull_primary,
    },

    /**  start of Card Header Component Styles */

    header: {
        flexDirection: 'row',
        marginHorizontal: 5,
        marginVertical: 10,
        alignItems: 'center',
        backgroundColor: colors.dull_primary,
        // zIndex:999,
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
        borderRadius: 10,
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
        // marginHorizontal: 5,
        marginVertical: 20,
        position: 'absolute',
        bottom: -30,
        alignSelf: 'center',
    },
    locButton: {
        width: width - 50,
        height: 35,
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
        color: colors.black || '#000',
        opacity: 0.8,
        fontFamily: FontFamily.Poppins.Regular,
        fontSize: 12
    },
    galleryIcon: {
        flexDirection: 'row',
        marginLeft: 10,
        paddingVertical: 5,

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
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: SPACING_VERTICAL,
        borderWidth: 1,
        borderColor: '#BBBBBB',
        width: width - 70,
        overflow:'hidden'
    },
    textAlignCenter: {
        paddingLeft: 15
    },

    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#7359BE",
        borderRadius: 0, //50
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    appButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    },
    caption: {
        position: "relative",
        left: 10,
        fontSize: 15,
        color: '#7359BE',
        marginVertical: 10,
    },

    textinput: {
        color: '#7359BE',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 5,
        borderColor: "#707070",
        borderWidth: 1,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    lineStyle: {
        borderBottomColor: '#EBEBEB',
        marginTop: 8,
        borderBottomWidth: 1,
    },
    //end of pitcstop location styles

    //start of buy for me styles

    buyForMeContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#BBBBBB',
        borderRadius: 5,
        padding: 15,
        justifyContent: 'space-between',
        // paddingHorizontal: 10,
        alignItems: 'center',
        width: width - 70,
        alignSelf: 'center',
        marginVertical: 10,
        backgroundColor: colors.white
    },

    //end of buy for me styles

    //start of pitstop estimated price container
    estPriceContainer: {
    }
    //end of pitstop est price conatiner styles
})