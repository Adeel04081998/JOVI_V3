import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GV from '../utils/GV';
export default ({ navigation }) => {
    const onPress = () => {
        GV.NAVIGATION_LISTENER.auth_handler(false);
    }
    return (
        <View style={{ flex: 1, jsutifyContent: "center", alingItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ margin: 20, padding: 20 }}>
                <Text style={{ textAlign: "center", borderRadius: 10, borderWidth: 0.5 }}>Press to open drawer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress} style={{ margin: 5, padding: 20 }}>
                <Text style={{ textAlign: "center", borderRadius: 10, borderWidth: 0.5 }}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}
