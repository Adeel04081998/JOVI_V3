import lodash from 'lodash'; // 4.0.8
import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { ActivityIndicator, Appearance, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Text from '../../components/atoms/Text';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import NoRecord from '../../components/organisms/NoRecord';
import { isNextPage, renderFile, sharedAddUpdatePitstop, sharedExceptionHandler, uniqueKeyExtractor, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import { store } from '../../redux/store';
import constants from '../../res/constants';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV, { PITSTOP_TYPES } from '../../utils/GV';
import GotoCartButton from '../RestaurantProductMenu/components/GotoCartButton';
import ProductMenuHeader from './components/ProductMenuHeader';
import ProductMenuItemCard from './components/ProductMenuItemCard';
import { itemStylesFunc, stylesFunc } from './styles';

const WINDOW_WIDTH = constants.window_dimensions.width;

const ITEM_IMAGE_SIZE = WINDOW_WIDTH * 0.35;
const VERTICAL_MAX_ITEM_PER_REQUEST = 10;
const HORIZONTAL_MAX_ITEM_PER_REQUEST = 4;
const SHELVE_MAX_COUNT = 7;
const DEFAULT_PAGINATION_INFO = { totalItem: 0, itemPerRequest: VERTICAL_MAX_ITEM_PER_REQUEST, currentRequestCount: 1 };
const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
export default ({ navigation, route }) => {
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.SUPER_MARKET;
    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOPS)[pitstopType]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);
    const itemStyles = itemStylesFunc(colors, ITEM_IMAGE_SIZE);

    // #endregion :: STYLES & THEME END's FROM HERE 
    const cartReducer = useSelector(store => store.cartReducer);
    const marketID = route.params?.pitstopID ?? 0;// 4613,4609, 4521;
    const headerTitle = route.params?.title ?? '';

    // #region :: STATE's & REF's START's FROM HERE 
    const flatlistRef = React.useRef(null);

    const [allData, updateALlData] = React.useState({});
    const [data, updateData] = React.useState([]);
    const [metaData, toggleMetaData] = React.useState(false);
    const [isClosed, toggleIsClosed] = React.useState(false);

    const [finalDestination, updateFinalDestination] = React.useState(store.getState().userReducer?.finalDestination ?? {});
    const [paginationInfo, updatePaginationInfo] = React.useState(DEFAULT_PAGINATION_INFO);
    const [query, updateQuery] = React.useState({
        isLoading: true,
        error: false,
        errorText: '',
        refreshing: false,
    });
    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: API IMPLEMENTATION START's FROM HERE 

    React.useEffect(() => {
        loadData(paginationInfo.currentRequestCount);
        return () => { };
    }, []);

    const getQuantity = () => {
        return 0;
    };

    const loadData = (currentRequestNumber, append = false) => {
        updateQuery({
            errorText: '',
            isLoading: !append,
            error: false,
            refreshing: append,
        });
        const params = {
            "latitude": finalDestination?.latitude ?? 33.654227,
            "longitude": finalDestination?.longitude ?? 73.044831,
            "searchItem": "",
            "categoryID": 0,
            "catPageNumber": currentRequestNumber,
            "catItemsPerPage": paginationInfo.itemPerRequest,
            "productPageNumber": 1,
            "productItemsPerPage": HORIZONTAL_MAX_ITEM_PER_REQUEST,
            "marketID": marketID
        };

        postRequest(Endpoints.GET_PRODUCT_MENU_LIST, params, (res) => {
            console.log('GET_PRODUCT_MENU_LIST', res);
            if (res.data.statusCode === 404) {
                updateQuery({
                    errorText: res.data.message,
                    isLoading: false,
                    error: true,
                    refreshing: false,
                });
                updateData({});
                return
            }

            const pitstopStockView = res.data?.pitstopStockViewModel ?? {};

            const newData = (pitstopStockView?.categoryWithItems ?? []).map(pitem => {
                const newpitstopItemListArr = pitem.pitstopItemList.map(item => {
                    return {
                        ...item,
                        quantity: getQuantity(),
                        isOutOfStock: false,
                    }
                })
                return {
                    ...pitem,
                    pitstopItemList: newpitstopItemListArr,
                };
            })

            if (!append) {
                const shelveSlicedArray = (pitstopStockView?.shelves ?? []).slice(0, SHELVE_MAX_COUNT);
                updateALlData({ ...pitstopStockView, shelveSlicedArray });
                const totalItem = res.data?.pitstopStockViewModel?.categoryPaginationInfo?.totalItems ?? DEFAULT_PAGINATION_INFO.totalItem;

                updatePaginationInfo(pre => ({
                    ...pre,
                    totalItem,
                }))
            }


            updateData([...data, ...newData]);
            toggleMetaData(!metaData);
            updateQuery({
                errorText: '',
                isLoading: false,
                error: false,
                refreshing: false,
            });

        }, (err) => {
            sharedExceptionHandler(err);
            updateQuery({
                errorText: sharedExceptionHandler(err),
                isLoading: false,
                error: true,
                refreshing: false,
            })
        })
    };//end of loadData

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = (title = headerTitle) => {
        return (
            <CustomHeader
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: VALIDATION_CHECK(title) ? colors.white : 'transparent',
                    ...!VALIDATION_CHECK(title) && {
                        position: "absolute",
                        zIndex: 999,

                    },
                    top: getStatusBarHeight(true),
                }}
                title={title}
                titleStyle={{
                    color: colors.primary,
                }}
                hideFinalDestination
                leftIconName="chevron-back"
                leftContainerStyle={{ backgroundColor: colors.white, }}
                rightContainerStyle={{ backgroundColor: colors.white, }}
                leftIconColor={colors.primary}
                rightIconColor={colors.primary}

            />
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: RENDER VERTICAL & HORIZONTAL SCROLL ITEM START's FROM HERE 
    const _renderParentItem = ({ item: parentItem, index: parentIndex }) => {
        const productTotalItem = parentItem?.productsPaginationInfo?.totalItems ?? 0;

        return (
            <React.Fragment>

                {/* ****************** Start of TITLE & VIEW MORE ****************** */}
                <View style={{
                    ...itemStyles.titlePrimaryContainer,
                    paddingTop: parentIndex === 0 ? 10 : 20,
                }}>
                    <Text style={styles.title}>{`${parentItem.categoryName}`}</Text>

                    {isNextPage(productTotalItem, HORIZONTAL_MAX_ITEM_PER_REQUEST, 1) &&
                        <TouchableScale wait={0} onPress={() => {
                            NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ProductMenuItem.screen_name, { pitstopType, marketID, item: parentItem })
                        }}>
                            <Text style={itemStyles.titleViewmoreText}>{`View More`}</Text>
                        </TouchableScale>
                    }
                </View>


                {/* ****************** End of TITLE & VIEW MORE ****************** */}

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(parentItem?.pitstopItemList ?? []).map((item, index) => {
                        const image = (item?.images ?? []).length > 0 ? item.images[0].joviImageThumbnail : '';
                        console.log('item ', item);
                        let isOutOfStock = "isOutOfStock" in item ? item.isOutOfStock : false;
                        if (item.availabilityStatus === ENUMS.AVAILABILITY_STATUS.OutOfStock) {
                            isOutOfStock = true;
                        }

                        return (
                            <View style={{
                                marginLeft: index === 0 ? 10 : 0,
                                ...itemStyles.primaryContainer,
                            }} key={uniqueKeyExtractor()}>
                                <ProductMenuItemCard
                                    disabled={isOutOfStock}
                                    colors={colors}
                                    index={index}
                                    itemImageSize={ITEM_IMAGE_SIZE}
                                    updateQuantity={(quantity) => {
                                        updateQuantity(parentIndex, index, quantity);
                                    }}
                                    item={{
                                        image: { uri: renderFile(`${image}`) },
                                        isOutOfStock: isOutOfStock,
                                        name: item.pitStopItemName,
                                        discountedPrice: item.discountedPrice || item.gstAddedPrice || item.itemPrice,
                                        price: item.gstAddedPrice || item.itemPrice,
                                        quantity: item.quantity,
                                        discountAmount: item.discountAmount,
                                        discountType: item.discountType,
                                    }}
                                    onPress={() => {
                                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ProductDetails.screen_name, {
                                            propItem: {
                                                itemDetails: {},
                                                ...item,
                                                vendorDetails: { ...route.params },
                                            },
                                            pitstopType: pitstopType
                                        })
                                    }}
                                />
                            </View>
                        )
                        // return (
                        //     <View style={{
                        //         marginLeft: index === 0 ? 10 : 0,
                        //         ...itemStyles.primaryContainer,
                        //     }} key={uniqueKeyExtractor()}>

                        //         {/* ****************** Start of IMAGE & QUANTITY ****************** */}
                        //         <View style={itemStyles.imageContainer}>
                        //             <ImageBackground
                        //                 source={{ uri: renderFile(`${image}`) }}
                        //                 style={itemStyles.image}
                        //                 borderRadius={8}
                        //                 tapToOpen={false}>

                        //                 <ProductQuantityCard
                        //                     outOfStock={isOutOfStock}
                        //                     initialQuantity={item.quantity}
                        //                     colors={colors}
                        //                     size={ITEM_IMAGE_SIZE}
                        //                     updateQuantity={(quantity) => {
                        //                         updateQuantity(parentIndex, index, quantity);
                        //                     }}
                        //                 />


                        //             </ImageBackground>
                        //         </View>

                        //         {/* ****************** End of IMAGE & QUANTITY ****************** */}


                        //         {/* ****************** Start of PRICE & DISCOUNT ****************** */}
                        //         <View style={itemStyles.priceDiscountContainer}>
                        //             <Text fontFamily='PoppinsBold' style={itemStyles.price}>{renderPrice(item.gstAddedPrice)}</Text>

                        //             {(VALIDATION_CHECK(item.discountedPrice) && parseInt(`${item.discountedPrice}`) > 0) &&
                        //                 <Text style={itemStyles.discountPrice}>{renderPrice(item.discountedPrice)}</Text>
                        //             }

                        //         </View>

                        //         {/* ****************** End of PRICE & DISCOUNT ****************** */}


                        //         {/* ****************** Start of NAME/TITLE ****************** */}
                        //         <Text style={itemStyles.name}>{item.pitStopItemName}</Text>

                        //         {/* ****************** End of NAME/TITLE ****************** */}

                        //         {/* ****************** Start of DISCOUNT TYPE ****************** */}
                        //         {parseInt(`${item.discountType}`) !== parseInt(`${ENUMS.PROMO_VALUE_TYPE.Empty.value}`) &&
                        //             <View style={itemStyles.discountTypeContainer}>
                        //                 {parseInt(`${item.discountType}`) === parseInt(`${ENUMS.PROMO_VALUE_TYPE.Percentage.value}`) &&
                        //                     <SvgXml xml={svgs.discount(colors.primary)} height={15} width={15} style={itemStyles.discountTypeIcon} />
                        //                 }
                        //                 <Text style={itemStyles.discountTypeText}>{`${renderPrice(item.discountAmount, '-', '%', /[^\d.]/g)}`}</Text>
                        //             </View>
                        //         }

                        //         {/* ****************** End of DISCOUNT TYPE ****************** */}


                        //     </View>
                        // )
                    })}
                </ScrollView>


            </React.Fragment>
        )
    }

    // #endregion :: RENDER VERTICAL & HORIZONTAL SCROLL ITEM END's FROM HERE 
    const discountTypeCallbacks = {
        1: (amount, discount) => discount > 0 ? ((discount / 100) * amount) : 0,
        2: (amount, discount) => discount > 0 ? (amount - discount) : 0,
    };
    // #region :: QUANTITY HANDLER START's FROM HERE 
    const updateQuantity = (parentIndex, index, quantity) => {
        let currentItem = data[parentIndex].pitstopItemList[index];
        let priceWithoutGst = currentItem.gstAddedPrice - currentItem.gstAmount;
        let discountAmount = discountTypeCallbacks[currentItem.discountType !== 0 ? currentItem.discountType : 1](priceWithoutGst, currentItem.discountAmount);
        data[parentIndex].pitstopItemList[index].quantity = quantity;
        const pitstopDetails = {
            pitstopType: PITSTOP_TYPES.SUPER_MARKET,
            vendorDetails: { ...data[parentIndex], pitstopItemList: null, marketID, actionKey: "marketID", pitstopName: allData.pitstopName, pitstopIndex: null, pitstopType, ...route.params },
            itemDetails: {
                ...data[parentIndex].pitstopItemList[index],
                actionKey: "pitStopItemID",
                gstAddedPrice: currentItem.gstAddedPrice,
                _itemPrice: currentItem.gstAddedPrice,
                _itemPriceWithoutDiscount: currentItem.gstAddedPrice - discountAmount,
                _totalDiscount: discountAmount,
                _totalGst: currentItem.gstAmount,
                totalAddOnPrice: 0,

            },
        }

        sharedAddUpdatePitstop(pitstopDetails,)
        // if (Math.random() < 0) {
        //     undoQuantity(parentIndex, index);
        // }
    };

    const undoQuantity = (parentIndex, index) => {
        data[parentIndex].pitstopItemList[index].isOutOfStock = !data[parentIndex].pitstopItemList[index].isOutOfStock;
        toggleMetaData(!metaData);

    };//end of undoQuantity

    // #endregion :: QUANTITY HANDLER END's FROM HERE 

    // #region :: ON END REACHED START's FROM HERE 
    const onEndReached = () => {
        if (isNextPage(paginationInfo.totalItem, paginationInfo.itemPerRequest, paginationInfo.currentRequestCount)) {
            updateQuery(pre => ({
                ...pre,
                refreshing: true
            }))

            updatePaginationInfo(pre => ({
                ...pre,
                currentRequestCount: pre.currentRequestCount + 1,
            }))


            loadData(paginationInfo.currentRequestCount + 1, true);

            return
        }
    };//end of onEndReached

    // #endregion :: ON END REACHED END's FROM HERE 

    if (query.error) {

        return (
            <>
                {_renderHeader()}
                <NoRecord
                    title={query.errorText}
                    buttonText={`Retry`}
                    onButtonPress={() => { loadData(paginationInfo.currentRequestCount, false) }} />
            </>
        )
    }
    if (query.isLoading) {
        return (
            <>
                {_renderHeader()}
                {/* <View style={{ height: '93%', width: '101%', paddingLeft: 10, paddingTop: 4, paddingHorizontal: 5, display: 'flex', justifyContent: 'center', alignContent: 'center', }}> */}
                <AnimatedLottieView
                    autoSize={true}
                    resizeMode={'contain'}
                    style={{ width: '100%' }}
                    source={require('../../assets/LoadingView/SupermarketMenu.json')}
                    autoPlay
                    loop
                />
                {/* </View> */}
            </>
        )
    }

    return (
        <SafeAreaView style={styles.primaryContainer}>
            {_renderHeader('')}
            <FlatList
                ref={flatlistRef}
                data={(data)}
                extraData={metaData}
                scrollEnabled={true}
                nestedScrollEnabled
                contentContainerStyle={{
                    paddingBottom: 55,
                }}
                onEndReachedThreshold={0.6}
                onEndReached={onEndReached}
                ListHeaderComponent={(
                    <ProductMenuHeader
                        pitstopType={pitstopType}
                        hideHeader
                        colors={colors}
                        shelveData={allData?.shelveSlicedArray ?? []}
                        data={allData.shelves}
                        marketID={marketID}
                        headerItem={{
                            image: { uri: renderFile(allData?.pitstopImage ?? '') },
                            distance: allData?.distance ?? '',
                            time: allData?.time ?? '',
                            title: allData?.pitstopName ?? '',
                            description: allData?.pitstopTag ?? '',
                        }}
                    />
                )}

                renderItem={_renderParentItem}
                initialNumToRender={3}
                maxToRenderPerBatch={10}
                ListFooterComponent={
                    <ActivityIndicator size="large" color={colors.primary}
                        style={{
                            opacity: query.refreshing ? 1 : 0,
                            marginTop: 10
                        }} />
                }
            />


            <GotoCartButton colors={colors} />



        </SafeAreaView>
    )
};//end of EXPORT DEFAULT

