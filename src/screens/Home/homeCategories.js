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
import { getRequest, postRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";

const TextSectiion = () => {
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    // const styles = sampleStyles.styles(colors);
    const _categoriesCartWidth = ((constants.SCREEN_DIMENSIONS.width - 40) / 4)
    const overAllMargin = 10;
    const categoryStyles = categoryStylesFunc(colors, overAllMargin);

    let tempArray =
    {
        greetingText: "Good afternoon,",
        userName: "Alam",
        joviDescription: " Hanji…? Kya chaiye? roti, jovi ya dukaan?",
        cartPrimaryText: "Book an order with JOVI today",
        cartSecondaryText: "Complete the challenges and earn different rewards",
        catSvg: svgs.otp()
    }
    let initialState = {
        greetingList: [
            {
                "header": ""
            },
        ]


    }
    const [state, setState] = useState(initialState)
    const categoriesList = ENUMS.PITSTOP_TYPES.filter((x, i) => { return x.isActive === true })
    const screenEnum_Value = ENUMS || 0





    const cartOnPressHandler = () => {
        alert("HY");
    }
    const _getMenu = () => {
        const payload = {
            "mascotScreenEnum": screenEnum_Value,
            "getPersonalizeMsgs": true,
        };
        postRequest(
            Endpoints.HOME_SCREEN_MENU,
            payload,
            res => {
                console.log("res=>>", res);
                const { statusCode, message } = res.data;

            },
            err => {
                console.log("error==>", err);
            },
            {})
    }
    useEffect(() => {
        _getMenu()
        return () => {

        }
    }, []);


    return (
        <SafeAreaView style={categoryStyles.container}        >

            <AnimatedView style={categoryStyles.greetingMainContainer} >
                <Text style={categoryStyles.greetingHeaderText}>{tempArray.greetingText}
                    <Text style={{ color: colors.BlueVoilet || "#6D51BB" }}>
                        {` ${tempArray.userName}`}
                    </Text>
                </Text>
                <Text style={categoryStyles.greetingBodyText}>
                    {tempArray.joviDescription}
                </Text>
            </AnimatedView>

            <AnimatedView style={{ margin: overAllMargin, }}>
                <AnimatedView style={categoryStyles.alertMsgPrimaryContainer}>
                    <AnimatedView style={categoryStyles.alertMsgSecondaryContainer}>
                        <Text style={categoryStyles.alertMsgHeaderText}>{tempArray.cartPrimaryText}</Text>
                        <Text style={categoryStyles.alertMsgBodyText}>{tempArray.cartSecondaryText}</Text>
                    </AnimatedView>
                    <AnimatedView style={categoryStyles.alertMsgSvgView}>
                        <SvgXml xml={tempArray.catSvg}
                            height={Platform.OS === 'android' ? 155 : 153}
                            width={90}
                            style={{ position: 'absolute', right: 15, bottom: Platform.OS === 'android' ? -36 : -30, borderRadius: 2 }} />
                    </AnimatedView>
                </AnimatedView>
            </AnimatedView>

            <AnimatedView style={categoryStyles.categoriesCardPrimaryContainer}>
                <Text style={categoryStyles.categoriesCardTittleText}>Categories</Text>
                <AnimatedView style={{ flexDirection: 'row', }}>
                    {categoriesList.map((x, i) => {
                        return <CategoryCardItem
                            key={`category card item${i}`}
                            xml={tempArray.catSvg}
                            title={x.text}
                            containerStyle={{ marginLeft: i === 0 ? 0 : 8, justifyContent: 'center', borderRadius: 10 }}
                            height={120}
                            width={_categoriesCartWidth}
                            textStyle={{ fontSize: 14 }}
                            imageContainerStyle={{ height: 80, width: 80, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}
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
        flexDirection: 'row', justifyContent: 'space-between', borderRadius: 7, backgroundColor: colors.BlueChalk || '#EEE5FF',

    },
    alertMsgSecondaryContainer: {
        flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10

    },
    alertMsgHeaderText: {
        fontSize: 14, color: colors.BlueVoilet || "#6D51BB"
    },
    alertMsgBodyText: {
        fontSize: 10, width: '90%', color: colors.Bossanova || '#453463'
    },
    alertMsgSvgView: {
        flex: 0.6, flexDirection: 'column', alignItems: 'center',
    },
    categoriesCardPrimaryContainer: {
        flex: 1, top: 20, margin: overAllMargin
    },
    categoriesCardTittleText: {
        fontSize: 16, color: colors.MineShaft || "#272727", paddingVertical: 8
    },
    categoriesCardItemContainer: {

    }





})