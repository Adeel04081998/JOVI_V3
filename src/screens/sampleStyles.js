import { StyleSheet } from "react-native"
export default {
    styles(colors) {
        return StyleSheet.create({
            sample: { textAlign: "center", borderRadius: 10, borderWidth: 0.5, color: colors.primary }
        })
    }
} 