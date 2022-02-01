

import { Platform, PlatformColor, StyleSheet } from "react-native"
export default {
    styles(colors) {
        return StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
            }
            ,
            textInput: {
                width: '100%',
                borderWidth: 1.5,
                borderRadius: 5,
                borderColor: 'rgba(0,0,0,0.1)',
                opacity: 0.9,
                height: 50,
                paddingHorizontal: 10,
                marginVertical: 10
            },
            view: {
                marginBottom: 5,
            },
            errorText: {
                color: "red",
                textAlign: 'center',
                width: '100%',
                bottom:Platform.OS === "android"? -27: -20

            },
            buttonView: {
                marginBottom: 14,
            }
        })
    }
}



