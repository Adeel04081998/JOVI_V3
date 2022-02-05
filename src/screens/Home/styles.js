import { StyleSheet } from "react-native";
import { initColors } from "../../res/colors";
export default {
    styles(colors = initColors, overAllMargin) {
        return StyleSheet.create({
            sample: { textAlign: "center", borderRadius: 10, borderWidth: 0.5, color: colors.primary },
            container: {
                flex: 1,
                backgroundColor: colors.Whisper || "#F6F5FA",
            },
            greetingMainContainer: {
                margin: overAllMargin,
                backgroundColor: colors.Whisper || "#F6F5FA",
                paddingLeft: 5,
                marginVertical: 5
            },
            greetingHeaderText: {
                fontSize: 16,
                color: '#272727'

            },
            greetingBodyText: {
                fontFamily: 'Poppins-Light', color: colors.DoveGray || '#6B6B6B', fontSize: 16, bottom: 5
            },
            alertMsgPrimaryContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 7,
                backgroundColor: colors.BlueChalk || '#EEE5FF',
            },
            alertMsgSecondaryContainer: {
                flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10
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
                margin: overAllMargin
            },
            categoriesCardTittleText: {
                fontSize: 16,
                color: colors.MineShaft || "#272727",
                paddingVertical: 8
            },
            categoriesCardItemContainer: {

            }
        })
    }
} 