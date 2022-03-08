import { Platform, StyleSheet } from "react-native"
import { initColors } from "./colors"

export default {
    _styles(colors = initColors) {
        return StyleSheet.create({
            shadow: {
                shadowColor: colors.black || "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.15,
                shadowRadius: 3.84,
                elevation: Platform.OS === "android" ? 2 : 3,
            },
            placefor_specific_shadow: {
                ...Platform.select({
                    ios: {

                        shadowColor: "DAD7E3",
                        shadowOffset: {
                            width: 1,
                            height: 10,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        // elevation: 3.5,

                        // shadowColor: "#DAD7E3",
                        // shadowOffset: {
                        //     width: 0,
                        //     height: 0.2,
                        // },
                        // shadowOpacity: 1,
                        // shadowRadius: 5,
                        // elevation: 3.5,
                    },
                    android: {
                        shadowColor: "DAD7E3",
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 4.5,

                        // shadowColor: "#DAD7E3",  
                        // shadowOpacity: 1,
                        // shadowRadius: 10,
                        // elevation: 3.5,

                    }
                })

            },
        })
    }
}