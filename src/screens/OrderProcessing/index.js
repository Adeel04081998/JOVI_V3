import * as React from 'react';
import { Appearance, Image, SafeAreaView, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard';
import DashedLine from '../../components/organisms/DashedLine';
import { renderPrice, sharedFetchOrder, sharedGenerateProductItem, sharedOrderNavigation } from '../../helpers/SharedActions';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { ORDER_STATUSES, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { stylesFunc } from './styles';
import { orderProcessingDummyData } from './StaticData';
import AnimatedLottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import ROUTES from '../../navigations/ROUTES';
import NavigationService, { _NavgationRef } from '../../navigations/NavigationService';
import actions from '../../redux/actions';

const DOUBLE_SPACING = constants.spacing_horizontal + 6;
const IMAGE_SIZE = constants.window_dimensions.width * 0.3;

export default ({ navigation, route }) => {
    console.log('_NavgationRef', _NavgationRef.current)
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.JOVI;
    const fcmReducer = useSelector(store => store.fcmReducer);
    const dispatch = useDispatch();
    const orderIDParam = route?.params?.orderID ?? 0;
    const showBack = route?.params?.showBack ?? false;
    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");

    const styles = stylesFunc(colors);

    // #endregion :: STYLES & THEME END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={{ ...styles.primaryContainer, flex: 0, }}>
                <CustomHeader
                    rightIconName='home'
                    hideFinalDestination
                    title={'Processing'}
                    leftIconName={showBack?'chevron-back':null}
                    rightIconColor={colors.primary}
                    rightIconSize={22}
                    onRightIconPress={() => {
                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
                    }}
                    defaultColor={colors.primary} />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: STATE's & REF's START's FROM HERE 
    const [state, setState] = React.useState({
        orderID: orderIDParam ?? 0,
        pitStopsList: [],
        isLoading: true,
        chargeBreakdown: {},
    });

    // #endregion :: STATE's & REF's END's FROM HERE 
    const fetchOrderDetails = () => {
        sharedFetchOrder(orderIDParam, (res) => {
            if (res.data.statusCode === 200) {
                let allowedOrderStatuses = [ORDER_STATUSES.VendorApproval, ORDER_STATUSES.VendorProblem, ORDER_STATUSES.Initiated];
                if (!allowedOrderStatuses.includes(res.data.order.subStatusName)) {
                    sharedOrderNavigation(orderIDParam, res.data.order.subStatusName, ROUTES.APP_DRAWER_ROUTES.OrderProcessing.screen_name);
                    return;
                }
                setState(pre => ({ ...pre, ...res.data.order, isLoading: false }))
            } else {
                setState(pre => ({ ...pre, isLoading: false }))
            }
        });
    }
    const goToHome = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
    }
    const orderCancelledOrCompleted = () => {
        goToHome();
    }
    React.useEffect(() => {
        fetchOrderDetails();
        return () => { };
    }, []);
    React.useEffect(() => {
        // console.log("[Order Processing].fcmReducer", fcmReducer);
        // '1',  For job related notification
        // '11',  For rider allocated related notification
        // '12', For order cancelled by admin
        // '13' For order cancelled by system
        // '14' out of stock
        // '18' replaced
        const notificationTypes = ["1", "11", "12", "13", "14", "18"]
        console.log('fcmReducer------OrderProcessing', fcmReducer);
        const jobNotify = fcmReducer.notifications?.find(x => (x.data && (notificationTypes.includes(`${x.data.NotificationType}`))) ? x : false) ?? false;
        if (jobNotify) {
            console.log(`[jobNotify]`, jobNotify)
            const { data, notifyClientID } = jobNotify;
            // const results = sharedCheckNotificationExpiry(data.ExpiryDate);
            // if (results.isSameOrBefore) {
            if (data.NotificationType == notificationTypes[1] || data.NotificationType == notificationTypes[0]) {
                // console.log("[Order Processing] Rider Assigned By Firbase...");
                fetchOrderDetails();
            }
            if (data.NotificationType == notificationTypes[2] || data.NotificationType == notificationTypes[3]) {
                // console.log("[Order Processing] Order Cancelled By Firbase...");
                orderCancelledOrCompleted();
            }
            if (data.NotificationType == notificationTypes[4] || data.NotificationType == notificationTypes[5]) {
                fetchOrderDetails()
            }
            else {

            }
            //  To remove old notification
            dispatch(actions.fcmAction({ notifyClientID }));
        } else console.log("[Order Processing] Job notification not found!!");
        return () => {
        }
    }, [fcmReducer]);
    if (state.isLoading) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <AnimatedLottieView
                source={require('../../assets/gifs/Processingloading.json')}
                autoPlay
                loop
                style={{
                    height: '100%',
                    width: "100%",
                    alignSelf: "center",
                    marginTop: 10,
                    marginBottom: 15,
                }}
            />
        </View>
    }

    return (
        <View style={styles.primaryContainer}>
            {_renderHeader()}

            <OrderEstTimeCard
                imageHeight={IMAGE_SIZE * 0.6}
                color={colors}
                middle={{
                    value: state.orderEstimateTime
                    // value: `Now ${data.OrderEstimateTime.replace('min'.toLowerCase().trim(), 'min')}`
                }} />



            {/*  ****************** Start of IMAGE, TEXT & LOADING BAR LINE ****************** */}
            <AnimatedLottieView
                source={require('../../assets/gifs/FoodProcessing.json')}
                autoPlay
                loop
                style={{
                    height: IMAGE_SIZE,
                    width: IMAGE_SIZE,
                    alignSelf: "center",
                    // marginBottom: 15,
                }}
            />
            {/* <Image source={require('../../assets/gifs/OrderProcessing.gif')}
                style={{
                    height: IMAGE_SIZE,
                    width: IMAGE_SIZE,
                    alignSelf: "center",
                }}
            /> */}

            {/* <Text fontFamily='PoppinsMedium' style={{
                fontSize: 16,
                color: colors.primary,
                textAlign: "center",
                alignItems: "center",
                paddingTop: 0,
                paddingBottom: 15,
            }}>{`Processing order`}</Text> */}

            <AnimatedLottieView
                source={require('../../assets/gifs/Loadingbar.json')}
                autoPlay
                loop
                style={{
                    height: 6,
                    width: "70%",
                    alignSelf: "center",
                    marginBottom: 15,
                }}
            />
            {/* <Image source={require('../../assets/gifs/OrderProcessingLoadingBar.gif')}
                style={{
                    height: 6,
                    width: "70%",
                    alignSelf: "center",
                    marginBottom: 15,
                }}
            /> */}

            {/*  ****************** End of IMAGE, TEXT & LOADING BAR LINE ****************** */}


            {/* ****************** Start of ORDER DETAIL CARD ****************** */}
            <View style={styles.cardContainer}>
                <Text fontFamily='PoppinsMedium' style={{
                    color: "#272727",
                    fontSize: 16,
                    paddingHorizontal: DOUBLE_SPACING,
                }}>{`Order Details`}</Text>


                <View style={{
                    backgroundColor: "#707070",
                    height: 1,
                    marginTop: 10,
                }} />
                <ScrollView contentContainerStyle={{ paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}>


                    {/* ****************** Start of DELIVERY ADDRESS ****************** */}
                    <OrderNumberUI colors={colors} orderNumber={`#${state.orderID}`} />
                    <DeliveryAddressUI address={`${state.pitStopsList[state.pitStopsList.length - 1]?.title ?? ''}`} />

                    {/* ****************** End of DELIVERY ADDRESS ****************** */}


                    {/* ****************** Start of SEPERATOR ****************** */}
                    <View style={{
                        backgroundColor: "#707070",
                        height: 1,
                        marginHorizontal: DOUBLE_SPACING * 2,
                        marginTop: 8,
                        marginBottom: 12,
                    }} />

                    {/* ****************** End of SEPERATOR ****************** */}


                    {/* ****************** Start of PITSTOP DETAILS ****************** */}
                    {state.pitStopsList.map((item, index) => {
                        if (index === state.pitStopsList.length - 1) return;
                        return (
                            <PitStopItemUI
                                key={index}
                                pitstopNumber={index + 1}
                                pitstopTitle={item?.title ?? ''}
                                isJoviJob={item.catID === '0'}
                                data={item.jobItemsListViewModel ?? []}
                                dataLeftKey={'productItemName'}
                                dataRightKey={'price'}
                                estimatePrice={item.estimatePrice}
                            />
                        )
                    })}

                    {/* ****************** End of PITSTOP DETAILS ****************** */}


                    {/* ****************** Start of SEPERATOR ****************** */}
                    <View style={{
                        marginBottom: constants.spacing_vertical,
                    }} />

                    {/* ****************** End of SEPERATOR ****************** */}


                    {/* ****************** Start of GST ****************** */}
                    <OrderProcessingChargesUI
                        title='GST'
                        value={renderPrice(state.chargeBreakdown.totalProductGST)} />

                    {/* ****************** End of GST ****************** */}


                    {/* ****************** Start of SERVICE CHARGES ****************** */}
                    <OrderProcessingChargesUI
                        title={`Service Charges(Incl S.T ${renderPrice(state.chargeBreakdown.estimateServiceTax, '')})`}
                        value={renderPrice(state.chargeBreakdown.estimateServiceTax + state.chargeBreakdown.totalEstimateCharge)} />
                    <DashedLine />

                    {/* ****************** End of SERVICE CHARGES ****************** */}


                    {/* ****************** Start of DISCOUNT ****************** */}
                    <OrderProcessingChargesUI title='Discount'
                        value={renderPrice(state.chargeBreakdown.discount)} />
                    {/* value={parseInt(renderPrice(state.chargeBreakdown.discount)) > 0 ? renderPrice(state.chargeBreakdown?.discount) : renderPrice(state.chargeBreakdown.discount)} /> */}
                    <DashedLine />

                    {/* ****************** End of DISCOUNT ****************** */}



                    {/* ****************** Start of ESTIMATED PRICE ****************** */}
                    <OrderProcessingEstimatedTotalUI estimatedPrice={renderPrice(state.chargeBreakdown.estimateTotalAmount)} />

                    {/* ****************** End of ESTIMATED PRICE ****************** */}



                    {/* ****************** Start of SEPERATOR ****************** */}
                    <View style={{
                        backgroundColor: "#707070",
                        height: 1,
                        marginHorizontal: DOUBLE_SPACING * 1.5,
                        marginTop: 8,
                        marginBottom: 12,
                    }} />

                    {/* ****************** End of SEPERATOR ****************** */}


                    {/* ****************** Start of PAID WITH TOTAL PRICE ****************** */}
                    <PaidWithUI price={renderPrice(state.chargeBreakdown.estimateTotalAmount)} />

                    {/* ****************** End of PAID WITH TOTAL PRICE ****************** */}

                </ScrollView>
            </View>

            {/* ****************** End of ORDER DETAIL CARD ****************** */}


        </View>
    )
};//end of EXPORT DEFAULT

// #region :: PAID WITH UI START's FROM HERE 
const PaidWithUI = ({ title = 'Cash on delivery', price = '' }) => {
    return (
        <>
            <Text fontFamily='PoppinsMedium' style={{
                color: "#272727",
                fontSize: 14,
                paddingHorizontal: constants.spacing_horizontal,
            }}>{`Paid with`}</Text>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: constants.spacing_horizontal,
                paddingTop: 15,
            }}>
                <SvgXml xml={svgs.dollar()} height={15} width={23} />
                <View style={{ flexDirection: "row", flex: 1, paddingLeft: 8, alignItems: "center", justifyContent: "space-between", }}>
                    <Text fontFamily='PoppinsSemiBold' style={{
                        color: "#272727",
                        fontSize: 11,
                    }}>{`${title}`}</Text>
                    <Text fontFamily='PoppinsSemiBold' style={{
                        color: "#272727",
                        fontSize: 11,
                        textAlign: "right",
                    }}>{`${renderPrice(price)}`}</Text>
                </View>
            </View>
        </>
    )
}

