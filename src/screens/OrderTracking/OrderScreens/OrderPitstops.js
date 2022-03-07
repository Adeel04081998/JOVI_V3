import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { Appearance, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Text from '../../../components/atoms/Text';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import CustomHeader from '../../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../../components/organisms/Card/OrderEstTimeCard';
import DashedLine from '../../../components/organisms/DashedLine';
import { renderPrice, sharedFetchOrder, sharedGenerateProductItem } from '../../../helpers/SharedActions';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import actions from '../../../redux/actions';
import constants from '../../../res/constants';
import theme from '../../../res/theme';
import GV, { PITSTOP_TYPES_INVERTED } from '../../../utils/GV';

const IMAGE_SIZE = constants.window_dimensions.width * 0.3;
const SPACING = 10;
const pitstopTitles = {
    1: 'Supermarket',
    4: 'Restaurant',
    3: 'Pharmacy',
    2: 'Jovi Job',
    0: 'Jovi Job',
};
export default ({ route }) => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[2]], Appearance.getColorScheme() === "dark");
    const styles = _styles(colors);
    const orderIDParam = route?.params?.orderID ?? 32992782;
    const fcmReducer = useSelector(store => store.fcmReducer);
    const dispatch = useDispatch();
    const [state, setState] = React.useState({
        orderID: orderIDParam ?? 0,
        pitStopsList: [],
        circularPitstops: [],
        isLoading: true,
        chargeBreakdown: {},
        progress: 0,
        totalPitstops: 0,
        currentPitstop: null,
        orderEstimateTimeRange: '40 - 50',
        currentPitstop: null
    });
    const RenderPitstop = ({ pitstop = {}, index = 0 }) => {
        const [pitstopState, setPitstopState] = React.useState({
            expanded: false
        });
        const isSkippedOrCanclledStyles = [3, 4, 5, 9].includes(pitstop.joviJobStatus) ? {
            textDecorationLine: "line-through",
            textDecorationColor: "#B1B1B1",
        } : {};
        const isFinalDestination = index === state.pitStopsList.length - 1;
        const isJoviJob = pitstop.catID === '0';
        const pitstopType = pitstop.catID === '0' ? 2 : pitstop.catID;
        const pitstopTypeTitle = pitstopTitles[pitstop.catID];
        let pitstopColor = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]]);
        let iconName = 'map-marker';
        let iconType = 'FontAwesome';
        if (isFinalDestination) {
            iconName = 'flag-checkered';
            pitstopColor = {
                ...pitstopColor,
                primary: pitstopColor.black,
            }
        }
        if (state.currentPitstop && state.currentPitstop.joviJobID === pitstop.joviJobID) {
            iconName = 'clockcircle';
            iconType = 'AntDesign';
        }
        const renderItems = () => {
            if (isJoviJob) return <View style={styles.itemContainer}>
                <Text style={{ fontSize: 12, color: colors.black, maxWidth: '75%', ...isSkippedOrCanclledStyles }}>{pitstop.title}</Text>
                <Text style={{ fontSize: 12, color: colors.black, ...isSkippedOrCanclledStyles }}>{renderPrice(pitstop.estimatePrice ?? 10)}</Text>
            </View>
            return pitstop.jobItemsListViewModel?.map((item, i) => {
                return <View key={i} style={styles.itemContainer}>
                    <Text style={{ fontSize: 12, color: colors.black, maxWidth: '75%', ...isSkippedOrCanclledStyles }}>{sharedGenerateProductItem(item.productItemName, item.quantity, item.jobItemOptions?.length > 0 ? item.jobItemOptions : (item.jobDealOptions ?? []))}</Text>
                    <Text style={{ fontSize: 12, color: colors.black, ...isSkippedOrCanclledStyles }}>{renderPrice(item.price)}</Text>
                </View>
            })
        }
        return <View style={{ marginLeft: 15 }} >
            <View style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                <View style={{ width: 55, backgroundColor: isFinalDestination ? colors.white : 'trasparent' }}>
                    <View style={{...styles.pitstopGreyCricle, backgroundColor: pitstopColor.light_grey, }}>
                        <View style={{ ...styles.pitstopWiseCircle, backgroundColor: pitstopColor.primary, }}>
                            <VectorIcon size={25} color={pitstopColor.white} type={iconType} name={iconName} />
                        </View>
                    </View>
                </View>
                <View style={styles.pitstopInfoContainer}>
                    <Text style={{ fontSize: 16, color: pitstopColor.black, ...isSkippedOrCanclledStyles }} fontFamily={'PoppinsRegular'} numberOfLines={pitstopState.expanded ? 2 : 1} onPress={() => setPitstopState(pre => ({ ...pre, expanded: !pre.expanded }))}>{isFinalDestination ? 'Final destination' : `Pitstop ${'0' + (index + 1)} - ${isJoviJob ? pitstopTypeTitle : pitstop.title}`}</Text>
                    {<Text style={{ fontSize: 12, color: pitstopColor.primary, ...isSkippedOrCanclledStyles }} fontFamily={'PoppinsLight'} numberOfLines={2}>{!isFinalDestination ? `${pitstopTypeTitle} | ${pitstop.pitstopEstimateTime}` : `${pitstop.title}`}</Text>}
                    {!isFinalDestination && <View style={{ marginVertical: SPACING, marginBottom: SPACING + SPACING }}>
                        {renderItems()}
                    </View>}
                </View>
            </View>
        </View>
    }
    const renderHeader = () => {
        return <CustomHeader
            hideFinalDestination
            onRightIconPress={() => {
                NavigationService.NavigationActions.common_actions.goBack();
            }}
            title={'Order#: ' + orderIDParam}
            rightIconType={'MaterialCommunityIcons'}
            rightIconName={'map-marker-distance'}
            rightIconColor={colors.primary}
            leftIconColor={colors.primary}
            leftIconType={'Ionicons'}
            leftIconName={'md-chatbubble-ellipses'}
        />
    }
    const renderFooter = () => {
        const renderCallIcon = () => {
            return <View style={{ height: 35, width: 35, borderRadius: 17.5, backgroundColor: colors.black, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <VectorIcon size={20} solid color={colors.white} name={'phone-call'} type={'Feather'} />
            </View>
        }
        return <View style={styles.footerContainer}>
            <View style={styles.footerItemContainer}>
                {renderCallIcon()}
                <Text style={{ marginLeft: 10, color: colors.black }}>Jovi Rider</Text>
            </View>
            <View style={{ width: 1, height: 30, borderWidth: 1, borderColor: colors.black }}></View>
            <View style={styles.footerItemContainer}>
                {renderCallIcon()}
                <Text style={{ marginLeft: 10, color: colors.black }}>Jovi Support</Text>
            </View>
        </View>
    };
    const fetchOrderDetails = () => {
        sharedFetchOrder(orderIDParam, (res) => {
            if (res.data.statusCode === 200) {
                console.log('[sharedFetchOrder]', res);
                let currentPitstop = null;
                const openJoviJobStatuses = [1, 6, 7, 8];
                const updatedPitstops = [];
                res.data.order.pitStopsList.map((item, i) => {
                    if (openJoviJobStatuses.includes(item.joviJobStatus) && !currentPitstop) {
                        currentPitstop = { ...item, index: i };
                    }
                    if(![3, 4, 5, 9].includes(item.joviJobStatus)){
                        updatedPitstops.push(item);
                    }
                });
                setState(pre => ({ ...pre, ...res.data.order, pitStopsList:updatedPitstops, currentPitstop, isLoading: false, }))
                // setState(pre => ({ ...pre, ...res.data.order, pitStopsList: [...updatedPitstops,...updatedPitstops,...updatedPitstops, ...updatedPitstops], currentPitstop, isLoading: false, }))
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
        console.log('fcmReducer------OrderPitstops', fcmReducer);
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
        } else console.log("[Order OrderPitstops] Job notification not found!!");
        return () => {
        }
    }, [fcmReducer]);
    if (state.isLoading) {
        return <View style={styles.primaryContainer}>
            {renderHeader()}
            <AnimatedLottieView
                source={require('../../../assets/gifs/Processingloading.json')}
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {renderHeader()}
                <OrderEstTimeCard
                    imageHeight={IMAGE_SIZE * 0.6}
                    color={colors}
                    right={{ value: state.totalPitstops }}
                    middle={{ value: state.orderEstimateTime }}
                    contentContainerStyle={{ marginBottom: 0, marginVertical: 0, marginTop: 10, borderRadius: 8 }}
                    rightContainerStyle={{}}
                    middleContainerStyle={{ flex: 2 }}
                    leftContainerStyle={{ paddingRight: 15 }}
                />
                <View style={styles.pitstopsContainer}>
                    <ScrollView style={{ flex: 1, marginTop: SPACING + SPACING, marginBottom: SPACING, overflow: 'hidden' }} >
                        <View style={{overflow:'hidden'}}>
                        <View style={styles.dashContainer}>
                            <Text style={styles.dashLine} >| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | || | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | </Text>
                        </View>

                            {
                                state.pitStopsList.map((pitstop, i) => {
                                    return <RenderPitstop pitstop={pitstop} index={i} key={i} />
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
                {renderFooter()}
            </View>
        </SafeAreaView>
    );
}
const _styles = (colors) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    pitstopsContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        flex: 1, backgroundColor: colors.white, marginVertical: SPACING, marginHorizontal: SPACING, borderRadius: 10,
    },
    dashContainer:{ flex: 1, flexWrap: 'nowrap', position: 'absolute', left: 40, top: 50, },
    dashLine:{ fontSize: 12, height: '100%', maxWidth: 5, color: colors.black, flexWrap: 'nowrap', },
    itemContainer:{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
    pitstopGreyCricle:{ width: 55, height: 55, borderRadius: 27.5, display: 'flex', justifyContent: 'center', alignItems: 'center',  },
    pitstopWiseCircle:{ width: 35, height: 35, borderRadius: 17.5, display: 'flex', justifyContent: 'center', alignItems: 'center', },
    pitstopInfoContainer:{ flex: 1, marginTop: 3, marginHorizontal: SPACING, display: 'flex', flexDirection: 'column' },
    footerItemContainer:{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    footerContainer:{ height: 72, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
});