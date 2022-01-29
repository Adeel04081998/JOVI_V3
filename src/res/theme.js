import colors from "./colors";
import ENUMS from "../utils/ENUMS";
const { THEME_VALUES } = ENUMS;
export default {
    getTheme: (themeValue = THEME_VALUES.DEFAULT, isDarkMode = false) => {
        let initTheme = { ...colors };
        initTheme = isDarkMode ? initTheme.DarkMode : initTheme.LightMode;
        if (themeValue === THEME_VALUES.SUPER_MARKET) {
            initTheme = initTheme.Supermarket
        }
        else if (themeValue === THEME_VALUES.JOVI) {
            initTheme = initTheme.Jovi
        }
        else if (themeValue === THEME_VALUES.PHARMACY) {
            initTheme = initTheme.Pharmacy
        }
        else if (themeValue === THEME_VALUES.RESTAURANT) {
            initTheme = initTheme.Restaurant
        }
        else if (themeValue === THEME_VALUES.JOVI_MART) {
            initTheme = initTheme.JOVI_MART
        } else {
            initTheme = initTheme.Default
        }
        return initTheme;
    }
}

