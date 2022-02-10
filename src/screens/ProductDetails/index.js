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
import TextInput from "../../components/atoms/TextInput";

export default () => {
    // const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    // const homeStyles = stylesheet.styles(colors);
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark")
    const ProductDetailsStyles = styleSheet.styles(colors)
    const sliderData = useSelector(state => state.promotionsReducer)
    let productName = "Melette Mcmuffin Meal"
    let productDetails = "Potato Bun, Cheddar Cheese, Beef, Cucumber, Red Onion, Iceberg Lettuce, Avocado, Tomato"
    let productPrice = "PKR - 500"
    let selectionTittle = "Choose addition"
    let selectionTittle2 = "Choose your drink"
    let requiredTittle = "Required"

    let initialState = {
        inputsArr: [
            { id: 1, field: "Email", title: 'Email address', },
            { id: 2, field: "FirstName", title: 'First name', },
            { id: 3, field: "LastName", title: 'Last name', },
            { id: 4, field: "Mobile", title: 'Mobile number', },
            { id: 4, field: "Mobile", title: 'Mobile number', },
            { id: 4, field: "Mobile", title: 'Mobile number', },

        ],
        'isSelected': false,

    }
    const [state, setState] = useState(initialState)
    const { inputsArr } = state


    const goBack = () => {
        NavigationService.NavigationActions.common_actions.goBack()
    }
    const onPressHandler = (val) => {
        console.log("onpress call=>>", val);
    }
    return (
        <SafeAreaView style={ProductDetailsStyles.container}>
            <ScrollView
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
                <AnimatedView style={{ marginHorizontal: 10, marginVertical: 15, }}>
                    <Text style={{ fontSize: 20, color: 'black' }} numberOfLines={1}>{productName}</Text>
                    <Text style={{ paddingVertical: 10, width: '100%', color: '#7D7D7D', fontSize: 13 }}>{productDetails}</Text>
                    <AnimatedView style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, color: '#7D7D7D', textAlign: 'center', }}>Price:</Text>
                        <Text style={{ fontSize: 15, left: 5, color: '#F94E41' }}
                            fontFamily='PoppinsRegular'
                        >{productPrice}</Text>
                    </AnimatedView>
                    <RadioButton
                        data={inputsArr}
                        onPressCb={(value) => { console.log("here", value); }}
                        selectionTittle={selectionTittle}
                        requiredTittle={requiredTittle}
                        // selectionCriteria={ }
                    />
                    <RadioButton
                        data={inputsArr}
                        onPressCb={(value) => { console.log("here", value); }}
                        selectionTittle={selectionTittle2}
                        requiredTittle={requiredTittle}

                    />
                    <Text>Please add your instructions</Text>
                    <AnimatedView style={{backgroundColor:'white', borderRadius:10}}>

                        <TextInput
                        containerStyle={{height:70, backgroundColor:'#0000002E', borderColor:'#0000002E', justifyContent:'flex-start',opacity:0.5, alignContent:'flex-start', alignSelf:'flex-start', alignItems:'flex-start'}}

                        />

                    </AnimatedView>

                </AnimatedView>


            </ScrollView>
            <Button
                onPress={() => { }}



            />

        </SafeAreaView>
    )

}