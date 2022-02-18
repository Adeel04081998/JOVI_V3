import React, { useState } from 'react'
import AnimatedView from '../../../components/atoms/AnimatedView'
import View from '../../../components/atoms/View'
import sharedStyles from '../../../res/sharedStyles'
import DashedLine from '../../../components/organisms/DashedLine'
import { SvgXml } from 'react-native-svg'
import svgs from '../../../assets/svgs'
import { renderPrice, sharedGetPrice } from '../../../helpers/SharedActions'
import Text from '../../../components/atoms/Text'
import TouchableOpacity from '../../../components/atoms/TouchableOpacity'
import { useSelector } from 'react-redux'
import AppStyles from '../../../res/AppStyles'
import { PITSTOP_TYPES } from '../../../utils/GV'


const RECEIPTPiTSTOPMAINTXTCOLOR = "#6B6B6B"
const subDetailListTxtColor = "#6B6B6B"
const subDetailListTxtFontSize = 12
const subDetailListTxtFontFamily = 'PoppinsRegular'
const TOPSPACING = 10

export default ({ cartReducer = [], colors = {}, secondData = [] }) => {
    const [showDetails, setShowDetails] = useState(false)
    const pitStops = cartReducer.pitstops || []
    const discount = cartReducer.discount
    const serviceCharges = cartReducer.serviceCharges
    const gst = cartReducer.gst
    const estimatedTotal = cartReducer.total;
    const st = cartReducer.st || 0;

    const onShowDetails = () => {
        setShowDetails(!showDetails)
    }

    const RenderSubPitStopDetailsUi = ({ pitstopDetail, data = [] }) => {
        if (showDetails) {
            return (
                <View style={{ justifyContent: 'center', flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center', }}>
                    {data.map((item, i) => {
                        let pitStopItemName = item.pitStopItemName
                        let itemPrice = item.itemPrice
                        let itemQuantity = item.quantity || "xl"
                        let itemSize = "1"
                        return <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 3 }}>
                            <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 20 }}>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{`${pitStopItemName}`}</Text>
                                {/* <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemSize}`}</Text>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemQuantity}`}</Text> */}
                            </View>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} fontFamily={subDetailListTxtFontFamily}>{sharedGetPrice(item, false)}</Text>
                                <Text style={{ left: 4, justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize, textDecorationLine: "line-through" }} fontFamily={subDetailListTxtFontFamily}>{sharedGetPrice(item, true,)}</Text>


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
                        <Text style={{ fontSize: 13, color: '#4D4D4D' }} fontFamily='PoppinsRegular'>GST</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 13, color: '#4D4D4D' }} fontFamily='PoppinsRegular'>{gst}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Text style={{ fontSize: 13, color: '#4D4D4D' }} fontFamily='PoppinsRegular' >Service Charges</Text>
                        <Text style={{ fontSize: 13, color: '#4D4D4D' }} fontFamily='PoppinsRegular'>{`(incl S.T ${st})`}</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 13, color: '#4D4D4D' }} fontFamily='PoppinsRegular'>{serviceCharges}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 12 }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Text style={{ fontSize: 13, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsRegular'>Discount</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 13, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsRegular'>{`-${discount}`}</Text>
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
                            <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold' >{`${estimatedTotal}`}</Text>
                        </View>
                    </View>
                </View>
            </View>

        )
    }
    const dotColor = (pitstopType) => {
        let clrs = colors.default;
        if (pitstopType === PITSTOP_TYPES.DEFAULT) clrs = colors.restaurant
        if (pitstopType === PITSTOP_TYPES.JOVI) clrs = colors.jovi
        if (pitstopType === PITSTOP_TYPES.RESTAURANT) clrs = colors.restaurant
        if (pitstopType === PITSTOP_TYPES.SUPER_MARKET) clrs = colors.jovi_mart
        if (pitstopType === PITSTOP_TYPES.PHARMACY) clrs = colors.pharamcy
        if (pitstopType === PITSTOP_TYPES.JOVI_MART) clrs = colors.jovi_mart
        return clrs;
    }

    return (
        <AnimatedView style={[{ backgroundColor: 'white', flex: 1, margin: TOPSPACING, borderRadius: 8, ...AppStyles.shadow, elevation: 2 }]}>
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
                            let pitStopNumber = i + 1
                            let pitstopName = x.pitstopName
                            let individualPitstopTotal = x.individualPitstopTotal;
                            let checkOutItemsListVM = x.checkOutItemsListVM
                            return <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingVertical: i === 0 ? 0 : 3, }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: dotColor(x.pitstopType).primary, }} />
                                    <Text style={{ marginLeft: 4, fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`Pit Stop 0${pitStopNumber}-`}</Text>
                                    <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR, }} fontFamily='PoppinsMedium' numberOfLines={1}>{String(pitstopName).substring(0, 25)}</Text>
                                    {!showDetails &&
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`${renderPrice(individualPitstopTotal, '')}`}</Text>
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