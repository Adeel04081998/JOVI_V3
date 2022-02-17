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


const RECEIPTPiTSTOPMAINTXTCOLOR = "#6B6B6B"
const subDetailListTxtColor = "#6B6B6B"
const subDetailListTxtFontSize = 12
const subDetailListTxtFontFamily = 'PoppinsRegular'

const CONTAINERS_MARGIN = 10

export default ({ data = [], colors = {}, secondData = [] }) => {
    const [showDetails, setShowDetails] = useState(false)

    const onShowDetails = () => {
        setShowDetails(!showDetails)
    }

    const RenderSubPitStopDetailsUi = ({ pitstopDetail }) => {
        if (showDetails) {
            return (
                <View style={{ justifyContent: 'center', flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center', }}>
                    {pitstopDetail.map((x, i) => {
                        let pitStopItemName = x.itemName
                        let itemSize = x.itemPrice
                        let itemQuantity = x.quantity
                        return <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 3 }}>
                            <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 30 }}>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{`${pitStopItemName}`}</Text>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemSize}`}</Text>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemQuantity}`}</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} fontFamily={subDetailListTxtFontFamily}>{renderPrice('123', '')}</Text>
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
                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{renderPrice('123')}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} >Service Charges</Text>
                        <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>(incl )</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{renderPrice('123')}</Text>
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
                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{renderPrice('123')}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', margin: 12, justifyContent: 'center', }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold'>Estimated Total</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold' >{renderPrice('123')}</Text>
                        </View>
                    </View>
                </View>
            </View>

        )
    }

    return (
        <AnimatedView style={[sharedStyles._styles("#00000021").shadow, { backgroundColor: 'white', flex: 1, marginVertical: CONTAINERS_MARGIN, borderRadius: 8, }]}>
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
                        data.map((x, i) => {
                            let pitStopNumber = i + 1
                            let pitstopName = x.brandName
                            let totalPitstopAmount = x.price;
                            return <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingVertical: i === 0 ? 0 : 3, }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: colors.primary, }} />
                                    <Text style={{ marginLeft: 4, fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`Pit Stop 0${pitStopNumber}-`}</Text>
                                    <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR, }} fontFamily='PoppinsMedium' numberOfLines={1}>{String(pitstopName).substring(0, 25)}</Text>
                                    {!showDetails &&
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{renderPrice(totalPitstopAmount, '')}</Text>
                                        </View>
                                    }
                                </View>
                                <RenderSubPitStopDetailsUi pitstopDetail={secondData} />
                            </View>
                        })
                    }

                </AnimatedView>
                <RenderGSTServiceChargeUi />
            </View>


        </AnimatedView>

    )
}