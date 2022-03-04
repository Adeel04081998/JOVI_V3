import React from "react";
import { PixelRatio, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import SharedMapView from "../../components/atoms/GoogleMaps/SharedMapView";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Text from "../../components/atoms/Text";
import View from "../../components/atoms/View";
import AnimatedProgressWheel from "../../components/molecules/AnimatedProgressWheel";
import { sharedFetchOrder, sharedOrderNavigation } from "../../helpers/SharedActions";
import constants from "../../res/constants";
import { ORDER_STATUSES, PITSTOP_TYPES } from "../../utils/GV";
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

    const orderIDParam = route?.params?.orderID ?? 41231;
    const SCALED_HEIGHT = PixelRatio.roundToNearestPixel(WINDOW_HEIGHT * (WINDOW_HEIGHT / baseHeight));
    const [state, setState] = React.useState({
        orderID: orderIDParam ?? 0,
        pitStopsList: [],
        isLoading: true,
        chargeBreakdown: {},
        progress: 0,
    });
    const fetchOrderDetails = () => {
        sharedFetchOrder(orderIDParam, (res) => {
            if (res.data.statusCode === 200) {
                let allowedOrderStatuses = [ORDER_STATUSES.Processing, ORDER_STATUSES.FindingRider, ORDER_STATUSES.RiderProblem, ORDER_STATUSES.TransferProblem];
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
    React.useEffect(() => {
        fetchOrderDetails();
    }, []);
    const renderProgressCircle = () => {
        const sizeSvg = 137
        return <>
            <View style={{ position: 'absolute', marginTop: -125 }}>
                <SvgXml style={{ top: -10, }} height={137} width={WIDTH} xml={circleCurveSvgXml} />
            </View>
            <View style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: -120,
                backgroundColor: 'white',
                padding: 15,
                borderTopEndRadius: 110,
                borderTopLeftRadius: 110,
            }}>
                <AnimatedProgressWheel pitstops={[...Array(4).fill(2)]} color={'#37c130'} backgroundColor={'#E7EAF1'} animateFromValue={0} progress={state.progress} />
                <View style={{ marginTop: -125, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }} fontFamily={'PoppinsBold'} onPress={() => setState(pre => ({ ...pre, progress: pre.progress + 25 }))}>30 - 40</Text>
                    <Text style={{ fontSize: 10, marginTop: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} >{` minutes \nuntil delivered`}</Text>
                </View>
            </View></>
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container} >
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