import lodash from 'lodash'; // 4.0.8
import LottieView from "lottie-react-native";
import React from 'react';
import { Animated, Appearance, Easing, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import GenericList from '../../components/molecules/GenericList';
import ImageCarousel from '../../components/molecules/ImageCarousel';
import BottomBarComponent from '../../components/organisms/BottomBarComponent';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import Search from '../Home/components/Search';
import AllPitstopsListing from './components/AllPitstopsListing';
import CardLoader from './components/CardLoader';
import Categories from './components/Categories';
import Filters from './components/Filters';
import stylesheet from './styles';
const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
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
const PistopListing = React.memo(({ route, }) => {
    const { pitstopType } = route.params;
    console.log('pitstopType',pitstopType);
    const [state, setState] = React.useState({
        filters: {
            filter: [],
            cuisines: [],
            averagePrice: null,
            search: '',
        },
    });
    const filtersRef = React.useRef({
        filter: [],
        cuisines: [],
        averagePrice: null,
        search: '',
    });
    const [fetchData, setFetchDataUseEffect] = React.useState(null);
    const scaleAnimation = React.useRef(new Animated.Value(1)).current;
    const isRequestSent = React.useRef(false);
    // const promotionsReducer = {};
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const categoriesTagsReducer = useSelector(state => state.categoriesTagsReducer);
    const pitstopSpecific = {
        [PITSTOPS.RESTAURANT]: {
            filterTitleShown: false,
            filterScreenIcon: true,
            searchPlaceHolder: 'What do you want to eat?',
            categorySection: true,
            categoryTitle: false,
            pitstopListingTitle: 'All Restaurants'
        },
        [PITSTOPS.SUPER_MARKET]: {
            filterTitleShown: false,
            filterScreenIcon: false,
            searchPlaceHolder: 'What do you want to order?',
            categorySection: false,
            pitstopListingTitle: 'All Supermarkets'
        },
    }
    const currentPitstopType = pitstopSpecific[pitstopType];
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.86
    }
    const { height, width } = SCALE_IMAGE;
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOPS)[pitstopType]], Appearance.getColorScheme() === "dark");
    const listingStyles = stylesheet.styles(colors, width, height);
    const isLoading = !promotionsReducer?.dashboardContentListViewModel?.dashboardBannerImg || !categoriesTagsReducer;
    const filterValidations = {
        search: (val) => { return val !== '' },
        filter: (val, currentVal) => { return val !== null && val.length > 0 && val[0] === currentVal },
        cuisines: (val, currentVal) => { console.log(val, currentVal); return val !== null && val.length > 0 && val[0] === currentVal },
        averagePrice: (val, currentVal) => { return val !== null && val.length > 0 && val[0] === currentVal }
    }
    const onSearchHandler = (val) => {
        const isDisSelect = val && val === '';
        setState(pre => ({ ...pre, filters: { ...pre.filters, search: isDisSelect ? '' : val } }));
        filtersRef.current.search = isDisSelect ? '' : val;
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
        if (isAllDisSelected) {
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        } else {
            Animated.timing(scaleAnimation, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        }
    }
    const backFromFiltersHandler = (updatedFilters) => {
        if (updatedFilters.activeFilterBy) {
            const listing = (categoriesTagsReducer?.vendorFilterViewModel?.filtersList ?? []).filter(item => item.vendorDashboardCatID === updatedFilters.activeFilterBy)[0];
            onPressFilter(listing, { cuisines: updatedFilters.activeCusine });
            return;
        }
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
    const onBackPress = () => {
        NavigationService.NavigationActions.common_actions.goBack();
    }

    const handleInfinityScroll = (event) => {
        let mHeight = event.nativeEvent.layoutMeasurement.height;
        let cSize = event.nativeEvent.contentSize.height;
        let Y = event.nativeEvent.contentOffset.y;
        if (Math.ceil(mHeight + Y) >= cSize) return true;
        return false;
    }
    const getAdvertisements = () => {
        postRequest(Endpoints.GET_ADVERTISEMENTS, {
            "adTypes": [1]
        }, res => {
            console.log('res --- GET_ADVERTISEMENTS',res);
        }, err => { sharedExceptionHandler(err); });
    }
    React.useEffect(()=>{
        getAdvertisements();
    },[])
    const renderFilters = () => (<View style={{ ...listingStyles.wrapper, paddingBottom: 0, zIndex: 100, paddingTop: SPACING_VERTICAL }}>
        <Search
            placeholder={currentPitstopType.searchPlaceHolder}
            colors={colors}
            homeStyles={listingStyles}
            onSearch={onSearchHandler}
        />
        <Filters
            colors={colors}
            filterConfig={currentPitstopType}
            selectedFilters={state.filters.filter}
            parentFilterHandler={onPressFilter}
            filtersData={categoriesTagsReducer?.vendorFilterViewModel?.filtersList}
            goToFilters={goToFilters} />
        {currentPitstopType.categorySection &&
            <Categories
                parentCategoryHandler={onFilterChange}
                selectedCategories={state.filters.cuisines}
                CategoriesTabConfig={currentPitstopType}
                colors={colors}
            />
        }
    </View>);
    const renderCarouselNdListing = () => (<Animated.View style={{
        opacity: scaleAnimation,
        zIndex: 80,
        transform: [{
            translateY: scaleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-300, 0]
            })
        }]
    }}>
        <ImageCarousel
            // aspectRatio={16 / 7}
            data={promotionsReducer?.dashboardContentListViewModel?.dashboardPromoListVM ??
                [{
                    promoImg: promotionsReducer?.dashboardContentListViewModel?.dashboardBannerImg ??
                        `Dev/DashboardBanner/2021/5/20/Jov_banner_350x220 (1)_12173.jpg`
                }]} // Hardcoded url added for QA testing only if there is no data in db => Mudassir
            uriKey="promoImg"
            containerStyle={{ ...listingStyles.imageCarousal }}
            height={128}
            theme={colors}
        />
        <View style={{ ...listingStyles.wrapper, paddingBottom: SPACING_VERTICAL }}>
            <GenericList themeColors={colors} pitstopType={pitstopType} />
        </View>
    </Animated.View>);
    const renderAllRestaurantsListing = () => (<Animated.View style={{
        ...listingStyles.wrapper,
        transform: [{
            translateY: scaleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-690, 0]
            })
        }]
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
    return (
        <View style={listingStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader defaultColor={colors.primary} onLeftIconPress={onBackPress} leftIconColor={colors.primary} rightIconColor={colors.primary} leftIconType={'AntDesign'} leftIconName={'left'} />
                {isLoading ? <CardLoader styles={listingStyles} /> : <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={(event) => {
                    if (handleInfinityScroll(event)) {
                        setFetchDataUseEffect(Math.random());
                    }
                }}>
                    {renderFilters()}
                    {renderCarouselNdListing()}
                    {renderAllRestaurantsListing()}
                </ScrollView>}
                <BottomBarComponent colors={colors} leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]} rightData={[{ id: 3, iconName: "wallet", title: "Wallet" }, { id: 4, iconName: "pin", title: "Location" }]} />
            </SafeAreaView>
        </View>
    );
}, (next, prev) => next !== prev)
export default PistopListing;


