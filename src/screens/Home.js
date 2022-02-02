import React from 'react';
import { View, Text, TouchableOpacity, Appearance, StyleSheet } from 'react-native';
import GV from '../utils/GV';
import theme from '../res/theme';
import sampleStyles from './sampleStyles';
import SharedActions from '../helpers/SharedActions';
import SafeAreaView from '../components/atoms/SafeAreaView';
export default ({ navigation }) => {
    const onPress = () => {
        SharedActions.navigation_listener.auth_handler(false);
    }
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = sampleStyles.styles(colors);
    return (
        <SafeAreaView style={{ flex: 1, jsutifyContent: "center", alingItems: "center"}}>
            <View style={{ flex: 1, jsutifyContent: "center", alingItems: "center" }}>
                <Text style={{ textAlign: "center" }}>WELCOME TO JOVI</Text>
                {/* <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ margin: 20, padding: 20 }}>
                <Text style={styles.sample}>Press to open drawer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress} style={{ margin: 5, padding: 20 }}>
                <Text style={styles.sample}>Go Back</Text>
            </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}



