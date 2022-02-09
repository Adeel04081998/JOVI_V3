import React, { useEffect } from 'react';
import { Animated, Appearance, FlatList, SafeAreaView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import GenericList from '../../components/molecules/GenericList';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import Search from '../Home/components/Search';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import stylesheet from './styles';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import Text from '../../components/atoms/Text';
import VectorIcon from '../../components/atoms/VectorIcon';
import ENUMS from '../../utils/ENUMS';
import BottomBarComponent from '../../components/organisms/BottomBarComponent';
import TouchableScale from '../../components/atoms/TouchableScale';
import ImageCarousel from '../../components/molecules/ImageCarousel';
import { useSelector } from 'react-redux';
import constants from '../../res/constants';
import CategoryCardItem, { CategoryCardItemSimple } from '../../components/molecules/CategoryCardItem';
import sharedStyles from '../../res/sharedStyles';
import PitstopsVerticalList from './PitstopsVerticalList';
import { renderFile, sharedExceptionHandler } from '../../helpers/SharedActions';
import Image from '../../components/atoms/Image';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import { postRequest } from '../../manager/ApiManager';
import LottieView from "lottie-react-native";
import Endpoints from '../../manager/Endpoints';
const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
const SPACING_VERTICAL = 10;
const FILTER_ICON_HEIGHT = 35;
const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.195;
const ITEMS_PER_PAGE = 40;
// console.log('CONTAINER_HEIGHT', CONTAINER_HEIGHT)
const data = [{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},];
const PistopListing = React.memo(({ pitstopType = 4 }) => {
    const [state, setState] = React.useState({
        filters: {
            mainFilter: [],
            cuisines: [],
        },
    });
    const [fetchData, setFetchDataUseEffect] = React.useState(null);
    const isRequestSent = React.useRef(false);
    // const promotionsReducer = {};
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const pitstopSpecific = {
        [PITSTOPS.RESTAURANT]: {
            filterTitleShown: false,
            filterScreenIcon: true,
            searchPlaceHolder: 'What do you want to eat?',
            categorySection: true,
            categoryTitle: false
        },
        [PITSTOPS.SUPER_MARKET]: {
            filterTitleShown: true,
            filterScreenIcon: true,
            searchPlaceHolder: 'What do you want to eat?',
            categorySection: true,
        },
    }
    const currentPitstopType = pitstopSpecific[pitstopType];
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.86
    }
    const { height, width } = SCALE_IMAGE;
    const colors = theme.getTheme(GV.THEME_VALUES.RESTAURANT, Appearance.getColorScheme() === "dark");
    const listingStyles = stylesheet.styles(colors, width, height);
    const onCuisineSelect = (item) => {
        setState(pre => ({ ...pre, filters: { ...pre.filters, cuisines: [item.id] } }));
    }
    const isLoading = !promotionsReducer?.dashboardContentListViewModel?.dashboardBannerImg ;
    const renderLoader = () => {
        return <View style={listingStyles.gifLoader}>
            <LottieView
                autoSize={true}
                resizeMode={'contain'}
                style={{ width: '100%' }}
                source={require('../../assets/gifs/RestaurantMenuLoading.json')}
                autoPlay
                loop
            />
        </View>
    }
    return (
        <View style={listingStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader defaultColor={colors.primary} leftIconType={'AntDesign'} leftIconName={'arrowleft'} />
                {isLoading ? renderLoader() : <KeyboardAwareScrollView>
                    <View style={{ ...listingStyles.wrapper, paddingBottom: 0, paddingTop: SPACING_VERTICAL }}>
                        <Search placeholder={'What do you want to eat?'} colors={colors} homeStyles={listingStyles} />
                        <Filters filterConfig={currentPitstopType} />
                        <CategoriesTab listingStyles={listingStyles} selectedCategories={state.filters.cuisines} onCategoryClick={onCuisineSelect} CategoriesTabConfig={currentPitstopType} colors={colors} />
                    </View>
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
                    <View style={listingStyles.wrapper}>
                        <GenericList themeColors={colors} />
                        {/* <PitstopsVerticalList colors={colors} /> */}
                        <AllPitstopListing styles={listingStyles.allPitstopListing} isRequestSent={isRequestSent} colors={colors} fetchDataFlag={fetchData} />
                    </View>
                </KeyboardAwareScrollView>}
                <BottomBarComponent colors={colors} leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]} rightData={[{ id: 3, iconName: "wallet", title: "Wallet" }, { id: 4, iconName: "pin", title: "Location" }]} />
            </SafeAreaView>
        </View>
    );
}, (next, prev) => next !== prev)
export default PistopListing;

