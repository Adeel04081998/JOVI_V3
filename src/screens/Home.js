import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GV from '../utils/GV';
import { useTheme } from '@react-navigation/native';
import theme from '../res/theme';
import ENUMS from '../utils/ENUMS';
export default ({ navigation }) => {
    const onPress = () => {
        GV.NAVIGATION_LISTENER.auth_handler(false);
    }
    const { colors } = useTheme();
    // const colors = theme.getTheme(ENUMS.THEME_VALUES.JOVI);
    return (
        <View style={{ flex: 1, jsutifyContent: "center", alingItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ margin: 20, padding: 20 }}>
                <Text style={{ textAlign: "center", borderRadius: 10, borderWidth: 0.5, color: colors.primary }}>Press to open drawer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress} style={{ margin: 5, padding: 20 }}>
                <Text style={{ textAlign: "center", borderRadius: 10, borderWidth: 0.5, color: colors.primary }}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}
