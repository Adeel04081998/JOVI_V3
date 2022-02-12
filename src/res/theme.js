import colors from "./colors";
import GV from "../utils/GV";
import { Appearance } from "react-native";
const { THEME_VALUES } = GV;
export default {
    getTheme: (themeValue = THEME_VALUES.DEFAULT, isDarkMode = Appearance.getColorScheme() === "dark") => {
        let initTheme = isDarkMode ? colors.dark_mode : colors.light_mode;
        if (themeValue === THEME_VALUES.DEFAULT) {
            return initTheme.default;
        }
        else if (themeValue === THEME_VALUES.SUPER_MARKET) {
            return initTheme.grocieries;
        }
        else if (themeValue === THEME_VALUES.JOVI) {
            return initTheme.jovi;

        }
        else if (themeValue === THEME_VALUES.PHARMACY) {
            return initTheme.pharamcy;
        }
        else if (themeValue === THEME_VALUES.RESTAURANT) {
            return initTheme.restaurant;

        }
        else if (themeValue === THEME_VALUES.JOVI_MART) {
            return initTheme.jovi_mart;

        } else {
            return initTheme.default;
        }
    }
}

