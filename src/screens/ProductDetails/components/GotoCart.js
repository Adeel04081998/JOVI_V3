// {/* <View style={{
//                     flex: 1,
//                     paddingVertical: 15,
//                     borderRadius: 10,
//                     // backgroundColor: "#6449AE",
//                     flexDirection: 'row',
//                     marginVertical: 10,
//                     alignItems: 'center',
//                     justifyContent: 'space-between'


//                 }}>
//                     <View style={{ backgroundColor: 'red', flex: 0.5, justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
//                         <SvgXml xml={svgs.Percentage()} style={{}} ></SvgXml>
//                     </View>
//                     <Text style={{ olor: '#fff', backgroundColor: 'green', textAlign: 'center', left: 20 }}>You have 3 vouchers</Text>
//                     <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 2, marginHorizontal: 5, paddingHorizontal: 10 }} >
//                         <Text style={{ color: "black", marginHorizontal: 10, marginVertical: 5 }}>{"See All"}</Text>
//                     </TouchableOpacity>
//                     <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 70, top: -10, backgroundColor: 'white', }} ></View>
//                     <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 70, bottom: -10, backgroundColor: 'white' }} ></View>

//                     {cuts.map((i) => <View key={`pitstop-arc-${i.index}`} style={{ height: 6, width: 1, position: 'absolute', left: 80, top: i["index"] === 0 ? 16 : i["index"] === 1 ? 28 : 39, backgroundColor: '#fff' }} ></View>)}

//                 </View> */}





//                 <AnimatedView style={{ margin: 10, marginTop: 0 }} >
//                 {

//                     PitstopData.map((x, i) => {
//                         let pitStopNumber = i + 1
//                         let pitstopName = x.brandName
//                         let totalPitstopAmount = x.price

//                         return <View style={{ flex: 1 }}>
//                             <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingVertical: 5, }}>
//                                 <View style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: colors.primary }} />
//                                 <Text style={{ flex: 1, fontSize: 12, textAlign: 'center', color: '#272727' }} fontFamily='PoppinsMedium'>{`Pit Stop ${pitStopNumber}-`}</Text>
//                                 <Text style={{ flex: 2, fontSize: 12, color: '#272727' }} fontFamily='PoppinsMedium'>{`${pitstopName}`}</Text>
//                                 {showDetails &&
//                                     <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
//                                         <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: '#272727' }} fontFamily='PoppinsMedium'>{totalPitstopAmount}</Text>
//                                     </View>
//                                 }
//                             </View>

//                             {showDetails ?
//                                 <View style={{ justifyContent: 'center', flex: 1, }}>
//                                     <View style={{ flex: 1, backgroundColor: 'red', flexDirection: 'row', alignItems: 'center', }}>
//                                         <View style={{ flexDirection: 'row' }}>
//                                             <Text>Piza small -xl</Text>
//                                             <Text>Piza small -xl</Text>
//                                         </View>
//                                         <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
//                                             <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: '#272727' }} fontFamily='PoppinsMedium'>{x.price}</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                                 : null
//                             }
//                         </View>
//                     })


//                 }

//             </AnimatedView>



                {/* <LinearGradient
                    colors={['#6D51BB', '#6C50B9', '#6449AE']}
                    style={{
                        // flex: 1,
                        paddingVertical: 15,
                        borderRadius: 10,
                        flexDirection: 'row',
                        marginVertical: CONTAINERS_MARGIN,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >

                    <View style={{ flex: 0.5, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', }}>
                        <SvgXml xml={svgs.Percentage()} style={{}} ></SvgXml>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Text style={{ color: '#fff', textAlign: 'center', flex: 1 }}>You have 3 vouchers</Text>
                        <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 2, marginHorizontal: 5, paddingHorizontal: 10 }} >
                            <Text style={{ color: "black", marginHorizontal: 10, marginVertical: 5 }}>{"See All"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, top: -10, backgroundColor: '#F6F5FA', }} ></View>
                    <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, bottom: -10, backgroundColor: '#F6F5FA' }} ></View>
                    {cuts.map((i) => <View key={`pitstop-arc-${i.index}`} style={{ height: 6, width: 1, position: 'absolute', left: 70, top: i["index"] === 0 ? 16 : i["index"] === 1 ? 28 : 39, backgroundColor: '#fff' }} ></View>)}
                </LinearGradient> */}