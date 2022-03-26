import { Platform, StyleSheet } from "react-native";

export default (colors, WIDTH, SCALED_HEIGHT,) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    headerContainer: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        position: 'absolute',
        top: Platform.select({ ios: 30, android: 0 }),
        zIndex: 9999
    },
    mapMarkerStyle: {
        zIndex: 3,
        position: 'absolute',
        marginTop: -15,
        marginLeft: -11,
        left: WIDTH / 2,
        top: ((SCALED_HEIGHT * 1.3) - SCALED_HEIGHT) / 2,
    },
    bottomViewContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 270,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
    },
    orderInformationContainer: { height: 200, marginTop: 50, alignItems: 'center', display: 'flex', },
    joviTitle: { fontSize: 20, marginTop: 10, fontWeight: 'bold', color: colors.black },
    orderCaption: { fontSize: 14, marginTop: 10, fontWeight: 'bold', color: colors.black },
    currentPitstopTime: { textAlign: 'center', color: colors.black, fontSize: 14, marginTop: 10 },
    orderNavigationContainer: { position: 'absolute', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, top: 45 },
    orderNavigationButton: { height: 42, width: 42, borderRadius: 21, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
    orderProgressContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: -165,
        // backgroundColor: colors.white,
        padding: 25,
        // borderTopEndRadius: 150,
        // borderTopLeftRadius: 150,
    },
});

export const orderPitstopStyles = (colors,ICON_BORDER,SPACING) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    pitstopsContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        flex: 1, backgroundColor: colors.white, marginVertical: SPACING, marginHorizontal: SPACING, borderRadius: 10,
    },
    dashContainer: { flex: 1, flexWrap: 'nowrap', position: 'absolute', left: 40, top: 50, },
    dashLine: { fontSize: 12, height: '100%', maxWidth: 5, color: colors.black, flexWrap: 'nowrap', },
    itemContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
    pitstopGreyCricle: { width: 55, height: 55, borderRadius: 27.5, display: 'flex', justifyContent: 'center', alignItems: 'center', },
    pitstopWiseCircle: { width: 35, height: 35, borderRadius: 17.5, display: 'flex', justifyContent: 'center', alignItems: 'center', },
    pitstopInfoContainer: { flex: 1, marginTop: 3, marginHorizontal: SPACING, display: 'flex', flexDirection: 'column' },
    footerItemContainer: { flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    footerContainer: { height: 72, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
    iconContainer: {
        height: ICON_BORDER.size,
        width: ICON_BORDER.size,

        borderColor: ICON_BORDER.color,
        borderWidth: ICON_BORDER.width,
        borderRadius: ICON_BORDER.borderRadius,

        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 8,
    }
});