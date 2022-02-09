import React, { useState, useRef } from "react";
import { Appearance, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AnimatedView from "../../components/atoms/AnimatedView";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Text from "../../components/atoms/Text";
import Button from "../../components/molecules/Button";
import CustomHeader from "../../components/molecules/CustomHeader";
import ImageCarousel from "../../components/molecules/ImageCarousel";
import NavigationService from "../../navigations/NavigationService";
import theme from "../../res/theme";
import GV from "../../utils/GV";
import styleSheet from "./style"
import RadioButton from "./components/RadioButton";

export default () => {
    // const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    // const homeStyles = stylesheet.styles(colors);
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark")
    const ProductDetailsStyles = styleSheet.styles(colors)
    const sliderData = useSelector(state => state.promotionsReducer)
    console.log("sliderData=>>", sliderData);
    let productName = "Melette Mcmuffin Meal"
    let productDetails = "Potato Bun, Cheddar Cheese, Beef, Cucumber, Red Onion, Iceberg Lettuce, Avocado, Tomato"
    let productPrice = "PKR - 500"
    let selectionTittle = "Choose addition"
    // let selectionTittle = "Choose addition"

    


    const goBack = () => {
        NavigationService.NavigationActions.common_actions.goBack()
    }
    return (
        <SafeAreaView style={ProductDetailsStyles.container}>
            <ScrollView style={{}}
                contentContainerStyle={{ flex: 1 }}
            >
                <CustomHeader
                    leftIconName={"arrow-back"}
                    onLeftIconPress={() => { goBack() }}
                    containerStyle={ProductDetailsStyles.customHeaderMainContainer}
                    hideFinalDestination={true}
                    leftContainerStyle={ProductDetailsStyles.customHeaderLeftRightContainer}
                    leftIconColor={ProductDetailsStyles.customHeaderLeftRightIconColor}
                    rightContainerStyle={ProductDetailsStyles.customHeaderLeftRightContainer}
                    rightIconColor={ProductDetailsStyles.customHeaderLeftRightIconColor}

                />
                <ImageCarousel
                    data={sliderData?.dashboardContentListViewModel?.dashboardPromoListVM}
                    containerStyle={{
                        borderRadius: 0,
                        borderBottomWidth: 0,
                        marginVertical: 4,
                        marginHorizontal: 0

                    }}
                    imageStyle={{ borderRadius: 0 }}
                    paginationDotStyle={{ borderColor: 'red', backgroundColor: 'red' }}
                    uriKey="promoImg"
                    height={180}
                    width={400}

                />
                <AnimatedView style={{ flex: 1, marginHorizontal: 10, marginVertical: 15,  }}>
                    <Text style={{ fontSize: 20, color: 'black' }} numberOfLines={1}>{productName}</Text>
                    <Text style={{ paddingVertical: 10, width: '100%', color:'#7D7D7D',fontSize:13}}>{productDetails}</Text>
                    <AnimatedView style={{ flexDirection: 'row' ,justifyContent:'flex-start', alignItems:'center' }}>
                        <Text style={{fontSize:15,color:'#7D7D7D', textAlign:'center', }}>Price:</Text>
                        <Text style={{ fontSize:15,left: 5 ,  color:'#F94E41'}}
                        fontFamily='PoppinsRegular'
                        >{productPrice}</Text>
                        {/* <Text>Price: PKR - 500</Text> */}
                    </AnimatedView>
                    {/* <Text style={{fontSize:14 ,color:'#F94E41'}}>Choose addition</Text>
                    <Text>Required</Text> */}

                    <RadioButton />
                </AnimatedView>


            </ScrollView>
            <Button
                onPress={() => { }}
            />

        </SafeAreaView>
    )

}