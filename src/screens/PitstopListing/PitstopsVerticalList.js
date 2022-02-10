import React, { useState } from 'react';
import { Appearance, ScrollView, StyleSheet } from 'react-native';
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
import LottieView from "lottie-react-native";
import lodash from 'lodash';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import CustomHeader from '../../components/molecules/CustomHeader';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import NavigationService from '../../navigations/NavigationService';
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
const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
const SPACING_VERTICAL = 10;
const ITEMS_PER_PAGE = 10;
const renderLoader = (styles) => {
    return <View style={{...styles}}>
    {/* return <View style={styles.gifLoader}> */}
        <LottieView
            autoSize={true}
            resizeMode={'contain'}
            style={{ width: '100%',marginTop:-19 }}
            source={require('../../assets/gifs/RestaurantCardsLoading.json')}
            autoPlay
            loop
        />
    </View>
}
const PitstopsVerticalList = ({ imageStyles = {}, route }) => {

    const [state, setState] = React.useState({
        pitstopListViewModel: {
            list: []
        },
        isLoading: false
    });
    const [fetchDataFlag, setFetchDataFlag] = React.useState(null);
    const pitstopType = route.params.pitstopType ?? 4;
    const listingObj = route.params.listingObj ?? {};
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.87
    }
    const { height, width } = SCALE_IMAGE;
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOPS)[pitstopType]], Appearance.getColorScheme() === "dark");
    const styles = _styles(colors, width, height);
    const isRequestSent = React.useRef(false);
    const componentLoaded = React.useRef(false);
    const paginationInfo = React.useRef({
        pageNumber: 0,
        itemsPerPage: ITEMS_PER_PAGE,
        totalItems: null,
    });
    const getData = () => {
        isRequestSent.current = true;
        setState(pre => ({ ...pre, isLoading: true }));
        postRequest(Endpoints.GET_PITSTOPS, {
            "latitude": 33.66902188096789,
            "longitude": 73.07520348918612,
            "marketPageNumber": paginationInfo.current.pageNumber,
            "marketItemsPerPage": paginationInfo.current.itemsPerPage,
            "marketID": 0,
            "pitstopType": pitstopType
        }, (res) => {
            setTimeout(() => {
                isRequestSent.current = false;
            }, 500);
            if (res.data.statusCode === 200 && res.data.pitstopListViewModel?.list) {
                if (paginationInfo.current.pageNumber > 1 && res.data.pitstopListViewModel?.list) {
                    const prevData = [...state.pitstopListViewModel.list, ...res.data.pitstopListViewModel?.list];
                    setState(pre => ({ ...pre, isLoading: false, pitstopListViewModel: { list: prevData, } }));
                } else {
                    setState(pre => ({ ...pre, isLoading: false, pitstopListViewModel: res.data.pitstopListViewModel }));
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
            if (err.data.statusCode === 404) {
                setState(pre => ({ ...pre, isLoading: false, pitstopListViewModel: { list: [] } }));
            } else {
                setState(pre => ({ ...pre, isLoading: false }));
            }
        }, {}, true);
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
        if ((fetchDataFlag) && state.pitstopListViewModel.list.length > 0 && !isRequestSent.current) {
            fetchDataWithUpdatedPageNumber();
        }
    }, [fetchDataFlag]);
    React.useEffect(() => {
        fetchDataWithUpdatedPageNumber();
        componentLoaded.current = true;
    }, [])
    const renderItem = (item, index) => {
        const { title, description, estTime, distance, image, averagePrice } = item;
        return (
            <TouchableOpacity activeOpacity={0.8} style={{ ...styles.itemContainer }}>
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
            </TouchableOpacity>
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
                <View style={{ margin: SPACING_VERTICAL, paddingBottom: 60 }}>
                    <View style={{ ...styles.container, marginVertical: SPACING_VERTICAL }} >
                        <Text style={styles.mainText} >{listingObj?.header ?? 'Vendors'}</Text>
                    </View>
                    {/* <Filters /> */}
                    <ScrollView showsVerticalScrollIndicator={false} onScroll={(event) => {
                        if (handleInfinityScroll(event)) {
                            setFetchDataFlag(Math.random());
                        }
                    }}>
                        {
                            (state.pitstopListViewModel.list ?? []).map((item, i) => {
                                return renderItem(item, i)
                            })
                        }
                        {
                            state.isLoading ? renderLoader(styles) : <></>
                        }
                    </ScrollView>
                    {/* <AnimatedFlatlist
                        data={state.pitstopListViewModel.list ?? []}
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