import React, { useState, useRef, useEffect } from "react";
import AnimatedView from "../../components/atoms/AnimatedView";
import Text from "../../components/atoms/Text";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Image from "../../components/atoms/Image";
import images from "../../assets/images";
import theme from "../../res/theme";
import GV from "../../utils/GV";
import { Alert, Appearance, Platform, StyleSheet } from "react-native";
import FontFamily from "../../res/FontFamily";
import AnimatedTab from "../../components/molecules/AnimatedTab/AnimatedTab";
import Svg, { SvgXml } from "react-native-svg";
import CategoryCardItem from "../../components/molecules/CategoryCardItem";
import svgs from "../../assets/svgs";
import ENUMS from "../../utils/ENUMS";
import AnimatedFlatlist from "../../components/molecules/AnimatedScrolls/AnimatedFlatlist";
import constants from "../../res/constants";
import { useSelector } from "react-redux";

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
    console.log("Message Reducer=>", messagesReducer);
    let firstMessage, secondMessage, tag, caption;
    if (Object.keys(messagesReducer).length) {
        const { homeScreenDataViewModel: { greetingsList, alertMsgList } } = messagesReducer;
        firstMessage = greetingsList?.[2] ?? null // would be dynamic in future
        secondMessage = alertMsgList?.[0] ?? null
        let totalStr = String(firstMessage.header).split("<<")
        console.log("totalStr", totalStr);
        caption = totalStr[0];
        tag = totalStr[totalStr.length - 1].replace(">>", "");

        // temp = String(firstMessage.header).split(">>");
        // console.log("temp", String(temp).replace(">>", "").split(","));
        console.log("tag", tag);
    }
    const CONTAINER_WIDTH = ((constants.SCREEN_DIMENSIONS.width) * 0.22);
    const CONTAINER_HEIGHT = constants.SCREEN_DIMENSIONS.width * 0.3;
    const overAllMargin = 10;
    const categoriesList = ENUMS.PITSTOP_TYPES.filter((x, i) => { return x.isActive === true })
    const catSvg = svgs.cat()
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const categoryStyles = categoryStylesFunc(colors, overAllMargin);

    const cartOnPressHandler = () => { alert("HY") }


    return (
        <SafeAreaView style={categoryStyles.container}>

            {firstMessage &&
                <AnimatedView style={[categoryStyles.greetingMainContainer,]} >
                    <Text style={[categoryStyles.greetingHeaderText]} numberOfLines={2} >
                        {`${caption} Good Afternoon `}
                        <Text style={{ color: colors.BlueVoilet || "#6D51BB", alignSelf: 'center', fontSize: 20 }} numberOfLines={1} >
                            {` ${userReducer[tag]}`}
                        </Text>
                    </Text>
                    <Text style={categoryStyles.greetingBodyText} numberOfLines={2}>
                        {`${firstMessage.body}`}
                    </Text>
                </AnimatedView>

            }

            {secondMessage &&

                <AnimatedView style={{ margin: overAllMargin, }}>
                    <AnimatedView style={categoryStyles.alertMsgPrimaryContainer}>
                        <AnimatedView style={categoryStyles.alertMsgSecondaryContainer}>
                            <Text style={categoryStyles.alertMsgHeaderText} numberOfLines={2}>
                                {`${secondMessage.header}`}
                            </Text>
                            <Text style={categoryStyles.alertMsgBodyText} numberOfLines={2}>
                                {`${secondMessage.body}`}
                            </Text>
                        </AnimatedView>
                        <AnimatedView style={categoryStyles.alertMsgSvgView}>
                            <SvgXml xml={catSvg}
                                height={Platform.OS === 'android' ? 155 : 70}
                                width={90}
                                style={{ position: 'absolute', right: 15, bottom: Platform.OS === 'android' ? -36 : 5, borderRadius: 2 }} />
                        </AnimatedView>
                    </AnimatedView>
                </AnimatedView>

            }


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
        </SafeAreaView>
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