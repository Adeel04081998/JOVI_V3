import { Platform, StyleSheet } from "react-native";
import { getStatusBarHeight } from "../../helpers/StatusBarHeight";
import { initColors } from "../../res/colors";
const SPACING_VERTICAL = 10;
export default {
    styles(colors = initColors) {
        return StyleSheet.create({

            mainContainer: {

                flex: 1, flexDirection: 'column', backgroundColor: colors.screen_background,

            },
            customHeaderMainContainer: { 
                position: 'absolute', zIndex: 2, backgroundColor: 'transparent', borderBottomWidth: 0, borderBottomColor: 'white',
                top:getStatusBarHeight(true)
                // top: Platform.OS === 'ios' ? 20 : null
                
            },
            customHeaderLeftRightContainer: {
                backgroundColor: colors.white
            },
            customHeaderLeftRightIconColor: colors.primary,
            primaryContainer: {
                marginHorizontal: 10, marginVertical: 15,
            },
            productNametxt: {
                fontSize: 20, color: colors.black
            },
            productDescriptionTxt: {
                paddingVertical: 10, width: '100%', color: colors.grey, fontSize: 14,paddingRight:10

            },
            productPriceContainer: {
                flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'
            },
            productPricelabel: {
                fontSize: 16, color: colors.grey, textAlign: 'center',
            },
            productPricetxt: {
                fontSize: 16, left: 5, color: colors.primary
            },
            radioButtonSelectionTittle: {
                fontSize: 16, color: colors.lightBlack
            },
            requiredTxt: {
                fontSize: 12, color: colors.grey

            },
            radioButtonPrimaryContainer: {
                backgroundColor: 'white',
                padding: 10,
                marginVertical: 5,
                borderRadius: 10,
            },
            radioButtonSecondaryContainer: {
                flexDirection: 'row', width: "100%", alignItems: 'center', paddingVertical: 3
            },
            radioButtonCircle: {
                height: 20, width: 20, borderRadius: 20, marginRight: 12, borderWidth: 3, borderColor: colors.pinBall, alignItems: 'center', justifyContent: 'center'
            },
            filledCircle: (val) => ({
                width: 10, height: 10, borderRadius: 30, backgroundColor: val ? colors.primary : "blue"
            }),

        })
    }
} 