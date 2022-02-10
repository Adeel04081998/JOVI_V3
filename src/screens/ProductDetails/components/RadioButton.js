import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import AnimatedView from "../../../components/atoms/AnimatedView";
import Text from "../../../components/atoms/Text";
import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
import View from "../../../components/atoms/View";

export default ({ data = [], onPressCb, selectionTittle = "", requiredTittle = "", isMultipleSelection = false, selectedItem = [] }) => {
    console.log("data=>>", data);
    console.log("selectedItem=>>", selectedItem);



    const onPress = (item) => {
        if (isMultipleSelection) {
            const isExist = selectedItem.findIndex(i => i.id === item.id);
            console.log('isExist ', isExist);
            if (isExist === -1) {
                selectedItem.push(item); // adding item
            } else {
                selectedItem.splice(isExist, 1); // deleting same item from
            }

            onPressCb && onPressCb(selectedItem, isMultipleSelection);

        } else {
            //SIGNLE SELECTION

            selectedItem = [];
            selectedItem.push(item); // adding item

            onPressCb && onPressCb(selectedItem, isMultipleSelection);

        }

    };

    return (
        <View>
            <Text style={{ fontSize: 14, color: 'black' }}>{selectionTittle}</Text>
            <Text>{requiredTittle}</Text>
            <AnimatedView style={styles.primaryContainer}>
                {
                    data.map((x, i) => {
                        const selectedIndex = selectedItem.findIndex(k => k.id === x.id);
                        let isActive = selectedIndex === -1 ? false : x.id === selectedItem[selectedIndex].id;
                        console.log("isActive=>>", isActive);
                        return <AnimatedView style={styles.container} key={i}  >
                            <TouchableOpacity style={styles.radioCircle}
                                onPress={() => { onPress(x) }}
                            >
                                {isActive &&
                                    <View style={styles.filledCircle(true)} />
                                }

                            </TouchableOpacity>
                            <Text style={{ color: 'black' }}>{x.title}</Text>

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
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 8,
        // },
        // shadowOpacity: 0.9,
        // shadowRadius: 20,

        // elevation: 5,
        borderRadius: 10,
        // borderWidth:1



    },
    container: {
        flexDirection: 'row', width: "100%", alignItems: 'center', paddingVertical: 3

    },
    radioCircle: {
        height: 18, width: 18,
        borderRadius: 10,
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