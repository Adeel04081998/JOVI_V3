import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import AnimatedView from "../../../components/atoms/AnimatedView";
import Text from "../../../components/atoms/Text";
import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
import View from "../../../components/atoms/View";

export default ({ data = [], onPressCb, selectionTittle = "", requiredTittle = "" }) => {
    console.log("data=>>", data);
    return (
        <View>
            <Text style={{ fontSize: 14, color: 'black' }}>{selectionTittle}</Text>
            <Text>{requiredTittle}</Text>
            <AnimatedView style={styles.primaryContainer}>
                {
                    data.map((x, i) => {
                        return <AnimatedView style={styles.container}>

                            <TouchableOpacity style={styles.radioCircle}
                                onPress={() => { onPressCb(x) }}
                            >
                                <View style={styles.filledCircle(true)}>
                                </View>
                            </TouchableOpacity>
                            <Text style={{}}>{x.field}</Text>


                        </AnimatedView>

                    })

                }


            </AnimatedView>

        </View>



    )

}
const styles = StyleSheet.create({
    primaryContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.9,
        shadowRadius: 20,

        elevation: 12,
        borderRadius: 10



    },
    container: {
        flexDirection: 'row', width: "100%", alignItems: 'center', paddingVertical: 3

    },
    radioCircle: {
        height: 25, width: 25,
        borderRadius: 90,
        marginRight: 12,
        borderWidth: 1.5,
        // borderColor: '#D3D3D3',
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filledCircle: (val) => ({
        width: 10, height: 10, borderRadius: 30, backgroundColor: val ? "red" : "blue"
    }
    )
})