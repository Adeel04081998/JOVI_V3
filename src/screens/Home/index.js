import LottieView from "lottie-react-native";
import React from 'react';
import { Animated, Appearance, Easing } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useDispatch, useSelector } from 'react-redux';
import RecentOrders from '../../components/atoms/RecentOrders';
import SafeAreaView from "../../components/atoms/SafeAreaView";
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import GenericList from '../../components/molecules/GenericList';
import ImageCarousel from '../../components/molecules/ImageCarousel';
import BottomBarComponent from '../../components/organisms/BottomBarComponent';
import ReduxActions from '../../redux/actions';
import theme from "../../res/theme";
import GV from "../../utils/GV";
import AvatarAlert from "./components/AvatarAlert";
import Categories from './components/Categories';
import Greetings from './components/Greetings';
import Search from './components/Search';
import stylesheet from './styles';
export default () => {
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const messagesReducer = useSelector(state => state.messagesReducer);
    const userReducer = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const loaderVisible = !promotionsReducer?.statusCode || !messagesReducer.statusCode;
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const homeStyles = stylesheet.styles(colors);
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

    if (loaderVisible) return <View style={homeStyles.gifLoader}>
        <LottieView
            autoSize={true}
            resizeMode={'contain'}
            style={{ width: '100%' }}
            source={require('../../assets/gifs/Homeloading.json')}
            autoPlay
            loop
        />
    </View>
    return (
        <View style={homeStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader />
                <Animated.View style={{
                    opacity: homeFadeIn.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
                    transform: [{ scale: homeFadeIn.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }]
                }}>
                    <KeyboardAwareScrollView style={{}} showsVerticalScrollIndicator={false}>
                        <Greetings messagesReducer={messagesReducer} homeStyles={homeStyles} userReducer={userReducer} colors={colors} />
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
                            <RecentOrders />
                            <GenericList />
                        </View>
                    </KeyboardAwareScrollView>
                </Animated.View>
            </SafeAreaView>
            <BottomBarComponent leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]} rightData={[{ id: 3, iconName: "wallet", title: "Wallet" }, { id: 4, iconName: "pin", title: "Location" }]} />
        </View>
    );
};