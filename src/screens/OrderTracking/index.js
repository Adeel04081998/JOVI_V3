import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { Animated, Appearance, Easing, Image, PixelRatio, Platform, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import svgs from "../../assets/svgs";
import SharedMapView from "../../components/atoms/GoogleMaps/SharedMapView";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Text from "../../components/atoms/Text";
import TouchableOpacity from "../../components/atoms/TouchableOpacity";
import VectorIcon from "../../components/atoms/VectorIcon";
import View from "../../components/atoms/View";
import AnimatedProgressWheel from "../../components/molecules/AnimatedProgressWheel";
import CustomHeader from "../../components/molecules/CustomHeader";
import { sharedExceptionHandler, sharedFetchOrder, sharedForegroundCallbackHandler, sharedNotificationHandlerForOrderScreens, sharedOrderNavigation, sharedRiderRating, VALIDATION_CHECK } from "../../helpers/SharedActions";
import { getRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import NavigationService from "../../navigations/NavigationService";
import ROUTES from "../../navigations/ROUTES";
import constants from "../../res/constants";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import GV, { ORDER_STATUSES, PITSTOP_TYPES_INVERTED } from "../../utils/GV";
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useIsFocused } from "@react-navigation/native";
import _styles from './styles';
const circleCurveSvgXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.9919999999999998 11.235 2.0079999999999996 0.764">
<path d="M 0.016 11.993 q -0.313 -0.031 -0.376 -0.283 c -0.2 -0.629 -1.065 -0.618 -1.271 -0.005 c -0.051 0.206 -0.149 0.258 -0.361 0.292" fill="#fff"/>
</svg>`;
export default ({ route }) => {
    const fcmReducer = useSelector(store => store.fcmReducer);
    const userReducer = useSelector(store => store.userReducer);
    const baseHeight = 550
    const WINDOW_HEIGHT = constants.window_dimensions.height;
    const WIDTH = constants.screen_dimensions.width;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[2]], Appearance.getColorScheme() === "dark");
    const orderIDParam = route?.params?.orderID ?? 26746624;
    const SCALED_HEIGHT = PixelRatio.roundToNearestPixel(WINDOW_HEIGHT * (WINDOW_HEIGHT / baseHeight));
    const styles = _styles(colors, WIDTH, SCALED_HEIGHT);
    const isFocused = useIsFocused();
    const [state, setState] = React.useState({
        orderID: orderIDParam ?? 0,
        pitStopsList: [],
        circularPitstops: [],
        isLoading: true,
        chargeBreakdown: {},
        progress: 0,
        currentPitstop: null,
        orderEstimateTimeRange: ' - ',
        totalActivePitstops: 0,
    });
    const [estimateTime, setEstimateTime] = React.useState({
        orderEstimateTimeViewModel: {},
    });
    const [realtimeChangingState, setRealTimeState] = React.useState({
        riderLocation: null,
    });
    const [modalOpened, setModalOpened] = React.useState(true);
    const [componentLoaded, setComponentLoaded] = React.useState(false);
    const circleColor = state.subStatusName === ORDER_STATUSES.RiderFound ? '#37c130' : colors.primary;
    const isRiderFound = state.subStatusName === ORDER_STATUSES.RiderFound;
    const colorChangeAnimation = React.useRef(new Animated.Value(0)).current;
    const loadAnimation = React.useRef(new Animated.Value(0)).current;
    const loadAnimationCurrentValue = React.useRef(0);
    const fetchRiderLocationRef = React.useRef(null);
    const fetchOrderEstimationRef = React.useRef(null);
    const renderUI = {
        [ORDER_STATUSES.TransferProblem]: () => renderProcessingUI(),
        [ORDER_STATUSES.RiderProblem]: () => renderProcessingUI(),
        [ORDER_STATUSES.FindingRider]: () => renderProcessingUI(),
        [ORDER_STATUSES.RiderFound]: () => renderTimeUI(),
        [ORDER_STATUSES.Processing]: () => renderProcessingUI(),
    };
    const translateY = new Animated.Value(0);
    // const onPanGestureEvent = Animated.event(
    //     [
    //         {
    //             nativeEvent: {
    //                 translationY: translateY,
    //             },
    //         },
    //     ],
    //     { useNativeDriver: true, }
    // );
    // const onHandlerStateChange = React.useCallback(() => {
    //     console.log('translateY', translateY);
    //     translateY.extractOffset();
    // }, []);//to be implemented
    const fetchOrderDetails = () => {
        if (!isFocused) return;
        sharedFetchOrder(orderIDParam, (res) => {
            if (res.data.statusCode === 200) {
                let allowedOrderStatuses = [ORDER_STATUSES.Processing, ORDER_STATUSES.RiderFound, ORDER_STATUSES.FindingRider, ORDER_STATUSES.RiderProblem, ORDER_STATUSES.TransferProblem];
                if (!allowedOrderStatuses.includes(res.data.order.subStatusName)) {
                    sharedOrderNavigation(orderIDParam, res.data.order.subStatusName, ROUTES.APP_DRAWER_ROUTES.OrderTracking.screen_name, null, false, res.data?.order?.pitStopsList ?? []);
                    return;
                }
                let progress = 0;
                const totalActivePitstops = res.data.order.pitStopsList.filter(item => ![3, 4, 5, 9].includes(item.joviJobStatus));
                const increment = 100 / (totalActivePitstops.length);
                const circularPitstops = [{
                    icon: svgs.startingPoint()
                }];
                let currentPitstop = null;
                let updatedPitstops = [];
                totalActivePitstops.map((item, i) => {
                    updatedPitstops.push({ ...item, isFinalDestination: i === (totalActivePitstops.length - 1) });
                    if (item.joviJobStatus === 2) {
                        progress += increment;
                    }
                    if (i === (totalActivePitstops.length - 1)) return;
                    const pitstopType = item.catID === '0' ? 2 : parseInt(item.catID);
                    let focusedPitstop = ENUMS.PITSTOP_TYPES.filter(pt => pt.value === pitstopType)[0];
                    if (!currentPitstop && item.joviJobStatus !== 2 && item.joviJobStatus !== 7) {
                        currentPitstop = { ...item, index: i, isFinalDestination: i === (totalActivePitstops.length - 1), };
                    }
                    circularPitstops.push({ ...focusedPitstop, icon: VALIDATION_CHECK(item.pharmacyPitstopType === 0 ? null : item.pharmacyPitstopType) ? ENUMS.PharmacyPitstopTypeServer[item.pharmacyPitstopType].icon : focusedPitstop.icon });
                });
                if (res.data.order.subStatusName === ORDER_STATUSES.RiderFound) {
                    fetchRiderLocation();
                }
                if (!currentPitstop) {
                    currentPitstop = { ...res.data.order.pitStopsList[res.data.order.pitStopsList.length - 1], index: totalActivePitstops.length - 1, isFinalDestination: true, };
                }
                fetchOrderEstimateInterval();
                setState(pre => ({ ...pre, ...res.data.order, pitStopsList: updatedPitstops, totalActivePitstops, currentPitstop, progress: progress, isLoading: false, circularPitstops }))
                // setState(pre => ({ ...pre, ...res.data.order, pitStopsList: updatedPitstops, currentPitstop, progress: res.data.order.completedJobPercentage, isLoading: false, circularPitstops }))
            } else {
                setState(pre => ({ ...pre, isLoading: false }))
            }
        });
    }
    const fetchRiderLocation = () => {
        const fetchRiderLocationRequest = () => {
            if (!isFocused) return;
            getRequest(`${Endpoints.GetRiderLocation}/${orderIDParam}`, (res) => {
                if (res.data.statusCode === 200) {
                    let { latitude, latitudeDelta, longitude, longitudeDelta, rotation } = res.data.riderLocationViewModel;
                    try {
                        const locObj = {
                            latitude: parseFloat(latitude),
                            latitudeDelta: parseFloat(latitudeDelta),
                            longitude: parseFloat(longitude),
                            longitudeDelta: parseFloat(longitudeDelta),
                            rotation: parseFloat(rotation)
                        };

                        if (locObj.latitude) {
                            console.log('res[GetRidersLatestLocation]', locObj);
                            setRealTimeState((prevState) => ({ ...prevState, riderLocation: { ...locObj } }));
                        }
                        else {
                        }
                    }
                    catch (e) {
                        console.log('e', e);
                    }
                }
            }, err => sharedExceptionHandler(err), {}, false);
        }
        if (fetchRiderLocationRef.current) {
            clearInterval(fetchRiderLocationRef.current);
        } else if (!fetchRiderLocationRef.current) {
            fetchRiderLocationRequest();
        }
        fetchRiderLocationRef.current = setInterval(fetchRiderLocationRequest, (userReducer?.fetchRiderLocationInterval || 5) * 1000);
    }
    const fetchOrderEstimateInterval = () => {
        const fetchOrderEstimation = () => {
            if (!isFocused) return;
            getRequest(Endpoints.OrderEstimateTime + '/' + orderIDParam, (res) => {
                if (res.data.statusCode === 200) {
                    setEstimateTime(pre => ({
                        ...pre,
                        orderEstimateTimeViewModel: res.data.orderEstimateTimeViewModel,
                        orderEstimateTime: res.data.orderEstimateTime,
                        estimateTime: res.data.estimateTime,
                    }));
                }
                console.log('res [fetchOrderEstimation] - ', res);
            }, (err) => {
                console.log('err [fetchOrderEstimation] - ', err);
            }, {}, false);
        }
        if (fetchOrderEstimationRef.current) {
            clearInterval(fetchOrderEstimationRef.current);
        } else if (!fetchOrderEstimationRef.current) {
            fetchOrderEstimation();
        }
        fetchOrderEstimationRef.current = setInterval(fetchOrderEstimation, (userReducer?.fetchOrderEstimateTimeInterval || 5) * 1000);
    }
    const goToHome = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
    }
    const orderCancelledOrCompleted = (status) => {
        if (!isFocused) return;
        if (status.orderCompleted) {
            sharedRiderRating(orderIDParam);
        } else {
            goToHome();
        }
    }
    const onOrderNavigationPress = (route = '', extraParams = {}) => {
        NavigationService.NavigationActions.common_actions.navigate(route, { orderID: orderIDParam, ...extraParams });
    }
    const modalAnimation = (toValue = 1, firstTimeLoad = false) => {
        Animated.timing(loadAnimation, {
            toValue: toValue,
            useNativeDriver: true,
            duration: 500,
            easing: Easing.ease
        }).start(finished => {
            if (finished) {
                if (firstTimeLoad) {
                    setComponentLoaded(true);
                } else {
                    setModalOpened(toValue === 1);
                }
                loadAnimationCurrentValue.current = toValue;
            }
        });
    }
    React.useEffect(() => {
        fetchOrderDetails();
        modalAnimation(1, true);
        return () => {
            if (fetchRiderLocationRef.current) {
                clearInterval(fetchRiderLocationRef.current);
            }
            if (fetchOrderEstimationRef.current) {
                clearInterval(fetchOrderEstimationRef.current);
            }
        }
    }, []);
    React.useEffect(() => {
        if (!isFocused) {
            if (fetchRiderLocationRef.current) {
                clearInterval(fetchRiderLocationRef.current);
            }
        } else {
            fetchOrderDetails();
            if (isRiderFound) {
                fetchRiderLocation();
            }
        }
    }, [isFocused]);
    React.useEffect(() => {
        const subscription = sharedForegroundCallbackHandler(fetchOrderDetails)
        sharedNotificationHandlerForOrderScreens(fcmReducer, fetchOrderDetails, orderCancelledOrCompleted, orderIDParam);
        return () => {
            subscription.remove()
        }
    }, [fcmReducer]);
    const handleCircleAnimation = () => {

    }
    const renderTime = (timeFontSize = 22, minutesUI = 10) => {
        let opacity = !estimateTime.orderEstimateTimeViewModel.orderEstimateTimeStr ? 0 : 1;
        return <View style={{ opacity: opacity }}>
            <Text style={{ fontSize: timeFontSize, color: 'black', fontWeight: 'bold' }} fontFamily={'PoppinsBold'} >{" "}{estimateTime.orderEstimateTimeViewModel?.orderEstimateTimeStr?.replace('min', '')?.trim()}</Text>
            <Text style={{ fontSize: minutesUI, marginTop: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} >{` minutes \nuntil delivered`}</Text>
        </View>
    }
    const renderTimeUI = (noCircle = false) => {
        return <>
            {renderProgressWheel()}
            <View style={{ marginTop: -125, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderTime()}
            </View>
        </>
    };
    const renderProgressWheel = () => {
        return <AnimatedProgressWheel color={circleColor} pitstops={isRiderFound ? state.circularPitstops : undefined} backgroundColor={'#E7EAF1'} width={20} animateFromValue={0} progress={isRiderFound ? state.progress : 100} />
    }
    const renderProcessingUI = () => {
        console.log('renderProcessingUI');
        return <>
            {renderProgressWheel()}
            <View style={{ marginTop: -180, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: 150, width: 200 }}>
                    <AnimatedLottieView
                        source={require('../../assets/gifs/FoodPreparing.json')}
                        autoPlay
                        loop
                    />
                </View>
            </View>
        </>
    };
    const renderProgressCircle = () => {
        const sizeSvg = 137
        return <>
            <View style={{ position: 'absolute', marginTop: -165 }}>
                {/* <SvgXml style={{ top: -10, }} height={137} width={WIDTH} xml={circleCurveSvgXml} /> */}
                <Image source={require('../../assets/images/Path36964.png')} />
            </View>
            <View style={styles.orderProgressContainer}>

                {/* {renderUI[ORDER_STATUSES.RiderFound]()} */}
                {renderUI[state.subStatusName ?? ORDER_STATUSES.Processing]()}
            </View>
            <View style={styles.orderNavigationContainer}>
                <TouchableOpacity disabled={!isRiderFound} onPress={() => onOrderNavigationPress(ROUTES.APP_DRAWER_ROUTES.OrderChat.screen_name, { riderProfilePic: state.userPic })} style={{ ...styles.orderNavigationButton, backgroundColor: isRiderFound ? colors.primary : colors.grey }}>
                    <VectorIcon size={25} name={'md-chatbubble-ellipses'} type={'Ionicons'} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onOrderNavigationPress(ROUTES.APP_DRAWER_ROUTES.OrderPitstops.screen_name)} style={styles.orderNavigationButton}>
                    <SvgXml xml={svgs.order_chat_header_receipt(colors.white)} height={25} width={25} />
                </TouchableOpacity>
            </View>
        </>
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader
                hideFinalDestination
                containerStyle={styles.headerContainer}
                leftContainerStyle={{
                    backgroundColor: colors.white,
                }}
                rightContainerStyle={{
                    backgroundColor: colors.white,
                }}
                onRightIconPress={() => {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
                }}
                rightIconName={'home'}
                leftIconColor={colors.black}
            />
            {!__DEV__ && <Animated.View style={{
                ...styles.container, transform: [{
                    translateY: loadAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -200]
                    })
                }]
            }} >
                {state.currentPitstop?.latitude && <SharedMapView
                    hideBackButton
                    latitude={state.currentPitstop?.latitude}
                    longitude={state.currentPitstop?.longitude}
                    route={route}
                    showCurrentLocationBtn={false}
                    showContinueBtn={false}
                    showDirections={true}
                    markerStyle={styles.mapMarkerStyle}
                    riderLocation={realtimeChangingState.riderLocation}
                    // customCenter={{ latitude: 33.669147010259806, longitude: 73.07375434744728 }}
                    customPitstops={state.pitStopsList}
                    customCenter={state.currentPitstop}
                    smoothRiderPlacement
                    minZoomLevel={12}
                    onMapPress={() => {
                        if (loadAnimationCurrentValue.current === 0) {
                            return;
                        }
                        modalAnimation(0);
                    }}
                />}
            </Animated.View>}
            {
                !modalOpened ? <TouchableOpacity onPress={() => {
                    modalAnimation(1);
                }} style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                    <SvgXml xml={svgs.modalClosedIcon()} style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
                    :
                    <></>
            }
            {/* <PanGestureHandler
                onGestureEvent={onPanGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                minDist={50}

            // activeOffsetY={[0, 300]}

            > */}
            <Animated.View
                onLayout={(e) => { console.log('e-onLayout', e); }}
                style={{
                    ...styles.bottomViewContainer, opacity: loadAnimation, transform: [{
                        translateY: loadAnimation.interpolate({
                            // translateY: componentLoaded ? translateY : loadAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [600, 0]
                        })
                    }]
                }}>
                {renderProgressCircle()}
                <View style={styles.orderInformationContainer}>
                    {isRiderFound ?
                        <Text style={styles.joviTitle} fontFamily={'PoppinsSemiBold'}>JOVI</Text>
                        :
                        renderTime(30, 14)
                    }
                    <Text style={styles.orderCaption} fontFamily={'PoppinsSemiBold'}>Almost there! Your order is being prepared now.</Text>
                    {
                        isRiderFound && state.currentPitstop ?
                            <Text style={styles.currentPitstopTime}>
                                {state.currentPitstop.isFinalDestination && state.currentPitstop.joviJobStatus === 2 ? `Jovi is at your door step!` : `Estimated arrival at ${state.totalActivePitstops.length === state.currentPitstop.index + 1 ? 'Final Destination' : `Pitstop ${state.currentPitstop?.index + 1}`}\n${state.currentPitstop?.pitstopEstimateTime ?? ' - '} minutes`}
                            </Text>
                            :
                            null
                    }
                </View>
            </Animated.View>
            {/* </PanGestureHandler> */}
        </SafeAreaView>
    );
};