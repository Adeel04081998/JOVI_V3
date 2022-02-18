import React, { useRef, useState } from 'react'
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
import { useSelector } from 'react-redux'
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard'
import AppStyles from '../../res/AppStyles'
import VouchersUi from './components/VouchersUi'
import { edit_icon, pin_icon } from '../Cart/svgs/cart_svgs'
import NavigationService from '../../navigations/NavigationService'
const WINDOW_WIDTH = constants.screen_dimensions.width;
const CARD_WIDTH = WINDOW_WIDTH * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 0.4;
const CONTAINERS_MARGIN = 10
const TOPSPACING = 10


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)], Appearance.getColorScheme() === "dark");
    const checkOutStyles = StyleSheet.styles(colors)
    const cartReducer = useSelector(store => store.cartReducer);
    const totalPitstop = cartReducer.pitstops.length ?? ""
    const estimatedDeliveryTime = "Now 30 - 45 min"
    const [vouchersList, setVouchersList] = useState([])
    const [switchVal, setSwitchVal] = useState(false)
    const [paymentMode, setpaymentMode] = useState("Wallet")
    const paymentMethod = "Payment Method"
    const paymentType = "Wallet"
    const walletAmount = "1500"


    const goBack = () => {
        NavigationService.NavigationActions.common_actions.goBack()
    }

    const getVouchersList = () => {
        getRequest(Endpoints.GET_VOUCHERS_LIST,
            res => {
                console.log("getVouchersList res===>", res);
            },
            err => {
                console.log("err===>", err);
                sharedExceptionHandler(err)

            }
        )
    }
    const RenderPaymentMethodCardUi = () => {

        return (
            <AnimatedView style={{ flexDirection: 'column', backgroundColor: 'white', borderRadius: 8, ...AppStyles.shadow, elevation: 3, margin: TOPSPACING, }}>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <SvgXml xml={svgs.paymentThroughwallet()} />
                        <Text style={{ paddingHorizontal: 10, fontSize: 14, color: '#6D51BB' }} fontFamily='PoppinsSemiBold'>{paymentMethod}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <SvgXml xml={switchVal ? svgs.paymentThroughwallet() : svgs.paymentCash()} style={{ alignSelf: "center" }} />
                            <View style={{ paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 11, color: '#272727', alignSelf: 'center', justifyContent: 'center', }} fontFamily='PoppinsSemiBold'>{switchVal ? `${paymentType}` : " Cash on delivery"}</Text>
                                {/* <Text style={{ fontSize: 11, color: '#272727', alignSelf: 'center', justifyContent: 'center', }} fontFamily='PoppinsSemiBold'>{paymentMode}</Text> */}
                                {switchVal ? <Text style={{ color: '#6B6B6B', fontSize: 10 }} fontFamily='PoppinsRegular'>{`Rs ${walletAmount}`}</Text> : null}
                            </View>
                        </View>
                        {/* <View style={{ height: 30, width: 30, backgroundColor: switchVal ? 'red' : 'blue' }} ></View> */}
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                            <Switch onToggleSwitch={(bool) => {
                                // onToggleSwitch(bool) 
                                setSwitchVal(bool)
                            }}
                                width={44} height={24}
                                switchContainerActive={{
                                    backgroundColor: '#27C787',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                }}
                                switchContainerInActive={{
                                    backgroundColor: '#C1C1C1',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                }}
                                subSwitchContainerActive={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 20,
                                    borderColor: 'white',
                                    borderWidth: 0,
                                    // marginHorizontal: 2,
                                    backgroundColor: 'white'
                                }}
                                subSwitchContainerInActive={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 20,
                                    borderColor: 'white',
                                    backgroundColor: 'white',
                                    borderWidth: 0,
                                    marginHorizontal: 2,
                                    marginHorizontal: 2,

                                }}

                            />
                            {/* <Switch switchVal={switchVal}
                                onToggleSwitch={(bool) => {
                                    // if (switchVal) cardData[index + 1].showSubCard = false
                                    // else cardData[index + 1].showSubCard = true
                                    setSwitchVal(bool)
                                    // setCardData(cardData)
                                }} /> */}

                        </View>
                    </View>
                </View>
            </AnimatedView>
        )
    }
    const BottomLine = ({ styles }) => (
        <View
            style={[{
                borderBottomColor: '#0000001A',
                borderWidth: 0.5,
                marginVertical: 5,
                marginHorizontal: 15
            }, styles]}
        />
    );
    const AddressCard = () => {
        const SPACING = 2;
        const ICON_HEIGHT = 20;
        const ICON_WIDTH = 20;
        return (
            <View
                style={{
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    padding: 5,
                    ...sharedStyles._styles(colors).shadow,
                    elevation: 3,
                    // marginVertical: TOPSPACING,
                    margin: TOPSPACING,
                    marginBottom: 2,
                    paddingVertical: 15
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <View style={{ flexDirection: 'row', padding: SPACING }}>
                        <SvgXml xml={pin_icon()} height={ICON_HEIGHT} width={ICON_WIDTH} />
                        <Text
                            style={{
                                paddingHorizontal: 10,
                                color: colors.primary,
                                fontSize: 16,
                            }}
                            fontFamily="PoppinsSemiBold">
                            Delivery Address
                        </Text>
                    </View>
                    <SvgXml xml={edit_icon()} height={20} width={20} />
                </View>
                <BottomLine styles={{ marginHorizontal: 12, marginVertical: 8 }} />
                {/* <DashedLine /> */}
                <View style={{ padding: SPACING - 5, paddingLeft: SPACING + 20 }}>
                    <Text
                        style={{ color: colors.primary, fontSize: 14 }}
                        fontFamily="PoppinsSemiBold"
                        numberOfLines={1}>
                        Office
                    </Text>
                    <Text style={{ color: colors.black, fontSize: 11 }} numberOfLines={2}>
                        2nd floor, pakland plaza, I8 Markaz, Islamabad
                    </Text>
                </View>
                {/* <DashedLine /> */}
                <BottomLine styles={{ marginHorizontal: 15, marginVertical: 8 }} />
                <View style={{ padding: SPACING - 5, paddingLeft: SPACING + 20 }}>
                    <Text
                        style={{ color: colors.primary, fontSize: 14 }}
                        fontFamily="PoppinsSemiBold"
                        numberOfLines={1}>
                        Instructions for rider
                    </Text>
                    <Text style={{ color: colors.black, fontSize: 11 }} numberOfLines={2}>
                        Call me when you reach on the address
                    </Text>
                </View>
            </View>
        );
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F5FA' }} >
            <CustomHeader
                title='Checkout'
                titleStyle={{ fontSize: 16, fontFamily: FontFamily.Poppins.SemiBold }}
                onLeftIconPress={goBack}
                rightIconName=''
            />
            <ScrollView style={{ flex: 1, }} showsVerticalScrollIndicator={false}>
                <OrderEstTimeCard
                    color={colors}
                    middle={{ value: estimatedDeliveryTime }}
                    right={{ value: totalPitstop }}
                    contentContainerStyle={{ marginBottom: 0 }}
                />
                <AddressCard />
                {RenderPaymentMethodCardUi()}
                <VouchersUi />
                <OrderRecipt cartReducer={cartReducer} colors={colors} />
            </ScrollView>
            <AnimatedView style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 5, bottom: 0, ...AppStyles.shadow, elevation: 4 }}>
                <Button
                    onPress={() => { }}
                    text='Place Order'
                    style={{ height: 60 }}
                />
            </AnimatedView>

        </SafeAreaView>
    )
}

