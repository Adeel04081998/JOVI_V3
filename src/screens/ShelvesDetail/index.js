import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { Animated, Appearance, FlatList, SafeAreaView, ScrollView } from 'react-native';
import Text from '../../components/atoms/Text';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import NoRecord from '../../components/organisms/NoRecord';
import { isNextPage, renderFile, sharedAddUpdatePitstop, sharedExceptionHandler, uniqueKeyExtractor } from '../../helpers/SharedActions';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import { store } from '../../redux/store';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import ProductMenuItemCard from '../ProductMenu/components/ProductMenuItemCard';
import ScrollableList from './Components/ScrollableList';
import { sectionHeaderItemStyleFunc, stylesFunc } from './styles';


// #region :: CONSTANT's START's FROM HERE 
const WINDOW_WIDTH = constants.screen_dimensions.width;

const ITEM_IMAGE_SIZE = WINDOW_WIDTH * 0.29;

const PITSTOP_ITEM_LIST_MAX_COUNT = 5;

// #endregion :: CONSTANT's END's FROM HERE 

export default ({ navigation, route }) => {

    // #region :: ROUTE PARAM's START's FROM HERE 
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.SUPER_MARKET;
    const marketID = route?.params?.marketID ?? 0;// 4613,4609, 4521, 4668;
    const shelveID = route?.params?.shelveID ?? 0;
    const headerTitle = route?.params?.categoryName ?? '';
    const shelveArr = route?.params?.shelveData ?? [];

    // #endregion :: ROUTE PARAM's END's FROM HERE 

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");

    const styles = stylesFunc(colors);
    const sectionHeaderItemStyles = sectionHeaderItemStyleFunc(colors);
    // #endregion :: STYLES & THEME END's FROM HERE 

    // #region :: STATE's & REF's START's FROM HERE 
    const animScroll = React.useRef(new Animated.Value(0)).current

    const [finalDestination, updateFinalDestination] = React.useState(store.getState().userReducer?.finalDestination ?? {});

    const [shelveData, updateShelveData] = React.useState(shelveArr);
    const [shelveMetaData, toggleShelveMetaData] = React.useState(false);

    const [data, updateData] = React.useState([]);
    const [metaData, toggleMetaData] = React.useState(false);

    const [query, updateQuery] = React.useState({
        isLoading: true,
        error: false,
        errorText: '',
    });
    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: API IMPLEMENTATION START's FROM HERE 

    React.useEffect(() => {
        loadData(shelveID);
        return () => { };
    }, []);

    const getQuantity = () => {
        return 0;
    };

    const loadData = (tagID) => {
        updateQuery({
            errorText: '',
            isLoading: true,
            error: false,
        });
        const params = {
            "latitude": finalDestination?.latitude ?? 33.654227,
            "longitude": finalDestination?.longitude ?? 73.044831,
            "searchItem": "",
            "categoryID": 0,
            "tagID": tagID,
            "catPageNumber": 1,
            "catItemsPerPage": 1,
            "productPageNumber": 1,
            "productItemsPerPage": PITSTOP_ITEM_LIST_MAX_COUNT,
            "marketID": marketID,
            "skipCatPagination": true,
        };

        postRequest(Endpoints.GET_PRODUCT_MENU_LIST, params, (res) => {

            if (res.data.statusCode === 404) {
                updateQuery({
                    errorText: res.data.message,
                    isLoading: false,
                    error: true,
                });
                updateData([]);
                return
            }
            const pitstopStockView = res?.data?.pitstopStockViewModel ?? {};


            const newData = (pitstopStockView?.categoryWithItems ?? []).map(pitem => {
                const newpitstopItemListArr = pitem.pitstopItemList.map(item => {
                    return {
                        ...item,
                        quantity: getQuantity(),
                        isOutOfStock: false,
                    }
                })
                const pitstopItemListSliced = (newpitstopItemListArr ?? []).slice(0, PITSTOP_ITEM_LIST_MAX_COUNT);
                return {
                    ...pitem,
                    pitstopItemList: newpitstopItemListArr,
                    pitstopItemListSliced,
                };
            });//end of newData

            updateQuery({
                errorText: '',
                isLoading: false,
                error: false,
            });
            updateData(newData)
            toggleMetaData(!metaData);

        }, (err) => {
            sharedExceptionHandler(err);
            updateQuery({
                errorText: sharedExceptionHandler(err),
                isLoading: false,
                error: true,
            })
            updateData([])
        })
    };//end of loadData

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

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

    // #region :: ON CHANGE SHELVE PRESS START's FROM HERE 
    const onChangeShelvePress = (index) => {
        updateQuery(pre => ({
            ...pre,
            isLoading: true,
        }));
        for (let i = 0; i < shelveData.length; i++) {
            shelveData[i].isSelected = index === i;
        }
        toggleShelveMetaData(!shelveMetaData);
        loadData(shelveData[index].tagID);
    };//end of onChangeShelvePress

    // #endregion :: ON CHANGE SHELVE PRESS END's FROM HERE 

    // #region :: QUERY ERROR AND LOADING RENDERING START's FROM HERE 
    if (query.error) {
        return (
            <SafeAreaView style={[styles.primaryContainer, { top: getStatusBarHeight(true) }]}>
                {_renderHeader()}
                <NoRecord
                    color={colors}
                    title={query.errorText}
                    buttonText={`Retry`}
                    onButtonPress={() => { loadData(shelveID) }} />
            </SafeAreaView>
        )
    }


    // #endregion :: QUERY ERROR AND LOADING RENDERING END's FROM HERE 

    // #region :: QUANTITY HANDLER START's FROM HERE 
    const updateQuantity = (parentIndex, index, quantity) => {
        data[parentIndex].pitstopItemList[index].quantity = quantity;
        const pitstopDetails = {
            pitstopType: PITSTOP_TYPES.SUPER_MARKET,
            vendorDetails: { ...data[parentIndex], pitstopItemList: null, marketID, actionKey: "marketID" },
            itemDetails: { ...data[parentIndex].pitstopItemList[index], actionKey: "pitStopItemID" },
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

    const onViewMorePress=(item)=>{
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ProductMenuItem.screen_name, { pitstopType, marketID, item: item });
    };//end of onViewMorePress

    return (
        <SafeAreaView style={styles.primaryContainer}>

            {_renderHeader()}

            {/* ****************** Start of HORIZONTAL SHELVES ****************** */}
            <FlatList
                data={shelveData}
                extraData={shelveMetaData}
                style={{ flexGrow: 0, }}
                contentContainerStyle={{ paddingBottom: 40, }}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item, index }) => {
                    return (
                        <TouchableScale style={{
                            minHeight: 40,
                            marginTop: 15,
                            marginLeft: index === 0 ? 10 : 0,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            backgroundColor: item.isSelected ? colors.primary : colors.white,
                            borderColor: "#B5B5B5",
                            borderWidth: 0.5,
                            marginRight: 10,
                            alignItems: "center",
                            justifyContent: "center",
                        }} key={uniqueKeyExtractor()}
                            onPress={() => { onChangeShelvePress(index) }}>
                            <Text fontFamily='PoppinsMedium' style={{
                                color: item.isSelected ? colors.white : "#272727",
                                fontSize: 12,
                            }}>{item.tagName}</Text>
                        </TouchableScale>
                    )
                }} />

            {/* ****************** End of HORIZONTAL SHELVES ****************** */}


            {query.isLoading ?
                <AnimatedLottieView
                    autoSize={true}
                    resizeMode={'contain'}
                    style={{ paddingTop: 50, }}
                    source={require('../../assets/LoadingView/ProductMenuItem.json')}
                    autoPlay
                    loop
                />
                :
                <ScrollableList
                    colors={colors}
                    data={data}
                    animatedScrollValue={animScroll}
                    itemListPropertyName="pitstopItemListSliced"
                    renderSectionHeader={(item, index) => {
                        const productTotalItem = item?.productsPaginationInfo?.totalItems ?? 0;

                        return (
                            <View style={sectionHeaderItemStyles.primaryContainer}>
                                {/* ****************** Start of TITLE & VIEW MORE ****************** */}
                                <Text style={sectionHeaderItemStyles.title}>{`${item.categoryName}`}</Text>

                                {isNextPage(productTotalItem, PITSTOP_ITEM_LIST_MAX_COUNT, 1) &&
                                    <TouchableScale onPress={() => {
                                        onViewMorePress(item);
                                    }} wait={0}>
                                        <Text style={sectionHeaderItemStyles.titleViewmoreText}>{`View More`}</Text>
                                    </TouchableScale>
                                }
                                {/* ****************** End of TITLE & VIEW MORE ****************** */}
                            </View>
                        )
                    }}
                    renderItem={(parentItem, item, parentIndex, index) => {
                        const image = (item?.images ?? []).length > 0 ? item.images[0].joviImageThumbnail : '';
                        const isOutOfStock = "isOutOfStock" in item ? item.isOutOfStock : false;

                        const productTotalItem = parentItem?.productsPaginationInfo?.totalItems ?? 0;
                        const additionalCount = productTotalItem - PITSTOP_ITEM_LIST_MAX_COUNT;

                        return (
                            <View style={{
                                marginTop: 0, flexDirection: "row", marginBottom: 10,
                                marginLeft: index % 3 === 0 ? constants.spacing_horizontal : 0,
                                alignItems: "center",
                                justifyContent: "center",
                            }} key={uniqueKeyExtractor()}>
                                <ProductMenuItemCard
                                    onPress={() => { }}
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
                                        price: item.gstAddedPrice,
                                        quantity: item.quantity,
                                        discountAmount: item.discountAmount,
                                        discountType: item.discountType,
                                        discountedPrice: item.discountedPrice,
                                    }}
                                />
                                {index === parentItem["pitstopItemListSliced"].length - 1 &&
                                    <ProductMenuItemCard
                                        onPress={() => {onViewMorePress(parentItem); }}
                                        colors={colors}
                                        index={index}
                                        itemImageSize={ITEM_IMAGE_SIZE}
                                        seeAll
                                        additionalCount={additionalCount}
                                    />
                                }

                            </View>


                        )
                    }}
                />

            }
        </SafeAreaView>
    )
};//end of EXPORT DEFAULT

