import * as React from 'react';
import { Appearance, Image, SafeAreaView, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard';
import DashedLine from '../../components/organisms/DashedLine';
import { renderPrice, sharedFetchOrder } from '../../helpers/SharedActions';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { stylesFunc } from './styles';
import { orderProcessingDummyData } from './StaticData';
import AnimatedLottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';

const DOUBLE_SPACING = constants.spacing_horizontal + 6;
const IMAGE_SIZE = constants.window_dimensions.width * 0.3;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE 
    const userReducer = useSelector(store => store.userReducer);
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.JOVI;
    const orderIDParam = route?.params?.orderID ?? PITSTOP_TYPES.JOVI;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    const [state, setState] = React.useState({
        orderID: userReducer.orderList ? userReducer.orderList[0] : 0,
        pitStopsList: [],
        isLoading: true,
        chargeBreakdown:{},
    });
    const styles = stylesFunc(colors);

    // #endregion :: STYLES & THEME END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={{ ...styles.primaryContainer, flex: 0, }}>
                <CustomHeader
                    leftIconName='home'
                    hideFinalDestination
                    title={'Processing'}
                    rightIconName={null}
                    rightIconSize={22}
                    defaultColor={colors.primary} />
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
            setState(pre => ({ ...pre, ...res.data.order,isLoading:false }))
        });
        let pitstopDataArr = orderProcessingDummyData.data.order.pitStopsList.slice(0, orderProcessingDummyData.data.order.pitStopsList.length - 1);

        pitstopDataArr = pitstopDataArr.map(e => {
            const ptItemData = [];
            if (e.pitstopType === PITSTOP_TYPES.SUPER_MARKET || e.pitstopType === PITSTOP_TYPES.RESTAURANT) {
                //RESTURANT AND SUPERMARKET
                (e?.jobItemsListViewModel ?? []).map((f, index) => {
                    ptItemData.push({
                        id: e?.jobItemID ?? index,
                        title: f?.productItemName ?? '',
                        value: f?.price ?? '',
                    })
                    return
                })
            } else {
                //JOVI JOB
                ptItemData.push({
                    id: 1,
                    title: e?.description ?? '',
                    value: e?.jobAmount ?? '',
                });

            }
            return {
                ...e,
                data: ptItemData,
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
                    marginTop:10,
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
                    <DeliveryAddressUI address={`${state.pitStopsList[state.pitStopsList.length-1]?.title ?? ''}`} />

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
                        value={renderPrice(data.chargeBreakdown.totalProductGST)} />

                    {/* ****************** End of GST ****************** */}


                    {/* ****************** Start of SERVICE CHARGES ****************** */}
                    <OrderProcessingChargesUI
                        title={`Service Charges(Incl S.T ${renderPrice(data.chargeBreakdown.estimateServiceTax, '')})`}
                        value={renderPrice(state.serviceCharges)} />
                    <DashedLine />

                    {/* ****************** End of SERVICE CHARGES ****************** */}


                    {/* ****************** Start of DISCOUNT ****************** */}
                    <OrderProcessingChargesUI title='Discount'
                        value={parseInt(renderPrice(data.chargeBreakdown.discount)) > 0 ? renderPrice(data.chargeBreakdown.discount) : renderPrice(data.chargeBreakdown.discount)} />
                    <DashedLine />

                    {/* ****************** End of DISCOUNT ****************** */}



                    {/* ****************** Start of ESTIMATED PRICE ****************** */}
                    <OrderProcessingEstimatedTotalUI estimatedPrice={renderPrice(state.totalAmount)} />

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
const PitStopItemUI = ({ pitstopTitle = '', isJoviJob = false, pitstopNumber = 1, data = [], dataLeftKey = "title", dataRightKey = "value" }) => {
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
                        }} numberOfLines={2}>{`${item[dataLeftKey]}`}</Text>

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