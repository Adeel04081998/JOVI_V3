import { Platform, StyleSheet } from "react-native"
import { initColors } from "./colors"

export default {
    _styles(colors = initColors ) {
        return StyleSheet.create({
            shadow: {
                shadowColor: colors.black || "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.15,
                shadowRadius: 3.84,
                elevation: Platform.OS === "android" ? 1 : 3,
            }
        })
    }
}