// #endregion :: PAID WITH UI END's FROM HERE 

// #region :: ESTIMATED TOTAL PRICE UI START's FROM HERE 
export const OrderProcessingEstimatedTotalUI = ({ estimatedPrice = '', title = `Estimated Total` }) => {
    return (
        <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: constants.spacing_horizontal,
        }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 16,
            }}>{`${title}`}</Text>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 16,
            }}>{`${estimatedPrice}`}</Text>
        </View>

    )
}

// #endregion :: ESTIMATED TOTAL PRICE UI END's FROM HERE 

// #region :: CHARGES, GST, DISCOUNT UI START's FROM HERE 
export const OrderProcessingChargesUI = ({ title = '', value = '', }) => {
    return (
        <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: constants.spacing_horizontal,
        }}>
            <Text style={{
                color: "#4D4D4D",
                fontSize: 13,
            }}>{`${title}`}</Text>
            <Text style={{
                color: "#4D4D4D",
                fontSize: 13,
            }}>{`${value}`}</Text>
        </View>
    )
}

// #endregion :: CHARGES, GST, DISCOUNT UI END's FROM HERE 

// #region :: PITSTOP ITEM UI  START's FROM HERE 
const PitStopItemUI = ({ pitstopTitle = '', isJoviJob = false, pitstopNumber = 1, data = [], dataLeftKey = "title", dataRightKey = "value", estimatePrice = 0 }) => {
    return (

        <View style={{ marginVertical: 8, }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 13,
                paddingHorizontal: DOUBLE_SPACING,
            }} numberOfLines={2}>{`Pit Stop ${pitstopNumber} - ${isJoviJob ? 'Jovi Job' : pitstopTitle}`}</Text>
            {
                isJoviJob ?
                    <View style={{ flexDirection: "row", alignItems: "center", }} >
                        <Text style={{
                            color: "#6B6B6B",
                            fontSize: 12,
                            paddingHorizontal: DOUBLE_SPACING * 1.5,
                            width: "75%",
                        }} numberOfLines={2}>{`${pitstopTitle}`}</Text>
                        <Text style={{
                            color: "#272727",
                            fontSize: 12,
                            paddingHorizontal: DOUBLE_SPACING,
                            width: "25%",
                            textAlign: "right",
                        }} numberOfLines={1}>{renderPrice(`${estimatePrice}`)}</Text>
                    </View>
                    :
                    null
            }
            {data.map((item, index) => {
                return (
                    <View style={{ flexDirection: "row", alignItems: "center", }} key={index}>
                        <Text style={{
                            color: "#6B6B6B",
                            fontSize: 12,
                            paddingHorizontal: DOUBLE_SPACING * 1.5,
                            width: "75%",
                        }} numberOfLines={3}>{`${sharedGenerateProductItem(item[dataLeftKey], item.quantity, item.jobItemOptions)}`}</Text>

                        <Text style={{
                            color: "#272727",
                            fontSize: 12,
                            paddingHorizontal: DOUBLE_SPACING,
                            width: "25%",
                            textAlign: "right",
                        }} numberOfLines={1}>{renderPrice(`${item[dataRightKey]}`)}</Text>
                    </View>
                )
            })}
        </View>
    )
};

// #endregion :: PITSTOP ITEM UI  END's FROM HERE 

// #region :: DELIVERY ADDRESS UI START's FROM HERE 
const DeliveryAddressUI = ({ address }) => {
    return (
        <View style={{ marginTop: 6, }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 13,
                paddingHorizontal: DOUBLE_SPACING,
            }}>{`Delivery Address:`}</Text>

            <Text style={{
                color: "#272727",
                fontSize: 12,
                paddingHorizontal: DOUBLE_SPACING * 2,
            }}>{`${address}`}</Text>
        </View>
    )
}

// #endregion :: DELIVERY ADDRESS UI END's FROM HERE 

// #region :: ORDER NUMBER UI START's FROM HERE 
const OrderNumberUI = ({ colors, orderNumber = '' }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 13,
                paddingHorizontal: DOUBLE_SPACING,
            }}>{`Your order number:`}</Text>

            <Text fontFamily='PoppinsMedium' style={{
                color: colors.primary,
                fontSize: 14,
                paddingHorizontal: DOUBLE_SPACING,
            }}>{`${orderNumber}`}</Text>
        </View>
    )
}

     // #endregion :: ORDER NUMBER UI END's FROM HERE 