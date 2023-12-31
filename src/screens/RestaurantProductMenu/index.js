import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { Animated, Appearance, Image as RNImage, LogBox, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import NoRecord from '../../components/organisms/NoRecord';
import ProductCard from '../../components/organisms/Card/ProductCard';
import { makeArrayRepeated, renderFile, renderPrice, sharedExceptionHandler, sharedGetFinalDestintionRequest, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';
import GotoCartButton from './components/GotoCartButton';
import { ProductDummyData2 } from './components/ProductDummyData';
import RestaurantProductMenuHeader from './components/RestaurantProductMenuHeader';
import RestaurantProductMenuScrollable from './components/RestaurantProductMenuScrollable';
import lodash from 'lodash'; // 4.0.8
import { itemStylesFunc, sectionHeaderStylesFunc, stylesFunc } from './styles';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ENUMS from '../../utils/ENUMS';
import svgs from '../../assets/svgs';
import { SvgXml } from 'react-native-svg';
import VendorOpening from '../../components/organisms/Overlays/VendorOpening';
import { useSelector } from 'react-redux';

const WINDOW_HEIGHT = constants.window_dimensions.height;
const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
LogBox.ignoreLogs([
    "Animated: `useNativeDriver` was not specified.",
]);

const SCROLL_HEADER_HEIGHT_LINE = 60;

export default ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const pitstopType = route?.params?.pitstopType ?? 4;
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOPS)[pitstopType]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);
    const pitstopID = route?.params?.pitstopID ?? 0;
    const sectionHeaderStyles = sectionHeaderStylesFunc(colors);
    const itemStyles = itemStylesFunc(colors);

    const [data, updateData] = React.useState({});
    const [query, updateQuery] = React.useState({
        isLoading: true,
        error: false,
        errorText: '',
    });
    const cartReducer = useSelector((store) => store.cartReducer);
    const { itemsCount = 0 } = cartReducer;

    // #region :: ANIMATION START's FROM HERE 
    const animScroll = React.useRef(new Animated.Value(0)).current;

    const [headerHeight, setHeaderHeight] = React.useState(0)//WINDOW_HEIGHT * 0.4);

    const headerTop = animScroll.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight + getStatusBarHeight())],
        extrapolate: "clamp",
        useNativeDriver: true
    });

    const inputRange = headerHeight - ((SCROLL_HEADER_HEIGHT_LINE * 2) + 20);
    const tabTop = animScroll.interpolate({
        inputRange: [0, inputRange > 0 ? inputRange : inputRange * -1],
        outputRange: [headerHeight + 20, SCROLL_HEADER_HEIGHT_LINE],
        extrapolate: "clamp",
        useNativeDriver: true
    });

    // #endregion :: ANIMATION END's FROM HERE 

    // #region :: API IMPLEMENTATION START's FROM HERE 

    React.useEffect(() => {
        loadData();
        return () => { };
    }, [])
    const loadData = () => {
        updateQuery({
            errorText: '',
            isLoading: true,
            error: false,
        });
        const params = {
            "pitstopID": pitstopID,//3738   4024,
            ...sharedGetFinalDestintionRequest(),
        };
        postRequest(Endpoints.GET_RESTAURANT_PRODUCT_MENU_LIST, params, (res) => {
            console.log('response ', res);
            if (res.data.statusCode === 404) {
                updateQuery({
                    errorText: res.data.message,
                    isLoading: false,
                    error: true,
                });
                updateData({});
                return
            }
            updateQuery({
                errorText: '',
                isLoading: false,
                error: false,
            });
            updateData(res.data?.productsAndDealsV2 ?? {});
        }, (err) => {
            console.log('errror api  ', err);
            sharedExceptionHandler(err)
            updateQuery({
                errorText: sharedExceptionHandler(err),
                isLoading: false,
                error: true,
            })
        })
    };

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

    // #region :: LOADING AND ERROR RENDERING START's FROM HERE 
    if (query.error) {
        return (
            <SafeAreaView style={{ flex: 1, top: getStatusBarHeight(true), backgroundColor: colors.white, }}>
                <CustomHeader
                    hideFinalDestination
                    title={route?.params?.title ?? ''}
                    titleStyle={{
                        color: colors.primary
                    }}
                    leftIconName="chevron-back"
                    leftIconColor={colors.primary}
                    rightIconColor={colors.primary}
                    containerStyle={{
                        backgroundColor: "transparent",
                        borderBottomWidth: 0,
                    }}
                />
                <NoRecord
                    color={colors}
                    title={query.errorText}
                    buttonText={`Retry`}
                    onButtonPress={loadData} />
            </SafeAreaView>
        )
    }
    if (query.isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, top: getStatusBarHeight(true), backgroundColor: colors.white, }}>
                <CustomHeader
                    hideFinalDestination
                    title={route?.params?.title ?? ''}
                    titleStyle={{
                        color: colors.primary
                    }}
                    leftIconName="chevron-back"
                    leftIconColor={colors.primary}
                    rightIconColor={colors.primary}
                    containerStyle={{
                        backgroundColor: "transparent",
                        borderBottomWidth: 0,
                    }}
                />

                <AnimatedLottieView
                    autoSize={true}
                    resizeMode={'contain'}
                    style={{ width: '100%' }}
                    source={require('../../assets/gifs/Homeloading.json')}
                    autoPlay
                    loop
                />

            </SafeAreaView>
        )
    }

    // #endregion :: LOADING AND ERROR RENDERING END's FROM HERE 

    const onItemPress = (item) => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ProductDetails.screen_name, { propItem: { ...item, vendorDetails: { marketID: pitstopID, ...data, pitstopType: PITSTOP_TYPES.RESTAURANT, ...route.params } }, pitstopType: PITSTOP_TYPES.RESTAURANT });
    };

    return (
        <SafeAreaView style={{ flex: 1, top: getStatusBarHeight(true) }}>
            {(data?.isClosed ?? false) &&
                <VendorOpening colors={colors} time={data?.openingTime ?? ''} />
            }

            <StatusBar backgroundColor={colors.white} />
            <Animated.View style={{ position: 'absolute', top: 0, zIndex: 9999, }}>
                <CustomHeader
                    hideFinalDestination
                    title={route?.params?.title ?? data?.pitstopName ?? ''}
                    titleStyle={{
                        color: colors.primary,
                        opacity: animScroll.interpolate({
                            inputRange: [0, headerHeight],
                            outputRange: [0, 1]
                        }),
                    }}
                    leftIconName="chevron-back"
                    leftContainerStyle={{
                        backgroundColor: colors.white,
                    }}
                    rightContainerStyle={{
                        backgroundColor: colors.white,
                    }}
                    leftIconColor={colors.primary}
                    rightIconColor={colors.primary}
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderBottomWidth: 0,
                    }}
                />
            </Animated.View>
            {/* ****************** Start of UPPER HEADER TILL RECENT ORDER ****************** */}
            <Animated.View style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: colors.screen_background,
                transform: [{
                    translateY: headerTop
                }],
            }}>
                {/* RECENT ORDER IS ALSO IN PRODUCT MENU HEADER */}
                <RestaurantProductMenuHeader colors={colors}
                    onLayout={(e) => {
                        setHeaderHeight(e.nativeEvent.layout.height);
                    }}
                    hideHeader
                    item={{
                        image: { uri: renderFile(data?.pitstopImage ?? '') },
                        distance: data?.distance ?? '',
                        time: data?.time ?? '',
                        title: data?.pitstopName ?? '',
                        description: data?.pitstopTag ?? '',
                    }}
                />
            </Animated.View>

            {/* ****************** End of UPPER HEADER TILL RECENT ORDER ****************** */}

            <RestaurantProductMenuScrollable
                colors={colors}
                data={data?.productsDealsCategories ?? []}
                animatedScrollValue={animScroll}
                headerHeight={headerHeight}
                topHeaderStyle={{
                    backgroundColor: colors.screen_background,
                    paddingTop: 10,
                    height: SCROLL_HEADER_HEIGHT_LINE,
                    transform: [{
                        translateY: tabTop
                    }],

                }}
                itemsScrollViewStyle={{
                    marginBottom: itemsCount > 0 ? 80 : 0
                }}

                itemListPropertyName="restaurantItems"
                renderSectionHeader={(item, index) => {
                    if (item?.isTopDeal ?? false) return null;
                    return (
                        <View style={[sectionHeaderStyles.primaryContainer, { backgroundColor: colors.screen_background, paddingHorizontal: 10 }]}>
                            <Text
                                fontFamily='PoppinsMedium'
                                style={sectionHeaderStyles.text}>{item.categoryName}</Text>
                            <View style={sectionHeaderStyles.borderLine} />
                        </View>
                    )
                }}
                renderItem={(parentItem, item, parentIndex, index) => {

                    const discountedPrice = item.discountPrice ? item.discountPrice : item.price;

                    const price = (item?.hasOptions ?? false) ? renderPrice(discountedPrice, 'from Rs.') : renderPrice(`${discountedPrice}`);

                    if (parentItem?.isTopDeal ?? false) {
                        return (
                            <View style={{ backgroundColor: colors.screen_background }}>
                                <ProductCard
                                    onItemPress={() => onItemPress(item)}
                                    color={colors}
                                    containerStyle={{
                                        ...itemStyles.primaryContainer,
                                        marginLeft: index === 0 ? 10 : 0,
                                    }}
                                    item={{
                                        itemID: item.itemID,
                                        image: { uri: renderFile(item.image) },
                                        description: item.description,
                                        title: item.name,
                                        price: price,
                                        discount: item.price,
                                        discountAmount: item.discount,
                                        discountType: item.discountType
                                    }} />

                            </View>

                        )
                    }
                    return (
                        <TouchableOpacity onPress={() => onItemPress(item)} style={[itemStyles.primaryContainer2, { backgroundColor: colors.screen_background, paddingHorizontal: 10 }]}>
                            {index !== 0 &&
                                <View style={itemStyles.seperator} />
                            }

                            <View style={itemStyles.bodyContainer}>

                                <View style={itemStyles.detailContainer}>
                                    {VALIDATION_CHECK(item.name) &&
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text fontFamily='PoppinsBold' style={{ ...itemStyles.name, flex: 5, }} numberOfLines={1}>{`${item.name}`}</Text>


                                            {/* ****************** Start of DISCOUNT TYPE ****************** */}
                                            {parseInt(`${item.discountType}`) !== parseInt(`${ENUMS.PROMO_VALUE_TYPE.Empty.value}`) &&
                                                <View style={{ ...itemStyles.discountTypeContainer, flex: 1, justifyContent: "flex-end", }}>
                                                    {(parseInt(`${item.discountType}`) === parseInt(`${ENUMS.PROMO_VALUE_TYPE.Percentage.value}`) && item.discount > 0) && (
                                                        <>
                                                            {/* <SvgXml xml={svgs.discount(colors.primary)} height={15} width={15} style={itemStyles.discountTypeIcon} /> */}
                                                            <Text style={itemStyles.discountTypeText} numberOfLines={1}>{`${renderPrice({ price: item.discount, showZero: true }, '-', '%', /[^\d.]/g)}`}</Text>
                                                        </>
                                                    )

                                                    }
                                                </View>
                                            }

                                            {/* ****************** End of DISCOUNT TYPE ****************** */}


                                        </View>
                                    }

                                    {VALIDATION_CHECK(item.description) &&
                                        <Text style={itemStyles.description} numberOfLines={2}>{`${item.description}`}</Text>
                                    }

                                    {VALIDATION_CHECK(item.price) &&
                                        <View style={{ flexDirection: "row", alignItems: "center", }}>

                                            {/* ****************** Start of PRICE CHARGE FROM CUSTOMER ****************** */}
                                            <Text fontFamily='PoppinsMedium' style={itemStyles.price}>{price}</Text>

                                            {/* ****************** End of PRICE CHARGE FROM CUSTOMER ****************** */}


                                            {/* ****************** Start of DISCOUNT PRICE ****************** */}
                                            {(item.discountPrice > 0 && item.discount > 0) &&
                                                <Text style={{
                                                    ...itemStyles.discountPrice,
                                                    marginLeft: 6,
                                                }} numberOfLines={1}>{renderPrice(item.price)}</Text>
                                            }

                                            {/* ****************** End of DISCOUNT PRICE ****************** */}

                                        </View>
                                    }
                                </View>

                                <RNImage
                                    source={{ uri: renderFile(item.image) }}
                                    style={itemStyles.image}
                                />

                            </View>



                        </TouchableOpacity>
                    )
                }}
                renderAboveItems={() => (
                    <View style={{ marginTop: headerHeight + 40, paddingHorizontal: 15, backgroundColor: "pink", elevation: 2, paddingTop: 0 }} />
                )}
            />
            <GotoCartButton colors={colors} bottom={insets.bottom > 0 ? insets.bottom : getStatusBarHeight(true)} />
        </SafeAreaView>
    )
};//end of EXPORT DEFAULT


