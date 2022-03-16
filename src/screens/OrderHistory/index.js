import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { ActivityIndicator, Appearance, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import Image from '../../components/atoms/Image';
import Text from '../../components/atoms/Text';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import Card from '../../components/organisms/Card';
import NoRecord from '../../components/organisms/NoRecord';
import { isNextPage, sharedExceptionHandler, VALIDATION_CHECK } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import RatingSliderUI from '../RateRider/components/RatingSliderUI';
import { headerFuncStyles, stylesFunc, historyItemFuncStyles, onGoingItemFuncStyles } from './styles';
import SetpProgress from '../../components/atoms/StepProgress';
import BarDottedLine from './BarDottedLine';
import VectorIcon from '../../components/atoms/VectorIcon';
import { initColors } from '../../res/colors';
import { getRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';


const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;

const TYPE_COLOR = {
    inProgress: "#F99E00",
    inProgressIncomplete: "#C1C1C1",
    delivered: "#31C55D",
    cancelled: "#D80D30",
}

const DEFAULT_PAGINATION_INFO = { totalItem: 0, itemPerRequest: 20, currentRequestNumber: 1 };

export default ({ navigation, route }) => {

    const orderID = 546456;

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary), ...headerFuncStyles };
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE's & REF's START's FROM HERE 
    const [paginationInfo, updatePaginationInfo] = React.useState(DEFAULT_PAGINATION_INFO);
    const [data, updateData] = React.useState({ onGoingData: [], historyData: [] });
    const [metaData, toggleMetaData] = React.useState(false);
    const [query, updateQuery] = React.useState({
        isLoading: false,
        error: false,
        errorText: '',
        refreshing: false,
    });


    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={customheaderStyles.primaryContainer}>
                <CustomHeader
                    containerStyle={customheaderStyles.containerStyle}
                    leftCustom={(
                        <TouchableScale wait={0} onPress={() => {
                            NavigationService.NavigationActions.common_actions.goBack();
                        }} style={customheaderStyles.iconContainer}>
                            <SvgXml xml={svgs.hamburgerMenu(colors.primary)} height={HEADER_ICON_SIZE} width={HEADER_ICON_SIZE} />
                        </TouchableScale>
                    )}
                    rightCustom={(
                        <TouchableScale wait={0} onPress={() => {
                            NavigationService.NavigationActions.stack_actions.replace(ROUTES.APP_DRAWER_ROUTES.OrderPitstops.screen_name, { orderID: orderID }, ROUTES.APP_DRAWER_ROUTES.OrderChat.screen_name)
                        }} style={customheaderStyles.iconContainer}>
                            <SvgXml xml={svgs.hamburgerHome(colors.primary)} height={HEADER_ICON_SIZE} width={HEADER_ICON_SIZE} />
                        </TouchableScale>
                    )}
                    title={`Order History`}
                    titleStyle={{
                        fontFamily: FontFamily.Poppins.SemiBold,
                        fontSize: 16,
                    }}
                    defaultColor={colors.primary}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 


    // #region :: API IMPLEMENTATION START's FROM HERE 

    React.useEffect(() => {
        loadHistoryData(paginationInfo.currentRequestNumber);
        loadOnGoingData();
        return () => { };
    }, []);

    const loadHistoryData = (currentRequestNumber, append = false) => {
        updateQuery({
            errorText: '',
            isLoading: !append,
            error: false,
            refreshing: append,
        });
        const params = {
            "pageNumber": currentRequestNumber,
            "itemsPerPage": paginationInfo.itemPerRequest,

        };

        postRequest(Endpoints.GET_CUSTOMER_ORDER_HISTORY, params, (res) => {
            const statusCode = res.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const resData = res.data?.orderHistory?.data ?? [];
                const newData = [...data.historyData, ...resData];
                updateData(p => ({ ...p, historyData: newData }));
                toggleMetaData(!metaData);


                if (!append) {
                    const totalItem = res.data?.orderHistory?.paginationInfo?.totalItems ?? DEFAULT_PAGINATION_INFO.totalItem;
                    updatePaginationInfo(pre => ({
                        ...pre,
                        totalItem,
                    }))
                }

                updateQuery({
                    errorText: '',
                    isLoading: false,
                    error: false,
                    refreshing: false,
                });
            } else {
                updateQuery({
                    errorText: sharedExceptionHandler(res),
                    error: true,
                    isLoading: false,
                    refreshing: false,
                });
                updateData(p => ({ ...p, historyData: [] }));
            }
        }, (err) => {
            sharedExceptionHandler(err);
            updateQuery({
                errorText: sharedExceptionHandler(err),
                isLoading: false,
                error: true,
                refreshing: false,
            });
            updateData(p => ({ ...p, historyData: [] }));
        })
    };//end of loadHistoryData

    const loadOnGoingData = () => {
        getRequest(Endpoints.GET_CUSTOMER_ONGOING_ORDER, (res) => {
            const statusCode = res.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const resData = res.data?.onGoingOrders?.onGoingOrdersList ?? [];
                updateData(p => ({ ...p, onGoingData: resData }));
                toggleMetaData(!metaData);

            } else {
                updateData(p => ({ ...p, onGoingData: [] }));
            }
        }, (err) => {
            sharedExceptionHandler(err);
            updateData(p => ({ ...p, onGoingData: [] }));
        })
    };//end of loadOnGoingData

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

    // #region :: ON END REACHED START's FROM HERE 
    const onEndReached = () => {
        if (isNextPage(paginationInfo.totalItem, paginationInfo.itemPerRequest, paginationInfo.currentRequestNumber)) {
            updateQuery(pre => ({
                ...pre,
                refreshing: true
            }))

            updatePaginationInfo(pre => ({
                ...pre,
                currentRequestNumber: pre.currentRequestNumber + 1,
            }))


            loadHistoryData(paginationInfo.currentRequestNumber + 1, true);

            return
        }
    };//end of onEndReached

    // #endregion :: ON END REACHED END's FROM HERE 


    // #region :: LOADING AND ERROR UI START's FROM HERE 
    if (query.isLoading) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <View style={{
                flex: 1,
                marginTop: -80,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <AnimatedLottieView
                    source={require('../../assets/LoadingView/OrderChat.json')}
                    autoPlay
                    loop
                    style={{
                        height: 120,
                        width: 120,
                    }}
                />
            </View>
        </View>
    } else if (query.error) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <NoRecord
                color={colors}
                title={query.errorText}
                buttonText={`Refresh`}
                onButtonPress={() => { }} />
        </View>
    }

    // #endregion :: LOADING AND ERROR UI END's FROM HERE 

    // #region :: UI START's FROM HERE 
    return (
        <View style={styles.primaryContainer}>
            {_renderHeader()}



            <FlatList
                data={data.historyData}
                extraData={metaData}
                ListHeaderComponent={<>
                    {data.onGoingData.length > 0 &&
                        <RenderTitle title='Ongoing Order' />
                    }
                    {data.onGoingData.map((item, index) => {
                        return (
                            <OnGoingItemCardUI
                                key={index}
                                colors={colors}
                                orderID={item.orderID}
                                atPoint={item.currentPitstop}
                                noOfPitstops={item.totalPitstops}
                                paymentMethod={item.paymentMethod}
                                estDeliveryTime={item.estDeliveryTime}
                            />
                        )
                    })}


                    <RenderTitle title='History' />
                </>}
                renderItem={({ item, index }) => {
                    const isDelivered = `${item.status}`.trim().toLowerCase() === "cancelled" ? false : true;
                    return (
                        <HistoryItemCardUI
                            colors={colors}
                            isDelivered={isDelivered}
                            orderID={item.orderID}
                            noOfPitstops={item.pitstopCount}
                            dateTime={item.dateTime}
                        />
                    )

                }}
                onEndReachedThreshold={0.8}
                onEndReached={onEndReached}
                initialNumToRender={3}
                maxToRenderPerBatch={paginationInfo.itemPerRequest}
                ListFooterComponent={
                    <ActivityIndicator size="large" color={colors.primary}
                        style={{
                            opacity: query.refreshing ? 1 : 0,
                            marginBottom: 30,
                            marginTop: 20,
                        }} />
                }
            />
        </View>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT


const OnGoingItemCardUI = ({ colors = initColors, orderID = '', atPoint = 0, noOfPitstops = '', paymentMethod = '', estDeliveryTime = '' }) => {
    const onGoingItemStyles = onGoingItemFuncStyles(colors, TYPE_COLOR);
    return (
        <Card contentContainerStyle={onGoingItemStyles.contentContainerStyle}>
            <View style={onGoingItemStyles.orderDetailContainer}>
                <Text fontFamily='PoppinsSemiBold' style={onGoingItemStyles.orderIDText}>{`Order id # ${orderID}`}</Text>
                <Text style={onGoingItemStyles.inProgressText}>{`In Progress`}</Text>
            </View>
            <Text style={onGoingItemStyles.noPitstopText}>{`${`${noOfPitstops}`.padStart(2, '0')} pitsops`}</Text>

            <View style={{ marginVertical: 5 }} />

            <BarDottedLine
                selectedIndex={atPoint}
                length={noOfPitstops}
                selectedBarColor={TYPE_COLOR.inProgress}
                selectedCircleColor={TYPE_COLOR.inProgress}
                unSelectedBarColor={TYPE_COLOR.inProgressIncomplete}
                unSelectedCircleColor={TYPE_COLOR.inProgressIncomplete}
                customSelectedCircle={() => {
                    return (
                        <View style={onGoingItemStyles.barSelectedIconContainer}>
                            <SvgXml xml={svgs.joviMan()} height={13} width={13} />
                        </View>
                    )
                }}
            />

            <View style={{ marginVertical: 10 }} />

            <View style={onGoingItemStyles.headingContainer}>
                <Text style={onGoingItemStyles.text}>{`Payment Method`}</Text>
                <Text style={onGoingItemStyles.text}>{`Estimated Delivery Time`}</Text>
            </View>

            <View style={onGoingItemStyles.valueContainer}>
                <Text style={onGoingItemStyles.value}>{`${paymentMethod}`}</Text>
                <Text style={onGoingItemStyles.value}>{`${estDeliveryTime}`}</Text>
            </View>
        </Card>
    )
};



// #region :: HISTORY ITEM CARD UI START's FROM HERE 
const HistoryItemCardUI = ({ colors = initColors, isDelivered, orderID = '', noOfPitstops = '', dateTime = '' }) => {
    const historyItemStyles = historyItemFuncStyles(colors);

    const dotColor = () => {
        return isDelivered ? TYPE_COLOR.delivered : TYPE_COLOR.cancelled;
    }
    const deliveryStatus = () => {
        return isDelivered ? 'Order Delivered' : 'Cancelled';
    }

    return (
        <Card contentContainerStyle={historyItemStyles.contentContainerStyle}>
            <View style={{ ...historyItemStyles.cubeIconContainer, backgroundColor: dotColor(), }}>
                <VectorIcon name='cube-outline' size={40} color={colors.white} />
            </View>

            <View style={historyItemStyles.bodyPrimaryContainer}>
                <View style={historyItemStyles.orderPitstopContainer}>
                    <Text fontFamily='PoppinsMedium' style={historyItemStyles.orderText}>{`Order ID: ${orderID}`}</Text>
                    <Text fontFamily='PoppinsMedium' style={historyItemStyles.noPitstopText}>{`${`${noOfPitstops}`.padStart(2, '0')} Pitstops`}</Text>
                </View>

                <View style={historyItemStyles.deliveryStatusContainer}>
                    <View style={historyItemStyles.orderDeliveredContainer}>
                        <View style={{ ...historyItemStyles.orderDeliveredDot, backgroundColor: dotColor(), }} />
                        <Text fontFamily='PoppinsMedium' style={historyItemStyles.orderDeliveredText}>{`${deliveryStatus()}`}</Text>
                    </View>
                    {VALIDATION_CHECK(dateTime) &&
                        <View style={{ ...historyItemStyles.datetimeContainer, backgroundColor: dotColor(), }}>
                            <Text style={historyItemStyles.dateTimeText}>{`${dateTime}`}</Text>
                        </View>
                    }
                </View>

            </View>
        </Card>
    )
}

// #endregion :: HISTORY ITEM CARD UI END's FROM HERE 

// #region :: TITLE UI START's FROM HERE 
const titleCase = (str) => {
    str = `${str}`.trim();
    str = str.toLowerCase().split(' ').map(function (word) { return word.replace(word[0], word[0].toUpperCase()); });
    return str.join(' ');
}

const RenderTitle = ({ title = '' }) => {
    if (!VALIDATION_CHECK(title)) return null;

    return (
        <Text fontFamily='PoppinsMedium' style={{
            paddingHorizontal: constants.spacing_horizontal,
            paddingTop: 10,
            fontSize: 18,
            color: "#212121",
        }}>{titleCase(title)}</Text>
    )
}

     // #endregion :: TITLE UI END's FROM HERE 