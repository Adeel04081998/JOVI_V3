import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { Appearance, PixelRatio, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import svgs from "../../assets/svgs";
import SharedMapView from "../../components/atoms/GoogleMaps/SharedMapView";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Text from "../../components/atoms/Text";
import VectorIcon from "../../components/atoms/VectorIcon";
import View from "../../components/atoms/View";
import AnimatedProgressWheel from "../../components/molecules/AnimatedProgressWheel";
import CustomHeader from "../../components/molecules/CustomHeader";
import { sharedFetchOrder, sharedOrderNavigation } from "../../helpers/SharedActions";
import NavigationService from "../../navigations/NavigationService";
import ROUTES from "../../navigations/ROUTES";
import actions from "../../redux/actions";
import constants from "../../res/constants";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import GV, { ORDER_STATUSES, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from "../../utils/GV";
const circleCurveSvgXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.9919999999999998 11.235 2.0079999999999996 0.764">
<path d="M 0.016 11.993 q -0.313 -0.031 -0.376 -0.283 c -0.2 -0.629 -1.065 -0.618 -1.271 -0.005 c -0.051 0.206 -0.149 0.258 -0.361 0.292" fill="#fff"/>
</svg>`;
export default ({ route }) => {
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.JOVI;
    const fcmReducer = useSelector(store => store.fcmReducer);
    const dispatch = useDispatch();

    const baseHeight = 550
    const WINDOW_HEIGHT = constants.window_dimensions.height;
    const HEIGHT = constants.screen_dimensions.height;
    const WIDTH = constants.screen_dimensions.width;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[2]], Appearance.getColorScheme() === "dark");
    const orderIDParam = route?.params?.orderID ?? 41231;
    const SCALED_HEIGHT = PixelRatio.roundToNearestPixel(WINDOW_HEIGHT * (WINDOW_HEIGHT / baseHeight));
    const [state, setState] = React.useState({
        orderID: orderIDParam ?? 0,
        pitStopsList: [],
        circularPitstops: [],
        isLoading: true,
        chargeBreakdown: {},
        progress: 0,
        currentPitstop: null,
        orderEstimateTimeRange: '40 - 50',
    });
    const circleColor = state.subStatusName === ORDER_STATUSES.RiderFound ? '#37c130' : colors.primary;
    const isRiderFound = state.subStatusName === ORDER_STATUSES.RiderFound;
    const colorChangeAnimation = React.useRef(new Animated.Value(0)).current;
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
                let allowedOrderStatuses = [ORDER_STATUSES.Processing, ORDER_STATUSES.FindingRider, ORDER_STATUSES.RiderProblem, ORDER_STATUSES.TransferProblem];
                console.log('res - sharedFetchOrder', res);
                if (!allowedOrderStatuses.includes(res.data.order.subStatusName)) {
                    sharedOrderNavigation(orderIDParam, res.data.order.subStatusName, ROUTES.APP_DRAWER_ROUTES.OrderProcessing.screen_name);
                    return;
                }
                let progress = 0;
                const increment = 100 / res.data.order.totalPitstops;
                const circularPitstops = [{
                    icon: svgs.startingPoint()
                }];
                let currentPitstop = null;
                let updatedPitstops = [];
                res.data.order.pitStopsList.map((item, i) => {
                    updatedPitstops.push({ ...item, isFinalDestination: i === (res.data.order.totalPitstops - 1) });
                    if (i === (res.data.order.totalPitstops - 1)) return;
                    const pitstopType = item.catID === '0' ? 2 : parseInt(item.catID);
                    const focusedPitstop = ENUMS.PITSTOP_TYPES.filter(pt => pt.value === pitstopType)[0];
                    if (item.joviJobStatus === 2 || item.joviJobStatus === 7) {
                        progress += increment;
                    } else if (!currentPitstop) {
                        currentPitstop = item;
                    }

                    circularPitstops.push(focusedPitstop);
                });
                // setState(pre => ({ ...pre, ...res.data.order,progress:progress, isLoading: false,circularPitstops }))
                setState(pre => ({ ...pre, ...res.data.order, pitStopsList: updatedPitstops, currentPitstop, progress: res.data.order.completedJobPercentage, isLoading: false, circularPitstops }))
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
        console.log('fcmReducer------OrderTracking', fcmReducer);
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
        } else console.log("[Order OrderTracking] Job notification not found!!");
        return () => {
        }
    }, [fcmReducer]);
    const handleCircleAnimation = () => {

    }
    const renderTime = (timeFontSize = 22, minutesUI = 10) => {
        return <>
            <Text style={{ fontSize: timeFontSize, color: 'black', fontWeight: 'bold' }} fontFamily={'PoppinsBold'} onPress={() => setState(pre => ({ ...pre, progress: pre.progress + (100 / 6) }))}>{isRiderFound && state.currentPitstop ? state.currentPitstop.pitstopEstimateTime : state.orderEstimateTimeRange}</Text>
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
            <View style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: -120,
                backgroundColor: colors.white,
                padding: 25,
                borderTopEndRadius: 110,
                borderTopLeftRadius: 110,
            }}>

                {/* {renderUI[ORDER_STATUSES.RiderFound]()} */}
                {renderUI[state.subStatusName ?? ORDER_STATUSES.Processing]()}
            </View>
            <View style={{ position: 'absolute', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, top: 75 }}>
                <View style={{ height: 42, width: 42, borderRadius: 21, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
                    <VectorIcon size={25} name={'md-chatbubble-ellipses'} type={'Ionicons'} color={colors.white} />
                </View>
                <View style={{ height: 42, width: 42, borderRadius: 21, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
                    <VectorIcon size={30} name={'list'} type={'Ionicons'} color={colors.white} />
                </View>
            </View>
        </>
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container} >
                <CustomHeader
                    hideFinalDestination
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderBottomWidth: 0,
                        position: 'absolute',
                        top: 0,
                        zIndex: 9999
                    }}
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
                <SharedMapView
                    hideBackButton
                    // latitude={props.route?.params?.finalDestObj.latitude}
                    // longitude={props.route?.params?.finalDestObj.longitude}
                    route={route}
                    showCurrentLocationBtn={false}
                    showContinueBtn={false}
                    showDirections={true}
                    // showMarker={true}
                    // mapHeight={SCALED_HEIGHT * 0.27}
                    markerStyle={{
                        zIndex: 3,
                        position: 'absolute',
                        marginTop: -15,
                        marginLeft: -11,
                        left: WIDTH / 2,
                        top: ((SCALED_HEIGHT * 1.3) - SCALED_HEIGHT) / 2,
                    }}
                    customPitstops={state.pitStopsList}
                    // pitchEnabled={false}
                    // zoomEnabled={false}
                    // scrollEnabled={false}
                    // selectFinalDestination={true}
                    onMapPress={() => {

                    }} />
            </View>
            <View style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 300,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center'
            }}>
                {renderProgressCircle()}
                <View style={{ height: 200, marginTop: 50, alignItems: 'center', display: 'flex', }}>
                    {isRiderFound ?
                        <Text style={{ fontSize: 20, marginTop: 10, fontWeight: 'bold', color: colors.black }} fontFamily={'PoppinsSemiBold'}>JOVI</Text>
                        :
                        renderTime(30, 14)
                    }
                    <Text style={{ fontSize: 14, marginTop: 10, fontWeight: 'bold', color: colors.black }} fontFamily={'PoppinsSemiBold'}>Almost there! Your order is being prepared now.</Text>
                    {
                        isRiderFound && state.currentPitstop ?
                            <Text style={{ textAlign: 'center', color: colors.black, fontSize: 14 ,marginTop:10}}>
                                {`Estimated arrival at Pitstop 3\n${state.currentPitstop?.pitstopEstimateTime ?? '40 - 50'} minutes`}
                            </Text>
                            :
                            null
                    }
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1
    },
});