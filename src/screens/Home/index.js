import React from 'react';
import { Animated, Appearance, Easing, Platform, StyleSheet } from "react-native";
import GenericList from '../../components/molecules/GenericList';
import { useSelector } from 'react-redux';
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
import { initColors } from '../../res/colors';


export default () => {
    // return <View />
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const messagesReducer = useSelector(state => state.messagesReducer);
    const userReducer = useSelector(state => state.userReducer);
    let greetingMessage, alertMessage, tag, caption, name = userReducer.firstName;
    if (Object.keys(messagesReducer).length) {
        // if(messagesReducer.)
        const { homeScreenDataViewModel } = messagesReducer ?? {};
        const { greetingsList, alertMsgList } = homeScreenDataViewModel ?? {};
        greetingMessage = greetingsList?.[0] ?? null; // would be dynamic in future for schedule messages
        alertMessage = alertMsgList?.[0] ?? false;// would be dynamic in future for schedule messages
        caption = String(greetingMessage?.header).replace(/<<firstName>>/g, "");
        name = userReducer["firstName"];
        // let totalStr = String(greetingMessage?.header).split("<<")
        // caption = totalStr[0];
        // tag = totalStr[totalStr.length - 1].replace(">>", "");
        // if (userReducer[tag]) {
        //     name = userReducer[tag];
        // }
    }
    const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
    const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.3;
    const overAllMargin = 0;
    const categoriesList = ENUMS.PITSTOP_TYPES.filter((x, i) => { return x.isActive === true });
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const categoryStyles = stylesheet.styles(colors, overAllMargin);
    const greetingAnimation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (greetingMessage) {
            Animated.timing(greetingAnimation, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        }
    }, [greetingMessage]);

    const cartOnPressHandler = () => { __DEV__ ? alert("Pressed") : null }
    const Greetings = () => {
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
                { margin: 10 }
            ]} >
            <Text style={[categoryStyles.greetingHeaderText]} numberOfLines={1} fontFamily='PoppinsRegular' >
                {`${caption}`}
                <Text style={{ color: colors.BlueVoilet || "#6D51BB", alignSelf: 'center', fontSize: 20 }} numberOfLines={1} >
                    {name}
                </Text>
            </Text>
            <Text style={categoryStyles.greetingBodyText} numberOfLines={2}>
                {`${greetingMessage?.body}`}
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
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, justifyContent: "space-between", overflow: 'hidden', }}>
            <VectorIcon name='search' style={{ left: 10 }} color={initColors.primary} />
            <TextInput textAlign="left" placeholder='Search for shops and restaurants or pharmacy' style={{ backgroundColor: "#fff" }} />
        </View>
    )

    const Categories = () => {
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
                        onPress={cartOnPressHandler}
                    />
                })
                }
            </AnimatedView>
        </AnimatedView>
    }
    const SPACING_VERTICAL = 10;
    const SPACING_BOTTOM = 0;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CustomHeader />
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
                />
                <View style={{ margin: SPACING_VERTICAL, paddingBottom: SPACING_BOTTOM }}>
                    <Search />
                    <Categories />
                    <AvatarAlert />
                    <GenericList />
                </View>
            </KeyboardAwareScrollView>

        </SafeAreaView>
    );
};
