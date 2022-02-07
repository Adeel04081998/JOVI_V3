import { Appearance, StyleSheet, View } from 'react-native';
import React from 'react';
import AnimatedFlatlist from '../molecules/AnimatedScrolls/AnimatedFlatlist';
import TouchableOpacity from './TouchableOpacity';
import Text from './Text';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import sharedStyles from '../../res/sharedStyles';
const CARD_HEIGHT = 100;
const SPACING = 10;
const DATA = Array(6).fill(); // Data should be fetched from server once its done on server side
const SPACING_VERTICAL = 10;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const styles = _styles(colors);
    const renderItem = (item, index) => (
        <View key={`recent-order-${index}`} style={styles.render_container}>
            <View style={{ paddingHorizontal: SPACING, padding: 5 }}>
                <Text fontFamily='PoppinsMedium' numberOfLines={1} style={styles.title}>
                    Beef patty Burger
                </Text>
                <Text numberOfLines={1} fontFamily='PoppinsRegular' style={styles.description}>
                    2 More Products
                </Text>
            </View>
            <View style={styles.footer_container}>
                <Text fontFamily='PoppinsMedium' style={styles.price}>
                    Rs. 750
                </Text>
                <TouchableOpacity style={styles.button} activeOpacity={.7}>
                    <Text fontFamily='PoppinsMedium' style={styles.button_text}>Reorder</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
    return <View style={styles.container}>
        <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={styles.caption}>
            Recent Orders
        </Text>
        <AnimatedFlatlist style={styles.flatList}
            horizontal
            data={DATA}
            renderItem={renderItem}
            flatlistProps={{
                showsHorizontalScrollIndicator: false,
            }}
        />
    </View>
}

const _styles = (colors) => StyleSheet.create({
    container: {
        marginVertical: SPACING_VERTICAL,
    },
    caption: {
        fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL
    },
    flatList: {
        flexDirection: "row"
    },
    render_container: {
        height: CARD_HEIGHT, backgroundColor: "#fff", marginRight: 10, borderRadius: 10, justifyContent: "space-between",
        shadowColor: "#000",
        marginVertical: 5,
        ...sharedStyles._styles(colors).shadow
    },
    title: {
        fontSize: 14, color: "#272727"
    },
    description: {
        fontSize: 10, color: "#C1C1C1"
    },
    footer_container: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING
    },
    price: {
        fontSize: 10, color: "#F94E41"
    },
    button: {
        borderColor: "#F94E41", borderRadius: 13, borderWidth: 0.5
    },
    button_text: {
        fontSize: 10, color: "#F94E41", paddingHorizontal: 10, textAlign: "center", paddingVertical: 5
    }

})
