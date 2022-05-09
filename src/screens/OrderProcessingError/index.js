import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Text from '../../components/atoms/Text';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import Button from '../../components/molecules/Button';
import CustomHeader from '../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard';
import DashedLine from '../../components/organisms/DashedLine';
import SitBackAnimation from '../../components/organisms/SitBackAnimation';
import { checkIfFirstPitstopRestaurant, renderPrice, sharedConfirmationAlert, sharedExceptionHandler, sharedFetchOrder, sharedGenerateProductItem, sharedNotificationHandlerForOrderScreens, sharedOrderNavigation, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { getRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV, { ORDER_STATUSES, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { OrderProcessingChargesUI, OrderProcessingEstimatedTotalUI } from '../OrderProcessing';
import { stylesFunc } from './styles';

const IMAGE_SIZE = constants.window_dimensions.width * 0.3;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE  
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.JOVI;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    const orderIDParam = route?.params?.orderID ?? 0;
    const showBack = route?.params?.showBack ?? false;
    const styles = stylesFunc(colors);
    const fcmReducer = useSelector(store => store.fcmReducer);
    const dispatch = useDispatch();
    // #endregion :: STYLES & THEME END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={{ ...styles.primaryContainer, flex: 0, }}>
                <CustomHeader

                    rightIconName='home'
                    hideFinalDestination
                    title={'Approval'}
                    leftIconName={showBack ? 'chevron-back' : null}
                    rightIconSize={22}
                    rightIconColor={colors.primary}
                    onRightIconPress={() => {
                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
                    }}
                    defaultColor={colors.primary}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 


    // #region :: STATE's & REF's START's FROM HERE 
    const [state, setState] = React.useState({
        orderID: orderIDParam ?? 0,
        pitStopsList: [],
        isLoading: true,
        orderActionLoading: false,
        chargeBreakdown: {},
        orderEstimateTimeViewModel: null,
        orderEstimateTime: null,
        estimateTime: null,
        sitBackAnimation: false,
        postSitBackAnimationData: null,
    });

    // #endregion :: STATE's & REF's END's FROM HERE 
    const goToHome = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
    }
    const orderCancelledOrCompleted = () => {
        goToHome();
    }
    const goToOrderTracking = (status = '', pitstopsList = []) => {
        sharedOrderNavigation(orderIDParam, status, ROUTES.APP_DRAWER_ROUTES.OrderProcessingError.screen_name, null, false, pitstopsList = [] ?? []);
        return;
    }
    const sitBackAnimation = (orderStatus = '', pitstopsList = []) => {
        setState(pre => ({
            ...pre,
            sitBackAnimation: true,
            postSitBackAnimationData: {
                orderStatus,
                pitstopsList,
            }
        }));
    }
    const fetchOrderDetails = () => {
        sharedFetchOrder(orderIDParam, (res) => {
            let allowedOrderStatuses = [ORDER_STATUSES.CustomerApproval, ORDER_STATUSES.CustomerProblem];
            if (!allowedOrderStatuses.includes(res.data.order.subStatusName)) {
                if (res.data.order.subStatusName === ORDER_STATUSES.RiderFound) {
                    sitBackAnimation(res.data.order.subStatusName, res.data?.order?.pitStopsList ?? []);
                } else {
                    goToOrderTracking(res.data.order.subStatusName, res.data?.order?.pitStopsList ?? []);
                    // sharedOrderNavigation(orderIDParam, res.data.order.subStatusName, ROUTES.APP_DRAWER_ROUTES.OrderProcessingError.screen_name, null, false, res.data?.order?.pitStopsList ?? []);
                }
                return;
            }
            let updatedPitstops = res.data.order.pitStopsList.map((item, i) => {
                let updatedPitstop = { ...item };
                if (item.jobItemsListViewModel && item.jobItemsListViewModel.length > 0) {
                    let outOfStockItems = [];
                    let replacedItems = [];
                    let availableItems = [];
                    item.jobItemsListViewModel.map((pitstopItem, j) => {
                        if (pitstopItem.pitStopItemStatus === 1) {
                            availableItems.push(pitstopItem);
                        } else if (pitstopItem.pitStopItemStatus === 2) {
                            outOfStockItems.push(pitstopItem);
                        } else if (pitstopItem.pitStopItemStatus === 4) {
                            replacedItems.push(pitstopItem);
                        }
                    });
                    updatedPitstop = { ...updatedPitstop, outOfStockItems, replacedItems, availableItems };
                }
                return { ...updatedPitstop }
            });
            setState(pre => ({ ...pre, ...res.data.order, pitStopsList: updatedPitstops, isLoading: false }));

        });
    }
    const fetchEstimateTime = () => {
        getRequest(Endpoints.OrderEstimateTime + '/' + orderIDParam, (res) => {
            if (res.data.statusCode === 200) {
                setState(pre => ({
                    ...pre,
                    orderEstimateTimeViewModel: res.data.orderEstimateTimeViewModel,
                    orderEstimateTime: res.data.orderEstimateTime,
                    estimateTime: res.data.estimateTime,
                }));
            }
            console.log('res [fetchOrderEstimation] - ', res);
        }, () => { }, {}, false);
    }
    React.useEffect(() => {
        sharedNotificationHandlerForOrderScreens(fcmReducer, fetchOrderDetails, orderCancelledOrCompleted, orderIDParam);
        return () => {
        }
    }, [fcmReducer]);
    React.useEffect(() => {
        fetchOrderDetails();
        fetchEstimateTime();
        return () => { };
    }, []);

    const orderDecision = isConfirm => {
        setState((pre) => ({ ...pre, orderActionLoading: isConfirm ? 'accept' : 'cancel', }));
        postRequest(
            Endpoints.AcceptRejectOrder,
            {
                "orderID": orderIDParam,
                "isConfirm": isConfirm
            },
            (response) => {
                console.log("[AcceptRejectOrder].respone", response);
                const { statusCode, orderStatusVM } = response.data;
                if (statusCode === 200) {
                    if (isConfirm) {
                        const isFirstPitstopRestaurant = checkIfFirstPitstopRestaurant(state.pitStopsList);
                        const routeToGo = isFirstPitstopRestaurant ? ROUTES.APP_DRAWER_ROUTES.OrderTracking.screen_name : ROUTES.APP_DRAWER_ROUTES.OrderProcessing.screen_name;
                        NavigationService.NavigationActions.stack_actions.replace(routeToGo, { orderID: orderIDParam }, ROUTES.APP_DRAWER_ROUTES.OrderProcessingError.screen_name);
                    } else {
                        NavigationService.NavigationActions.common_actions.goBack();
                    }
                }
            },
            (error) => {
                sharedExceptionHandler(error);
                setState((pre) => ({ ...pre, orderActionLoading: false }));
            },
        );
    }
    const verifyCustomerDecision = (isConfirm) => {
        sharedConfirmationAlert("Confirm!", `Are you sure you want to ${isConfirm ? "continue" : "cancel"} this order?`, null, null, {
            cancelButton: { text: "No", onPress: () => { } },
            okButton: {
                text: "Yes", onPress: () => orderDecision(isConfirm)
            },
        });
    }

    const _renderFooter = () => {
        return (
            <>
                <OrderProcessingChargesUI
                    title={`Subtotal (Incl GST ${state.orderReceiptVM.chargeBreakdown.totalProductGST})`}
                    value={renderPrice(state.orderReceiptVM.subTotal)} />
                <DashedLine />

                <OrderProcessingChargesUI
                    title='Total Discount'
                    value={`${renderPrice({ showZero: true, price: state.orderReceiptVM.chargeBreakdown.discount }, 'Rs.')}`}
                // value={parseInt(renderPrice(state.orderReceiptVM.chargeBreakdown.discount, '')) > 0 ? renderPrice(state.chargeBreakdown.discount, '-') : renderPrice(state.chargeBreakdown.discount, '')}
                />
                <DashedLine />

                {/* <OrderProcessingChargesUI
                    title='Total GST'
                    value={renderPrice(state.orderReceiptVM.chargeBreakdown.totalProductGST, '')} /> */}

                <OrderProcessingChargesUI
                    title={`Service Charges(Incl S.T ${renderPrice(state.orderReceiptVM.chargeBreakdown.estimateServiceTax, '')})`}
                    value={renderPrice(state.orderReceiptVM.chargeBreakdown.estimateServiceTax + state.orderReceiptVM.chargeBreakdown.totalEstimateCharge, '')} />
                <DashedLine />


                <OrderProcessingEstimatedTotalUI estimatedPrice={renderPrice(state.orderReceiptVM.estTotalPlusPitstopAmount, '')} />
            </>
        )
    }

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
            {state.sitBackAnimation && <SitBackAnimation onComplete={() => {
                goToOrderTracking(state?.postSitBackAnimationData?.orderStatus, state?.postSitBackAnimationData?.pitstopsList)
            }} />}
            <OrderEstTimeCard
                imageHeight={IMAGE_SIZE * 0.6}
                color={colors}
                middle={{
                    value: state.orderEstimateTimeViewModel ? state.orderEstimateTimeViewModel?.orderEstimateTime?.trim() : ' - ',
                }} />

            <AnimatedFlatlist
                data={state.pitStopsList}
                flatlistProps={{
                    contentContainerStyle: {
                        paddingBottom: 75,
                    },
                    ListFooterComponent: <View style={styles.cardContainer}>
                        {_renderFooter()}
                    </View>
                }}
                renderItem={(item, index) => {
                    // if (!item.hasError) return null;
                    if (index === state.pitStopsList.length - 1) return;
                    const isJoviJob = item.catID === '0';
                    return (
                        <View style={styles.cardContainer} key={index}>
                            <CardTitle
                                pitstopType={VALIDATION_CHECK(item.pharmacyPitstopType === 0 ? null : item.pharmacyPitstopType) ? PITSTOP_TYPES.PHARMACY : isJoviJob ? 2 : item.catID}
                                pitstopNumber={`${index + 1}`}
                                title={isJoviJob ? (VALIDATION_CHECK(item.pharmacyPitstopType === 0 ? null : item.pharmacyPitstopType) ? ENUMS.PharmacyPitstopTypeServer[item.pharmacyPitstopType].text : 'Jovi Job') : item.title}
                                strikethrough={item.joviJobStatus === ENUMS.JOVI_JOB_STATUS.Cancel || (item?.forceStrikethrough ?? false)}
                            />
                            <DashedLine />
                            {
                                item.isSkipped ? <>
                                    <CardSubTitle type={CARD_SUB_TITLE_TYPES.cancelled} />
                                    <View style={styles.greyCardContainer}>
                                        {item.jobItemsListViewModel.map((childItem, childIndex) => {
                                            return (
                                                <CardText
                                                    key={childIndex}
                                                    title={childItem.productItemName}
                                                    price={childItem.price}
                                                    actualPrice={childItem.actualPrice}
                                                    type={CARD_SUB_TITLE_TYPES.cancelled}
                                                    quantity={childItem.quantity}
                                                    options={childItem.jobItemOptions?.length > 0 ? childItem.jobItemOptions : (childItem.jobDealOptions ?? [])}
                                                />
                                            )
                                        })}
                                    </View>
                                </>
                                    :
                                    !item.isSkipped && !isJoviJob && item.availableItems.length > 0 && <>
                                        <CardSubTitle type={CARD_SUB_TITLE_TYPES.accepted} />
                                        <View style={styles.greyCardContainer}>
                                            {item.availableItems.map((childItem, childIndex) => {
                                                return (
                                                    <CardText
                                                        key={childIndex}
                                                        title={childItem.productItemName}
                                                        price={childItem.price}
                                                        actualPrice={childItem.actualPrice}
                                                        type={CARD_SUB_TITLE_TYPES.available}
                                                        quantity={childItem.quantity}
                                                        options={childItem.jobItemOptions?.length > 0 ? childItem.jobItemOptions : (childItem.jobDealOptions ?? [])}
                                                    />
                                                )
                                            })}
                                        </View>
                                    </>
                            }
                            {

                                isJoviJob && <>
                                    <View style={styles.greyCardContainer}>
                                        <CardText
                                            title={item.title}
                                            price={item.estimatePrice}
                                            type={CARD_SUB_TITLE_TYPES.available}
                                        />
                                    </View>
                                </>
                            }
                            {item.outOfStockItems?.length > 0 &&
                                <>
                                    <CardSubTitle type={CARD_SUB_TITLE_TYPES.outOfStock} />

                                    <View style={styles.greyCardContainer}>
                                        {item.outOfStockItems.map((childItem, childIndex) => {
                                            return (
                                                <CardText
                                                    key={childIndex}
                                                    title={childItem.productItemName}
                                                    price={childItem.price}
                                                    type={CARD_SUB_TITLE_TYPES.outOfStock}
                                                    quantity={childItem.quantity}
                                                    options={childItem.jobItemOptions?.length > 0 ? childItem.jobItemOptions : (childItem.jobDealOptions ?? [])}
                                                />
                                            )
                                        })}
                                    </View>
                                </>
                            }

                            {item.replacedItems?.length > 0 &&
                                <>
                                    <CardSubTitle type={CARD_SUB_TITLE_TYPES.replaced} />

                                    <View style={styles.greyCardContainer}>
                                        {item.replacedItems.map((childItem, childIndex) => {
                                            return (
                                                <View
                                                    key={childIndex}
                                                >
                                                    <CardText
                                                        title={childItem.replacedItemName}
                                                        price={childItem.replacedItemPrice}
                                                        type={CARD_SUB_TITLE_TYPES.outOfStock}
                                                    />
                                                    <CardText
                                                        title={childItem.productItemName}
                                                        price={childItem.price}
                                                        type={CARD_SUB_TITLE_TYPES.available}
                                                    />
                                                </View>
                                            )
                                        })}
                                    </View>
                                </>
                            }
                        </View>
                    )
                }} />



            {/* ****************** Start of BOTTOM BUTTON ****************** */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,

                backgroundColor: colors.white,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: constants.spacing_horizontal,
                paddingVertical: constants.spacing_vertical,
            }}>
                <Button
                    onPress={() => verifyCustomerDecision(false)}
                    text="Cancel"
                    isLoading={state.orderActionLoading === 'cancel'}
                    disabled={state.orderActionLoading === 'accept'}
                    style={{
                        width: "30%",
                        backgroundColor: colors.white,
                        height: 45,
                        marginRight: constants.spacing_horizontal,
                        borderColor: "#C4C4C4",
                        borderWidth: 0.5,
                        borderRadius: 7,
                    }}
                    textStyle={{
                        color: "#B2B2B2",
                        fontSize: 12,
                        fontFamily: FontFamily.Poppins.Medium,
                    }} />

                <Button
                    onPress={() => verifyCustomerDecision(true)}
                    // disabled={enableDisableButton}
                    disabled={state.orderActionLoading === 'cancel'}
                    isLoading={state.orderActionLoading === 'accept'}
                    text='Continue with your order'
                    style={{
                        width: "68%",
                        height: 45,
                    }}
                    textStyle={{
                        color: colors.white,
                        fontSize: 15,
                        fontFamily: FontFamily.Poppins.Medium,
                    }}
                />
            </View>

            {/* ****************** End of BOTTOM BUTTON ****************** */}



        </View>
    )
};//end of EXPORT DEFAULT

