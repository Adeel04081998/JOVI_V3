import { Appearance } from "react-native";
import colors from "./colors";
import ENUMS from "../utils/ENUMS";
const { THEME_VALUES } = ENUMS;
export default {
    getTheme: (themeValue = THEME_VALUES.JOVI) => {
        const isDarkMode = Appearance.getColorScheme() === "dark";
        let initTheme = { ...colors };
        initTheme = isDarkMode ? initTheme.DarkMode : initTheme.LightMode;
        if (themeValue === THEME_VALUES.SUPER_MARKET) {
            initTheme = {
                ...initTheme,
                ...initTheme.Supermarket
            }
        }
        else if (themeValue === THEME_VALUES.PHARMACY) {
            initTheme = {
                ...initTheme,
                ...initTheme.Pharmacy
            }
        }
        else if (themeValue === THEME_VALUES.RESTAURANT) {
            initTheme = {
                ...initTheme,
                ...initTheme.Restaurant
            }
        }
        else if (themeValue === THEME_VALUES.JOVI_MART) {
            initTheme = {
                ...initTheme,
                ...initTheme.JoviMart
            }
        }
        return initTheme.Default;
    }
}

