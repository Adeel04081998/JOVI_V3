import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import Text from '../../components/atoms/Text';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import Button from '../../components/molecules/Button';
import CustomHeader from '../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard';
import DashedLine from '../../components/organisms/DashedLine';
import { renderPrice, sharedFetchOrder, VALIDATION_CHECK } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { OrderProcessingChargesUI, OrderProcessingEstimatedTotalUI } from '../OrderProcessing';
import { orderProcessingDummyData } from '../OrderProcessing/StaticData';
import { stylesFunc } from './styles';

const IMAGE_SIZE = constants.window_dimensions.width * 0.3;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE  
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.JOVI;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    const orderIDParam = route?.params?.orderID ?? 0;
    const styles = stylesFunc(colors);
    const [state, setState] = React.useState({
        orderID: orderIDParam ?? 0,
        pitStopsList: [],
        isLoading: true,
        chargeBreakdown: {},
    });
    // #endregion :: STYLES & THEME END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={{ ...styles.primaryContainer, flex: 0, }}>
                <CustomHeader

                    rightIconName='home'
                    hideFinalDestination
                    title={'Approval'}
                    leftIconName={null}
                    rightIconColor={colors.primary}
                    rightIconSize={22}
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

    const [query, updateQuery] = React.useState({
        data: {},
        pitstopData: [],
        isLoading: true,
    });

    const data = query.data;
    // #endregion :: STATE's & REF's END's FROM HERE 

    React.useEffect(() => {
        sharedFetchOrder(orderIDParam, (res) => {
            setState(pre => ({ ...pre, ...res.data.order, isLoading: false }))
        });
        let pitstopDataArr = orderProcessingDummyData.data.order.pitStopsList.slice(0, orderProcessingDummyData.data.order.pitStopsList.length - 1);

        pitstopDataArr = pitstopDataArr.map(e => {
            const ptItemData = [];
            if (e.pitstopType === PITSTOP_TYPES.SUPER_MARKET || e.pitstopType === PITSTOP_TYPES.RESTAURANT) {
                //RESTURANT AND SUPERMARKET
                (e?.jobItemsListViewModel ?? []).map((f, index) => {

                    let type = CARD_SUB_TITLE_TYPES.available;

                    if (f.pitStopItemStatus === ENUMS.AVAILABILITY_STATUS.OutOfStock || f.pitStopItemStatus === ENUMS.AVAILABILITY_STATUS.NotAvailable) {
                        //OUT OF STOCK
                        type = CARD_SUB_TITLE_TYPES.outOfStock;
                    } else if (f.pitStopItemStatus === ENUMS.AVAILABILITY_STATUS.Replaced) {
                        //REPLACED
                        type = CARD_SUB_TITLE_TYPES.replaced;
                    }

                    ptItemData.push({
                        id: e?.jobItemID ?? index,
                        title: f?.productItemName ?? '',
                        value: f?.price ?? '',
                        type,
                    })
                    return
                })
            } else {
                //JOVI JOB
                ptItemData.push({
                    id: 1,
                    title: e?.description ?? '',
                    value: e?.jobAmount ?? '',
                    type: CARD_SUB_TITLE_TYPES.available,
                });
            }


            const CANCELLED_ARRAY = ptItemData.filter(i => i.type === CARD_SUB_TITLE_TYPES.outOfStock && e.jobItemsListViewModel.length < 2);
            const OUTOFSTOCK_ARRAY = ptItemData.filter(i => i.type === CARD_SUB_TITLE_TYPES.outOfStock && !(e.jobItemsListViewModel.length < 2));
            const REPLACED_ARRAY = ptItemData.filter(i => i.type === CARD_SUB_TITLE_TYPES.replaced);


            return {
                ...e,
                data: {
                    cancelledData: CANCELLED_ARRAY,
                    outOfStockData: OUTOFSTOCK_ARRAY,
                    replacedData: REPLACED_ARRAY,
                },
                forceStrikethrough: CANCELLED_ARRAY.length > 0,
                hasError: CANCELLED_ARRAY.length > 0 || OUTOFSTOCK_ARRAY.length > 0 || REPLACED_ARRAY.length > 0,
            }
        });


        updateQuery({
            data: {
                ...orderProcessingDummyData.data.order,
                finalDestination: orderProcessingDummyData.data.order.pitStopsList[orderProcessingDummyData.data.order.pitStopsList.length - 1],
            },
            pitstopData: pitstopDataArr,
            isLoading: false,
        })
        return () => { };
    }, []);


    const _renderFooter = () => {
        return (
            <>
                <OrderProcessingChargesUI
                    title='GST'
                    value={renderPrice(data.chargeBreakdown.totalProductGST, '')} />

                <OrderProcessingChargesUI
                    title={`Service Charges(Incl S.T ${renderPrice(data.chargeBreakdown.estimateServiceTax, '')})`}
                    value={renderPrice(data.chargeBreakdown.totalEstimateCharge, '')} />
                <DashedLine />
                <OrderProcessingChargesUI
                    title='Discount'
                    value={parseInt(renderPrice(data.chargeBreakdown.discount, '')) > 0 ? renderPrice(data.chargeBreakdown.discount, '-') : renderPrice(data.chargeBreakdown.discount, '')} />
                <DashedLine />

                <OrderProcessingEstimatedTotalUI estimatedPrice={renderPrice(data.chargeBreakdown.estimateTotalAmount, '')} />
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

            <OrderEstTimeCard
                imageHeight={IMAGE_SIZE * 0.6}
                color={colors}
                middle={{
                    value: state.orderEstimateTime,
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
                    return (
                        <View style={styles.cardContainer} key={index}>
                            <CardTitle
                                pitstopType={item.pitstopType}
                                pitstopNumber={`${index + 1}`}
                                title={item.title}
                                strikethrough={item.joviJobStatus === ENUMS.JOVI_JOB_STATUS.Cancel || (item?.forceStrikethrough ?? false)}
                            />
                            <DashedLine />
                            {
                                item.isSkipped && <>
                                     <CardSubTitle type={CARD_SUB_TITLE_TYPES.cancelled} />
                                     <View style={styles.greyCardContainer}>
                                        {item.jobItemsListViewModel.map((childItem, childIndex) => {
                                            return (
                                                <CardText
                                                    key={childIndex}
                                                    title={childItem.productItemName}
                                                    price={childItem.price}
                                                    type={CARD_SUB_TITLE_TYPES.cancelled}
                                                />
                                            )
                                        })}
                                    </View>
                                </>
                            }
                            {item.cancelledData > 0 &&
                                <>
                                    <CardSubTitle type={CARD_SUB_TITLE_TYPES.cancelled} />

                                    {/* <View style={styles.greyCardContainer}>
                                        {item.data.cancelledData.map((childItem, childIndex) => {
                                            return (
                                                <CardText
                                                    key={childIndex}
                                                    title={childItem.title}
                                                    price={childItem.value}
                                                    type={CARD_SUB_TITLE_TYPES.cancelled}
                                                />
                                            )
                                        })}
                                    </View> */}
                                </>
                            }

                            {item.outOfStockData > 0 &&
                                <>
                                    <CardSubTitle type={CARD_SUB_TITLE_TYPES.outOfStock} />

                                    <View style={styles.greyCardContainer}>
                                        {item.data.outOfStockData.map((childItem, childIndex) => {
                                            return (
                                                <CardText
                                                    key={childIndex}
                                                    title={childItem.title}
                                                    price={childItem.value}
                                                    type={CARD_SUB_TITLE_TYPES.outOfStock}
                                                />
                                            )
                                        })}
                                    </View>
                                </>
                            }

                            {item.replacedData> 0 &&
                                <>
                                    <CardSubTitle type={CARD_SUB_TITLE_TYPES.replaced} />

                                    <View style={styles.greyCardContainer}>
                                        {item.data.replacedData.map((childItem, childIndex) => {
                                            return (
                                                <CardText
                                                    key={childIndex}
                                                    title={childItem.title}
                                                    price={childItem.value}
                                                    type={CARD_SUB_TITLE_TYPES.replaced}
                                                />
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
                    onPress={() => { }}
                    text="Cancel"
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
                    onPress={() => { }}
                    // disabled={enableDisableButton}
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
const CardText = ({ title = '', price = '', type }) => {
    if (type === CARD_SUB_TITLE_TYPES.cancelled || type === CARD_SUB_TITLE_TYPES.outOfStock) {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "70%",
                    fontSize: 12,
                    color: "#B1B1B1",
                    textDecorationLine: "line-through",
                    textDecorationColor: "#B1B1B1",

                }} numberOfLines={1}>{`${title}`}</Text>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "30%",
                    fontSize: 12,
                    color: "#B1B1B1",
                    textDecorationLine: "line-through",
                    textDecorationColor: "#B1B1B1",
                }} numberOfLines={1}>{`${renderPrice(`${price}`)}`}</Text>
            </View>
        )
    }
    return (
        <>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "70%",
                    fontSize: 12,
                    color: "#B1B1B1",
                    textDecorationLine: "line-through",
                    textDecorationColor: "#B1B1B1",

                }} numberOfLines={1}>{`${title}`}</Text>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "30%",
                    fontSize: 12,
                    color: "#B1B1B1",
                    textDecorationLine: "line-through",
                    textDecorationColor: "#B1B1B1",
                }} numberOfLines={1}>{`${renderPrice(`${price}`)}`}</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "70%",
                    fontSize: 12,
                    color: "#272727",

                }} numberOfLines={1}>{`${title}`}</Text>
                <Text fontFamily='PoppinsMedium' style={{
                    maxWidth: "30%",
                    fontSize: 12,
                    color: "#272727",
                }} numberOfLines={1}>{`${renderPrice(`${price}`)}`}</Text>
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
    }else if(type === CARD_SUB_TITLE_TYPES.accepted){
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