// #region :: CARD TEXT UI START's FROM HERE 
const CardText = ({ title = '', price = '', type, quantity = null, options = null, actualPrice = 0 }) => {
    const productTitle = sharedGenerateProductItem(title, quantity, options);
    if (type === CARD_SUB_TITLE_TYPES.cancelled || type === CARD_SUB_TITLE_TYPES.outOfStock) {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "70%",
                    fontSize: 12,
                    color: "#B1B1B1",
                    textDecorationLine: "line-through",
                    textDecorationColor: "#B1B1B1",

                }} numberOfLines={3}>{`${productTitle}`}</Text>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "30%",
                    fontSize: 12,
                    color: "#B1B1B1",
                    textDecorationLine: "line-through",
                    textDecorationColor: "#B1B1B1",
                }} numberOfLines={1}>{`${renderPrice({ showZero: true, price: `${price}` })}`}</Text>
            </View>
        )
    }
    return (
        <>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "70%",
                    fontSize: 12,
                    color: "#272727",

                }} numberOfLines={3}>{`${productTitle}`}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text fontFamily='PoppinsMedium' style={{
                        fontSize: 12,
                        color: "#272727",
                    }} numberOfLines={1}>{`${renderPrice({ showZero: true, price: `${price}` })}  `}</Text>
                    {
                        actualPrice > price ?
                            <Text style={{
                                fontSize: 12,
                                color: "#B1B1B1",
                                textDecorationLine: "line-through",
                                textDecorationColor: "#B1B1B1",
                            }} numberOfLines={1}>{renderPrice(`${actualPrice}`)}

                            </Text>
                            : null
                    }
                </View>
            </View>
        </>
    )


}

