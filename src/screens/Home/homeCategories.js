import React, { useState, useRef, useEffect } from "react";
import AnimatedView from "../../components/atoms/AnimatedView";
import Text from "../../components/atoms/Text";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import theme from "../../res/theme";
import GV from "../../utils/GV";
import { Alert, Animated, Easing, Appearance, Platform, StyleSheet } from "react-native";
import FontFamily from "../../res/FontFamily";
import AnimatedTab from "../../components/molecules/AnimatedTab/AnimatedTab";
import Svg, { SvgXml } from "react-native-svg";
import CategoryCardItem from "../../components/molecules/CategoryCardItem";
import svgs from "../../assets/svgs";
import ENUMS from "../../utils/ENUMS";
import constants from "../../res/constants";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { ScrollView } from "react-native-gesture-handler";

const TextSectiion = () => {

    let tempArray =
    {
        greetingText: "Good afternoon,",
        userName: "Alam",
        joviDescription: " Hanji…? Kya chaiye? roti, jovi ya dukaan?",
        cartPrimaryText: "Book an order with JOVI today ",
        cartSecondaryText: "Complete the challenges and earn different rewards ",
        header: "Book an order with JOVI today",
        body: "Complete the challenges and earn different rewards"
    }

    const messagesReducer = useSelector(state => state.messagesReducer);
    const userReducer = useSelector(state => state.userReducer);
    console.log("Message Reducer=>", userReducer);
    let greetingMessage, alertMessage, tag, caption;
    if (Object.keys(messagesReducer).length) {
        const { homeScreenDataViewModel: { greetingsList, alertMsgList } } = messagesReducer;
        greetingMessage = greetingsList?.[0] ?? null // would be dynamic in future
        alertMessage = alertMsgList?.[0] ?? false
        let totalStr = String(greetingMessage.header).split("<<")
        caption = totalStr[0];
        tag = totalStr[totalStr.length - 1].replace(">>", "");
    }
    const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
    const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.3;
    const overAllMargin = 10;
    const categoriesList = ENUMS.PITSTOP_TYPES.filter((x, i) => { return x.isActive === true })
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const categoryStyles = categoryStylesFunc(colors, overAllMargin);
    const greetingAnimation = React.useRef(new Animated.Value(0)).current;

    const cartOnPressHandler = () => { __DEV__ ? alert("HY") : null }

    useEffect(() => {
        if (greetingMessage) {
            Animated.timing(greetingAnimation, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        }
    }, [greetingMessage]);

    const _greetingMessageUi = () => {
        return (
            <AnimatedView style={{
                ...categoryStyles.greetingMainContainer, opacity: greetingAnimation,
                transform: [{
                    translateX: greetingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 0]
                    })
                }]
            }} >
                <Text style={[categoryStyles.greetingHeaderText]} numberOfLines={2} >
                    {`${caption}`}
                    <Text style={{ color: colors.BlueVoilet || "#6D51BB", alignSelf: 'center', fontSize: 20 }} numberOfLines={1} >
                        {/* { tag?`${userReducer["firstName"]}`: userReducer.firstName} */}
                        {`${userReducer["firstName"]}`}
                    </Text>
                </Text>
                <Text style={categoryStyles.greetingBodyText} numberOfLines={2}>
                    {`${greetingMessage?.body}`}
                </Text>
            </AnimatedView>

        )
    }


    const _alertMessageUi = () => {
        if (alertMessage) {
            return (
                <AnimatedView style={{ margin: overAllMargin, marginHorizontal: 10, }}>
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
                                style={{ position: 'absolute', right: 15, height: 80, bottom: Platform.OS === 'android' ? 2 : 1, borderRadius: 2 }}
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
                <AnimatedView style={[{ height: 80, marginHorizontal: 10, }]}>
                    <LottieView
                        source={require('../../assets/gifs/alertMsgs_Skeleton.json')}
                        hardwareAccelerationAndroid={true}
                        autoPlay
                        loop
                    />
                </AnimatedView>
            )

        }
    }

    const _categoryCardUi = () => {
        return (
            <AnimatedView style={[categoryStyles.categoriesCardPrimaryContainer,]}>
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

        )

    }


    return (
        <SafeAreaView style={categoryStyles.container}>
            {_greetingMessageUi()}
            {_alertMessageUi()}
            {_categoryCardUi()}
        </SafeAreaView >
    )
}



export default TextSectiion
const categoryStylesFunc = (colors, overAllMargin) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Whisper || "#F6F5FA",
    },
    greetingMainContainer: {
        margin: overAllMargin,
        backgroundColor: colors.Whisper || "#F6F5FA",
        paddingLeft: 5,
    },
    greetingHeaderText: {
        fontSize: 20, color: 'black'

    },
    greetingBodyText: {
        fontFamily: 'Poppins-Light', color: colors.DoveGray || '#6B6B6B', fontSize: 16, bottom: 6
    },
    alertMsgPrimaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 7,
        backgroundColor: colors.BlueChalk || '#EEE5FF',
    },
    alertMsgSecondaryContainer: {
        flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10
    },
    alertMsgHeaderText: {
        fontSize: 14,
        color: colors.BlueVoilet || "#6D51BB",

    },
    alertMsgBodyText: {
        fontSize: 10,
        width: '90%',
        color: colors.Bossanova || '#453463'
    },
    alertMsgSvgView: {
        flex: 0.5,
        flexDirection: 'column',
        alignItems: 'center',
    },
    categoriesCardPrimaryContainer: {
        flex: 0.8,
        margin: overAllMargin
    },
    categoriesCardTittleText: {
        fontSize: 16,
        color: colors.MineShaft || "#272727",
        paddingVertical: 8
    },
    categoriesCardItemContainer: {

    }





})