import React, { useRef, useState } from 'react'
import { Alert, Appearance, Platform, ScrollView, } from 'react-native'
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
import { getRequest, postRequest } from '../../manager/ApiManager'
import Endpoints from '../../manager/Endpoints'
import { sharedCalculatedTotals, sharedExceptionHandler, sharedGetDeviceInfo, sharedGetPromoList, sharedGetServiceCharges, sharedOrderNavigation, sharedVerifyCartItems } from '../../helpers/SharedActions'
import Button from '../../components/molecules/Button'
import OrderRecipt from './components/OrderRecipt'
import { useDispatch, useSelector } from 'react-redux'
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard'
import AppStyles from '../../res/AppStyles'
import VouchersUi from './components/VouchersUi'
import NavigationService from '../../navigations/NavigationService'
import DeliveryAddress from '../../components/atoms/DeliveryAddress'
import StepProgress from '../../components/atoms/StepProgress'
import ROUTES from '../../navigations/ROUTES'
import Toast from '../../components/atoms/Toast';
import actions from '../../redux/actions'
import ENUMS from '../../utils/ENUMS'
import AnimatedModal from '../../components/organisms/AnimatedModal'
import GoodyBag from '../GoodyBag'

const WINDOW_WIDTH = constants.screen_dimensions.width;
const CARD_WIDTH = WINDOW_WIDTH * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 0.4;
const TOPSPACING = 10

