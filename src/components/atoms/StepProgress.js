import { StyleSheet } from 'react-native'
import React from 'react'
import constants from '../../res/constants'
import { initColors } from '../../res/colors';
import View from './View';
import Text from './Text';
const DATA = [{ title: "Browsing" }, { title: "Cart" }, { title: "Checkout" }];
const CIRCLE_HEIGHT = 20;
const { width, height } = constants.screen_dimensions;
export default (props) => {
    const colors = initColors;
    const styles = _styles(colors, props);
    const StrEnum = {
        "0": "Browsing",
        "1": "Cart",
        "2": "Checkout",
    }
    const highlight = (i) => {
        let clr = colors.primary;
        if (props.isCart && i > 1) clr = colors.grey
        return clr;
    }
    return (
        <>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {
                    DATA.map((p, i) => (
                        <React.Fragment key={`progress-key-${i}`}>
                            <View style={[styles.bar, { backgroundColor: highlight(i) }]} />
                            <View style={[styles.circle, { borderColor: props.isCart && i > 1 ? colors.grey : colors.primary }]} />
                        </React.Fragment>
                    ))
                }
                <View style={{ width, backgroundColor: highlight(DATA.length + 1), paddingVertical: 2 }} />

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

const _styles = (colors = initColors, props) => StyleSheet.create({
    bar: {
        width: (width - CIRCLE_HEIGHT * 3) / 4, backgroundColor: colors.primary, paddingVertical: 2
    },
    circle: {
        height: CIRCLE_HEIGHT, width: CIRCLE_HEIGHT, borderRadius: CIRCLE_HEIGHT / 2, borderWidth: 3, borderColor: colors.primary
    }
})