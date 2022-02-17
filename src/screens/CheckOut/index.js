import React, { useState } from 'react'
import { Appearance, ScrollView, } from 'react-native'
import AnimatedView from '../../components/atoms/AnimatedView'
import SafeAreaView from '../../components/atoms/SafeAreaView'
import Text from '../../components/atoms/Text'
import View from '../../components/atoms/View'
import CustomHeader from '../../components/molecules/CustomHeader'
import FontFamily from '../../res/FontFamily'
import constants from '../../res/constants'
import theme from '../../res/theme'
import GV, { PITSTOP_TYPES } from '../../utils/GV'
import lodash from 'lodash'; // 4.0.8
import StyleSheet from "./styles"
import { SvgXml } from 'react-native-svg'
import svgs from '../../assets/svgs'
import Switch from '../../components/atoms/Switch'
import TouchableOpacity from '../../components/atoms/TouchableOpacity'
import { getRequest } from '../../manager/ApiManager'
import Endpoints from '../../manager/Endpoints'
import { renderPrice, sharedExceptionHandler } from '../../helpers/SharedActions'
import LinearGradient from 'react-native-linear-gradient'
import Button from '../../components/molecules/Button'
import DashedLine from '../../components/organisms/DashedLine'
import sharedStyles from '../../res/sharedStyles';
import OrderRecipt from './components/OrderRecipt'



