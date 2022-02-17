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
const WINDOW_WIDTH = constants.screen_dimensions.width;
const CARD_WIDTH = WINDOW_WIDTH * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 0.4;
const CONTAINERS_MARGIN = 10


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)], Appearance.getColorScheme() === "dark");
    const checkOutStyles = StyleSheet.styles(colors)
    const cartReducer = useSelector(store => store.cartReducer);
    const totalPitstop = cartReducer.pitstops.length ?? ""
    const estimatedDeliveryTime = "Now 30 - 45 min"
    const [vouchersList, setVouchersList] = useState([])
    const [switchVal, setSwitchVal] = useState(true)
    const paymentMethod = "Payment Method"
    const paymentType = switchVal ? "Wallet" : "cash on delivery"
    const walletAmount = switchVal ? "1500" : ""
    const switchRef = useRef(null)
    const onToggleSwitch = (bool) => {
        console.log("onToggleSwitch", bool);
        // switchRef.current = bool
        // setSwitchVal(bool)
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
            <AnimatedView style={{
                flexDirection: 'column', backgroundColor: 'white', borderRadius: 10,
                ...AppStyles.shadow,
                elevation: 3
            }}>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <SvgXml xml={svgs.paymentThroughwallet()} />
                        <Text style={{ paddingHorizontal: 10, fontSize: 14, color: '#6D51BB' }} fontFamily='PoppinsSemiBold'>{paymentMethod}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ flexDirection: 'row' }}>
                            <SvgXml xml={switchVal ? svgs.paymentThroughwallet() : svgs.paymentCash()} style={{ alignSelf: "center" }} />
                            <View style={{ paddingHorizontal: 10, height: 30, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 11, color: '#272727', alignSelf: 'center', justifyContent: 'center', }} fontFamily='PoppinsSemiBold'>{switchVal ? `${paymentType}` : " Cash on delivery"}</Text>
                                {walletAmount ? <Text style={{ color: '#6B6B6B', fontSize: 10 }} fontFamily='PoppinsRegular'>{`Rs ${walletAmount}`}</Text> : null}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                            <Switch onToggleSwitch={(bool) => { onToggleSwitch(bool) }}
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

                            // switchContainerActive={{}}
                            // switchContainerInActive={{}}
                            // subSwitchContainerActive={{}}
                            // subSwitchContainerInActive={{}}

                            />
                        </View>
                    </View>
                </View>
            </AnimatedView>
        )
    }

    React.useEffect(() => {
        getVouchersList()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F5FA' }} >
            <CustomHeader
                title='Checkout'
                titleStyle={{ fontSize: 16, fontFamily: FontFamily.Poppins.SemiBold }}
                onLeftIconPress={() => { }}
                rightIconName=''
            />
            <ScrollView style={{ flex: 1, marginHorizontal: constants.horizontal_margin, }} showsVerticalScrollIndicator={false}>
                <OrderEstTimeCard
                    color={colors}
                    middle={{ value: estimatedDeliveryTime }}
                    right={{ value: totalPitstop }}
                    contentContainerStyle={{ marginHorizontal: 0, marginVertical: 10 }}
                />
                <RenderPaymentMethodCardUi />
                <VouchersUi />
                <OrderRecipt cartReducer={cartReducer} colors={colors} />
            </ScrollView>
            <AnimatedView style={{ width: '100%', backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, bottom: 0, ...AppStyles.shadow, elevation: 4 }}>
                <Button
                    onPress={() => { }}
                    text='Place Order'
                    style={{ height: 60 }}
                />
            </AnimatedView>

        </SafeAreaView>
    )
}

