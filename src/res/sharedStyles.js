import { StyleSheet } from "react-native"

export default {
    _styles(colors) {
        return StyleSheet.create({
            shadow: {
                shadowColor: colors.black || "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.15,
                shadowRadius: 3.84,
                elevation: 1,
            }
        })
    }
}