const WINDOW_WIDTH = constants.screen_dimensions.width;
const CARD_WIDTH = WINDOW_WIDTH * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 0.4;
const CONTAINERS_MARGIN = 10
const RECEIPTPiTSTOPMAINTXTCOLOR = "#6B6B6B"
const subDetailListTxtColor = "#6B6B6B"
const subDetailListTxtFontSize = 12


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)], Appearance.getColorScheme() === "dark");
    const checkOutStyles = StyleSheet.styles(colors)

    // const paymentAmount ="1500"
    let cuts = [{
        "dashedLine": true,
        "index": 0,
    }, {
        "heading": 'Discount',
        "dashedLine": true,
        "index": 1,
    }, {
        "heading": 'Total',
        "dashedLine": false,
        "index": 2,
    },
    {
        "heading": 'Total',
        "dashedLine": false,
        "index": 3,
    },


    ]
    const PitstopData = [
        {
            pitstopNumber: '01',
            brandName: 'Rahat Bakers - I-8',
            price: "2134"
        },
        {
            pitstopNumber: '02',
            brandName: 'Jovi Job',
            price: "123"

        },
        {
            pitstopNumber: '03',
            brandName: 'Madina Cash & Carry',
            price: "56"


        },
        {
            pitstopNumber: '04',
            brandName: 'D-Watson',
            price: "3456"

        },
    ]
    const PitstopSubDetails = [
        {
            id: 0,
            itemName: 'Pepperoni Pizza',
            size: '2kg',
            quantity: 'xl',
            itemPrice: "750"
        },
        {
            id: 1,
            itemName: 'Red & Hot Pizza',
            size: '2kg',
            quantity: 'xl',
            itemPrice: "750"

        },
        {
            id: 2,
            itemName: 'Niddo',
            size: '2kg',
            quantity: 'xl',
            itemPrice: "750"

        },
        {
            id: 3,
            itemName: 'Aspirin',
            size: '2kg',
            quantity: 'xl',
            itemPrice: "750"

        },
    ]

    const [vouchersList, setVouchersList] = useState([])
    const [switchVal, setSwitchVal] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    const onToggleSwitch = (bool) => {
        setSwitchVal(bool)
    }
    const paymentMethod = "Payment Method"
    const paymentType = switchVal ? "Wallet" : "cash on delivery"
    const walletAmount = switchVal ? "1500" : ""
    const gstAmount = "124"
    const serviceCharges = "445"
    const discount = "567"
    const estimatedTotal = "49823"

    const onShowDetails = () => {
        setShowDetails(!showDetails)
    }
    const RenderPaymentMethodUi = () => {
        return (
            <AnimatedView style={{ flexDirection: 'column', backgroundColor: 'white', borderRadius: 10, }}>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <SvgXml xml={svgs.paymentThroughwallet()} />
                        <Text style={{ paddingHorizontal: 10, fontSize: 14, color: '#6D51BB' }} fontFamily='PoppinsSemiBold'>{paymentMethod}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {
                            <View style={{ flexDirection: 'row' }}>
                                <SvgXml xml={switchVal ? svgs.paymentThroughwallet() : svgs.paymentCash()} style={{ alignSelf: "center" }} />
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontSize: 11, color: '#272727' }} fontFamily='PoppinsSemiBold'>{switchVal ? `${paymentType}` : " Cash on delivery"}</Text>
                                    {walletAmount ? <Text style={{ color: '#6B6B6B', fontSize: 10 }} fontFamily='PoppinsRegular'>{`Rs ${walletAmount}`}</Text> : null}
                                </View>
                            </View>

                        }

                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, alignItems: 'center', }}>

                            <Switch switchVal={switchVal} onToggleSwitch={(bool) => { onToggleSwitch(bool) }}
                                width={45} height={25}
                                containerStyle={{ backgroundColor: switchVal ? "#27C787" : "#C1C1C1", borderRadius: 30, }}
                                toggleStyle={{
                                    backgroundColor: 'white', borderWidth: 0,
                                    width: 15,
                                    height: 15,
                                    borderRadius: 18,
                                    paddingHorizontal: 0

                                }}

                            />
                        </View>
                    </View>
                </View>
            </AnimatedView>
        )
    }

    const getVouchersList = () => {
        getRequest(Endpoints.GET_VOUCHERS_LIST,
            res => {
                console.log("getVouchersList res===>", res);
                setSwitchVal(res.data)
            },
            err => {
                console.log("err===>", err);
                sharedExceptionHandler(err)

            }
        )



    }
    const RenderSubPitStopDetailsUi = () => {
        if (showDetails) {
            return (
                <View style={{ justifyContent: 'center', flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center', }}>
                    {PitstopSubDetails.map((x, i) => {
                        let pitStopItemName = x.itemName
                        let itemSize = x.itemPrice
                        let itemQuantity = x.quantity
                        return <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 3 }}>
                            <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 30 }}>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }}>{`${pitStopItemName}`}</Text>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }}>{`${itemSize}`}</Text>
                                <Text style={{ color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} >{`${itemQuantity}`}</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', color: subDetailListTxtColor, fontSize: subDetailListTxtFontSize }} fontFamily='PoppinsMedium'>{renderPrice('123', '')}</Text>
                            </View>
                        </View>
                    })

                    }

                </View>
            )
        }
        else return <View />
    }
    const RenderOrderReciptUi = () => {
        return (
            <AnimatedView style={[sharedStyles._styles(colors.white).shadow, { backgroundColor: 'white', flex: 1, marginVertical: CONTAINERS_MARGIN, borderRadius: 10, }]}>
                <View style={{ flexDirection: 'row', margin: 12, marginBottom: 0, }}>
                    <SvgXml xml={svgs.compliance()}></SvgXml>
                    <Text style={{ color: '#6D51BB', fontSize: 14, paddingHorizontal: 10 }} fontFamily='PoppinsSemiBold'>Order Receipt</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 0 }}
                        onPress={onShowDetails}
                    >
                        <Text style={{ color: '#6D51BB', fontSize: 12 }} fontFamily='PoppinsMedium' >Details</Text>
                    </TouchableOpacity>
                </View>
                <DashedLine dashColor='#707070' dashLength={1.8} style={{ marginHorizontal: 5, marginVertical: 10 }} />
                <AnimatedView style={{ margin: 12, marginTop: 0, }} >
                    {
                        PitstopData.map((x, i) => {
                            let pitStopNumber = i + 1
                            let pitstopName = x.brandName
                            let totalPitstopAmount = x.price
                            return <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingVertical: i === 0 ? 0 : 3, }}>
                                    <View style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: colors.primary }} />
                                    <Text style={{ flex: 1, fontSize: 12, textAlign: 'center', color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`Pit Stop 0${pitStopNumber}-`}</Text>
                                    <Text style={{ flex: 2, fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{`${pitstopName}`}</Text>
                                    {!showDetails &&
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                            <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{renderPrice(totalPitstopAmount, '')}</Text>
                                        </View>
                                    }
                                </View>
                                <RenderSubPitStopDetailsUi />
                            </View>
                        })
                    }
                    <View style={{ flex: 1, flexDirection: 'column', marginVertical: 10 }}>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>GST</Text>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{'123'}</Text>
                            </View>

                        </View>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} >Service Charges</Text>
                            <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>(incl )</Text>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{'123'}</Text>
                            </View>

                        </View>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>Discount</Text>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{'123'}</Text>
                            </View>

                        </View>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text style={{ fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }}>Estimated Total</Text>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                <Text style={{ justifyContent: 'flex-end', fontSize: 12, color: RECEIPTPiTSTOPMAINTXTCOLOR }} fontFamily='PoppinsMedium'>{'123'}</Text>
                            </View>

                        </View>



                    </View>

                </AnimatedView>

            </AnimatedView>
        )
    }
    const RenderVouchersUi = () => {
        return (
            <LinearGradient
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
                <View style={{ position:'absolute',left:20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', }}>
                    <SvgXml xml={svgs.Percentage()} style={{}} ></SvgXml>
                </View>
                <View style={{width:70}} />
                <View style={{ flex: 1, flexDirection: 'row',justifyContent:'flex-start', alignItems: 'center' }}>

                    <Text style={{ color: '#fff', textAlign: 'left',paddingLeft:20, flex: 1 }} numberOfLines={1}>You have 3 vouchers</Text>
                    <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 2, marginRight: 15, paddingHorizontal: 5 }} >
                        <Text style={{ color: "black", marginHorizontal: 10, marginVertical: 5 }}>{"See All"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, top: -10, backgroundColor: '#F6F5FA', }} ></View>
                <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, bottom: -10, backgroundColor: '#F6F5FA' }} ></View>
                {cuts.map((i) => <View key={`pitstop-arc-${i.index}`} style={{ height: 6, width: 1, position: 'absolute', left: 70, top: i["index"] === 0 ? 16 : i["index"] === 1 ? 28 : 39, backgroundColor: '#fff' }} ></View>)}
            </LinearGradient>
        )
    }
    React.useEffect(() => {
        getVouchersList()
    }, [])
    console.log("showDetails", showDetails);
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F5FA' }}>
            <CustomHeader
                title='Checkout'
                titleStyle={{ fontSize: 16, fontFamily: FontFamily.Poppins.SemiBold }}
                onLeftIconPress={() => { }}
                rightIconName=''
            />
            <ScrollView style={{ flex: 1, marginHorizontal: constants.horizontal_margin, }}>
                <AnimatedView style={{ flexDirection: "row", backgroundColor: 'white', borderRadius: 10, paddingVertical: 10, marginVertical: CONTAINERS_MARGIN }}>
                    <View style={{ flex: 1, borderRightWidth: 1, borderColor: '#6B6B6B', alignItems: "center", justifyContent: "center", }}>
                        <SvgXml xml={svgs.cat()} height={80} width={70} style={{ paddingRight: 5 }} />
                    </View>
                    <View style={{ flex: 2, alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ fontSize: 12, color: '#272727' }} fontFamily='PoppinsRegular'>Estimated Delivery Time</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 18 }}>Now 30 - 45 min</Text>
                    </View>
                    <View style={{ flex: 1, borderLeftWidth: 1, borderColor: '#6B6B6B', alignItems: "center", justifyContent: "center", paddingHorizontal: 5 }}>
                        <Text style={{ fontSize: 12, color: '#272727' }}>Total Pitstops</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 18 }}>04</Text>
                    </View>
                </AnimatedView>
                <AnimatedView style={{ flexDirection: 'column', backgroundColor: 'white', borderRadius: 10, }}>
                    <View style={{ margin: 10 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <SvgXml xml={svgs.paymentThroughwallet()} />
                            <Text style={{ paddingHorizontal: 10, fontSize: 14, color: '#6D51BB' }} fontFamily='PoppinsSemiBold'>{paymentMethod}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ flexDirection: 'row' }}>
                                <SvgXml xml={switchVal ? svgs.paymentThroughwallet() : svgs.paymentCash()} style={{ alignSelf: "center" }} />
                                <View style={{ paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 11, color: '#272727', alignSelf: 'center', justifyContent: 'center', borderWidth: 1 }} fontFamily='PoppinsSemiBold'>{switchVal ? `${paymentType}` : " Cash on delivery"}</Text>
                                    {walletAmount ? <Text style={{ color: '#6B6B6B', fontSize: 10 }} fontFamily='PoppinsRegular'>{`Rs ${walletAmount}`}</Text> : null}
                                </View>
                            </View>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                                <Switch switchVal={switchVal} onToggleSwitch={(bool) => { onToggleSwitch(bool) }}
                                    width={45} height={25}
                                    containerStyle={{ backgroundColor: switchVal ? "#27C787" : "#C1C1C1", borderRadius: 30, }}
                                    toggleStyle={{
                                        backgroundColor: 'white', borderWidth: 0,
                                        width: 15,
                                        height: 15,
                                        borderRadius: 18,
                                        paddingHorizontal: 0
                                    }}
                                    toValue={3}
                                />
                            </View>
                        </View>
                    </View>
                </AnimatedView>
                <RenderVouchersUi />
                <OrderRecipt data={PitstopData} colors={colors} secondData={PitstopSubDetails} />
            </ScrollView>
            <AnimatedView style={{ width: '100%', backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, bottom: 4 }}>
                <Button
                    onPress={() => { }}
                    text='Place Order'
                    style={{ height: 60 }}
                />
            </AnimatedView>

        </SafeAreaView>
    )
}

