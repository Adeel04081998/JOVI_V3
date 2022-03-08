import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React, { useState } from 'react';
import { Animated, Appearance, Easing, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useDispatch, useSelector } from 'react-redux';
import AddressesList from "../../components/atoms/FinalDestination/AddressesList";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Text from "../../components/atoms/Text";
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import GenericList from '../../components/molecules/GenericList';
import ImageCarousel from '../../components/molecules/ImageCarousel';
import BottomBarComponent from '../../components/organisms/BottomBarComponent';
import { sharedConfirmationAlert, sharedExceptionHandler, sharedLogoutUser, sharedOrderNavigation } from "../../helpers/SharedActions";
import { getRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import preference_manager from "../../preference_manager";
import ReduxActions from '../../redux/actions';
import theme from "../../res/theme";
import GV from "../../utils/GV";
import AvatarAlert from "./components/AvatarAlert";
import Categories from './components/Categories';
import Greetings from './components/Greetings';
import Search from './components/Search';
import stylesheet from './styles';
export default () => {
    let initState = {
        "modalVisible": false,
        "finalDestTitle": ''
    }
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const messagesReducer = useSelector(state => state.messagesReducer);
    const userReducer = useSelector(state => state.userReducer);
    const vendorDashboardCategoryIDReducer = useSelector(s => s.vendorDashboardCategoryIDReducer)?.data ?? [];
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const loaderVisible = !promotionsReducer?.statusCode || !messagesReducer.statusCode;
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const homeStyles = stylesheet.styles(colors);
    const homeFadeIn = React.useRef(new Animated.Value(0)).current;
    const [state, setState] = useState(initState)
    const { modalVisible, finalDestTitle } = state;
    const isFinalDestinationSelected = userReducer.finalDestObj;
    // #region :: SELECTING FINAL DESTINATION IF NOT SELECTED START's FROM HERE 
    const gotoFinalDestinationModal = () => {
        dispatch(ReduxActions.setModalAction({
            visible: true,
            ModalContent: <AddressesList />,
            disabled: true, //DISABLING OUTSIDE TOUCH
        }))
    };
    const onOrderPress = (order) => {
        sharedOrderNavigation(order.orderID, order.subStatusName);
    }
    useFocusEffect(
        React.useCallback(() => {
            getRequest(Endpoints.GetOpenOrders, (res) => {
                console.log('[GetOpenOrders] res', res);
                if (res.data.statusCode === 200) {
                    const openOrders = res.data?.getOpenOrderDetails?.openOrderList ?? [];
                    dispatch(ReduxActions.setUserAction({ openOrders, noOfOpenOrders: openOrders.length }));
                }
            }, (err) => { sharedExceptionHandler(err); });
            if (!(!!userReducer?.finalDestObj)) {
                gotoFinalDestinationModal();
            }

            return () => {
                dispatch(ReduxActions.hideRobotAction());
            };
        }, [userReducer?.finalDestObj])
    );


    // #endregion :: SELECTING FINAL DESTINATION IF NOT SELECTED END's FROM HERE 

    React.useEffect(() => {
        if (!loaderVisible && userReducer?.finalDestObj?.latitude) {
            Animated.timing(homeFadeIn, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if (finished && !__DEV__) {
                    dispatch(ReduxActions.showRobotAction());
                }
            });
        }
    }, [loaderVisible, userReducer?.finalDestObj]);
    React.useEffect(() => {
        if (!isFocused) {
            dispatch(ReduxActions.hideRobotAction());
        }
    }, [isFocused]);
    const renderLoader = () => {
        return <View style={homeStyles.gifLoader}>
            <LottieView
                autoSize={true}
                resizeMode={'contain'}
                style={{ width: '100%' }}
                source={require('../../assets/gifs/Homeloading.json')}
                autoPlay
                loop
            />
        </View>
    }
    return (
        <View style={homeStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader
                    finalDest={userReducer?.finalDestObj?.title || null}
                    leftIconName={"ios-menu"}
                    onTitlePress={() => {
                        dispatch(ReduxActions.setModalAction({
                            visible: true,
                            ModalContent: <AddressesList />
                        }))
                    }}
                    onLeftIconPress={null}
                />
                {loaderVisible ? renderLoader() : <Animated.View style={{
                    opacity: homeFadeIn.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
                    transform: [{ scale: homeFadeIn.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }]
                }}>
                    <KeyboardAwareScrollView style={{}} showsVerticalScrollIndicator={false}>
                        <Greetings messagesReducer={messagesReducer} homeStyles={homeStyles} userReducer={userReducer} colors={colors} />
                        {
                            userReducer.openOrders && userReducer.openOrders.length > 0 &&
                            <>
                                <Text style={{ margin: 5, left: 5, fontWeight: "bold", color: colors.primary, fontSize: 16 }}>Orders:</Text>
                                <ScrollView horizontal contentContainerStyle={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }} style={{ borderRadius: 5, borderWidth: .5, borderColor: colors.primary, margin: 5 }}>
                                    {
                                        // [...userReducer.openOrders, ...userReducer.openOrders, ...userReducer.openOrders, ...userReducer.openOrders].map((item, i) => {
                                            userReducer.openOrders.map((item, i) => {
                                            return <Text style={{ margin: 10, backgroundColor: colors.primary, color: colors.white, borderRadius: 5, padding: 5, textAlign: "center", paddingTop: 7 }} onPress={() => {
                                                onOrderPress(item);
                                            }}>{item.orderID}</Text>
                                        })
                                    }
                                </ScrollView>
                            </>
                        }
                        <ImageCarousel
                            // aspectRatio={16 / 7}
                            data={promotionsReducer?.dashboardContentListViewModel?.dashboardPromoListVM ??
                                [{
                                    promoImg: promotionsReducer?.dashboardContentListViewModel?.dashboardBannerImg ??
                                        `Dev/DashboardBanner/2021/5/20/Jov_banner_350x220 (1)_12173.jpg`
                                }]} // Hardcoded url added for QA testing only if there is no data in db => Mudassir
                            uriKey="promoImg"
                            containerStyle={homeStyles.imageCarousal}
                            height={170}
                        />
                        <View style={homeStyles.wrapper}>
                            <Search colors={colors} homeStyles={homeStyles} />
                            <Categories homeStyles={homeStyles} />
                            <AvatarAlert messagesReducer={messagesReducer} homeStyles={homeStyles} />
                            {/* <RecentOrders /> AS PER PM WE HAVE TO REMOVE RECENT ORDER FOR NOW*/}
                            {isFinalDestinationSelected && vendorDashboardCategoryIDReducer.map((item, index) => {
                                return (
                                    <GenericList vendorDashboardCatID={item.vendorDashboardCatID} textContainer={{ paddingHorizontal: 0 }} />
                                )
                            })}
                        </View>
                    </KeyboardAwareScrollView>
                </Animated.View>}
            </SafeAreaView>
            <BottomBarComponent leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]} rightData={[{ id: 3, iconName: "wallet", title: "Wallet" }, {
                id: 4, iconType: "AntDesign", iconName: "logout", title: "Logout", onPress: () => {
                    sharedConfirmationAlert("Alert", "Log me out and remove all the cache?",
                        [
                            { text: "No", onPress: () => { } },
                            {
                                text: "Yes", onPress: () => preference_manager.clearAllCacheAsync().then(() => sharedLogoutUser())
                            },
                        ]
                    )
                }
            }]} />
        </View>
    );
};