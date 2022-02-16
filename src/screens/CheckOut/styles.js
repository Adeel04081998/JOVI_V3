import { Platform, StyleSheet } from "react-native";
import { initColors } from "../../res/colors";
const SPACING_VERTICAL = 10;
export default {
    styles(colors = initColors) {
        return StyleSheet.create({

            "cardStyle": {
                'flex': 1,
                // ...commonStyles.borderedViewStyles(5, 1, activeTheme.default),
                marginHorizontal: 10,
                paddingBottom:10
            },
            "subCardStyle": {
                'flexDirection': 'row',
                'margin': 10
            },
            "svgStyle":{
                'height':10,
                'width': 10,
            },
            "textStyle":{
                // ...commonStyles.fontStyles(14,activeTheme.default,undefined,'bold'),
                // 'padding':5
                'paddingHorizontal': 5
            },
            "subTextStyle":{
                // ...commonStyles.fontStyles(12,activeTheme.black,undefined),
                // 'padding':5
                'paddingHorizontal': 15,
            },
            
            "receiptBoldTextStyle":{
                // ...commonStyles.fontStyles(size,activeTheme.black,family,'bold'),
              
            }, "receiptThinTextStyle":{
                // ...commonStyles.fontStyles(12,activeTheme,family),
              
            },
        })
    }
} 