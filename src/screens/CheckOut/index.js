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
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV'
import lodash from 'lodash'; // 4.0.8
import StyleSheet from "./styles"
import { SvgXml } from 'react-native-svg'
import svgs from '../../assets/svgs'
import Switch from '../../components/atoms/Switch'
import TouchableOpacity from '../../components/atoms/TouchableOpacity'
import { getRequest } from '../../manager/ApiManager'
import Endpoints from '../../manager/Endpoints'
import { sharedExceptionHandler } from '../../helpers/SharedActions'
import Button from '../../components/molecules/Button'
import OrderRecipt from './components/OrderRecipt'
import { useSelector } from 'react-redux'
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard'
import AppStyles from '../../res/AppStyles'
import VouchersUi from './components/VouchersUi'
import NavigationService from '../../navigations/NavigationService'
import DeliveryAddress from '../../components/atoms/DeliveryAddress'
import StepProgress from '../../components/atoms/StepProgress'
import ROUTES from '../../navigations/ROUTES'
const WINDOW_WIDTH = constants.screen_dimensions.width;
const CARD_WIDTH = WINDOW_WIDTH * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 0.4;
const TOPSPACING = 10

const IMAGE_SIZE = constants.window_dimensions.width * 0.3;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED['10']], Appearance.getColorScheme() === "dark");
    const checkOutStyles = StyleSheet.styles(colors)
    const cartReducer = useSelector(store => store.cartReducer);
    const userReducer = useSelector(store => store.userReducer);
    const totalPitstop = cartReducer.pitstops.length ?? ""
    const estimatedDeliveryTime = cartReducer.estTimeStr || "Now 30 - 45 min"
    const [vouchersList, setVouchersList] = useState([])
    const [switchVal, setSwitchVal] = useState(false)
    const [paymentMode, setpaymentMode] = useState("Wallet")
    const paymentMethod = "Payment Method"
    const paymentType = "Wallet"
    const walletAmount = userReducer.wallet || "1500"
    const instructionForRider = cartReducer.riderInstructions || "Call me when you reach on the address"

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
            <AnimatedView style={checkOutStyles.paymentCardMainCOntainder}>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', marginVertical: 7 }}>
                        <SvgXml xml={svgs.paymentMethod()} width={20} height={20} />
                        <Text style={checkOutStyles.paymentMethodLabelTxt} fontFamily='PoppinsSemiBold'>{paymentMethod}</Text>
                    </View>
                    <View style={checkOutStyles.paymentOptionMainContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <SvgXml xml={switchVal ? svgs.wallet() : svgs.paymentCash()} fill={colors.grey} style={{ alignSelf: "center", height: 20, width: 20 }} />
                            <View style={checkOutStyles.paymentOptionPrimaryContainer}>
                                <Text style={checkOutStyles.paymentOptionLabelTxt} fontFamily='PoppinsSemiBold'>{switchVal ? `${paymentType}` : " Cash on delivery"}</Text>
                                {switchVal ? <Text style={checkOutStyles.paymentOptionLabelWallletTxt} fontFamily='PoppinsRegular'>{`Rs ${walletAmount}`}</Text> : null}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                            <Switch onToggleSwitch={(bool) => {
                                // onToggleSwitch(bool) 
                                setSwitchVal(bool)
                            }}
                                width={30} height={18}
                                switchContainerActive={{
                                    backgroundColor: '#48EA8B',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                }}
                                switchContainerInActive={{
                                    backgroundColor: '#C1C1C1',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                }}
                                subSwitchContainerActive={{
                                    width: 13,
                                    height: 13,
                                    borderRadius: 10,
                                    borderColor: 'white',
                                    borderWidth: 0,
                                    right: 2,
                                    backgroundColor: 'white',
                                }}
                                subSwitchContainerInActive={{
                                    width: 13,
                                    height: 13,
                                    borderRadius: 10,
                                    borderColor: 'white',
                                    backgroundColor: 'white',
                                    borderWidth: 0,
                                    right: 1,
                                }}

                            />
                        </View>
                    </View>
                </View>
            </AnimatedView>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
            <CustomHeader
                title='Checkout'
                titleStyle={{ fontSize: 16, fontFamily: FontFamily.Poppins.SemiBold, color: '#6D51BB' }}
                onLeftIconPress={goBack}
                // rightIconName=''
                containerStyle={{ borderBottomWidth: 0 }}

                rightIconName='home'
                rightIconSize={22}
                rightIconColor={colors.primary}
                onRightIconPress={() => {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name)
                }}
            //  /   defaultColor={colors.primary} 
            />
            <View style={{ backgroundColor: colors.screen_background, flex: 1 }}>
                <View style={{ top: -10 }}>
                    <StepProgress maxHighlight={3} />
                </View>
                <ScrollView style={{ flex: 1, }} showsVerticalScrollIndicator={false}>

                    <OrderEstTimeCard
                        imageHeight={IMAGE_SIZE * 0.6}
                        color={colors}
                        right={{ value: totalPitstop }}
                        middle={{ value: estimatedDeliveryTime }}
                        contentContainerStyle={{ marginBottom: 0, marginVertical: 0, marginTop: 10, borderRadius: 8 }}
                        rightContainerStyle={{}}
                        middleContainerStyle={{ flex: 2 }}
                        leftContainerStyle={{ paddingRight: 15 }}
                    />
                    <DeliveryAddress
                        contianerStyle={{ margin: TOPSPACING, marginBottom: 2, padding: 0, borderRadius: 8 }}
                        addressTxtStyle={{ fontSize: 14, color: "#6D51BB", paddingHorizontal: 10 }}
                        instructions={instructionForRider}
                        // editIconStyle={{ marginHorizontal: 10 }}
                        editIconStyle={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginHorizontal: 12 }}
                        edit_icon_Height={18}
                        isShowLine={false}
                        finalDestinationPrimaryContainer={{ paddingLeft: 18, paddingVertical: 0, bottom: 3 }}
                    />
                    {RenderPaymentMethodCardUi()}
                    <VouchersUi checkOutStyles={checkOutStyles} />
                    <OrderRecipt checkOutStyles={checkOutStyles} cartReducer={cartReducer} colors={colors} />

                </ScrollView>
            </View>
            <AnimatedView style={{ backgroundColor: colors.white, opacity: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 5, paddingBottom:5, width: '100%', ...AppStyles.shadow ,marginBottom:3 }}>
                <Button
                    onPress={() => { }}
                    text='Place Order'
                    style={{ height: 60 }}
                    textStyle={{}}
                />
            </AnimatedView>

        </SafeAreaView>
    )
}