const CategoriesTab = React.memo(({ CategoriesTabConfig, selectedCategories, colors, listingStyles }) => {
    const [state, setState] = React.useState({
        activeTab: [],
    });
    const isRendered = React.useRef(false);
    const checkSelectedTab = (item) => {
        return (state.activeTab ?? []).find(x => x === item.id);
    }
    const selectedStyle = (item) => {
        // console.log('checkSelectedTab')
        const style = {
            height: CONTAINER_HEIGHT,
            width: CONTAINER_WIDTH,
            marginBottom: 5,
            justifyContent: 'center',
            backgroundColor: '#fff',
            // borderWidth: 0.2,
            // borderColor: 'rgba(0,0,0,0.4)',
            // borderRadius: 4,
            // justifyContent: 'center',
            // paddingHorizontal: 5,
            // backgroundColor: 'white',
            // // width:80,
            // marginHorizontal: 5,
            ...sharedStyles._styles().shadow,
            ...listingStyles.cat_item_container,
        };
        // if (checkSelectedTab(item)) {
        //     return {
        //         ...style,

        //         // backgroundColor:colors.primary+'40'
        //     };
        // }
        return style;
    }
    const onCategoryClick = (item) => {
        setState(pre => ({ ...pre, activeTab: [item.id] }));
    }
    React.useLayoutEffect(() => {
        setTimeout(() => {
            isRendered.current = true;
        }, 1000);
    }, []);
    const CategoryCardItemComponent = isRendered.current ? CategoryCardItemSimple : CategoryCardItem;
    return (<View style={{ marginTop: 10, overflow: 'visible' }}>
        {CategoriesTabConfig.categoryTitle && <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={{ fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL }}>
            Cuisine
        </Text>}
        <AnimatedFlatlist
            data={
                [
                    {
                        text: 'Pizza',
                        id: 1,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Burger',
                        id: 2,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Pizza',
                        id: 3,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        id: 4,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Pizza',
                        id: 5,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        id: 6,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    },
                    {
                        text: 'Distance',
                        id: 7,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Pizza',
                        id: 8,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        id: 9,
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }
                ]
            }
            delay={250}
            renderItem={(x, i) => {
                return <CategoryCardItemComponent
                    key={`category card item${i}`}
                    xml={x.icon}
                    title={x.text}
                    // containerStyle={listingStyles.cat_item_container}
                    containerStyleOverride={true}
                    containerOverrideStyle={{
                        backgroundColor: checkSelectedTab(x) ? colors.primary + '40' : '#fff',
                        borderColor: checkSelectedTab(x) ? colors.primary : '',
                        borderWidth: checkSelectedTab(x) ? 1 : 0,
                        height: '100%'
                    }}
                    // height={CONTAINER_HEIGHT}
                    // width={CONTAINER_WIDTH}

                    textStyle={{ fontSize: 12, padding: 2 }}
                    imageContainerStyle={[{ height: CONTAINER_HEIGHT * 0.6 }, listingStyles.cat_img_container]}
                    onPress={() => onCategoryClick(x)}
                />
            }}
            horizontal={true}
            itemContainerStyleCb={selectedStyle}
        />
    </View>)
}, (n, p) => n !== p);
const Filters = React.memo(({ filterConfig }) => {
    return (<View style={{ width: '100%', paddingTop: 10, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        {filterConfig.filterTitleShown && <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={{ fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL }}>
            Filters
        </Text>}
        <View style={{
            display: 'flex',
            flexDirection: 'row'
        }}>
            <TouchableScale style={{
                height: FILTER_ICON_HEIGHT,
                // borderWidth: 0.2,
                // borderColor: 'rgba(0,0,0,0.4)',
                borderRadius: 4,
                justifyContent: 'center',
                paddingHorizontal: 5,
                backgroundColor: 'white',
                // width:80,Î
                marginHorizontal: 5,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,

                elevation: 6,
            }}>
                <VectorIcon name={'filter'} type={'AntDesign'} size={17} color={'black'} style={{ marginRight: 2 }} />
            </TouchableScale>
            <AnimatedFlatlist
                data={[{
                    title: 'Discounts',
                    iconName: 'ticket',
                    type: 'Entypo'
                }, {
                    title: 'Distance',
                    iconName: 'direction',
                    type: 'Entypo'
                }, {
                    title: 'Discounts',
                    iconName: 'ticket',
                    type: 'Entypo'
                }, {
                    title: 'Distance',
                    iconName: 'direction',
                    type: 'Entypo'
                }, {
                    title: 'Discounts',
                    iconName: 'ticket',
                    type: 'Entypo'
                }, {
                    title: 'Distance',
                    iconName: 'direction',
                    type: 'Entypo'
                },]}
                renderItem={(item, i) => {
                    return <TouchableScale style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <VectorIcon name={item.iconName} type={item.type} size={17} color={'black'} style={{ marginRight: 2 }} />
                        <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }} fontFamily={'PoppinsBold'} >{item.title}</Text>
                    </TouchableScale>
                }}
                horizontal={true}
                itemContainerStyle={{
                    height: FILTER_ICON_HEIGHT,
                    borderWidth: 0.2,
                    borderColor: 'rgba(0,0,0,0.4)',
                    borderRadius: 4,
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    backgroundColor: 'white',
                    // width:80,
                    marginHorizontal: 5,
                }}
            />
        </View>
    </View>)
}, (n, p) => n !== p)

