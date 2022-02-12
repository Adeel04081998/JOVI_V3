import React, { useState } from 'react';
import { Animated, Appearance, Easing, ScrollView, StyleSheet } from 'react-native';
import Image from '../../components/atoms/Image';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import { renderFile, sharedExceptionHandler } from '../../helpers/SharedActions';
import constants from '../../res/constants';
import sharedStyles from '../../res/sharedStyles';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import Filters from './components/Filters';
import lodash from 'lodash';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import CustomHeader from '../../components/molecules/CustomHeader';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import NavigationService from '../../navigations/NavigationService';
import CardLoader from './components/CardLoader';
import Categories from './components/Categories';
import ROUTES from '../../navigations/ROUTES';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
const SPACING_VERTICAL = 10;
const ITEMS_PER_PAGE = 10;
const PitstopsVerticalList = ({ imageStyles = {}, route }) => {
    const pitstopType = route.params.pitstopType ?? 4;
    const [state, setState] = React.useState({
        vendorCategoryViewModel: {
            vendorList: []
        },
        isLoading: false,
        filters: {
            filter: route.params.listingObj?.vendorDashboardCatID ? [route.params.listingObj?.vendorDashboardCatID] : [],
            cuisines: route.params.updatedFilters?.cuisines ? [route.params.updatedFilters?.cuisines] : [],
            averagePrice: null,
            search: '',
        },
        listingObj: {
            ...route.params.listingObj ?? {},
            header: route.params.listingObj.name ?? route.params.listingObj.header
        }
    });
    const filtersRef = React.useRef({
        filter: route.params.listingObj?.vendorDashboardCatID ? [route.params.listingObj?.vendorDashboardCatID] : [],
        cuisines: route.params.updatedFilters?.cuisines ? [route.params.updatedFilters?.cuisines] : [],
        averagePrice: null,
        search: '',
    });
    const filterValidations = {
        search: (val) => { return val !== '' },
        filter: (val, currentVal) => { return val !== null && val.length > 0 && val[0] === currentVal },
        cuisines: (val, currentVal) => { return val !== null && val.length > 0 && val[0] === currentVal },
        averagePrice: (val, currentVal) => { return val !== null && val.length > 0 && val[0] === currentVal }
    }
    const { listingObj } = state;
    const [fetchDataFlag, setFetchDataFlag] = React.useState(null);
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.87
    }
    const { height, width } = SCALE_IMAGE;
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOPS)[pitstopType]], Appearance.getColorScheme() === "dark");
    const styles = _styles(colors, width, height);
    const isRequestSent = React.useRef(false);
    const cardsRenderedCount = React.useRef(-1);
    const componentLoaded = React.useRef(false);
    const paginationInfo = React.useRef({
        pageNumber: 0,
        itemsPerPage: ITEMS_PER_PAGE,
        totalItems: null,
    });
    const onSearchHandler = (val) => {
        const isDisSelect = val && val === '';
        setState(pre => ({ ...pre, filters: { ...pre.filters, search: isDisSelect ? '' : val } }));
        filtersRef.current.search = isDisSelect ? '' : val;
    };
    const onFilterChange = (item, idKey, key,) => {
        setState(pre => ({ ...pre, listingObj: { ...item, header: item.name }, filters: { ...pre.filters, filter: [item[idKey]] } }));
        filtersRef.current[key] = [item[idKey]];
        fetchDataWithResetedPageNumber();
    }
    const onCategoryChange = (item, idKey, key, emptyVal = []) => {
        const isDisSelect = filterValidations[key](filtersRef.current[key], item[idKey]);
        setState(pre => ({ ...pre, filters: { ...pre.filters, [key]: isDisSelect ? emptyVal : [item[idKey]] } }));
        filtersRef.current[key] = isDisSelect ? emptyVal : [item[idKey]];
        fetchDataWithResetedPageNumber();
    }
    const getData = () => {
        isRequestSent.current = true;
        setState(pre => ({ ...pre, isLoading: true }));
        postRequest(Endpoints.GET_PITSTOPS_PROMOTIONS, {
            "vendorType": 0,
            "pageNumber": paginationInfo.current.pageNumber,
            "itemsPerPage": paginationInfo.current.itemsPerPage,
            "vendorDashboardCatID": listingObj.vendorDashboardCatID,
            "categoryID": filtersRef.current.cuisines[0] ?? ''
        }, (res) => {
            setTimeout(() => {
                isRequestSent.current = false;
            }, 500);
            if (res.data.statusCode === 200 && res.data.vendorCategoryViewModel?.vendorList) {
                if (paginationInfo.current.pageNumber > 1 && res.data.vendorCategoryViewModel?.vendorList) {
                    const prevData = [...state.vendorCategoryViewModel.vendorList, ...res.data.vendorCategoryViewModel?.vendorList];
                    setState(pre => ({ ...pre, isLoading: false, vendorCategoryViewModel: { vendorList: prevData, } }));
                } else {
                    setState(pre => ({ ...pre, isLoading: false, vendorCategoryViewModel: res.data.vendorCategoryViewModel }));
                }
                paginationInfo.current = {
                    ...paginationInfo.current,
                    totalItems: res.data.vendorCategoryViewModel?.paginationInfo?.totalItems
                }
            }
            console.log('GET_PITSTOPS_PROMOTIONS', res);
        }, err => {
            sharedExceptionHandler(err);
            isRequestSent.current = false;
            paginationInfo.current = {
                ...paginationInfo.current,
                pageNumber: paginationInfo.current.pageNumber - 1,
                itemsPerPage: paginationInfo.current.itemsPerPage - ITEMS_PER_PAGE
            }
            if (err.data.statusCode === 404) {
                setState(pre => ({ ...pre, isLoading: false, vendorCategoryViewModel: { vendorList: [] } }));
            } else {
                setState(pre => ({ ...pre, isLoading: false }));
            }
        }, {}, true);
    }
    const backFromFiltersHandler = (updatedFilters) => {
        filtersRef.current.cuisines = [updatedFilters.activeCusine];
        filtersRef.current.activeFilterBy = [updatedFilters.activeFilterBy];
        filtersRef.current.averagePrice = updatedFilters.activeAvergePrice;
        setState(pre => ({
            ...pre,
            filters: {
                ...pre.filters,
                cuisines: [updatedFilters.activeCusine],
                filter: [updatedFilters.activeFilterBy],
                averagePrice: updatedFilters.activeAvergePrice
            }
        }));
        console.log('updatedFilters', updatedFilters);
    }
    const goToFilters = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Filter.screen_name, { activeAvergePrice: filtersRef.current.averagePrice, activeCusine: filtersRef.current.cuisines[0], activeFilterBy: filtersRef.current.filter[0], backCB: backFromFiltersHandler });
    }
    const fetchDataWithUpdatedPageNumber = (onLoad = false) => {
        if (paginationInfo.current.totalItems && (ITEMS_PER_PAGE * paginationInfo.current.pageNumber) >= paginationInfo.current.totalItems) {
            return;
        }
        paginationInfo.current = {
            ...paginationInfo.current,
            pageNumber: paginationInfo.current.pageNumber + 1,
            itemsPerPage: paginationInfo.current.itemsPerPage
        }
        getData();
    }
    const fetchDataWithResetedPageNumber = () => {
        if (state.vendorCategoryViewModel.vendorList.length > 0) {
            setState(pre => ({ ...pre, vendorCategoryViewModel: { vendorList: [] } }));
        }
        cardsRenderedCount.current = -1;
        paginationInfo.current = {
            pageNumber: 1,
            itemsPerPage: ITEMS_PER_PAGE
        }
        getData();
    }
    const onBackPress = () => {
        NavigationService.NavigationActions.common_actions.goBack();
    }
    React.useEffect(() => {
        if ((fetchDataFlag) && state.vendorCategoryViewModel.vendorList.length > 0 && !isRequestSent.current) {
            fetchDataWithUpdatedPageNumber();
        }
    }, [fetchDataFlag]);
    React.useEffect(() => {
        fetchDataWithUpdatedPageNumber();
        componentLoaded.current = true;
    }, [])
    const RenderItem = ({ item, index }) => {
        const [itemState,setItemState] = React.useState({
            rendered:false
        });
        const { title, description, estTime, distance, image, averagePrice } = item;
        const isAnimateable = index < 3 && cardsRenderedCount.current < index ;
        const animatedScale = React.useRef(new Animated.Value(isAnimateable?0:1)).current;
        const TC = isAnimateable && !itemState.rendered ? AnimatedTouchableOpacity : TouchableOpacity;
        React.useEffect(() => {
            if (isAnimateable) {
                setTimeout(() => {
                    Animated.timing(animatedScale, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                        easing: Easing.ease
                    }).start(finished => {
                        if (finished) {
                            cardsRenderedCount.current = cardsRenderedCount.current < index ? index : cardsRenderedCount.current;
                            setItemState(pre=>({...pre,rendered:true}));
                        }
                    });
                }, index * 100);
            }
        }, []);
        return (
            <TC key={index} activeOpacity={0.8} style={{
                ...styles.itemContainer, ...isAnimateable ? {
                    opacity: animatedScale,
                    transform: [{
                        scale: animatedScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1]
                        })
                    }]
                } : {}
            }}>
                <Image source={{ uri: renderFile(image) }} style={[styles.image, imageStyles]} tapToOpen={false} />
                <View style={styles.subContainer}>
                    <Text style={styles.title} numberOfLines={1} >{title}</Text>
                    {(distance || estTime) &&
                        <View style={styles.iconContainer} >
                            <VectorIcon name={item.distance ? "map-marker" : "clock-time-four"} type={item.distance ? "FontAwesome" : "MaterialCommunityIcons"} color={colors.primary || "#6D51BB"} size={15} style={{ marginRight: 5 }} />
                            <Text style={styles.estTime} >{estTime || distance}</Text>
                        </View>
                    }
                </View>
                <Text style={styles.tagsText} numberOfLines={1} >{description}</Text>
                {averagePrice &&
                    <Text style={styles.title} >Rs. {averagePrice}</Text>
                }
            </TC>
        )
    }
    const handleInfinityScroll = (event) => {
        let mHeight = event.nativeEvent.layoutMeasurement.height;
        let cSize = event.nativeEvent.contentSize.height;
        let Y = event.nativeEvent.contentOffset.y;
        if (Math.ceil(mHeight + Y) >= cSize) return true;
        return false;
    }
    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1, }}>
                <CustomHeader defaultColor={colors.primary} onLeftIconPress={onBackPress} leftIconType={'AntDesign'} leftIconName={'arrowleft'} />
                <View style={{ margin: SPACING_VERTICAL, paddingBottom: 160 }}>
                    <View style={{ ...styles.container, marginVertical: SPACING_VERTICAL }} >
                        <Text style={styles.mainText} >{listingObj?.header ?? 'Vendors'}</Text>
                    </View>
                    <Filters
                        colors={colors}
                        parentFilterHandler={onFilterChange}
                        filterConfig={{}}
                        goToFilters={goToFilters}
                        selectedFilters={state.filters.filter}
                    />
                    {pitstopType === 4 && <Categories
                        colors={colors}
                        parentCategoryHandler={onCategoryChange}
                        selectedCategories={state.filters.cuisines}
                    />}
                    <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16} style={{ marginTop: SPACING_VERTICAL, marginBottom: pitstopType === 4 ? 100 : 0 }} onScroll={(event) => {
                        if (handleInfinityScroll(event)) {
                            setFetchDataFlag(Math.random());
                        }
                    }}>
                        {
                            (state.vendorCategoryViewModel.vendorList ?? []).map((item, i) => {
                                return <RenderItem item={item} index={i} />
                            })
                        }
                        {
                            state.isLoading ? <CardLoader styles={styles} loaderStyles={{ marginTop: -15 }} type={2} /> : <></>
                        }
                    </ScrollView>
                    {/* <AnimatedFlatlist
                        data={state.vendorCategoryViewModel.vendorList ?? []}
                        renderItem={renderItem}
                        itemContainerStyle={{ ...styles.itemContainer }}
                        flatlistProps={{
                            showsHorizontalScrollIndicator: false,
                            onEndReached: () => setFetchDataFlag(Math.random())
                            // style:{height:200}
                            // contentContainerStyle: { paddingBottom: 40 }
                        }}
                    /> */}

                </View>
            </SafeAreaView>
        </View>
    );
}
export default PitstopsVerticalList;

