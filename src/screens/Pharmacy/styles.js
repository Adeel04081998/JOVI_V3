import { StyleSheet } from "react-native";
import sharedStyles from "../../res/sharedStyles";

export default (colors,BORDER_RADIUS,SPACING,) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    subSection: {
        padding: SPACING, backgroundColor: colors.light_grey, marginBottom: 3, zIndex: 0
    },
    borderTopRadius: { borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS },
    borderBottomRadius: { borderBottomLeftRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS },
    btnText: {
        fontSize: 12,
        fontWeight: '600'
    },
    locButton: {
        // width: WIDTH - 50,
        height: 35,
        borderRadius: 8,
        alignSelf: 'center'
    },
    galleryIcon: {
        flexDirection: 'row',
        marginLeft: 10,
        paddingVertical: 5,

    },
    prescriptionButton: { height: 40, width: '47%', borderRadius: 12, ...sharedStyles._styles(colors).placefor_specific_shadow, justifyContent: 'center', alignItems: 'center', flexDirection:'row' },
    addImageButton: { height: 50, width: 60, marginLeft: 10, borderWidth: 1, borderStyle: 'dotted', borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
    saveButton: { width: '95%', marginVertical: SPACING, backgroundColor: colors.primary, marginHorizontal: SPACING, height: 60, zIndex: 999 },
    inputStyle: {
        width: '100%',
        height: 50,
        backgroundColor: colors.light_grey,
        margin: -13,
        marginVertical: -15,
    },
    selectLocationButton:{ width: '100%', marginVertical: SPACING, backgroundColor: colors.black, height: 35, zIndex: -1 },

});