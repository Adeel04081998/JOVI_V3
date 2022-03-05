import { useFocusEffect } from '@react-navigation/native';
import lodash from 'lodash'; // 4.0.8
import LottieView from "lottie-react-native";
import React from 'react';
import { Animated, Appearance, Easing, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Text from '../../components/atoms/Text';
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
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
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
const PistopListing = React.memo(({ route, }) => {
    const { pitstopType } = route.params;
    const vendorDashboardCategoryIDReducer = useSelector(s => s.vendorDashboardCategoryIDReducer)?.data ?? [];

    console.log('pitstopType', pitstopType);
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
    const [categoryAnimation, setCategoryAnimation] = React.useState({
        allRestaurant: false,
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
    const animationHeight = constants.window_dimensions.height * 0.96;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    const listingStyles = stylesheet.styles(colors, width, height);
    const isLoading = !promotionsReducer?.dashboardContentListViewModel?.dashboardBannerImg || !categoriesTagsReducer;
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
        if (updatedFilters.activeFilterBy) {
            const listing = (categoriesTagsReducer?.vendorFilterViewModel?.filtersList ?? []).filter(item => item.vendorDashboardCatID === updatedFilters.activeFilterBy)[0];
            onPressFilter(listing, { cuisines: updatedFilters.activeCusine });
            return;
        }
        filtersRef.current.cuisines = updatedFilters.activeCusine ? [updatedFilters.activeCusine] : [];
        filtersRef.current.activeFilterBy = updatedFilters.activeFilterBy ? [updatedFilters.activeFilterBy] : [];
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
        console.log('updatedFilters', updatedFilters,isAllDisSelected,filtersRef.current);
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
            console.log('res --- GET_ADVERTISEMENTS', res);
        }, err => { sharedExceptionHandler(err); });
    }
    React.useEffect(() => {
        scrollEvent = null;
        getAdvertisements();
    }, [])
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
        display: categoryAnimation.allRestaurant === true ? 'none' : 'flex',
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
        <View style={{ ...listingStyles.wrapper, paddingBottom: SPACING_VERTICAL, marginHorizontal:0 }}>
        {vendorDashboardCategoryIDReducer.map((item, index) => {
                                return (
                                    <GenericList themeColors={colors} pitstopType={pitstopType} vendorDashboardCatID={item.vendorDashboardCatID}/>
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
    }, [scrollEvent]));

    return (
        <View style={listingStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader defaultColor={colors.primary} onLeftIconPress={onBackPress} leftIconColor={colors.primary} rightIconColor={colors.primary}
                    // leftIconType={'AntDesign'} leftIconName={'left'}
                    leftIconSize={30}
                />
                {isLoading ? <CardLoader styles={listingStyles} /> :
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
                    </ScrollView>}
                <BottomBarComponent colors={colors} leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]} rightData={[{ id: 3, iconName: "wallet", title: "Wallet" }, { id: 4, iconName: "pin", title: "Location" }]} />
            </SafeAreaView>
        </View>
    );
}, (next, prev) => next !== prev)
export default PistopListing;


