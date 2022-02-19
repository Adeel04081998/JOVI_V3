import { StyleSheet } from 'react-native'
import React from 'react'
import constants from '../../res/constants'
import { initColors } from '../../res/colors';
import View from './View';
import Text from './Text';
const DATA = [{ title: "Browsing" }, { title: "Cart" }, { title: "Checkout" }];
const CIRCLE_HEIGHT = 20;
const { width, height } = constants.screen_dimensions;
export default ({ maxHighlight = 0 }) => {
    const colors = initColors;
    const styles = _styles(colors);
    const StrEnum = {
        "0": "Browsing",
        "1": "Cart",
        "2": "Checkout",
    }
    const highlight = (i) => {
        let clr = colors.grey;
        if (i < maxHighlight) clr = colors.primary
        return clr;
    }
    return (
        <>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
                {
                    DATA.map((p, i) => (
                        <React.Fragment key={`progress-key-${i}`}>
                            <View style={[styles.bar, { backgroundColor: highlight(i) }]} />
                            <View style={[styles.circle, { borderColor: highlight(i) }]} />
                        </React.Fragment>
                    ))
                }
                <View style={{ width, backgroundColor: colors.grey, paddingVertical: 2 }} />

            </View>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                {
                    DATA.map((p, i) => (
                        <React.Fragment key={`progress-key-${i}`}>
                            <View style={{ width: (width + (CIRCLE_HEIGHT * 2)) / 7 }} />
                            <Text style={{ color: highlight(i), fontSize: 12, paddingLeft: 2 }} fontFamily="PoppinsRegular">{StrEnum[i]}</Text>
                        </React.Fragment>
                    ))
                }
            </View>
        </>
    )
}

const _styles = (colors = initColors) => StyleSheet.create({
    bar: {
        width: (width - CIRCLE_HEIGHT * 3) / 4, backgroundColor: colors.primary, paddingVertical: 2
    },
    circle: {
        height: CIRCLE_HEIGHT, width: CIRCLE_HEIGHT, borderRadius: CIRCLE_HEIGHT / 2, borderWidth: 3, borderColor: colors.primary
    }
})