const IMAGE_SIZE = constants.window_dimensions.width * 0.3;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED['10']], Appearance.getColorScheme() === "dark");
    const checkOutStyles = StyleSheet.styles(colors)
    const { userReducer, cartReducer } = useSelector(store => ({ userReducer: store.userReducer, cartReducer: store.cartReducer }));
    const totalPitstop = cartReducer.pitstops.length ?? ""
    const estimatedDeliveryTime = cartReducer.orderEstimateTime || ""
    const [vouchersList, setVouchersList] = useState([])
    const dispatch = useDispatch();
    const [switchVal, setSwitchVal] = useState(true)
    const [paymentMode, setpaymentMode] = useState("Wallet")
    const paymentMethod = "Payment Method"
    const paymentType = "Wallet"
    const walletAmount = userReducer.balance || 0;
    const instructionForRider = GV.RIDER_INSTRUCTIONS.current;
    React.useEffect(() => {
        sharedGetPromoList()
        sharedVerifyCartItems();
        // sharedGetServiceCharges(null, (res) => {
        //     setState(pre => ({
        //         ...pre,
        //         chargeBreakdown: res.data.chargeBreakdown,
        //     }));
        // });

    }, []);
    let promoList = userReducer.promoList ?? []
    const [state, setState] = React.useState({
        chargeBreakdown: cartReducer.chargeBreakdown,
        isLoading: false,
        isModalVisible: false,
        selectedVoucher: {}
    });
    // console.log("[Checkout] cartReducer", cartReducer);


    // const estimateServiceCharge = () => {
    //     let payload = newJoviPitstop ? {
    //         "pitstops": [...pitstops].map((item, index) => ({
    //             "isRestaurant": (item?.pitstopItemsList?.[0]?.isRestaurant) ? true : false,
    //             "latLng": `${item.latitude},${item.longitude}`
    //         })),
    //         "orderID": state.orderID
    //     }
    //         :
    //         {
    //             "joviJobAmount": (pitstops.map((p, i) => (p.details && parseInt(p.details.estCost)) || 0).reduce((a, b) => a + b)),
    //             "estimateTime": (state?.restarantPitstopsEstTime && state?.restarantPitstopsEstTime?.toString().trim() !== "" && state?.restarantPitstopsEstTime?.toString().trim() !== "0") ? state?.restarantPitstopsEstTime : null,
    //             "pitstops": [...pitstops, state.finalDestObj].map((item, index) => ({
    //                 "isRestaurant": (item?.pitstopItemsList?.[0]?.isRestaurant) ? true : false,
    //                 "latLng": `${item.latitude},${item.longitude}`
    //             })),
    //             "userID": userObj?.userID,
    //             "hardwareID": deviceMAC,
    //             "promoCodeApplied": (promoCode ? promoCode : clearPromo ? "" : state.promoCodeApplied),
    //             "skipEstAmountAndGst": state.pitstops.find(p => p.pitstopID) ? false : true,
    //         }
    //     postRequest(Endpoints.SERVICE_CHARGES, {}, (res) => {
    //         if (res.data.statusCode === 200) {

    //         }
    //     }, err => {
    //         sharedExceptionHandler(err);
    //     });
    // }

    const onPlaceOrder = () => {
        const placeOrder = async () => {
            setState(pre => ({ ...pre, isLoading: true }));
            const finalPitstops = [...cartReducer.pitstops || [], { ...userReducer.finalDestObj, isDestinationPitstop: true }];
            let selectedPromoCode = state.selectedVoucher?.promoCode ?? ''
            const finalOrder = {
                "pitStopsList": finalPitstops.map((item, index) => {
                    console.log('item ==>>>', item);
                    if ((item.isJoviJob || item.isPharmacy) && !item.isDestinationPitstop) {
                        let minEstimateTime = item.estTime?.text?.split(' ')[0]?.split('-')[0] ?? '';
                        let maxEstimateTime = item.estTime?.text?.split(' ')[0]?.split('-')[1] ?? '';
                        let prescriptionImagesID = null;
                        let fileIDList = null;
                        if (item.estTime?.text?.includes('hour')) {
                            minEstimateTime = '01:00';
                            maxEstimateTime = '01:00';//as instructed by tabish, he was saying that in 1hour+ case, send same value for min max
                        } else {
                            minEstimateTime = minEstimateTime.length === 1 ? '00:0' + minEstimateTime : '00:' + (minEstimateTime ?? '00');
                            maxEstimateTime = maxEstimateTime.length === 1 ? '00:0' + maxEstimateTime : '00:' + (maxEstimateTime ?? '00');
                            maxEstimateTime = maxEstimateTime.replace('60', '59');
                        }
                        if (item.isPickupPitstop) {
                            minEstimateTime = '00:15';
                            maxEstimateTime = '00:30';
                        }
                        if (item.isPharmacy) {
                            prescriptionImagesID = (item.imageData ?? []).map((item, index) => {
                                return item.joviImageID
                            });
                            fileIDList = item.voiceNote ? [item.voiceNote.joviImageID] : null;
                        } else {
                            if (item.imageData.length) {
                                fileIDList = (item.imageData ?? []).map((item, index) => {
                                    return item.joviImageID
                                });
                            }
                            if (item.voiceNote && item.voiceNote?.joviImageID) {
                                fileIDList = [...fileIDList ?? [], item.voiceNote.joviImageID]
                            }
                        }
                  
                        const newFileIDList = (fileIDList ?? []).filter(n => n);
                        return {
                            "pitstopID": null,
                            "title": item.title,
                            "city": item.city ? item.city : "",
                            "description": item.description ? item.description : "",
                            "latitude": item.latitude ?? 0,
                            "latitudeDelta": item.latitudeDelta ?? 6,
                            "longitude": item.longitude ?? 0,
                            "longitudeDelta": item.longitudeDelta ?? 6,
                            "addressID": item.addressID ? item.addressID : null,
                            "buyForMe": item.buyForMe ? true : false,
                            // "estimateTime": '00:20',//to be removed from backend, because according to new design, it will be min estimate time and max estimate time
                            "minEstimateTime": minEstimateTime,
                            "maxEstimateTime": maxEstimateTime,
                            // "estimateTime": item.estTime.value,
                            "estimatePrice": item.estimatePrice,
                            "isFavourite": item.isFavourite ? item.isFavourite : false,
                            "addressType": item.addressType ? item.addressType : null,
                            "catID": 0,
                            "catTitle": "Jovi",
                            "PharmacyPitstopType": item.isPharmacy ? (item.isPickupPitstop ? 1 : 2) : null,
                            "pitstopType": 2,
                            "isDestinationPitstop": false,
                            "dateTime": new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                            "prescriptionImagesID": prescriptionImagesID,
                            ...(newFileIDList.length > 0) && {
                                "fileIDList": newFileIDList,
                            }
                        }
                    }
                    return {
                        "pitstopID": item.pitstopID ? item.pitstopID : null,
                        "title": item.title ?? 'Final Destination',
                        "city": item.city ? item.city : "",
                        "description": item.description ? item.description : "",
                        "latitude": item.latitude,
                        "latitudeDelta": item.latitudeDelta ?? 6,
                        "longitude": item.longitude,
                        "estimateTime": item.vendorMaxEstTime || "",
                        "longitudeDelta": item.longitudeDelta ?? 6,
                        "addressID": item.addressID ? item.addressID : null,
                        // "estimateTime": item.estPrepTime ?? 20,
                        "isFavourite": item.isFavourite ? item.isFavourite : false,
                        "addressType": item.addressType ? item.addressType : null,
                        "pitstopType": item.pitstopType ?? 0,
                        // "addressTypeStr": item.addressTypeStr ? item.addressTypeStr : null,
                        "isDestinationPitstop": item.isDestinationPitstop ? item.isDestinationPitstop : false,
                        "pitstopItemsList": (item.checkOutItemsListVM && Array.isArray(item.checkOutItemsListVM) ?
                            item.checkOutItemsListVM.map((obj) => ({
                                "pitstopItemID": obj.pitStopItemID ? obj.pitStopItemID : null,
                                "pitstopDealID": obj.pitStopDealID && obj.pitStopDealID !== 0 ? obj.pitStopDealID : null,
                                "pitstopItemName": obj.pitStopItemName ?? '',
                                // "pitstopItemName": (obj.pitstopDealID && obj.pitstopDealVM) ? obj.pitstopDealVM.title : obj.productItemName,
                                "quantity": obj.quantity,
                                "checkoutItemID": obj.checkOutItemID,
                                "amount": obj.itemPrice,
                                //new Keys added for new create update order
                                "actualPrice": (obj._priceForSubtotals - obj.gstAmount),
                                // "actualPrice": obj.itemPrice,
                                "Price": obj._itemPrice || obj.itemPrice,
                                "DiscountType": obj.discountType,
                                "DiscountRate": obj.discountAmount,
                                "DiscountedPrice": obj.itemPrice - obj._totalDiscount,
                                "Description": obj.notes ?? obj.description,

                                "IsJoviDiscount": obj.isJoviDiscount ?? 0,
                                "JoviDiscount": obj.joviDiscount ?? 0,
                                "JoviDiscountType": obj.joviDiscountType ?? 0,
                                "joviDiscountedPrice": obj.totalJoviDiscount ?? 0,
                                // tabish
                                "joviDiscountAmount": obj.totalJoviDiscount ?? 0,
                                "discountAmount": obj.itemPrice - obj._totalDiscount,
                                // tabish
                                //End New Keys
                                "estimateTime": obj.estimatePrepTime || 0,
                                "gstPercentage": obj.gstPercentage,
                                "gstAddedPrice": obj.gstAddedPrice + (obj.totalJoviDiscount || 0) + (obj._totalDiscount || 0),//backend is expecting gst added price without discounts, due to deadline, it couldn't be calculated from backend,
                                "restaurantProductNotFound": (obj.isRestaurant && obj.restaurantProductNotFound) ? obj.restaurantProductNotFound : 0,
                                "pitstopItemsOptionList": (obj.isRestaurant || item.pitstopType === 4 ?
                                    // A non-deal type restaurant item
                                    (obj.pitStopDealID ?
                                        ((obj.selectedOptions) || []).map((o, i) => ({
                                            "itemOptionID": null,
                                            "price": o.optionPrice,
                                            "dealOptionItemID": o.itemOptionID,
                                            "quantity": 0,
                                        })) :
                                        (obj.selectedOptions || []).map((o, i) => ({
                                            "itemOptionID": o.itemOptionID,
                                            "price": o.optionPrice,
                                            "dealOptionItemID": null,
                                            "quantity": 0,
                                            "pitstopDealItemOptionItemList": null
                                        }))
                                    )
                                    :
                                    null
                                )
                            }))
                            :
                            null
                        ),
                        "catID": (!item.isDestinationPitstop) ? item?.pitstopType.toString() : "0",
                        "catTitle": (!item.isDestinationPitstop) ? PITSTOP_TYPES_INVERTED[item.pitstopType] : "Final Destination"
                    }
                }),
                "promotionCode": selectedPromoCode,
                "orderTypeID": 2,
                "OrderPaymentType": switchVal ? ENUMS.OrderPaymentType.JoviWallet : ENUMS.OrderPaymentType.CashOnDelivery,
                // "pitStopsImage": state?.mapImageBase64 ?? null,
                "joviType": 1,
                "chargeBreakdown": state.chargeBreakdown,
                "hardwareID": await sharedGetDeviceInfo().deviceID,
                // "productNotFoundQ": state.productNotFoundQ,
                // "prescriptionImagesID": state.prescriptionImages,
                // "customerLatitude": getLastRecordedLocationOnMap()?.latitude,
                // "customerLongitude": getLastRecordedLocationOnMap()?.longitude,
                // ref => https://cibak.atlassian.net/browse/TJA-3225 ==> Mudassir
                // "pitstopDistances": state.pitstopDistances
            };
            let recentJoviPitstops = userReducer?.recentJoviPitstops ? userReducer?.recentJoviPitstops : [];
            cartReducer.pitstops.filter(x => x.pitstopType === 2).map((item, i) => {
                let index = recentJoviPitstops.findIndex((recentPT, index) => {
                    if (recentPT.estimatePrice === item.estimatePrice && recentPT.estTime?.text === item.estTime?.text && recentPT.buyForMe === item.buyForMe && recentPT.title === item.title && recentPT.description === item.description) {
                        return true;
                    }
                    else false;
                });
                if (index !== -1) {
                    recentJoviPitstops.splice(index, 1);
                }
                recentJoviPitstops = [{ ...item, timeStamp: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), voiceNote: null, imageData: null }, ...recentJoviPitstops];
            })
            if (recentJoviPitstops.length > 12) {
                recentJoviPitstops.splice(11, recentJoviPitstops.length - 12);
            }
            // console.log("Final Order =>", finalOrder, recentJoviPitstops);
            postRequest(Endpoints.CreateUpdateOrder, finalOrder, (res) => {
                // console.log('order place res', res);
                if (res.data.statusCode === 200) {
                    Toast.success(res.data.message ?? 'Order Placed!!');
                    dispatch(actions.setUserAction({ recentJoviPitstops: recentJoviPitstops }));
                    dispatch(actions.clearCartAction());
                    sharedOrderNavigation(res.data?.createUpdateOrderVM?.orderID ?? 0, res.data?.createUpdateOrderVM?.subStatusName ?? '', null, true, false, finalOrder.pitStopsList);
                } else {
                    setState(pre => ({ ...pre, isLoading: false }));
                }
            }, err => {
                // NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.OrderProcessing.screen_name, {});
                setState(pre => ({ ...pre, isLoading: false }));
                console.log(err);
                sharedExceptionHandler(err);
            }, {}, true);
        }
        Alert.alert(
            'Are you sure?',
            'Do you want to place this order?',
            [
                {
                    text: 'No',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        placeOrder();
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const goBack = () => {
        NavigationService.NavigationActions.common_actions.goBack()
    }


    const RenderPaymentMethodCardUi = () => {
        const SHOW_WALLET = switchVal && walletAmount > 0;

        return (
            <AnimatedView style={checkOutStyles.paymentCardMainCOntainder}>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', marginVertical: 7 }}>
                        <SvgXml xml={svgs.paymentMethod()} width={20} height={20} />
                        <Text style={checkOutStyles.paymentMethodLabelTxt} fontFamily='PoppinsSemiBold'>{paymentMethod}</Text>
                    </View>
                    <View style={checkOutStyles.paymentOptionMainContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <SvgXml xml={SHOW_WALLET ? svgs.wallet() : svgs.paymentCash()} fill={colors.grey} style={{ alignSelf: "center", height: 20, width: 20 }} />
                            <View style={checkOutStyles.paymentOptionPrimaryContainer}>
                                <Text style={checkOutStyles.paymentOptionLabelTxt} fontFamily='PoppinsSemiBold'>{SHOW_WALLET ? `${paymentType}` : " Cash on delivery"}</Text>
                                {SHOW_WALLET ? <Text style={checkOutStyles.paymentOptionLabelWallletTxt} fontFamily='PoppinsRegular'>{`Rs. ${walletAmount}`}</Text> : null}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                            {walletAmount > 0 ?

                                <Switch onToggleSwitch={(bool) => {
                                    // onToggleSwitch(bool) 
                                    setSwitchVal(bool)
                                }}
                                    switchVal={switchVal}
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
                                : null
                            }

                        </View>
                    </View>
                </View>
            </AnimatedView>
        )
    }

    const seeAllVoucher = () => {
        if (state.isModalVisible && promoList?.length > 0) {
            return (
                <AnimatedModal
                    position='bottom'
                    useKeyboardAvoidingView
                    visible={state.isModalVisible}
                    contentContainerStyle={{ borderRadius: 7, width: "100%", backgroundColor: 'transparent' }}
                    containerStyle={{ backgroundColor: 'transparent', }}
                    wrapperStyl={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <ScrollView style={{ maxHeight: constants.screen_dimensions.height * .8, borderRadius: 10, marginHorizontal: 5, }}>
                        <GoodyBag
                            showHeader={false}
                            onPressClbk={(item) => {
                                setState((pre) => ({
                                    ...pre,
                                    selectedVoucher: item,
                                    isModalVisible: false
                                }))
                            }}
                            containerStyle={{ marginHorizontal: 5, borderRadius: 10, paddingBottom: 10, paddingTop: 10 }}


                        />
                    </ScrollView>
                </AnimatedModal>
            )
        }

    }
    // console.log("state=>", state);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
            <CustomHeader
                title='Checkout'
                titleStyle={{ fontSize: 16, fontFamily: FontFamily.Poppins.SemiBold, color: '#6D51BB' }}
                onLeftIconPress={goBack}
                // rightIconName=''
                containerStyle={{ borderBottomWidth: 0, }}

                rightIconName='home'
                rightIconSize={22}
                rightIconColor={colors.primary}
                onRightIconPress={() => {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name)
                }}
            //  /   defaultColor={colors.primary} 
            />
            <View style={{ backgroundColor: colors.screen_background, flex: 1, }}>
                <View style={{ top: -10 }}>
                    <StepProgress maxHighlight={3} />
                </View>
                <ScrollView style={{ flex: 1, marginTop: -10 }} showsVerticalScrollIndicator={false}>

                    <OrderEstTimeCard
                        imageHeight={IMAGE_SIZE * 0.6}
                        color={colors}
                        right={{ value: totalPitstop }}
                        middle={{ value: estimatedDeliveryTime }}
                        contentContainerStyle={{ marginBottom: 0, marginVertical: 0, marginTop: 5, borderRadius: 8, paddingVertical: 9 }}
                        rightContainerStyle={{ flex: 0 }}
                        middleContainerStyle={{ flex: 3, }}
                        leftContainerStyle={{ paddingLeft: 2, paddingRight: 15 }}

                    />
                    <DeliveryAddress
                        contianerStyle={{ margin: TOPSPACING, marginBottom: 2, padding: 0, borderRadius: 8 }}
                        addressTxtStyle={{ fontSize: 14, color: "#6D51BB", paddingHorizontal: 10 }}
                        instructions={instructionForRider}
                        editIconStyle={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14 }}
                        edit_icon_Height={18}
                        isShowLine={false}
                        finalDestinationPrimaryContainer={{ paddingLeft: 18, paddingVertical: 0, bottom: 3 }}
                    />
                    {RenderPaymentMethodCardUi()}

                    <VouchersUi checkOutStyles={checkOutStyles}
                        onPressClBk={(visible) => {
                            if (visible) {
                                setState((pre) => ({ ...pre, isModalVisible: visible }))
                            }
                            else {
                                setState((pre) => ({ ...pre, selectedVoucher: {} }))

                            }
                        }}
                        state={state}
                        promoList={promoList}

                    />
                    <OrderRecipt checkOutStyles={checkOutStyles} cartReducer={cartReducer} colors={colors} />

                </ScrollView>


            </View>

            <AnimatedView style={{ backgroundColor: colors.white, opacity: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 3, width: '100%', ...AppStyles.shadow, marginBottom: Platform.OS === 'ios' ? 0 : 0.5 }}>
                <Button
                    onPress={onPlaceOrder}
                    text='Place Order'
                    style={{ height: 60 }}
                    isLoading={state.isLoading}
                    textStyle={{}}
                />
            </AnimatedView>
            {seeAllVoucher()}
        </SafeAreaView>
    )
}

