import colors from "./colors";
import GV from "../utils/GV";
const { THEME_VALUES } = GV;
export default {
    getTheme: (themeValue = THEME_VALUES.DEFAULT, isDarkMode = false) => {
        let initTheme = { ...colors };
        initTheme = isDarkMode ? initTheme.DarkMode : initTheme.LightMode;
        if (themeValue === THEME_VALUES.SUPER_MARKET) {
            return initTheme = initTheme.Supermarket
        }
        else if (themeValue === THEME_VALUES.JOVI) {
            return initTheme = initTheme.Jovi
        }
        else if (themeValue === THEME_VALUES.PHARMACY) {
            return initTheme = initTheme.Pharmacy
        }
        else if (themeValue === THEME_VALUES.RESTAURANT) {
            return initTheme = initTheme.Restaurant
        }
        else if (themeValue === THEME_VALUES.JOVI_MART) {
            return initTheme = initTheme.JOVI_MART
        } else {
            return initTheme = initTheme.Default
        }
    }
}

