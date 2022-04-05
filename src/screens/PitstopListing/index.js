import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Animated, Appearance, Easing, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Advertisment from '../../components/atoms/Advertisment/index';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import GenericList from '../../components/molecules/GenericList';
import BottomBarComponent from '../../components/organisms/BottomBarComponent';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV, { FILTER_TAGS_PITSTOP_LISTING, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import RenderBottomBarComponent from '../Home/components/RenderBottomBarComponent';
// const Search = React.lazy(()=>import('../Home/components/Search'));
// const AllPitstopsListing = React.lazy(()=>import('./components/AllPitstopsListing'));
// const CardLoader = React.lazy(()=>import('./components/CardLoader'));
// const Categories = React.lazy(()=>import('./components/Categories'));
// const Filters = React.lazy(()=>import('./components/Filters'));
//
import Search from '../Home/components/Search';
import AllPitstopsListing from './components/AllPitstopsListing';
import CardLoader from './components/CardLoader';
import Categories from './components/Categories';
import Filters from './components/Filters';
import stylesheet from './styles';



const SPACING_VERTICAL = 10;
// const renderLoader = (styles) => {
//     return <View style={styles.gifLoader}>
//         <LottieView
//             autoSize={true}
//             resizeMode={'contain'}
//             style={{ width: '100%' }}
//             source={require('../../assets/gifs/RestaurantMenuLoading.json')}
//             autoPlay
//             loop
//         />
//     </View>
// }

let scrollEvent = null;
const PistopListing = ({ route }) => {

    const [state, setState] = React.useState({ loaded: false });
    const { pitstopType } = route.params;
    const isLoadedRef = React.useRef(false);
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.86
    }
    const { height, width } = SCALE_IMAGE;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    const listingStyles = stylesheet.styles(colors, width, height);
    React.useEffect(() => {
        if (!isLoadedRef.current) {
            isLoadedRef.current = true;
            setState(pre => ({ ...pre, loaded: true }));
            // setInterval(() => {
            // }, 100);
        }
    }, []);
    const onBackPress = () => {
        NavigationService.NavigationActions.common_actions.goBack();
    }
    return <View style={listingStyles.container}>
        <SafeAreaView style={{ flex: 1 }}>
            <CustomHeader defaultColor={colors.primary} onLeftIconPress={onBackPress} leftIconColor={colors.primary} rightIconColor={colors.primary}
                // leftIconType={'AntDesign'} leftIconName={'left'}
                leftIconSize={30}
            />
            {state.loaded ? <PistopListingChild route={route} /> : <CardLoader styles={listingStyles} />}
        </SafeAreaView>
    </View>
}//when app is animating the screen, then there is a lag due to load time of pitstoplisting component, so there is a wrapper for that component, so the screen transition is smooth
const PistopListingChild = React.memo(({ route, }) => {
    const { pitstopType } = route.params;
    const vendorDashboardCategoryIDReducer = useSelector(s => s.vendorDashboardCategoryIDReducer)?.data ?? [];
    const categoryItem = route.params?.categoryItem ?? {};
    const size = Object.keys(categoryItem).length;

    const [state, setState] = React.useState({
        filters: {
            filter: [],
            cuisines: size > 0 ? [categoryItem.item.tagID] : [],
            averagePrice: null,
            search: '',
        },
    });
    const filtersRef = React.useRef({
        filter: [],
        cuisines: size > 0 ? [categoryItem.item.tagID] : [],
        averagePrice: null,
        search: '',
    });
    const [fetchData, setFetchDataUseEffect] = React.useState(null);
    const scaleAnimation = React.useRef(new Animated.Value(size > 0 ? 0 : 1)).current;
    const isRequestSent = React.useRef(false);
    // const promotionsReducer = {};
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const categoriesTagsReducer = useSelector(state => state.categoriesTagsReducer);
    const [categoryAnimation, setCategoryAnimation] = React.useState({
        allRestaurant: size > 0 ? true : false,
    });
    const pitstopSpecific = {
        [PITSTOP_TYPES.RESTAURANT]: {
            filterTitleShown: false,
            filterScreenIcon: true,
            searchPlaceHolder: 'What do you want to eat?',
            categorySection: true,
            categoryTitle: false,
            pitstopListingTitle: 'All Restaurants'
        },
        [PITSTOP_TYPES.SUPER_MARKET]: {
            filterTitleShown: true,
            filterScreenIcon: true,
            searchPlaceHolder: 'What do you want to order?',
            categorySection: true,
            pitstopListingTitle: 'All Supermarkets'
        },
    }
    const currentPitstopType = pitstopSpecific[pitstopType];
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.86
    }
    const { height, width } = SCALE_IMAGE;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    const listingStyles = stylesheet.styles(colors, width, height);
    const [loadedData, setLoadedData] = useState(false)
    const isLoading = !loadedData;

    const filterValidations = {
        search: (val) => { return val !== '' },
        filter: (val, currentVal) => { return val !== null && val.length > 0 && val[0] === currentVal },
        cuisines: (val, currentVal) => { console.log(val, currentVal); return val !== null && val.length > 0 && val[0] === currentVal },
        averagePrice: (val, currentVal) => { return val !== null && val.length > 0 && val[0] === currentVal }
    }
    const onSearchHandler = (val) => {
        const isDisSelect = val === '';
        setState(pre => ({ ...pre, filters: { ...pre.filters, search: isDisSelect ? '' : val } }));
        filtersRef.current.search = isDisSelect ? '' : val;
        allRestaurantAnimation(isDisSelect ? 1 : 0);
    };
    const onPressFilter = (item, updatedFilters = {}) => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.PitstopsVerticalList.screen_name, { pitstopType: pitstopType, updatedFilters, listingObj: { ...item } });
    }
    const onFilterChange = (item, idKey, key, emptyVal = []) => {
        const isDisSelect = filterValidations[key](filtersRef.current[key], item[idKey]);
        // const isDisselect = filtersRef.current[key] !== null && filtersRef.current[key].length > 0 && filtersRef.current[key][0] === item[idKey];
        setState(pre => ({ ...pre, filters: { ...pre.filters, [key]: isDisSelect ? emptyVal : [item[idKey]] } }));
        filtersRef.current[key] = isDisSelect ? emptyVal : [item[idKey]];
        const isAllDisSelected = filtersRef.current.averagePrice === null && filtersRef.current.cuisines.length === 0 && filtersRef.current.filter.length === 0;
        allRestaurantAnimation(isAllDisSelected ? 1 : 0);
    }
    const allRestaurantAnimation = (toValue = 1) => {
        if (toValue === 1) {
            setCategoryAnimation(pre => ({ ...pre, allRestaurant: false }));
        }
        Animated.timing(scaleAnimation, {
            toValue: toValue,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.ease
        }).start(finished => {
            if (finished && toValue === 0) {
                setCategoryAnimation(pre => ({ ...pre, allRestaurant: true }));
            }
        });
    }
    const backFromFiltersHandler = (updatedFilters) => {
        // if (updatedFilters.activeFilterBy) {
        //     const listing = (categoriesTagsReducer?.vendorFilterViewModel?.filtersList ?? []).filter(item => item.vendorDashboardCatID === updatedFilters.activeFilterBy)[0];
        //     onPressFilter(listing, { cuisines: updatedFilters.activeCusine });
        //     return;
        // }
        filtersRef.current.cuisines = updatedFilters.activeCusine ? [updatedFilters.activeCusine] : [];
        filtersRef.current.filter = updatedFilters.activeFilterBy ? [updatedFilters.activeFilterBy] : [];
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
        const isAllDisSelected = filtersRef.current.averagePrice === null && filtersRef.current.cuisines.length === 0 && filtersRef.current.filter.length === 0;
        allRestaurantAnimation(isAllDisSelected ? 1 : 0);
    }
    const goToFilters = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Filter.screen_name, { activeAvergePrice: filtersRef.current.averagePrice, activeCusine: filtersRef.current.cuisines[0], activeFilterBy: filtersRef.current.filter[0], backCB: backFromFiltersHandler, pitstopType, });
    }
    const handleInfinityScroll = (event) => {
        let mHeight = event.nativeEvent.layoutMeasurement.height;
        let cSize = event.nativeEvent.contentSize.height;
        let Y = event.nativeEvent.contentOffset.y;
        if (Math.ceil(mHeight + Y) >= cSize) return true;
        return false;
    }
    React.useEffect(() => {
        scrollEvent = null;
        // getAdvertisements();
    }, [])




    const renderFilters = () => (<View style={{ ...listingStyles.wrapper, paddingBottom: 0, zIndex: 100, paddingTop: SPACING_VERTICAL }}>
        <Search
            placeholder={currentPitstopType.searchPlaceHolder}
            colors={colors}
            homeStyles={listingStyles}
            onSearch={onSearchHandler}
            fontSize={12}
        />

        <Filters
            colors={colors}
            filterConfig={currentPitstopType}
            selectedFilters={state.filters.filter}
            parentFilterHandler={onFilterChange}
            filtersData={categoriesTagsReducer?.vendorFilterViewModel?.filtersList}
            screenName={'Listing Page'}
            customData={FILTER_TAGS_PITSTOP_LISTING}
            goToFilters={goToFilters} />

        {currentPitstopType.categorySection &&
            <>
                <Categories
                    parentCategoryHandler={onFilterChange}
                    selectedCategories={state.filters.cuisines}
                    CategoriesTabConfig={currentPitstopType}
                    colors={colors}
                    {...size > 0 && {
                        paramItem: categoryItem?.item ?? {}
                    }}
                    {...pitstopType === PITSTOP_TYPES.SUPER_MARKET && {
                        itemKeys: {
                            id: "tagID",
                            name: "tagName",
                            image: "tagImage",
                        }
                    }}
                />
            </>
        }
    </View>);
    const renderCarouselNdListing = () => (<Animated.View style={{
        opacity: scaleAnimation,
        display: categoryAnimation.allRestaurant === true ? 'none' : 'flex',
        zIndex: 80,
        transform: [{
            translateY: scaleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-300, 0]
            })
        }]
    }}>
        <Advertisment adTypes={[ENUMS.ADVERTISMENT_TYPE.VENDOR_LISTING]}
            colors={colors}
        />


        {/* <ImageCarousel
            // aspectRatio={16 / 7}
            data={promotionsReducer?.dashboardContentListViewModel?.dashboardPromoListVM ?? []} // Hardcoded url added for QA testing only if there is no data in db => Mudassir
            uriKey="promoImg"
            containerStyle={{ ...listingStyles.imageCarousal }}
            height={128}
            theme={colors}
        /> */}
        <View style={{ ...listingStyles.wrapper, paddingBottom: SPACING_VERTICAL, marginHorizontal: 0 }}>
            {vendorDashboardCategoryIDReducer.map((item, index) => {
                return (
                    <GenericList themeColors={colors} pitstopType={pitstopType}
                        textContainer={{ paddingHorizontal: 10 }}
                        vendorDashboardCatID={item.vendorDashboardCatID} cb={(loaded) => {
                            setLoadedData(loaded)

                        }} />
                )
            })}

        </View>
    </Animated.View>);

    const renderAllRestaurantsListing = () => (<Animated.View style={{
        ...listingStyles.wrapper,
        marginTop: -10
    }}>
        <AllPitstopsListing
            config={currentPitstopType}
            pitstopType={pitstopType}
            styles={listingStyles.allPitstopListing}
            isRequestSent={isRequestSent}
            colors={colors}
            fetchPitstopsFlagParent={fetchData}
            filters={state.filters}
        />
    </Animated.View>);

    const scrollRef = React.useRef(null);

    useFocusEffect(React.useCallback(() => {
        if (scrollEvent) {
            const yAxis = scrollEvent?.y ?? 0;
            const xAxis = scrollEvent?.x ?? 0;
            scrollRef.current && scrollRef.current.scrollTo({ y: yAxis, x: xAxis, animated: true });
        }
    }, []));
    return (
        // <View style={listingStyles.container}>
        //     <SafeAreaView style={{ flex: 1 }}>
        //         <CustomHeader defaultColor={colors.primary} onLeftIconPress={onBackPress} leftIconColor={colors.primary} rightIconColor={colors.primary}
        //             // leftIconType={'AntDesign'} leftIconName={'left'}
        //             leftIconSize={30}
        //         />
        <>
            {isLoading ? <CardLoader styles={listingStyles} /> : null}
            <ScrollView
                ref={scrollRef}
                nestedScrollEnabled showsVerticalScrollIndicator={false} scrollEventThrottle={16}
                onScroll={(event) => {
                    const yAxis = event?.nativeEvent?.contentOffset.y ?? 0;
                    if (yAxis > 0)
                        scrollEvent = event.nativeEvent.contentOffset;
                    if (handleInfinityScroll(event)) {
                        setFetchDataUseEffect(Math.random());
                    }
                }}>
                {renderFilters()}
                {renderCarouselNdListing()}
                {renderAllRestaurantsListing()}
            </ScrollView>
            <RenderBottomBarComponent showCategories={false} bottomBarComponentProps={
                {
                    colors: { ...colors },
                    pitstopType: pitstopType,
                    screenName: ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name,
                }
            } />
            {/* <BottomBarComponent pitstopType={pitstopType} screenName={ROUTES.APP_DRAWER_ROUTES.PitstopListing.screen_name} colors={colors} leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]} rightData={[{ id: 3, iconName: "wallet", title: "Wallet" }, { id: 4, iconName: "pin", title: "Location" }]} /> */}
            {/* </SafeAreaView>
        </View> */}
        </>
    );
}, (next, prev) => next !== prev)
export default PistopListing;


