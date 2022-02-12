import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { Animated, Appearance, Image as RNImage, LogBox, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import NoRecord from '../../components/organisms/NoRecord';
import ProductCard from '../../components/organisms/ProductCard';
import { renderFile, renderPrice, sharedExceptionHandler, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import GotoCartButton from './components/GotoCartButton';
import { ProductDummyData2 } from './components/ProductDummyData';
import RestaurantProductMenuHeader from './components/RestaurantProductMenuHeader';
import RestaurantProductMenuScrollable from './components/RestaurantProductMenuScrollable';
import lodash from 'lodash'; // 4.0.8
import { itemStylesFunc, sectionHeaderStylesFunc, stylesFunc } from './styles';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';

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

export default ({ navigation, route }) => {
    const pitstopType = route.params.pitstopType ?? 4;
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOPS)[pitstopType]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);
    const pitstopID = route?.params?.pitstopID ?? (__DEV__ ? 3738 : -1);
    const sectionHeaderStyles = sectionHeaderStylesFunc(colors);
    const itemStyles = itemStylesFunc(colors);

    const [data, updateData] = React.useState({});
    const [query, updateQuery] = React.useState({
        isLoading: true,
        error: false,
        errorText: '',
    });

    // #region :: ANIMATION START's FROM HERE 
    const animScroll = React.useRef(new Animated.Value(0)).current
    const [headerHeight, setHeaderHeight] = React.useState(WINDOW_HEIGHT * 0.7);

    const headerTop = animScroll.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight + 20)],
        extrapolate: "clamp",
        useNativeDriver: true
    });

    const tabTop = animScroll.interpolate({
        inputRange: [0, headerHeight + 20],
        outputRange: [headerHeight + 20, 0],
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
            "latitude": 33.654227,
            "longitude": 73.044831
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
    if (query.error) {
        return (
            <>
                <CustomHeader />
                <NoRecord
                    title={query.errorText}
                    buttonText={`Retry`}
                    onButtonPress={loadData} />
            </>
        )
    }
    if (query.isLoading) {
        return (
            <>
                <CustomHeader
                    hideFinalDestination
                    title={route?.params?.title??''}
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
                <View
                    style={{ height: '93%', width: '101%', paddingLeft: 10, paddingTop: 4, paddingHorizontal: 5, display: 'flex', justifyContent: 'center', alignContent: 'center', }}
                >
                    <AnimatedLottieView
                        autoSize={true}
                        resizeMode={'contain'}
                        style={{ width: '100%' }}
                        source={require('../../assets/gifs/Homeloading.json')}
                        autoPlay
                        loop
                    />
                </View>
            </>
        )
    }
    const onItemPress = (item)=>{
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ProductDetails.screen_name, { propItem:item,pitstopID,pitstopType:4 });
    };

    return (
        <View style={{ flex: 1, }}>
            <StatusBar backgroundColor={colors.white} />
            {/* ****************** Start of UPPER HEADER TILL RECENT ORDER ****************** */}
            <Animated.View style={{
                ...StyleSheet.absoluteFill,
                transform: [{
                    translateY: headerTop
                }],
            }}>
                {/* RECENT ORDER IS ALSO IN PRODUCT MENU HEADER */}
                <RestaurantProductMenuHeader colors={colors}
                    onLayout={(e) => {
                        setHeaderHeight(e.nativeEvent.layout.height);
                    }}
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
                    height: 50,
                    transform: [{
                        translateY: tabTop
                    }],
                }}
                itemsScrollViewStyle={{
                }}
                itemListPropertyName="restaurantItems"
                renderSectionHeader={(item, index) => {
                    if (item?.isTopDeal ?? false) return null;
                    return (
                        <View style={sectionHeaderStyles.primaryContainer}>
                            <Text
                                fontFamily='PoppinsMedium'
                                style={sectionHeaderStyles.text}>{item.categoryName}</Text>
                            <View style={sectionHeaderStyles.borderLine} />
                        </View>
                    )
                }}
                renderItem={(parentItem, item, parentIndex, index) => {
                    if (parentItem?.isTopDeal ?? false) {
                        return (
                            <ProductCard 
                            onItemPress={onItemPress}
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
                                    price: renderPrice(`${item.price}`)
                                }} />
                        )
                    }
                    return (
                        <TouchableOpacity onPress={()=>onItemPress(item)} style={itemStyles.primaryContainer2}>
                            {index !== 0 &&
                                <View style={itemStyles.seperator} />
                            }

                            <View style={itemStyles.bodyContainer}>

                                <View style={itemStyles.detailContainer}>
                                    {VALIDATION_CHECK(item.name) &&
                                        <Text fontFamily='PoppinsBold' style={itemStyles.name}>{`${item.name}`}</Text>
                                    }

                                    {VALIDATION_CHECK(item.description) &&
                                        <Text style={itemStyles.description}>{`${item.description}`}</Text>
                                    }

                                    {VALIDATION_CHECK(item.price) &&
                                        <Text fontFamily='PoppinsMedium' style={itemStyles.price}>{renderPrice(item.price, 'from Rs.')}</Text>
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

            <GotoCartButton colors={colors} onPress={() => { }} />

        </View>
    )
};//end of EXPORT DEFAULT

