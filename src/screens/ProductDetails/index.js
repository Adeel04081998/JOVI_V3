import React, { useState, useRef } from "react";
import { Alert, Appearance, Platform, ScrollView, StyleSheet, TouchableOpacity, } from "react-native";
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
import View from "../../components/atoms/View";
import VectorIcon from "../../components/atoms/VectorIcon";

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
        multipleSelectedItemArr: [
            { id: 1, title: 'Potato wedges', },
            { id: 2, title: 'Corn on the cob', },
            { id: 3, title: 'Potato wedges', },
            { id: 4, title: 'Corn on the cob', },
        ],
        singleSelectedItemArr: [
            { id: 1, title: 'Pepsi', },
            { id: 2, title: 'Coke', },
            { id: 3, title: 'String', },

        ],
        'multipleSelectedItem': [],
        'singleSelectedItem': [],
        'notes': ''

    }
    const [state, setState] = useState(initialState)
    const { multipleSelectedItemArr, singleSelectedItemArr, multipleSelectedItem, singleSelectedItem } = state
    let numberOfLines = 4
    let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null



    const goBack = () => {
        NavigationService.NavigationActions.common_actions.goBack()
    }
    const onPressHandler = (item, key) => {
        console.log("onPressHandler item>>", item);
        console.log("onPressHandler key=>>", key);
        // const sI=state.selectedItem;
        // const isExist=sI.findIndex(i=>i.id===item.id);
        // console.log('isExist ',isExist);
        // if(isExist===-1){
        //     sI.push(item); // adding item
        // }else{
        //     sI.splice(isExist,1); // deleting same item from
        // }
        if (key === true) {
            console.log("muliple",);
            setState((pre) => ({ ...pre, multipleSelectedItem: item }))

        }
        else {
            console.log("single");
            setState(pre => ({ ...pre, singleSelectedItem: item, }))

        }
        // setState((pre) => ({
        //     ...pre,
        //     multipleSelectedItem: item

        // }))


    }
    const onPressForAll = (value, key) => {
        console.log("value=>>", value);
        console.log("key=>>", key);
    }
    console.log("state=>>", state);

    const renderButtonsUi = () => {
        return (
            <AnimatedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 12, height: 80 }}>
                <View style={{
                    flexDirection: 'row', alignSelf: 'center', backgroundColor: 'white', borderRadius: 30, alignItems: 'center', paddingHorizontal: 6, paddingVertical: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2, },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>
                    <VectorIcon
                        name="minus"
                        type="MaterialCommunityIcons"
                        size={25}
                        onPress={() => { Alert.alert("hy minu") }}
                        color={"black"}
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, justifyContent: 'center', alignItems: 'center', color: 'black', paddingHorizontal: 16 }}>1</Text>
                    <VectorIcon
                        name="plus"
                        type="MaterialCommunityIcons"
                        size={25}
                        onPress={() => { Alert.alert("hy add") }}
                        color={"black"}
                    />

                </View>
                <View style={{ marginLeft: 9, }}>
                    <Button
                        onPress={() => { }}
                        text={`Add to cart - ${productPrice}`}
                        textStyle={{ textAlign: 'center', fontSize: 16 }}
                        style={{ paddingHorizontal: 16, alignSelf: "center", paddingVertical: 10, borderRadius: 10, backgroundColor: '#F94E41', justifyContent: 'center', alignItems: 'center' }}
                    />
                </View>

            </AnimatedView>


        )

    }


    return (
        <SafeAreaView style={ProductDetailsStyles.container}>
            <ScrollView   >
                <CustomHeader
                    leftIconName={"chevron-back"}
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
                        data={multipleSelectedItemArr}
                        // onPressCb={(value) => onPressHandler(value)}
                        onPressCb={(value, key) => { onPressHandler(value, key) }}
                        selectionTittle={selectionTittle}
                        requiredTittle={requiredTittle}
                        isMultipleSelection={true}
                        selectedItem={multipleSelectedItem}

                    />
                    <RadioButton
                        data={singleSelectedItemArr}
                        // onPressCb={(value) => { setState(pre => ({ ...pre, singleSelectedItem: value, })) }}
                        onPressCb={(value, key) => { onPressHandler(value, key) }}
                        selectionTittle={selectionTittle2}
                        requiredTittle={requiredTittle}
                        isMultipleSelection={false}
                        selectedItem={singleSelectedItem}
                    />
                    {/* <Text>Please add your instructions</Text>
                    <AnimatedView style={{ backgroundColor: 'white', borderRadius: 10 }}>
                        <TextInput
                            containerStyle={{ backgroundColor: '#0000002E', borderColor: '#0000002E', opacity: 0.5, width: '90%', }}
                            textAlignVertical="top"
                            style={{ textAlign: "left", }}
                            placeholder="Types your notes"
                            onChangeText={(text) => { setState((pre) => ({ ...pre, notes: text })) }}

                            multiline={true} // ios fix for centering it at the top-left corner 
                            numberOfLines={10}
                        />
                    </AnimatedView> */}
                    {/* numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
  minHeight={(Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null} */}

                    <TextInput
                        containerStyle={{ backgroundColor: 'white', marginVertical: 30, margin: 0, }}
                        placeholder="Types your notes"
                        titleStyle={{ color: 'black', fontSize: 14, }}
                        title="Please add your instructions"
                        textAlignVertical='top'
                        style={{ textAlign: "left", backgroundColor: '#0000002E', borderColor: '#0000002E', opacity: 0.5, margin: 10, borderRadius: 10, minHeight: minHeight }}
                        placeholder="Types your notes"
                        onChangeText={(text) => { setState((pre) => ({ ...pre, notes: text })) }}
                        multiline={true} // ios fix for centering it at the top-left corner 
                        numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
                    />
                </AnimatedView>

            </ScrollView>
            {renderButtonsUi()}
        </SafeAreaView>
    )

}