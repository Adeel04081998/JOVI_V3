import React, { useState } from 'react'
import AnimatedView from '../../../components/atoms/AnimatedView'
import View from '../../../components/atoms/View'
import sharedStyles from '../../../res/sharedStyles'
import DashedLine from '../../../components/organisms/DashedLine'
import { SvgXml } from 'react-native-svg'
import svgs from '../../../assets/svgs'
import { renderPrice } from '../../../helpers/SharedActions'
import Text from '../../../components/atoms/Text'
import TouchableOpacity from '../../../components/atoms/TouchableOpacity'
import { useSelector } from 'react-redux'
import AppStyles from '../../../res/AppStyles'


const RECEIPTPiTSTOPMAINTXTCOLOR = "#6B6B6B"
const subDetailListTxtColor = "#6B6B6B"
const subDetailListTxtFontSize = 12
const subDetailListTxtFontFamily = 'PoppinsRegular'
const CONTAINERS_MARGIN = 10

export default ({ cartReducer = [], colors = {}, secondData = [] }) => {
    const [showDetails, setShowDetails] = useState(false)
    console.log('if [CART_SCREEN] cartReducer', cartReducer);
    const pitStops = cartReducer.pitstops || []
    const discount = cartReducer.discount
    const serviceCharges = cartReducer.serviceCharges
    const gst = cartReducer.gst
    const estimatedTotal = cartReducer.total

    const onShowDetails = () => {
        setShowDetails(!showDetails)
    }

    const RenderSubPitStopDetailsUi = ({ pitstopDetail, data = [] }) => {
        if (showDetails) {
            return (
                <View style={{ justifyContent: 'center', flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center', }}>
                    {data.map((x, i) => {
                        let pitStopItemName = x.pitStopItemName
                        let itemPrice = x.itemPrice
                        let itemQuantity = x.quantity || "xl"
                        let itemSize = "1"
                        return <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 3 }}>
                            <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 20 }}>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{`${pitStopItemName}`}</Text>
                                {/* <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemSize}`}</Text>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemQuantity}`}</Text> */}
                            </View>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} fontFamily={subDetailListTxtFontFamily}>{itemPrice}</Text>
                                <Text style={{ left: 4, justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize, textDecorationLine: "line-through" }} fontFamily={subDetailListTxtFontFamily}>{itemPrice}</Text>


                            </View>
                        </View>
                    })

                    }

                </View>
            )
        }
        else return <View />
    }

    const RenderGSTServiceChargeUi = ({ }) => {
        return (
            <View style={{}}>
                <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 12 }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>GST</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{gst}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} >Service Charges</Text>
                        <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>(incl S.T )</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{serviceCharges}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 12 }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>Discount</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`Rs ${discount}`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                    <View style={{ flexDirection: "row", }}>
                        <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold'>Estimated Total</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold' >{`Rs ${estimatedTotal}`}</Text>
                        </View>
                    </View>
                </View>
            </View>

        )
    }

    return (
        <AnimatedView style={[{ backgroundColor: 'white', flex: 1, marginVertical: CONTAINERS_MARGIN, borderRadius: 8, ...AppStyles.shadow, elevation: 2 }]}>
            <View style={{ flexDirection: 'row', margin: 12, marginBottom: 0, }}>
                <SvgXml xml={svgs.compliance()}></SvgXml>
                <Text style={{ color: '#6D51BB', fontSize: 14, paddingHorizontal: 10 }} fontFamily='PoppinsSemiBold'>Order Receipt</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={onShowDetails} >
                    <Text style={{ color: '#6D51BB', fontSize: 12 }} fontFamily='PoppinsMedium'>Details</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 2 }}>
                <DashedLine dashLineStyles={{ color: "#707070", }} />
            </View>
            <View>
                <AnimatedView style={{ margin: 12, marginTop: 0, }} >
                    {
                        pitStops.map((x, i) => {
                            console.log("if x=>", x);
                            console.log("if render=>>", renderPrice(x, false));
                            let pitStopNumber = i + 1
                            let pitstopName = x.pitstopName
                            let individualPitstopTotal = x.individualPitstopTotal;
                            let checkOutItemsListVM = x.checkOutItemsListVM
                            return <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingVertical: i === 0 ? 0 : 3, }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: colors.primary, }} />
                                    <Text style={{ marginLeft: 4, fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`Pit Stop 0${pitStopNumber}-`}</Text>
                                    <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR, }} fontFamily='PoppinsMedium' numberOfLines={1}>{String(pitstopName).substring(0, 25)}</Text>
                                    {!showDetails &&
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`Rs ${individualPitstopTotal}`}</Text>
                                        </View>
                                    }
                                </View>
                                <RenderSubPitStopDetailsUi pitstopDetail={secondData} data={checkOutItemsListVM} />
                            </View>
                        })
                    }

                </AnimatedView>
                <RenderGSTServiceChargeUi />
            </View>


        </AnimatedView>

    )
}