const AllPitstopListing = ({ styles,imageStyles = { width: '100%' }, colors }) => {
    const [state, setState] = React.useState({
        pitstopListViewModel: {
            list: []
        }
    });
    const isRequestSent = React.useRef(false);
    const [fetchData, setFetchDataUseEffect] = React.useState(null);
    const setFetchDataFlagCb = () => {
        const flag = Math.floor(Math.random() * 1000) + 1;
        setFetchDataUseEffect(flag);
    }
    const paginationInfo = React.useRef({
        pageNumber: 0,
        itemsPerPage: 0,
        totalItems: null,
    });
    const getData = () => {
        isRequestSent.current = true;
        postRequest(Endpoints.GET_PITSTOPS, {
            "latitude": 33.66902188096789,
            "longitude": 73.07520348918612,
            "marketPageNumber": paginationInfo.current.pageNumber,
            "marketItemsPerPage": paginationInfo.current.itemsPerPage,
            "marketID": 0,
            "pitstopType": 4
        }, (res) => {
            setTimeout(() => {
                isRequestSent.current = false;
            }, 500);
            if (res.data.statusCode === 200) {
                if (paginationInfo.current.pageNumber > 1 && res.data.pitstopListViewModel?.list) {
                    const prevData = [...state.pitstopListViewModel.list, ...res.data.pitstopListViewModel?.list];
                    setState(pre => ({ ...pre, pitstopListViewModel: { list: prevData, } }));
                } else {
                    setState(pre => ({ ...pre, pitstopListViewModel: res.data.pitstopListViewModel }));
                }
                paginationInfo.current = {
                    ...paginationInfo.current,
                    totalItems: res.data.pitstopListViewModel?.paginationInfo?.totalItems
                }
            }
            console.log('GET_PITSTOPS', res);
        }, err => {
            sharedExceptionHandler(err);
            isRequestSent.current = false;
            paginationInfo.current = {
                ...paginationInfo.current,
                pageNumber: paginationInfo.current.pageNumber - 1,
                itemsPerPage: paginationInfo.current.itemsPerPage - ITEMS_PER_PAGE
            }
        }, {}, true);
    }
    const fetchDataWithUpdatedPageNumber = (onLoad = false) => {
        if (paginationInfo.current.totalItems && (paginationInfo.current.itemsPerPage + 40) >= paginationInfo.current.totalItems) {
            return;
        }
        paginationInfo.current = {
            ...paginationInfo.current,
            pageNumber: paginationInfo.current.pageNumber + 1,
            itemsPerPage: paginationInfo.current.itemsPerPage + ITEMS_PER_PAGE
        }
        getData();
    }
    const fetchDataWithResetedPageNumber = () => {
        paginationInfo.current = {
            pageNumber: 1,
            itemsPerPage: ITEMS_PER_PAGE
        }
        getData();
    }
    React.useEffect(() => {
        if (fetchData && !isRequestSent.current) {
            fetchDataWithUpdatedPageNumber();
        }
    }, [fetchData]);
    React.useEffect(() => {
        fetchDataWithUpdatedPageNumber();
    }, [])
    const renderItem = (item, index) => {
        const { title, description, estTime, distanceFromLocation, image, averagePrice } = item;
        return (
            <TouchableOpacity key={index} activeOpacity={0.8} style={{ ...styles.itemContainer }}>
                <Image source={{ uri: renderFile(image) }} style={[styles.image, imageStyles]} tapToOpen={false} />
                <View style={styles.subContainer}>
                    <Text style={styles.title} numberOfLines={1} >{title}</Text>
                    {(distanceFromLocation || estTime) &&
                        <View style={styles.iconContainer} >
                            <VectorIcon name={item.distanceFromLocation ? "map-marker" : "clock-time-four"} type={item.distanceFromLocation ? "FontAwesome" : "MaterialCommunityIcons"} color={colors.primary || "#6D51BB"} size={15} style={{ marginRight: 5 }} />
                            <Text style={styles.estTime} >{estTime || distanceFromLocation} m</Text>
                        </View>
                    }
                </View>
                <Text style={styles.tagsText} numberOfLines={1} >{description}</Text>
                {averagePrice &&
                    <Text style={styles.title} >Rs. {averagePrice}</Text>
                }
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container} >
                <Text style={styles.mainText} >All Restaurant</Text>
            </View>
            <View >
            <FlatList 
                data={state.pitstopListViewModel.list}
                renderItem={({item,index})=>renderItem(item,index)}
                keyExtractor={(item,i)=>`pitstop_key_${i}`}
                onEndReached={setFetchDataFlagCb}
            />
                {/* {
                    state.pitstopListViewModel.list.map((item, index) => renderItem(item, index))
                } */}
            </View>
        </View>
    );
};