import React, { useState, useRef } from "react";
import AnimatedView from "../../components/atoms/AnimatedView";
import Text from "../../components/atoms/Text";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Image from "../../components/atoms/Image";
import images from "../../assets/images";
import theme from "../../res/theme";
import GV from "../../utils/GV";
import { Appearance } from "react-native";
import FontFamily from "../../res/FontFamily";
import AnimatedTab from "../../components/molecules/AnimatedTab/AnimatedTab";
import Svg, { SvgXml } from "react-native-svg";
import CategoryCardItem from "../../components/molecules/CategoryCardItem";
import svgs from "../../assets/svgs";
import ENUMS from "../../utils/ENUMS";

const TextSectiion = () => {

    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    // const styles = sampleStyles.styles(colors);
    let tempArray =
    {
        greetingText: "Good afternoon,",
        userName: "Alam",
        joviDescription: " Hanji…? Kya chaiye? roti, jovi ya dukaan?",
        cartPrimaryText: "Book an order with JOVI today",
        cartSecondaryText: "Complete the challenges and earn different rewards",
        catSvg: svgs.otp()

    }

    const categoriesList = ENUMS.PITSTOP_TYPES.filter((x, i) => {
        console.log("x==>", x)
        return x.isActive === true
    })
    console.log("categories=>", categoriesList);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F5FA' || colors.primary, }}>

            <AnimatedView style={{ margin: 5, backgroundColor: colors.Whisper || "#F6F5FA",paddingLeft:5}}>
                <Text style={{ fontSize: 20, color: 'black' ,}}>{tempArray.greetingText}
                    <Text style={{ color: colors.BlueVoilet || "#6D51BB",  }}>
                        {tempArray.userName}
                    </Text>
                </Text>
                <Text style={{ fontFamily: 'Poppins-Light', color: '#6B6B6B', fontSize: 16,bottom:9 }}>
                    {tempArray.joviDescription}
                </Text>
            </AnimatedView>

            <AnimatedView style={{ margin: 5 }}>
                <AnimatedView style={{ flexDirection: 'row', justifyContent: 'space-between', borderRadius:7, backgroundColor: '#EEE5FF', }}>
                    <AnimatedView style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', paddingLeft: 8 }}>
                        <Text style={{ fontSize: 14, color: colors.BlueVoilet || "#6D51BB" }}>{tempArray.cartPrimaryText}</Text>
                        <Text style={{ fontSize: 11, width: '90%' ,color:'#453463'}}>{tempArray.cartSecondaryText}</Text>
                    </AnimatedView>
                    <AnimatedView style={{ flexDirection: 'column', alignItems: 'center', flex: 0.6 }}>
                        {/* <Image source={images.otp()} resizeMode="cover" style={{ height: 100, width: 90, }} /> */}
                        <SvgXml
                            xml={tempArray.catSvg}
                            height={70}
                            width={80}
                        />
                    </AnimatedView>
                </AnimatedView>
            </AnimatedView>

            <AnimatedView style={{ flex: 1, top: 20, }}>
                <Text>Categories</Text>


                <AnimatedView style={{ flex: 1, flexDirection: 'row' }}>
                    {categoriesList.map((x, i) => {
                        return <CategoryCardItem
                            xml={tempArray.catSvg}
                            title={x.text}
                            containerStyle={{backgroundColor:'red',justifyContent:'center' }}
                            height={150}
                            width={110}
                            // width={}
                            imageContainerStyle={{height:80,width:80, justifyContent:'center',alignContent:'center',alignItems:'center', alignSelf:'center'}}

                        />
                    })
                    }
                </AnimatedView>





            </AnimatedView>



        </SafeAreaView>
    )
}



export default TextSectiion