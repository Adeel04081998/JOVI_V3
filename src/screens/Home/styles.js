import { Platform, StyleSheet } from "react-native";
import { option } from "yargs";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";
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
                fontSize: 16,
                color: '#272727',
                fontWeight:'normal',

            },
            greetingBodyText: {
                fontFamily: 'Poppins-Light', color: colors.DoveGray || '#6B6B6B', fontSize: 14, bottom: 2
            },
            alertMsgPrimaryContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 7,
                // backgroundColor: colors.BlueChalk || '#EEE5FF',
                backgroundColor: 'rgba(238, 229, 255, 1)'
               

            },
            alertMsgSecondaryContainer: {
                flex: 1, flexDirection: 'column', justifyContent: 'center',
                //  padding: 10,
                paddingVertical:10, paddingHorizontal:14
            },
            alertMsgHeaderText: {
                fontSize: 14,
                color: colors.BlueVoilet || "#6D51BB",
                

            },
            alertMsgBodyText: {
                fontSize: 10,
                width: '80%',
                color: colors.Bossanova || '#453463',
                opacity: 1,
            },
            alertMsgSvgView: (height) => ({
                // flex: 0.5,
                // flexDirection: 'column',
                // alignItems: 'center',
                // minHeight: 10,
                // minWidth: 80,
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf:'center',
                height: 70,
                width: '25%',

            }),
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
                flexDirection: "row", alignItems: "center", backgroundColor: "#F2F1F6", borderRadius: 10, height: constants.window_dimensions.height * .06, justifyContent: "space-between", overflow: 'hidden',
                borderWidth:1, borderColor:'#EBEAEE'
            },
            search_input: {
                alignSelf: 'center', height: constants.window_dimensions.height * .06, backgroundColor: "#F2F1F6", fontFamily: FontFamily.Poppins.Regular
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