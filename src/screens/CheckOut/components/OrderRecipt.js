import React, { useState } from 'react'
import { SvgXml } from 'react-native-svg'
import svgs from '../../../assets/svgs'
import AnimatedView from '../../../components/atoms/AnimatedView'
import Text from '../../../components/atoms/Text'
import TouchableOpacity from '../../../components/atoms/TouchableOpacity'
import View from '../../../components/atoms/View'
import DashedLine from '../../../components/organisms/DashedLine'
import ReceiptItem from '../../../components/organisms/ReceiptItem'
import { renderPrice, sharedCalculatedTotals, sharedGenerateProductItem, sharedGetPrice } from '../../../helpers/SharedActions'
import { PITSTOP_TYPES } from '../../../utils/GV'


const subDetailListTxtFontFamily = 'PoppinsRegular'

export default ({ checkOutStyles = {}, cartReducer = [], colors = {}, secondData = [] }) => {
    const [showDetails, setShowDetails] = useState(false)
    const pitStops = cartReducer.pitstops || []
    const onShowDetails = () => {
        setShowDetails(!showDetails)
    }
    const RenderSubPitStopDetailsUi = ({ pitstopDetail, data = [] }) => {
        if (showDetails) {
            return (
                <View style={{}}>
                    {data.map((item, i) => {
                        let pitStopItemName = item.pitStopItemName
                        return <View style={{ flex: 1, flexDirection: 'row', marginBottom: -2, justifyContent: "space-between" }} key={i}>
                            <Text style={[checkOutStyles.reciptSubDetailspitStopItemName, {}]} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>
                                {/* {`${pitStopItemName}`.trimStart()} */}
                                {sharedGenerateProductItem(pitStopItemName, item?.quantity)}
                            </Text>
                            {/* <Text style={{fontSize:12, color:colors.grey, borderWidth:1, marginHorizontal:-15}} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>
                              xl
                            </Text> */}
                            {/* <View style={{ flesxDirection: 'row', flex: 1, marginHorizontal: 20 }}>
                            <Text style={checkOutStyles.reciptSubDetailspitStopItemName} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{`${pitStopItemName}`}</Text>
                            <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemSize}`}</Text>
                            <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>{` -${itemQuantity}`}</Text>
                        </View> */}
                            <View style={{ justifyContent: 'flex-end', alignItems: "center", flexDirection: 'row', paddingHorizontal: 5, flex: 1 }}>
                                <Text style={checkOutStyles.reciptSubDetailspitStopItemPrice} fontFamily={subDetailListTxtFontFamily}>{sharedGetPrice(item, false)}</Text>
                                <Text style={checkOutStyles.reciptSubDetailspitStopItemPriceLineThrough} fontFamily={subDetailListTxtFontFamily}>{sharedGetPrice(item, true,)}</Text>
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
                <View style={checkOutStyles.gstMainContainer}>
                    <View style={checkOutStyles.gstPrimaryContainer}>
                        <Text style={checkOutStyles.gstCommonLabelTxtStyle} fontFamily='PoppinsRegular'>GST</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={checkOutStyles.gstCommonPriceTxtStyle} fontFamily='PoppinsRegular'>{`${renderPrice({ showZero: true, price: sharedCalculatedTotals().gst })}`}</Text>
                        </View>
                    </View>
                    <View style={checkOutStyles.gstPrimaryContainer}>
                        <Text style={checkOutStyles.gstCommonLabelTxtStyle} fontFamily='PoppinsRegular' >Service Charges</Text>
                        <Text style={checkOutStyles.gstCommonLabelTxtStyle} fontFamily='PoppinsRegular'>{` (incl S.T ${renderPrice(sharedCalculatedTotals().serviceTax, '')})`}</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, }}>
                            <Text style={checkOutStyles.gstCommonPriceTxtStyle} fontFamily='PoppinsRegular'>{`${renderPrice({ showZero: true, price: sharedCalculatedTotals().serviceCharges })}`}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 12, borderWidth: 0, paddingVertical: -9 }}>
                    <View style={{ flexDirection: "row", flex: 1, borderWidth: 0, marginTop: 7, }}>
                        <Text style={[checkOutStyles.gstCommonLabelTxtStyle, { textAlignVertical: 'center', }]} fontFamily='PoppinsRegular'>Discount</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, }}>
                            {<Text style={[checkOutStyles.gstCommonPriceTxtStyle, { textAlignVertical: 'center', }]} fontFamily='PoppinsRegular'>{`${renderPrice({ showZero: true, price: sharedCalculatedTotals().discount }, 'Rs -')}`}</Text>}
                        </View>
                    </View>
                </View>
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', padding: 10, paddingVertical: 8 }}>
                    <View style={{ flexDirection: "row", bottom: 2.5 }}>
                        <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold'>Estimated Total</Text>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold' >{`${renderPrice(sharedCalculatedTotals().total)}`}</Text>
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
        <AnimatedView style={checkOutStyles.receiptMainContainer}>
            <View style={checkOutStyles.receiptPrimaryContainer}>
                <SvgXml xml={svgs.compliance()} style={{ top: 2 }}></SvgXml>
                <Text style={checkOutStyles.orderReciptTxt} fontFamily='PoppinsSemiBold'>Order Receipt</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 0, paddingVertical: 2, borderWidth: 0 }} onPress={onShowDetails}  >
                    <Text style={checkOutStyles.detailTxt} fontFamily='PoppinsMedium'>Details</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 2 }}>
                <DashedLine dashLineStyles={checkOutStyles.dashedLine} />
            </View>
            <View>
                <AnimatedView style={{ margin: 12, marginTop: 0, }} >
                    {
                        pitStops.map((x, i) => {
                            const isJoviJob = x.pitstopType === PITSTOP_TYPES.JOVI;
                            let pitStopNumber = i + 1
                            let pitstopName = x.pitstopName
                            let individualPitstopTotal = x.individualPitstopTotal;
                            let checkOutItemsListVM = x?.checkOutItemsListVM ?? (isJoviJob ? [{ ...x, isJoviJob }] : []);
                            return <View style={{ flex: 1 }} key={i}>
                                <ReceiptItem
                                    title={pitstopName}
                                    type={x.pitstopType}
                                    pitstopNumber={i + 1}
                                    isJoviJob={isJoviJob}
                                    itemData={checkOutItemsListVM}
                                    showDetail={showDetails}
                                    totalPrice={individualPitstopTotal}
                                />
                                {/* <View style={{
                                    flexDirection: 'row', alignItems: 'center', flex: 1, paddingVertical: i === 0 ? 0 : 0,
                                    // marginTop: i === 0  ? 0 : 7,
                                    marginTop: showDetails === false ? 0 : (i === 0 ? 0 : 7)



                                }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: dotColor(x.pitstopType)?.primary, }} />
                                    <Text style={checkOutStyles.reciptMainDetailsPitstopNo} fontFamily='PoppinsMedium'>{`Pit Stop 0${pitStopNumber}-`}</Text>
                                    <Text style={checkOutStyles.reciptMainDetailsPitstopName} fontFamily='PoppinsMedium' numberOfLines={1}>{String(pitstopName).substring(0, 25)}</Text>
                                    {!showDetails &&
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                            <Text style={checkOutStyles.reciptMainDetailsindividualPitstopTotal} fontFamily='PoppinsMedium'>{`${renderPrice({ showZero: true, price: individualPitstopTotal })}`}</Text>
                                        </View>
                                    }
                                </View>
                                <RenderSubPitStopDetailsUi pitstopDetail={secondData} data={checkOutItemsListVM} /> */}
                            </View>
                        })
                    }

                </AnimatedView>
                <RenderGSTServiceChargeUi />
            </View>


        </AnimatedView>

    )
}