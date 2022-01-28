import React from "react";
import { Dimensions } from "react-native";
const ACTIVE_THEME_INDEX = React.createRef(0);
export default {
    ACTIVE_THEME_INDEX,
    SCREEN_DIMENSIONS: Dimensions.get("screen"),
    WINDOW_DIMENSIONS: Dimensions.get("window")
}