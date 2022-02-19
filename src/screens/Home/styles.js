import { Platform, StyleSheet } from "react-native";
import { initColors } from "../../res/colors";
const SPACING_VERTICAL = 10;
export default {
    styles(colors = initColors) {
        return StyleSheet.create({
            container: {
                flexGrow: 1,
                backgroundColor: colors.Whisper || "#F6F5FA",
            },
            gifLoader: {
                height: '93%', width: '101%', paddingLeft: 10, paddingTop: 8, paddingHorizontal: 5, display: 'flex', justifyContent: 'center', alignContent: 'center',
            },
            imageCarousal: {
                marginHorizontal: 10,
                alignItems: 'center',
                borderRadius: 12,
                // backgroundColor: "red",
                // resizeMode: "contain"
            },
            wrapper: {
                margin: SPACING_VERTICAL, paddingBottom: Platform.select({ android: 160, ios: 140 })
            },
            greetingMainContainer: {
                margin: 0,
                backgroundColor: colors.Whisper || "#F6F5FA",
                paddingLeft: 5,
                marginVertical: 5
            },
            greetingHeaderText: {
                fontSize: 25,
                color: '#272727',

            },
            greetingBodyText: {
                fontFamily: 'Poppins-Light', color: colors.DoveGray || '#6B6B6B', fontSize: 14, bottom: 2
            },
            alertMsgPrimaryContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 7,
                backgroundColor: colors.BlueChalk || '#EEE5FF',
                
            },
            alertMsgSecondaryContainer: {
                flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10,
            },
            alertMsgHeaderText: {
                fontSize: 14,
                color: colors.BlueVoilet || "#6D51BB",

            },
            alertMsgBodyText: {
                fontSize: 10,
                width: '90%',
                color: colors.Bossanova || '#453463'
            },
            alertMsgSvgView: {
                flex: 0.5,
                flexDirection: 'column',
                alignItems: 'center',
            },
            categoriesCardPrimaryContainer: {
                flex: 0.8,
                margin: 0
            },
            categoriesCardTittleText: {
                fontSize: 16,
                color: colors.MineShaft || "#272727",
                paddingVertical: 8
            },
            categoriesCardItemContainer: {

            },
            search_container: {
                flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, height: 55, justifyContent: "space-between", overflow: 'hidden',
            },
            search_input: {
                alignSelf: 'center', backgroundColor: "#fff"
            },
            cat_item_container: {
                marginHorizontal: 3, justifyContent: 'center', borderRadius: 10
            },
            cat_img_container: {
                width: 80, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'
            }
        })
    }
} 