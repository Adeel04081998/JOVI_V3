import { StyleSheet } from "react-native";
import { initColors } from "../res/colors";
export default {
    styles(colors = initColors) {
        return StyleSheet.create({
            sample: { textAlign: "center", borderRadius: 10, borderWidth: 0.5, color: colors.primary }
        })
    }
} 