const _styles = (colors, width, height) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    container: {
        flexGrow: 1,
        backgroundColor: colors.Whisper || "#F6F5FA",
    },
    itemContainer: {
        ...sharedStyles._styles(colors).shadow,
        backgroundColor: colors.white || '#fff',
        borderRadius: 10,
        marginHorizontal: 5,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5
    },
    mainText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold'
    },
    viewMoreBtn: {
        color: colors.primary || '#6D51BB', // colors.theme here should be the theme color of specific category
        fontSize: 12
    },
    itemContainer: {
        ...sharedStyles._styles(colors).shadow,
        backgroundColor: colors.white || '#fff',
        borderRadius: 10,
        marginHorizontal: 5,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5
    },
    image: {
        height: height,
        width: width,
        borderRadius: 10
    },
    iconContainer: {
        borderRadius: 15,
        backgroundColor: colors.iconContainer || '#F6F5FA',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    tagsText: {
        fontSize: 12,
        color: colors.subText || '#212121',
        opacity: 0.6,
        width: width * 0.9,
        // backgroundColor:'blue',
        marginTop: -10
    },
    estTime: {
        fontSize: 12,
        color: colors.primary || '#6D51BB', // colors.theme here should be the theme color of specific category
        marginTop: Platform.OS === "android" ? 3 : 0
    },
    title: {
        fontSize: 14,
        // paddingVertical: 5,
        color: '#000',
        width: width * 0.7
    },
    bodyContainer: {
        width: width * 0.8
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        // backgroundColor:'red'
    }
})