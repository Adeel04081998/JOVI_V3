import { Platform, StyleSheet } from 'react-native'
import React from 'react'
import constants from '../../res/constants'
import { initColors } from '../../res/colors';
import View from './View';
import Text from './Text';
const DEFAULT_DATA = [{ title: "Browsing" }, { title: "Cart" }, { title: "Checkout" }];
const CIRCLE_HEIGHT = 20;
const { width, height } = constants.screen_dimensions;
export default ({ maxHighlight = 0, DATA = DEFAULT_DATA, hideText = false, containerStyle = {}, selectedBarStyle = {}, selectedCircleStyle = {}, invert = false }) => {
    const colors = initColors;
    const styles = _styles(colors, DATA.length);
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
    const _paddingLeft = (i) => {
        if (Platform.OS === "android") {
            if (i > 0) return 0;
            else return 2;
        } else {
            // NOT PERFECT YET NEED TO VERIFY ON SMALL IOS DEVICES
            if (i > 0) return 0;
            if (i === 1) return 5;
            else return 2;
        }
    }
    return (
        <>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
                {
                    DATA.map((p, i) => (
                        <React.Fragment key={`progress-key-${i}`}>
                            {invert ?
                                <>
                                    <View style={[styles.circle, { borderColor: highlight(i) }, selectedCircleStyle]} />
                                    {i !== DATA.length - 1 &&
                                        <View style={[styles.bar, { backgroundColor: highlight(i) }, selectedBarStyle]} />
                                    }
                                </>
                                :
                                <>
                                    <View style={[styles.bar, { backgroundColor: highlight(i) }, selectedBarStyle]} />
                                    <View style={[styles.circle, { borderColor: highlight(i) }, selectedCircleStyle]} />
                                </>
                            }
                        </React.Fragment>
                    ))
                }
                <View style={[{ backgroundColor: colors.grey, paddingVertical: 2 }, containerStyle]} />

            </View>
            {!hideText &&
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 1 }}>
                    {
                        DATA.map((p, i) => (
                            <React.Fragment key={`progress-key-${i}`} >
                                <View style={{ width: (width + (CIRCLE_HEIGHT * 2)) / 7 }} />
                                <Text style={{ color: highlight(i), fontSize: 12, paddingLeft: _paddingLeft(i) }} fontFamily="PoppinsRegular">{StrEnum[i]}</Text>
                            </React.Fragment>
                        ))
                    }
                </View>
            }
        </>
    )
}

const _styles = (colors = initColors, len) => StyleSheet.create({
    bar: {
        width: (width - CIRCLE_HEIGHT * len) / len, backgroundColor: colors.primary, paddingVertical: 2
    },
    circle: {
        height: CIRCLE_HEIGHT, width: CIRCLE_HEIGHT, borderRadius: CIRCLE_HEIGHT / 2, borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.white
    }
})