import colors from "./colors";
import GV from "../utils/GV";
const { THEME_VALUES } = GV;
export default {
    getTheme: (themeValue = THEME_VALUES.DEFAULT, isDarkMode = false) => {
        if (themeValue === THEME_VALUES.DEFAULT) {
            return isDarkMode ? colors.dark_mode.default : colors.light_mode.default
        }
        else if (themeValue === THEME_VALUES.SUPER_MARKET) {
            return isDarkMode ? colors.dark_mode.grocieries : colors.light_mode.grocieries
        }
        else if (themeValue === THEME_VALUES.JOVI) {
            return isDarkMode ? colors.dark_mode.jovi : colors.light_mode.jovi

        }
        else if (themeValue === THEME_VALUES.PHARMACY) {
            return isDarkMode ? colors.dark_mode.pharamcy : colors.light_mode.pharamcy
        }
        else if (themeValue === THEME_VALUES.RESTAURANT) {
            return isDarkMode ? colors.dark_mode.restaurant : colors.light_mode.restaurant

        }
        else if (themeValue === THEME_VALUES.JOVI_MART) {
            return isDarkMode ? colors.dark_mode.jovi_mart : colors.light_mode.jovi_mart

        } else {
            return isDarkMode ? colors.dark_mode.default : colors.light_mode.default

        }
    }
}

