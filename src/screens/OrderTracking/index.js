import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { Animated, Appearance, Easing, PixelRatio, StyleSheet } from "react-native";
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
import { sharedExceptionHandler, sharedFetchOrder, sharedNotificationHandlerForOrderScreens, sharedOrderNavigation } from "../../helpers/SharedActions";
import { getRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import NavigationService from "../../navigations/NavigationService";
import ROUTES from "../../navigations/ROUTES";
import constants from "../../res/constants";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import GV, { ORDER_STATUSES, PITSTOP_TYPES_INVERTED } from "../../utils/GV";
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
    const orderIDParam = route?.params?.orderID ?? 41231;
    const SCALED_HEIGHT = PixelRatio.roundToNearestPixel(WINDOW_HEIGHT * (WINDOW_HEIGHT / baseHeight));
    const styles = _styles(colors, WIDTH, SCALED_HEIGHT);
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
    const [realtimeChangingState, setRealTimeState] = React.useState({
        riderLocation: null,
    });
    const circleColor = state.subStatusName === ORDER_STATUSES.RiderFound ? '#37c130' : colors.primary;
    const isRiderFound = state.subStatusName === ORDER_STATUSES.RiderFound;
    const colorChangeAnimation = React.useRef(new Animated.Value(0)).current;
    const loadAnimation = React.useRef(new Animated.Value(0)).current;
    const fetchRiderLocationRef = React.useRef(null);
    const renderUI = {
        [ORDER_STATUSES.TransferProblem]: () => renderProcessingUI(),
        [ORDER_STATUSES.RiderProblem]: () => renderProcessingUI(),
        [ORDER_STATUSES.FindingRider]: () => renderProcessingUI(),
        [ORDER_STATUSES.RiderFound]: () => renderTimeUI(),
        [ORDER_STATUSES.Processing]: () => renderProcessingUI(),
    };
    const fetchOrderDetails = () => {
        sharedFetchOrder(orderIDParam, (res) => {
            if (res.data.statusCode === 200) {
                let allowedOrderStatuses = [ORDER_STATUSES.Processing, ORDER_STATUSES.RiderFound, ORDER_STATUSES.FindingRider, ORDER_STATUSES.RiderProblem, ORDER_STATUSES.TransferProblem];
                if (!allowedOrderStatuses.includes(res.data.order.subStatusName)) {
                    sharedOrderNavigation(orderIDParam, res.data.order.subStatusName, ROUTES.APP_DRAWER_ROUTES.OrderProcessing.screen_name);
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
                    if (i === (totalActivePitstops.length - 1)) return;
                    const pitstopType = item.catID === '0' ? 2 : parseInt(item.catID);
                    const focusedPitstop = ENUMS.PITSTOP_TYPES.filter(pt => pt.value === pitstopType)[0];
                    if (item.joviJobStatus === 2 || item.joviJobStatus === 7) {
                        progress += increment;
                    } else if (!currentPitstop) {
                        currentPitstop = { ...item, index: i };
                    }

                    circularPitstops.push(focusedPitstop);
                });
                if (res.data.order.subStatusName === ORDER_STATUSES.RiderFound) {
                    fetchRiderLocation();
                }
                if (!currentPitstop) {
                    currentPitstop = { ...res.data.order.pitStopsList[res.data.order.pitStopsList.length - 1], index: totalActivePitstops.length - 1 };
                }
                setState(pre => ({ ...pre, ...res.data.order, pitStopsList: updatedPitstops, totalActivePitstops, currentPitstop, progress: progress, isLoading: false, circularPitstops }))
                // setState(pre => ({ ...pre, ...res.data.order, pitStopsList: updatedPitstops, currentPitstop, progress: res.data.order.completedJobPercentage, isLoading: false, circularPitstops }))
            } else {
                setState(pre => ({ ...pre, isLoading: false }))
            }
        });
    }
    const fetchRiderLocation = () => {
        const fetchRiderLocationRequest = () => {
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
        }
        fetchRiderLocationRef.current = setInterval(fetchRiderLocationRequest, (userReducer?.fetchRiderLocationInterval || 5) * 1000);
    }
    const goToHome = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
    }
    const orderCancelledOrCompleted = () => {
        goToHome();
    }
    const onOrderNavigationPress = (route = '', extraParams = {}) => {
        NavigationService.NavigationActions.common_actions.navigate(route, { orderID: orderIDParam, ...extraParams });
    }
    React.useEffect(() => {
        fetchOrderDetails();
        Animated.timing(loadAnimation, {
            toValue: 1,
            useNativeDriver: true,
            duration: 500,
            easing: Easing.ease
        }).start();
        return () => {
            if (fetchRiderLocationRef.current) {
                clearInterval(fetchRiderLocationRef.current);
            }
        }
    }, []);
    React.useEffect(() => {
        sharedNotificationHandlerForOrderScreens(fcmReducer, fetchOrderDetails, orderCancelledOrCompleted);
        return () => {
        }
    }, [fcmReducer]);
    const handleCircleAnimation = () => {

    }
    const renderTime = (timeFontSize = 22, minutesUI = 10) => {
        return <>
            <Text style={{ fontSize: timeFontSize, color: 'black', fontWeight: 'bold' }} fontFamily={'PoppinsBold'} >{isRiderFound && state.currentPitstop ? state.currentPitstop.pitstopEstimateTime : state.orderEstimateTimeRange}</Text>
            <Text style={{ fontSize: minutesUI, marginTop: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} >{` minutes \nuntil delivered`}</Text>
        </>
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
            <View style={{ position: 'absolute', marginTop: -125 }}>
                {/* <SvgXml style={{ top: -10, }} height={137} width={WIDTH} xml={circleCurveSvgXml} /> */}
            </View>
            <View style={styles.orderProgressContainer}>

                {/* {renderUI[ORDER_STATUSES.RiderFound]()} */}
                {renderUI[state.subStatusName ?? ORDER_STATUSES.Processing]()}
            </View>
            <View style={styles.orderNavigationContainer}>
                <TouchableOpacity disabled={!isRiderFound} onPress={() => onOrderNavigationPress(ROUTES.APP_DRAWER_ROUTES.OrderChat.screen_name, { riderProfilePic: state.userPic, })} style={{ ...styles.orderNavigationButton, backgroundColor: isRiderFound ? colors.primary : colors.grey }}>
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
            <View style={styles.container} >
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
               {/* <SharedMapView
                    hideBackButton
                    // latitude={props.route?.params?.finalDestObj.latitude}
                    // longitude={props.route?.params?.finalDestObj.longitude}
                    route={route}
                    showCurrentLocationBtn={false}
                    showContinueBtn={false}
                    showDirections={true}
                    // showMarker={true}
                    // mapHeight={SCALED_HEIGHT * 0.27}
                    markerStyle={styles.mapMarkerStyle}
                    customPitstops={state.pitStopsList}
                    riderLocation={realtimeChangingState.riderLocation}
                    customCenter={state.currentPitstop ?? { latitude: 33.66818441183923, longitude: 73.07202094623308 }}
                    // pitchEnabled={false}
                    // zoomEnabled={false}
                    // scrollEnabled={false}
                    // selectFinalDestination={true}
                    onMapPress={() => {

                    }} /> */}
            </View>
            <Animated.View style={{
                ...styles.bottomViewContainer, opacity: loadAnimation, transform: [{
                    translateY: loadAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0]
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
                                {`Estimated arrival at ${state.totalActivePitstops.length === state.currentPitstop.index + 1 ? 'Final Destination' : `Pitstop ${state.currentPitstop?.index + 1}`}\n${state.currentPitstop?.pitstopEstimateTime ?? ' - '} minutes`}
                            </Text>
                            :
                            null
                    }
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const _styles = (colors, WIDTH, SCALED_HEIGHT) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    headerContainer: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        position: 'absolute',
        top: 0,
        zIndex: 9999
    },
    mapMarkerStyle: {
        zIndex: 3,
        position: 'absolute',
        marginTop: -15,
        marginLeft: -11,
        left: WIDTH / 2,
        top: ((SCALED_HEIGHT * 1.3) - SCALED_HEIGHT) / 2,
    },
    bottomViewContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 300,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
    },
    orderInformationContainer: { height: 200, marginTop: 50, alignItems: 'center', display: 'flex', },
    joviTitle: { fontSize: 20, marginTop: 10, fontWeight: 'bold', color: colors.black },
    orderCaption: { fontSize: 14, marginTop: 10, fontWeight: 'bold', color: colors.black },
    currentPitstopTime: { textAlign: 'center', color: colors.black, fontSize: 14, marginTop: 10 },
    orderNavigationContainer: { position: 'absolute', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, top: 75 },
    orderNavigationButton: { height: 42, width: 42, borderRadius: 21, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
    orderProgressContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: -120,
        backgroundColor: colors.white,
        padding: 25,
        borderTopEndRadius: 150,
        borderTopLeftRadius: 150,
    },
});