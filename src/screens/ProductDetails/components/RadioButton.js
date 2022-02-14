import React, { useState, useRef } from "react";
import { Alert, SectionList, StyleSheet } from "react-native";
import { boolean } from "yargs";
import AnimatedView from "../../../components/atoms/AnimatedView";
import Text from "../../../components/atoms/Text";
import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
import View from "../../../components/atoms/View";

export default ({ data = [], selectedOptions = [], onPressCb, productDetailsStyles }) => {

    const checkSelected = (x) => {
        const check = selectedOptions.filter(item => item.itemOptionID === x.itemOptionID)[0];
        if (check) {
            return true;
        }
        return false;
    }


    const RenderSelectionUi = ({ pitstopItemsOptionList, choosedQuantity, isMany, parentIndex }) => {
        return (
            <View style={{
                backgroundColor: 'white',
                padding: 10,
                marginVertical: 5,
                borderRadius: 10,
                flexDirection: 'column',
            }}>
                {
                    pitstopItemsOptionList.map((x, i) => {
                        const attributeName = x.tittle
                        const attributeOptionPrice = x.optionPrice
                        let isActive = checkSelected(x);
                        return <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingVertical: 5 }} onPress={() => onPressCb(x, isMany, parentIndex, choosedQuantity ?? null)} key={i}  >
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
                    // const isMany = (__DEV__ && i === 0) ? true : x.isMany ?? false
                    const isMany = x.isMany ?? false
                    const isRequired = x.isRequired ?? false
                    const mainTitle = x.mainTittle ?? ""
                    const choosedQuantity = x.quantity ?? 0
                    const pitstopItemsOptionList = x.pitStopItemsOptionList ?? []
                    return <AnimatedView style={{}} key={i}>
                        <Text style={productDetailsStyles.radioButtonSelectionTittle}
                            fontFamily="PoppinsRegular"
                        >{`${mainTitle}`}
                            {choosedQuantity > 0 &&
                                <Text>{`(Select${choosedQuantity})`}</Text>

                            }
                        </Text>
                        {isRequired && <Text style={productDetailsStyles.requiredTxt} fontFamily="PoppinsRegular">{"Required"}</Text>}
                        <RenderSelectionUi pitstopItemsOptionList={pitstopItemsOptionList} isMany={isMany} parentIndex={i} choosedQuantity={choosedQuantity} />

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
