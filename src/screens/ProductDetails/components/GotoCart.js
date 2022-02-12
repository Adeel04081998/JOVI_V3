// import React, { useState, useRef } from "react";
// import { Alert, SectionList, StyleSheet } from "react-native";
// import { boolean } from "yargs";
// import AnimatedView from "../../../components/atoms/AnimatedView";
// import Text from "../../../components/atoms/Text";
// import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
// import View from "../../../components/atoms/View";

// export default ({ data = [], onPressCb, selectionTittle = "", requiredTittle = "", isMultipleSelection = false, selectedItem = [], selectCOndition = null, productDetailsStyles }) => {
//     console.log("datta=>>", data);
//     const choosedQuantity = data.quantity ?? ""
//     const isRequired = data.isRequired ?? false
//     const isMany = data.isMany ?? false
//     let optionsList = data?.pitstopItemsOptionList ?? []
//     console.log("optionList", optionsList);

//     const onPress = (item) => {
//         if (isMultipleSelection) {
//             const isExist = selectedItem.findIndex(i => i.id === item.id);
//             console.log('isExist ', isExist);
//             if (isExist === -1) {
//                 if (selectedItem.length === selectCOndition) return
//                 selectedItem.push(item); // adding item
//             } else {
//                 selectedItem.splice(isExist, 1); // deleting same item from
//             }

//             onPressCb && onPressCb(selectedItem, isMultipleSelection,);

//         } else {
//             //SINGLE SELECTION

//             selectedItem = [];
//             selectedItem.push(item); // adding item
//             onPressCb && onPressCb(selectedItem, isMultipleSelection);

//         }

//     };



//     // return (

//     //     <View>
//     //         {
//     //             data.map((x, i) => {
//     //                 console.log("x=>>", x);
//     //                 const mainTitle = x.mainTitle ?? ""
//     //                 const choosedQuantity = x.quantity ?? ""
//     //                 const isRequired = x.isRequired ?? false
//     //                 const selectedIndex = selectedItem.findIndex(k => k.id === x.id);
//     //                 let isActive = selectedIndex === -1 ? false : x.id === selectedItem[selectedIndex].id;
//     //                 return <AnimatedView  style={{}}>
//     //                     <Text style={productDetailsStyles.radioButtonSelectionTittle}
//     //                         fontFamily="PoppinsRegular"
//     //                     >{`${mainTitle},(Select${choosedQuantity})`}</Text>
//     //                     <Text style={productDetailsStyles.requiredTxt} fontFamily="PoppinsRegular">{isRequired && "Required"}</Text>
//     //                     <View style={{flexDirection:'column'}}>
//     //                     <AnimatedView style={productDetailsStyles.radioButtonPrimaryContainer}>
//     //                         <AnimatedView style={productDetailsStyles.radioButtonSecondaryContainer} key={i}  >
//     //                             <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', }} onPress={() => { onPress(x) }} >
//     //                                 <View style={productDetailsStyles.radioButtonCircle}>
//     //                                     {isActive &&
//     //                                         <View style={productDetailsStyles.filledCircle(true)} />
//     //                                     }

//     //                                 </View>
//     //                                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
//     //                                     <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">{x.title}</Text>
//     //                                     <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">{`+ ${x.price}`}</Text>
//     //                                 </View>
//     //                             </TouchableOpacity>


//     //                             <TouchableOpacity style={productDetailsStyles.radioButtonCircle} onPress={() => { onPress(x) }}>
//     //                                 {isActive &&
//     //                                     <View style={productDetailsStyles.filledCircle(true)} />
//     //                                 }

//     //                             </TouchableOpacity>
//     //                             <Text style={{ color: 'black' }}>{x.title}</Text>

//     //                         </AnimatedView>


//     //                     </AnimatedView>
//     //                     </View>
//     //                 </AnimatedView>


//     //             })

//     //         }

//     //     </View>
//     // )

//     return (


//         <View>
//             {/* <Text style={productDetailsStyles.radioButtonSelectionTittle}
//                 fontFamily="PoppinsRegular"
//             >{`${selectionTittle},(Select${selectCOndition})`}</Text>
//             <Text style={productDetailsStyles.requiredTxt} fontFamily="PoppinsRegular">{requiredTittle}</Text> */}
//             <AnimatedView style={productDetailsStyles.radioButtonPrimaryContainer}>
//                 {
//                     optionsList.map((x, i) => {
//                         console.log("option ", x);
//                         const selectedIndex = selectedItem.findIndex(k => k.id === x.id);
//                         let isActive = selectedIndex === -1 ? false : x.id === selectedItem[selectedIndex].id;
//                         console.log("isActive=>>", isActive);
//                         return <AnimatedView style={productDetailsStyles.radioButtonSecondaryContainer} key={i}  >
//                             <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', }} onPress={() => { onPress(x) }} >
//                                 <View style={productDetailsStyles.radioButtonCircle}>
//                                     {isActive &&
//                                         <View style={productDetailsStyles.filledCircle(true)} />
//                                     }

//                                 </View>
//                                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
//                                     <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">{x.title}</Text>
//                                     <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">{`+ ${x.price}`}</Text>
//                                 </View>
//                             </TouchableOpacity>


//                             {/* <TouchableOpacity style={productDetailsStyles.radioButtonCircle} onPress={() => { onPress(x) }}>
//                                 {isActive &&
//                                     <View style={productDetailsStyles.filledCircle(true)} />
//                                 }

//                             </TouchableOpacity>
//                             <Text style={{ color: 'black' }}>{x.title}</Text> */}

//                         </AnimatedView>

//                     })

//                 }


//             </AnimatedView>


//         </View>



//     )

// }
// const styles = StyleSheet.create({
//     primaryContainer: {
//         backgroundColor: 'white',
//         padding: 10,
//         marginVertical: 5,
//         // shadowColor: "#000",
//         // shadowOffset: {
//         //     width: 0,
//         //     height: 8,
//         // },
//         // shadowOpacity: 0.9,
//         // shadowRadius: 20,

//         // elevation: 5,
//         borderRadius: 10,
//         // borderWidth:1



//     },
//     container: {
//         flexDirection: 'row', width: "100%", alignItems: 'center', paddingVertical: 3

//     },
//     radioCircle: {
//         height: 18, width: 18,
//         borderRadius: 10,
//         marginRight: 12,
//         borderWidth: 1.5,
//         // borderColor: '#D3D3D3',
//         borderColor: 'grey',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     filledCircle: (val) => ({
//         width: 10, height: 10, borderRadius: 30, backgroundColor: val ? "red" : "blue"
//     }
//     )
// })




// ///////////////mapeed ok
// {pitstopItemsOptionList.map(() => {
                            
//     return <AnimatedView style={{
//         backgroundColor: 'white',
//         padding: 10,
//         marginVertical: 5,
//         borderRadius: 10,
//         flexDirection: 'row',
//         height: 90
//     }}>
//         <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }} onPress={() => { onPress(x) }} >
//             <View style={productDetailsStyles.radioButtonCircle}>
//                 {/* {isActive &&
//     <View style={productDetailsStyles.filledCircle(true)} />
// } */}

//             </View>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
//                 <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">hello</Text>
//                 <Text style={{ color: '#212121', fontSize: 14 }} fontFamily="PoppinsRegular">Prixe</Text>
//             </View>
//         </TouchableOpacity>
//     </AnimatedView>



// })
// }