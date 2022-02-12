import React, { useState, useRef } from "react";
import { Alert, SectionList, StyleSheet } from "react-native";
import { boolean } from "yargs";
import AnimatedView from "../../../components/atoms/AnimatedView";
import Text from "../../../components/atoms/Text";
import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
import View from "../../../components/atoms/View";

export default ({ data = [], selectedOptions = [], onPressCb, selectionTittle = "", requiredTittle = "", isMultipleSelection = false, selectedItem = [], selectCOndition = null, productDetailsStyles }) => {

    console.log("selectedItem", selectedItem);
    const checkSelected = (x) => {
        const check = selectedOptions.filter(item=>item.itemOptionID === x.itemOptionID)[0];
        if(check){
            return true;
        }
        return false;
    }
    const onPress = (item, isMany, i) => {
        console.log("isMany, i", isMany, i);
        if (isMany === true) {
            const isExist = selectedItem.findIndex(i => i.itemOptionID === item.itemOptionID);
            // console.log('isExist ', isExist);
            if (isExist === -1) {
                // if (selectedItem.length === selectCOndition) return
                selectedItem.push(item); // adding item
            } else {
                selectedItem.splice(isExist, 1); // deleting same item from
            }

            onPressCb && onPressCb(selectedItem, isMany);

        } else {
            //SINGLE SELECTION

            selectedItem = [];
            selectedItem.push(item); // adding item
            onPressCb && onPressCb(selectedItem, isMany);

        }


        return
        if (isMultipleSelection) {
            const isExist = selectedItem.findIndex(i => i.id === item.id);
            console.log('isExist ', isExist);
            if (isExist === -1) {
                if (selectedItem.length === selectCOndition) return
                selectedItem.push(item); // adding item
            } else {
                selectedItem.splice(isExist, 1); // deleting same item from
            }

            onPressCb && onPressCb(selectedItem, isMultipleSelection,);

        } else {
            //SINGLE SELECTION

            selectedItem = [];
            selectedItem.push(item); // adding item
            onPressCb && onPressCb(selectedItem, isMultipleSelection);

        }

    };

    const RenderUi = ({ pitstopItemsOptionList,choosedQuantity, isMany, parentIndex }) => {
        console.log(`pitstopItemsOptionList`, pitstopItemsOptionList,choosedQuantity)

        return (
            <View style={{
                backgroundColor: 'white',
                padding: 10,
                marginVertical: 5,
                borderRadius: 10,
                flexDirection: 'column',
                // height: 90,

            }}>
                {
                    pitstopItemsOptionList.map((x, i) => {
                        const attributeName = x.tittle
                        const attributeOptionPrice = x.optionPrice
                        const selectedIndex = selectedItem.findIndex(k => k.itemOptionID === x.itemOptionID);
                        // let isActive = selectedIndex === -1 ? false : x.itemOptionID === selectedItem[selectedIndex].itemOptionID;
                        let isActive = checkSelected(x);
                        // return <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingVertical:5 }} onPress={() => { onPress(x, isMany,i) }} >
                        return <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingVertical: 5 }} onPress={() => onPressCb(x, isMany, parentIndex,choosedQuantity??null)} >
                            <View style={productDetailsStyles.radioButtonCircle}>
                                {isActive &&
                                    <View style={productDetailsStyles.filledCircle(true)} />
                                }
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">{`${attributeName}`}</Text>
                                <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">{`${attributeOptionPrice}`}</Text>
                            </View>
                        </TouchableOpacity>
                    })
                }
            </View>

        )


    }

    return (

        <View>
            {
                data.map((x, i) => {
                    const isMany = (__DEV__ && i === 0) ? true : x.isMany ?? false
                    // const isMany = true

                    const isRequired = x.isRequired ?? false
                    const mainTitle = x.mainTittle ?? ""
                    const choosedQuantity = 2
                    const pitstopItemsOptionList = x.pitStopItemsOptionList ?? []
                    // const selectedIndex = selectedItem.findIndex(k => k.id === x.id);
                    // let isActive = selectedIndex === -1 ? false : x.id === selectedItem[selectedIndex].id;
                    return <AnimatedView style={{}}>
                        <Text style={productDetailsStyles.radioButtonSelectionTittle}
                            fontFamily="PoppinsRegular"
                        >{`${mainTitle},(Select${choosedQuantity})`}</Text>
                        <Text style={productDetailsStyles.requiredTxt} fontFamily="PoppinsRegular">{isRequired && "Required"}</Text>
                        <RenderUi pitstopItemsOptionList={pitstopItemsOptionList} isMany={isMany} parentIndex={i} choosedQuantity={choosedQuantity} />

                    </AnimatedView>


                })

            }

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
