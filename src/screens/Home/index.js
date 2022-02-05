import React from 'react';
import { Animated, Appearance, Easing, Platform, ScrollView, StyleSheet } from "react-native";
import GenericList from '../../components/molecules/GenericList';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ImageCarousel from '../../components/molecules/ImageCarousel';
import LottieView from "lottie-react-native";
import AnimatedView from "../../components/atoms/AnimatedView";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Text from "../../components/atoms/Text";
import CategoryCardItem from "../../components/molecules/CategoryCardItem";
import constants from "../../res/constants";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import GV from "../../utils/GV";
import stylesheet from './styles';
import CustomHeader from '../../components/molecules/CustomHeader';
import TextInput from '../../components/atoms/TextInput';
import View from '../../components/atoms/View';
import VectorIcon from "../../components/atoms/VectorIcon";
import ReduxActions from '../../redux/actions';
import { initColors } from '../../res/colors';
import BottomBarComponent from '../../components/organisms/BottomBarComponent';
import Button from '../../components/molecules/Button';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import { sharedLogoutUser } from '../../helpers/SharedActions';

const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.3;
export default () => {
    // return <View />
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const messagesReducer = useSelector(state => state.messagesReducer);
    const userReducer = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    let greetingMessage, alertMessage, tag, caption, name = userReducer.firstName;
    if (Object.keys(messagesReducer).length) {
        // if(messagesReducer.)
        const { homeScreenDataViewModel } = messagesReducer ?? {};
        const { greetingsList, alertMsgList } = homeScreenDataViewModel ?? {};
        greetingMessage = greetingsList?.[0] ?? null; // would be dynamic in future for schedule messages
        alertMessage = alertMsgList?.[0] ?? false;// would be dynamic in future for schedule messages
        caption = String(greetingMessage?.header).replace(/[<<Name>>, <<phoneNumber>>]/g, "");
        name = userReducer["firstName"];
        // let totalStr = String(greetingMessage?.header).split("<<")
        // caption = totalStr[0];
        // tag = totalStr[totalStr.length - 1].replace(">>", "");
        // if (userReducer[tag]) {
        //     name = userReducer[tag];
        // }
    }
    const loaderVisible = !promotionsReducer?.statusCode || !messagesReducer.statusCode;
    const overAllMargin = 0;
    const categoriesList = ENUMS.PITSTOP_TYPES.filter((x, i) => { return x.isActive === true });
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const categoryStyles = stylesheet.styles(colors, overAllMargin);
    const greetingAnimation = React.useRef(new Animated.Value(0)).current;
    const homeFadeIn = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (!loaderVisible) {
            Animated.timing(homeFadeIn, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if (finished) {
                    dispatch(ReduxActions.showRobotAction());
                }
            });
        }
    }, [loaderVisible]);
    const cartOnPressHandler = (index) => {
        if (index === 3) sharedLogoutUser();
    }
    const RecentOrders = () => {
        const CARD_HEIGHT = 100;
        const SPACING = 10;
        const DATA = Array(6).fill();
        return <View style={{ marginVertical: SPACING_VERTICAL, }}>
            <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={{ fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL }}>
                Recent Orders
            </Text>
            <ScrollView style={{ flexDirection: "row" }} horizontal showsHorizontalScrollIndicator={false}>
                {
                    DATA.map((order, index) => (
                        <View key={`recent-order-${index}`} style={{ height: CARD_HEIGHT, backgroundColor: "#fff", marginRight: 10, borderRadius: 10, justifyContent: "space-between" }}>
                            <View style={{ paddingHorizontal: SPACING, padding: 5 }}>
                                <Text fontFamily='PoppinsMedium' numberOfLines={1} style={{ fontSize: 14, color: "#272727" }}>
                                    Beef patty Burger
                                </Text>
                                <Text numberOfLines={1} fontFamily='PoppinsRegular' style={{ fontSize: 10, color: "#C1C1C1" }}>
                                    2 More Products
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING }}>
                                <Text fontFamily='PoppinsMedium' style={{ fontSize: 10, color: "#F94E41" }}>
                                    Rs. 750
                                </Text>
                                <TouchableOpacity style={{ borderColor: "#F94E41", borderRadius: 13, borderWidth: 0.5 }} activeOpacity={.7}>
                                    <Text fontFamily='PoppinsMedium' style={{ fontSize: 10, color: "#F94E41", paddingHorizontal: 10, textAlign: "center", paddingVertical: 5 }}>Reorder</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>

    }
    const Greetings = () => {
        React.useLayoutEffect(() => {
            if (greetingMessage) {
                Animated.timing(greetingAnimation, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                    easing: Easing.ease
                }).start();
            }
        }, [greetingMessage]);
        return <AnimatedView style={
            [
                {
                    ...categoryStyles.greetingMainContainer,
                    opacity: greetingAnimation,
                    transform: [{
                        translateX: greetingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-100, 0]
                        })
                    }]
                },
                { margin: 5 }
            ]} >
            <Text style={[categoryStyles.greetingHeaderText]} numberOfLines={1} fontFamily='PoppinsRegular' >
                {`${caption}`}
                <Text style={{ color: colors.BlueVoilet || "#6D51BB", alignSelf: 'center', fontSize: 20 }} numberOfLines={1} >
                    {name}
                </Text>
            </Text>
            <Text style={categoryStyles.greetingBodyText} numberOfLines={2}>
                {`${greetingMessage?.body?.replace(/[<<Name>>, <<phoneNumber>>]/g, "")}`}
            </Text>
        </AnimatedView>
    }
    const AvatarAlert = () => {
        if (alertMessage) {
            return (
                <AnimatedView style={{ marginVertical: 30 }}>
                    <AnimatedView style={categoryStyles.alertMsgPrimaryContainer}>
                        <AnimatedView style={categoryStyles.alertMsgSecondaryContainer}>
                            <Text style={categoryStyles.alertMsgHeaderText} numberOfLines={2}>
                                {`${alertMessage.header}`}
                            </Text>
                            <Text style={categoryStyles.alertMsgBodyText} numberOfLines={2}>
                                {`${alertMessage.body}`}
                            </Text>
                        </AnimatedView>
                        <AnimatedView style={categoryStyles.alertMsgSvgView}>
                            <LottieView
                                source={require('../../assets/gifs/animated_cat.json')}
                                style={{ position: 'absolute', right: 15, height: 80, bottom: Platform.OS === 'android' ? 2 : 1 }}
                                hardwareAccelerationAndroid={true}
                                autoPlay
                                loop
                            />
                        </AnimatedView>
                    </AnimatedView>
                </AnimatedView>

            )

        }
        else {
            return (
                <View />
                // <AnimatedView style={[{ height: 80, marginHorizontal: 10, }]}>
                //     <LottieView
                //         source={require('../../assets/gifs/alertMsgs_Skeleton.json')}
                //         hardwareAccelerationAndroid={true}
                //         autoPlay
                //         loop
                //     />
                // </AnimatedView>
            )

        }
    }
    const Search = () => (
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, height: 60, justifyContent: "space-between", overflow: 'hidden', }}>
            <VectorIcon name='search' style={{ left: 10 }} color={initColors.primary} />
            <TextInput textAlign="left" placeholder='Search for shops and restaurants or pharmacy' style={{ backgroundColor: "#fff" }} />
        </View>
    )


    const SPACING_VERTICAL = 10;
    const SPACING_BOTTOM = 0;
    return (
        <View style={{ flex: 1, flexGrow: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader />
                {
                    loaderVisible ?
                        <View
                            style={{ height: '93%', width: '99%', paddingLeft: 10, paddingTop: 4, paddingHorizontal: 5, display: 'flex', justifyContent: 'center', alignContent: 'center', }}
                        >
                            <LottieView
                                autoSize={true}
                                resizeMode={'contain'}
                                style={{ width: '100%' }}
                                source={require('../../assets/gifs/Homeloading.json')}
                                autoPlay
                                loop
                            />
                        </View>
                        :
                        <Animated.View style={{
                            opacity: homeFadeIn.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.6, 1]
                            }), transform: [{
                                scale: homeFadeIn.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.9, 1]
                                })
                            }]
                        }}>
                            <KeyboardAwareScrollView style={{}} showsVerticalScrollIndicator={false}>
                                <Greetings />
                                <ImageCarousel
                                    // aspectRatio={16 / 7}
                                    // width={150}
                                    data={promotionsReducer?.dashboardContentListViewModel?.dashboardPromoListVM ?? [{ promoImg: `Dev/DashboardBanner/2021/5/20/Jov_banner_350x220 (1)_12173.jpg` }]} // Hardcoded url added for QA testing only if there is no data in db => Mudassir
                                    uriKey="promoImg"
                                    containerStyle={{
                                        marginHorizontal: 10,
                                        alignItems: 'center',
                                        borderRadius: 12,
                                        // backgroundColor: "red",
                                        // resizeMode: "contain"
                                    }}
                                    height={170}
                                />
                                <View style={{ margin: SPACING_VERTICAL, paddingBottom: Platform.select({ android: 160, ios: 140 }) }}>
                                    <Search />
                                    <Categories cartOnPressHandler={cartOnPressHandler} categoriesList={categoriesList} categoryStyles={categoryStyles} />
                                    <AvatarAlert />
                                    <RecentOrders />
                                    <GenericList />
                                </View>
                            </KeyboardAwareScrollView>
                        </Animated.View>
                }

            </SafeAreaView>
            <BottomBarComponent
                leftData={[{
                    id: 1,
                    iconName: "home",
                    title: "Home",
                },
                {
                    id: 2,
                    iconName: "person",
                    title: "Profile",
                }
                ]}
                rightData={[{
                    id: 3,
                    iconName: "wallet",
                    title: "Wallet",
                },
                {
                    id: 4,
                    iconName: "pin",
                    title: "Location",
                }
                ]}
            />
        </View>
    );
};

const Categories = React.memo(({ cartOnPressHandler, categoriesList, categoryStyles }) => {
    return <AnimatedView style={[categoryStyles.categoriesCardPrimaryContainer]}>
        <Text style={categoryStyles.categoriesCardTittleText}>Categories</Text>
        <AnimatedView style={{ flexDirection: 'row' }}>
            {categoriesList.map((x, i) => {
                return <CategoryCardItem
                    key={`category card item${i}`}
                    xml={x.icon}
                    title={x.text}
                    containerStyle={{ marginHorizontal: 3, justifyContent: 'center', borderRadius: 10 }}
                    height={CONTAINER_HEIGHT}
                    width={CONTAINER_WIDTH}
                    textStyle={{ fontSize: 12, padding: 2 }}
                    imageContainerStyle={{ height: CONTAINER_HEIGHT * 0.6, width: 80, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}
                    onPress={()=>cartOnPressHandler(i)}
                />
            })
            }
        </AnimatedView>
    </AnimatedView>
}, (prevProps, nextProps) => {
    return prevProps !== nextProps
})