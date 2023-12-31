import lodash from 'lodash'; // 4.0.8
import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { ActivityIndicator, Alert, Appearance, FlatList, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import View from '../../components/atoms/View';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import CustomHeader from '../../components/molecules/CustomHeader';
import NoRecord from '../../components/organisms/NoRecord';
import { getKeyByValue, isNextPage, renderFile, sharedAddToCartKeys, sharedAddUpdatePitstop, sharedExceptionHandler, sharedGetFinalDestintionRequest, sharedGetPitstopData, uniqueKeyExtractor } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import { store } from '../../redux/store';
import constants from '../../res/constants';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import ProductMenuItemCard from '../ProductMenu/components/ProductMenuItemCard';
import { ProductDummyData1 } from '../RestaurantProductMenu/components/ProductDummyData';
import { stylesFunc } from './styles';

const WINDOW_WIDTH = constants.screen_dimensions.width;
const ITEM_IMAGE_SIZE = WINDOW_WIDTH * 0.29;
const VERTICAL_MAX_ITEM_PER_REQUEST = 10;
const DEFAULT_PAGINATION_INFO = { totalItem: 0, itemPerRequest: VERTICAL_MAX_ITEM_PER_REQUEST, currentRequestCount: 1 };

export default ({ navigation, route }) => {

    // #region :: ROUTE PARAM's START's FROM HERE 
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.SUPER_MARKET;
    const parentItem = route?.params?.item ?? {};
    const allData = route?.params?.allData ?? {};

    const marketID = route?.params?.marketID ?? 0;// 4613,4609, 4521, 4668;
    const categoryID = route?.params?.item?.categoryID ?? 0;// 668, 675
    const headerTitle = route?.params?.item?.categoryName ?? '';
    const getStoredQuantities = sharedGetPitstopData({ marketID }, "marketID");


    // #endregion :: ROUTE PARAM's END's FROM HERE 

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");

    const styles = stylesFunc(colors);

    // #endregion :: STYLES & THEME END's FROM HERE 

    // #region :: STATE's & REF's START's FROM HERE 

    const [paginationInfo, updatePaginationInfo] = React.useState(DEFAULT_PAGINATION_INFO);
    const [data, updateData] = React.useState([]);
    const [metaData, toggleMetaData] = React.useState(false);
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

    const getQuantity = (id) => {
        const arr = getStoredQuantities?.checkOutItemsListVM ?? [];
        return arr.find(x => x[x.actionKey] === id)?.quantity ?? 0;
    };
    const loadData = (currentRequestNumber, append = false) => {
        updateQuery({
            errorText: '',
            isLoading: !append,
            error: false,
            refreshing: append,
        });
        const params = {
            "searchItem": "",
            "categoryID": categoryID,
            "catPageNumber": 1,
            "catItemsPerPage": 1,
            "productPageNumber": currentRequestNumber,
            "productItemsPerPage": paginationInfo.itemPerRequest,
            "marketID": marketID,
            "skipCatPagination": true,
            ...sharedGetFinalDestintionRequest()
        };

        console.log('PARAM ', params);
        postRequest(Endpoints.GET_PRODUCT_MENU_LIST, params, (res) => {
            console.log('res ', res);
            if (res.data.statusCode === 404) {
                if (data.length < 1) {
                    updateQuery({
                        errorText: res.data.message,
                        isLoading: false,
                        error: true,
                        refreshing: false,
                    });
                    updateData([]);
                } else {
                    updateQuery({
                        errorText: res.data.message,
                        isLoading: false,
                        error: false,
                        refreshing: false,
                    });
                }
                return
            }
            const pitstopStockView = res?.data?.pitstopStockViewModel ?? {};

            const newData = (pitstopStockView?.categoryWithItems ?? []).map(pitem => {
                const newpitstopItemListArr = pitem.pitstopItemList.map(item => {
                    return {
                        ...item,
                        quantity: getQuantity(item.pitStopItemID),
                        isOutOfStock: false,
                    }
                })
                return {
                    categoryID: pitem.categoryID,
                    data: newpitstopItemListArr,
                    paginationInfo: pitem?.productsPaginationInfo,
                };
            }).find(x => x.categoryID === categoryID);

            if (!append) {
                updatePaginationInfo(pre => ({
                    ...pre,
                    totalItem: newData?.paginationInfo?.totalItems ?? 0,
                }))
            }

            updateQuery({
                errorText: '',
                isLoading: false,
                error: false,
                refreshing: false,
            });
            updateData([...data, ...(newData?.data ?? [])])
            toggleMetaData(!metaData);

        }, (err) => {
            sharedExceptionHandler(err);
            updateQuery({
                errorText: sharedExceptionHandler(err),
                isLoading: false,
                error: true,
                refreshing: false,
            })
            updateData([])
        })
    };//end of loadData

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

    // #region :: ON END REACHED START's FROM HERE 
    const onEndReached = () => {
        if (query.refreshing) return
        if (isNextPage(paginationInfo.totalItem, paginationInfo.itemPerRequest, paginationInfo.currentRequestCount)) {
            updateQuery(pre => ({
                ...pre,
                refreshing: true
            }))


            // setTimeout(() => {
            loadData(paginationInfo.currentRequestCount + 1, true);

            updatePaginationInfo(pre => ({
                ...pre,
                currentRequestCount: pre.currentRequestCount + 1,
            }))

            // }, 5000);
            return
        }
    };//end of onEndReached

    // #endregion :: ON END REACHED END's FROM HERE 

    // #region :: QUANTITY HANDLER START's FROM HERE 
    const updateQuantity = (index, quantity) => {
        let currentItem = data[index]
        currentItem.quantity = quantity;
        console.log("currentItem", currentItem);
        const pitstopDetails = {
            pitstopType: PITSTOP_TYPES.SUPER_MARKET,
            vendorDetails: {
                ...route?.params?.item,
                pitstopItemList: null,
                marketID,
                ...sharedAddToCartKeys(null, null).restaurant,
                actionKey: "marketID",
                pitstopType: PITSTOP_TYPES.SUPER_MARKET,
            },
            itemDetails: {
                ...data[index],
                ...sharedAddToCartKeys(null, currentItem).item,
                actionKey: "pitStopItemID",
                pitstopType: PITSTOP_TYPES.SUPER_MARKET,
            },
        }

        sharedAddUpdatePitstop(pitstopDetails, false, [], false, false, null, false, true)
        // if (Math.random() < 0) {
        //     undoQuantity(parentIndex, index);
        // }
    };

    const undoQuantity = (parentIndex, index) => {
        data[parentIndex].pitstopItemList[index].isOutOfStock = !data[parentIndex].pitstopItemList[index].isOutOfStock;
        toggleMetaData(!metaData);

    };//end of undoQuantity

    // #endregion :: QUANTITY HANDLER END's FROM HERE 

    // #region :: GETTING PRODUCT MENU PRICE FROM ITEM START's FROM HERE 
    const getPricesForProductMenuItemCard = (item) => {
        return {
            discountedPrice: item.discountAmount > 0 ? item.discountedPrice : item.gstAddedPrice || item.itemPrice, //MAIN PRICE
            price: item.gstAddedPrice || item.itemPrice, //ACTUAL PRICE BEFORE DISCOUNT
            discountAmount: item.discountAmount, //PERCENTAGE OF DISCOUNT
            discountType: item.discountType, //DISCOUNT TYPE FIXED OR PERCENATAGE
        }
    };
    // #endregion :: GETTING PRODUCT MENU PRICE FROM ITEM END's FROM HERE 


    // #region :: RENDER ITEM START's FROM HERE 
    const _renderItem = ({ item, index }) => {
        const image = (item?.images ?? []).length > 0 ? item.images[0].joviImageThumbnail : '';
        let isOutOfStock = "isOutOfStock" in item ? item.isOutOfStock : false;
        if (item.availabilityStatus === ENUMS.AVAILABILITY_STATUS.OutOfStock) {
            isOutOfStock = true;
        }

        return (
            <View style={{
                marginTop: 20,
            }}>
                <ProductMenuItemCard
                    itemContainerStyle={{
                        marginRight: 0,
                    }}
                    onPress={() => {
                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ProductDetails.screen_name, {
                            propItem: {
                                itemDetails: { ...item },
                                ...item,
                                vendorDetails: {
                                    ...parentItem, pitstopItemList: null, marketID, actionKey: "marketID",
                                    pitstopName: allData?.pitstopName ?? '', pitstopIndex: null, pitstopType, ...route.params
                                },
                                // vendorDetails: { ...route.params, allData },
                            },
                            pitstopType: pitstopType
                        })
                    }}
                    disabled={isOutOfStock}
                    colors={colors}
                    index={index}
                    itemImageSize={ITEM_IMAGE_SIZE}
                    updateQuantity={(quantity) => {
                        updateQuantity(index, quantity);
                    }}
                    item={{
                        marketID: marketID,
                        pitstopItemID: item.pitStopItemID,
                        image: { uri: renderFile(`${image}`) },
                        isOutOfStock: isOutOfStock,
                        name: item.pitStopItemName,
                        quantity: item.quantity,
                        ...getPricesForProductMenuItemCard(item),
                    }}
                />
            </View>

        )
    }

    // #endregion :: RENDER ITEM END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <CustomHeader
                hideFinalDestination
                rightIconColor={colors.primary}
                leftIconColor={colors.primary}
                leftContainerStyle={{ backgroundColor: colors.white, }}
                containerStyle={{
                    backgroundColor: colors.white,
                    borderBottomColor: colors.primary,
                    alignItems: "center",
                    paddingBottom: 10,
                }}
                title={headerTitle}
                titleStyle={{
                    textAlign: "center",
                    color: colors.primary,
                }}
            />


        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: ERROR AND LOADING START's FROM HERE 
    if (query.error) {
        return (
            <>
                {_renderHeader()}
                <NoRecord
                    color={colors}
                    title={query.errorText}
                    buttonText={`Retry`}
                    onButtonPress={() => {
                        loadData(1, true);

                        updatePaginationInfo(pre => ({
                            ...pre,
                            currentRequestCount: 1,
                        }));
                    }} />
            </>
        )
    }
    if (query.isLoading) {
        return (
            <>
                {_renderHeader()}
                <AnimatedLottieView
                    autoSize={true}
                    resizeMode={'contain'}
                    style={{ paddingTop: 10, }}
                    source={require('../../assets/LoadingView/ProductMenuItem.json')}
                    autoPlay
                    loop
                />
            </>
        )
    }

    // #endregion :: ERROR AND LOADING END's FROM HERE 

    return (
        <SafeAreaView style={[styles.primaryContainer]}>
            {_renderHeader()}


            <FlatList
                data={data}
                extraData={metaData}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    paddingHorizontal: constants.spacing_horizontal,
                }}
                contentContainerStyle={{
                    paddingBottom: 60,
                }}

                flatlistProps={{
                    numColumns: 3,
                    columnWrapperStyle: {
                        paddingHorizontal: constants.spacing_horizontal / 2,
                    },
                    contentContainerStyle: {
                        paddingBottom: 60,
                    },
                    showsVerticalScrollIndicator: false,
                }}
                renderItem={_renderItem}
                onEndReachedThreshold={0.6}
                onEndReached={onEndReached}
                initialNumToRender={3}
                maxToRenderPerBatch={10}
                ListFooterComponent={
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                        style={{
                            opacity: query.refreshing ? 1 : 0,
                            marginTop: 20,
                            marginBottom: 20,
                        }} />
                }
            />
        </SafeAreaView>
    )
};//end of EXPORT DEFAULT

