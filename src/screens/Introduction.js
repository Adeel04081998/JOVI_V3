import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NAVIGATIONS from '../navigations/NAVIGATIONS';
import GV from '../utils/GV';
export default (props) => {
    // console.log("[Introduction] GV", GV.AUTH_LISTENER)
    const { navigation, route } = props;
    const onPress = () => {
        GV.NAVIGATION_LISTENER.auth_handler(true)
        // route.params.cb(true);
    }
    return (
        <View style={{ flex: 1, jsutifyContent: "center", alingItems: "center", margin: 20 }}>
            <Text style={{ textAlign: "center", fontSize: 30 }}>Intro</Text>
            <TouchableOpacity onPress={onPress} style={{ margin: 20, padding: 20 }}>
                <Text style={{ textAlign: "center", borderRadius: 10, borderWidth: 0.5 }}>Press to go home</Text>
            </TouchableOpacity>
        </View>
    );
}
