import React from 'react';
import { Appearance, StyleSheet, Platform, Alert } from 'react-native';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import Image from '../../atoms/Image';
import Text from '../../atoms/Text';
import TouchableOpacity from '../../atoms/TouchableOpacity';
import VectorIcon from '../../atoms/VectorIcon';
import View from '../../atoms/View';
import AnimatedFlatlist from '../AnimatedScrolls/AnimatedFlatlist';
import constants from '../../../res/constants';
import { renderFile, sharedExceptionHandler, sharedOnVendorPress } from '../../../helpers/SharedActions';
import { postRequest } from '../../../manager/ApiManager';
import Endpoints from '../../../manager/Endpoints';
import sharedStyles from '../../../res/sharedStyles';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import { useSelector } from 'react-redux';
import ImageBackground from '../../atoms/ImageBackground';
import CardDealHover from '../../../screens/PitstopListing/components/CardDealHover';

export default React.memo(({ vendorType = 0, pitstopType = 2, vendorDashboardCatID = 0, imageStyles = {}, themeColors = null, showMoreBtnText = "", cb = () => { }, textContainer = {} }) => {
    const SPACING_BOTTOM = 0;
    const [data, setData] = React.useState(null);
    const isLoading = React.useRef(null);
    const userReducer = useSelector(store => store.userReducer);
    const finalDestination = userReducer?.finalDestObj ?? { latitude: 0, longitude: 0 };
    const ITEMS_PER_PAGE = userReducer.homeScreenItemsPerPage || 10;

    const fetchData = () => {
        postRequest(Endpoints.GET_VENDOR_DASHBOARD_CATEGORY_ID_DETAIL,
            {
                "vendorType": vendorType,
                "pageNumber": 1,
                "itemsPerPage": ITEMS_PER_PAGE,
                "vendorDashboardCatID": vendorDashboardCatID,
                "latitude": finalDestination.latitude,
                "longitude": finalDestination.longitude
            },
            res => {
                console.log('res.data generic ==>>>', res.data);
                if (res.data.statusCode !== 200) return;
                cb(true)
                setData(res.data.vendorCategoryViewModel);
            },
            err => {
                isLoading.current = true
                cb(true)
                sharedExceptionHandler(err)
            },
            {},
            false,
        );
    };
    React.useEffect(() => {
        fetchData();
    }, [vendorType])
    const colors = themeColors ?? theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.8,

    }
    const SCALE_IMAGE_SMALL = {
        height_sm: constants.window_dimensions.height / 7,
        width_sm: constants.window_dimensions.width * 0.3
    }
    const { height, width } = SCALE_IMAGE;
    const { height_sm, width_sm } = SCALE_IMAGE_SMALL;
    const styles = _styles(colors, width, height, width_sm, height_sm)



    const cardTypeUI = {
        1: (item, index) => {
            const { title, description, image, averagePrice } = item;
            return (
                <TouchableOpacity activeOpacity={0.8} style={{ padding: 10 }} onPress={() => sharedOnVendorPress(item, index)}>
                    <ImageBackground source={{ uri: renderFile(image) }} style={[styles.image_Small, imageStyles]} tapToOpen={false} >
                        <CardDealHover colors={colors} text={item?.discountTitle ?? ''} />
                        <CardDealHover colors={colors} text={item?.discountPercentage ?? ''} />
                    </ImageBackground>
                    <View style={styles.subContainer}>
                        <Text style={styles.title} numberOfLines={1} >{title}</Text>
                    </View>
                    <Text style={{ ...styles.tagsText }} numberOfLines={1} >{description}</Text>
                    {averagePrice &&
                        <Text style={styles.title} >Rs. {averagePrice}</Text>
                    }
                </TouchableOpacity>
            )
        },
        2: (item, index) => {
            const { title, description, estTime, distance, image, averagePrice } = item;
            return (
                <TouchableOpacity activeOpacity={0.8} onPress={() => sharedOnVendorPress(item, index)}>
                    <ImageBackground source={{ uri: renderFile(image) }} style={[styles.image, imageStyles]} tapToOpen={false} >
                        <CardDealHover colors={colors} text={item?.discountTitle ?? ''} />
                        <CardDealHover colors={colors} text={item?.discountPercentage ?? ''} />
                    </ImageBackground>
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
    }
    const onPressViewMore = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.PitstopsVerticalList.screen_name, { pitstopType: pitstopType, listingObj: { ...data } });
    }
    if (!data)
        return null
    return (
        <View style={{ paddingBottom: SPACING_BOTTOM }}>
            {/* {
                data.map((item, index) => ( */}
            <React.Fragment key={`generic-item-key-${'index'}`}>
                <View style={{ ...textContainer, ...styles.container }} >
                    <Text style={styles.mainText} numberOfLines={1} >{data?.header}</Text>
                    <TouchableOpacity onPress={() => onPressViewMore()}>
                        <Text style={styles.viewMoreBtn} >{showMoreBtnText || `View More`}</Text>
                    </TouchableOpacity>
                </View>

                <AnimatedFlatlist

                    data={data?.vendorList ?? []}
                    renderItem={cardTypeUI[data?.cardType ?? 1]}
                    itemContainerStyle={data?.cardType === 1 ? styles.itemContainerSmall : { ...styles.itemContainer }}
                    // itemContainerStyle={item.cardType !== 1?styles.itemContainerSmall:{ ...styles.itemContainer }}
                    horizontal={true}
                    flatlistProps={{
                        showsHorizontalScrollIndicator: false,
                        contentContainerStyle: { marginLeft: 0, paddingRight: 10 }
                    }}
                />
            </React.Fragment>
            {/* )) */}
            {/* } */}

        </View>
    );
}, (n, p) => n !== p)


//_styles declararation

const _styles = (colors, width, height, height_sm, width_sm) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 10,
        paddingVertical: 5
    },
    mainText: {
        color: colors.text,
        fontSize: 16,
        flex: 0.8,

        // paddingHorizontal:10,
    },
    viewMoreBtn: {
        color: colors.primary || '#6D51BB', // colors.primary here should be the theme color of specific category
        fontSize: 12
    },
    itemContainer: {
        ...sharedStyles._styles(colors).shadow,
        backgroundColor: colors.white || '#fff',
        borderRadius: 10,
        // marginHorizontal: 5,
        // marginRight: 10,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5,
        marginLeft: 10,
        // marginRight: 10,

    },
    itemContainerSmall: {
        ...sharedStyles._styles(colors).shadow,
        backgroundColor: colors.white || '#fff',
        height: 200,
        width: 180,
        borderRadius: 10,
        marginRight: Platform.OS === 'ios' ? 10 : 10,
        // marginHorizontal: 5,
        flex: 1,
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        marginVertical: 5,
        left: 10,


    },
    image: {
        height: height,
        width: width,
        borderRadius: 10
    },
    image_Small: {
        height: height_sm,
        width: 160,
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
        color: colors.primary || '#6D51BB', // colors.primary here should be the theme color of specific category
        marginTop: Platform.OS === "android" ? 3 : 0
    },
    title: {
        fontSize: 14,
        // paddingVertical: 5,
        color: '#000',
        width: width * 0.5
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