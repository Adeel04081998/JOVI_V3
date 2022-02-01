import React from 'react';
import { View, Text, TouchableOpacity, Appearance, StyleSheet } from 'react-native';
import GV from '../utils/GV';
import theme from '../res/theme';
import sampleStyles from './sampleStyles';
import { navigation_listener } from '../helpers/SharedActions';
export default ({ navigation }) => {
    const onPress = () => {
        navigation_listener.auth_handler(false);
    }
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = sampleStyles.styles(colors);
    return (
        <View style={{ flex: 1, jsutifyContent: "center", alingItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ margin: 20, padding: 20 }}>
                <Text style={styles.sample}>Press to open drawer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress} style={{ margin: 5, padding: 20 }}>
                <Text style={styles.sample}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}