// #endregion :: CARD TEXT UI END's FROM HERE 

// #region :: CODE SUB TITLE UI START's FROM HERE 
const CARD_SUB_TITLE_TYPES = {
    "available": -1,
    "cancelled": 1,
    "outOfStock": 2,
    "replaced": 3,
    "accepted": 4,
}
const CardSubTitle = ({ type = CARD_SUB_TITLE_TYPES.cancelled }) => {
    let color = "#D80D30";//DEFAULT IS CANCELLED
    let text = "Vendor was unable to fulfil your order";
    let icon = 'shopping-bag';
    let iconType = 'FontAwesome5';
    if (type === CARD_SUB_TITLE_TYPES.outOfStock) {
        color = "#F98500";
        text = "Out of stock";
    } else if (type === CARD_SUB_TITLE_TYPES.replaced) {
        color = "#2D5AD5";
        text = "Replaced";
    } else if (type === CARD_SUB_TITLE_TYPES.accepted) {
        color = "green";
        text = "Vendor has accepted your order";
        icon = "checkcircle";
        iconType = 'AntDesign';
    }
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: constants.spacing_horizontal,
            paddingTop: constants.spacing_vertical,
        }}>
            <VectorIcon name={icon} type={iconType} color={color} />
            <Text fontFamily='PoppinsSemiBold' style={{
                paddingLeft: 6,
                color: "#272727",
                fontSize: 12,
            }}>{text}</Text>
        </View>
    )
}

// #endregion :: CODE SUB TITLE UI END's FROM HERE 

// #region :: CARD TITLE UI START's FROM HERE 
const CardTitle = ({ pitstopType, strikethrough = false, pitstopNumber = '', title = '' }) => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    pitstopNumber = `${pitstopNumber}`.trim();
    title = `${title}`.trim();
    if (strikethrough) {
        return (
            <Text style={{
                padding: constants.spacing_horizontal,
                fontSize: 17,
                color: "#D80D30",
                textDecorationLine: "line-through",
                textDecorationColor: "#D80D30",
            }} numberOfLines={1}>{`Pitstop ${pitstopNumber} - ${title}`}
            </Text>
        )
    }
    return (
        <Text style={{
            padding: constants.spacing_horizontal,
            fontSize: 17,
            color: "#272727",
        }} numberOfLines={1}>{`Pitstop ${pitstopNumber} - `}
            <Text style={{
                color: colors.primary,
            }} numberOfLines={1}>{`${title}`}</Text>
        </Text>
    )
}

     // #endregion :: CARD TITLE UI END's FROM HERE 