import { Platform, StyleSheet } from "react-native";
import { getStatusBarHeight } from "../../helpers/StatusBarHeight";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
const SPACING_VERTICAL = 10;
// const TOPSPACING = 8
// const RECEIPTPiTSTOPMAINTXTCOLOR = "#6B6B6B"
// const subDetailListTxtColor = "#6B6B6B"
// const subDetailListTxtFontSize = 12
export default {
    styles(colors = initColors) {
        const TOPSPACING = 8
        const RECEIPTPiTSTOPMAINTXTCOLOR = colors.grey
        const subDetailListTxtColor = colors.grey
        const subDetailListTxtFontSize = 12
        return StyleSheet.create({

            mainContainer: { flex: 1, backgroundColor: colors.screen_background },
            voucherMainContainer: {
                paddingVertical: 15,
                borderRadius: 10,
                flexDirection: 'row',
                margin: TOPSPACING,
                alignItems: 'center',
                justifyContent: 'space-between'
            },
            voucherPerntgeSvg: {
                position: 'absolute', left: 20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center',
            },
            voucherPrimaryContainer: {
                flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'

            },
            vouchertxtStyle: {
                color: '#fff', textAlign: 'left', paddingLeft: 20, flex: 1
            },
            voucherSecondaryContainer: {
                backgroundColor: colors.white, borderRadius: 2, marginRight: 15, width: '25%', height: 28, justifyContent: 'center', alignSelf: 'center', alignContent: 'center'
            },
            voucherSeeAllTxtstyle: {
                color: colors.primary, marginHorizontal: 10, fontSize: 14, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center'
            },
            receiptMainContainer: {
                backgroundColor: colors.white, flex: 1, margin: TOPSPACING, borderRadius: 8, ...AppStyles.shadow, elevation: 2
            },
            receiptPrimaryContainer: {
                flexDirection: 'row', margin: 12, marginBottom: 0,

            },
            orderReciptTxt: {
                color: colors.primary, fontSize: 14, paddingHorizontal: 10
            },

            detailTxt: {
                color: colors.primary, fontSize: 12
            },
            dashedLine: {
                color: "#707070",
            },
            reciptMainDetailsPitstopNo: {
                marginLeft: 4, fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR
            },
            reciptMainDetailsPitstopName: {
                fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR,
            },
            reciptMainDetailsindividualPitstopTotal: {
                justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR
            },
            reciptSubDetailspitStopItemName: {
                color: subDetailListTxtColor,
                fontSize: subDetailListTxtFontSize,
                textAlign:'justify', 
                paddingHorizontal:20 ,
                flex:1
               
            },
            reciptSubDetailspitStopItemPrice: {
                justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize
            },
            reciptSubDetailspitStopItemPriceLineThrough: {
                left: 4, justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize, textDecorationLine: "line-through"
            },
            gstMainContainer: {
                flex: 1, flexDirection: 'column', marginHorizontal: 12
            },
            gstPrimaryContainer: {
                flexDirection: "row", flex: 1
            },
            gstCommonLabelTxtStyle: {
                fontSize: 13, color: colors.ASH_TO_ASH
            },
            gstCommonPriceTxtStyle: {
                justifyContent: 'flex-end', fontSize: 13, color: colors.ASH_TO_ASH
            },
            paymentCardMainCOntainder: {
                flexDirection: 'column', backgroundColor: colors.white, borderRadius: 8, ...AppStyles.shadow, elevation: 3, margin: TOPSPACING,
            },
            paymentMethodLabelTxt: {
                paddingHorizontal: 10, fontSize: 14, color: colors.primary
            },
            paymentOptionMainContainer: {
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            },
            paymentOptionPrimaryContainer: {
                paddingHorizontal: 10, height: 30, justifyContent: 'center'
            },

            paymentOptionLabelTxt: {
                fontSize: 11, color: colors.black, alignSelf: 'center', justifyContent: 'center',

            },
            paymentOptionLabelWallletTxt: {
                color: RECEIPTPiTSTOPMAINTXTCOLOR, fontSize: 10

            }





        })
    }
} 