import React, { useState, useRef, useEffect } from "react";
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
import TouchableScale from "../../components/atoms/TouchableScale";
import GotoCartButton from "./components/GotoCart";
import lodash from 'lodash'; // 4.0.8
import LinearGradient from 'react-native-linear-gradient';
import { postRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import { sharedExceptionHandler } from "../../helpers/SharedActions";

const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
export default (props) => {
    // const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark")


    let tempArray = {
        "pitstopItemID": "1",
        "pitstopDealID": "233",
        "pitstopItemName": "Melette Mcmuffin Meal",
        "quantity": "1",
        "itemPrice": "PKR - 500",
        "images": "",
        "description": "Potato Bun, Cheddar Cheese, Beef, Cucumber, Red Onion, Iceberg Lettuce, Avocado, Tomato",
        "estimateTime": "",
        "gstPercentage": "",
        "gstAddedPrice": "",
        "optionsList": [
            {
                "mainTitle": "Choose addition",
                "quantity": "3",
                "isRequired": "true",
                "isMany": "",
                "isChoosed": "",
                "pitstopItemsOptionList": [
                    {
                        "itemOptionID": "1232",
                        "optionPrice": "20",
                        "dealOptionItemID": "12322",
                        "title": "Potato wedges"
                    }, {
                        "itemOptionID": "1232",
                        "optionPrice": "20",
                        "dealOptionItemID": "12322",
                        "title": "Potato wedges"
                    },
                    {
                        "itemOptionID": "1232",
                        "optionPrice": "20",
                        "dealOptionItemID": "12322",
                        "title": "Potato wedges"
                    }
                ]
            },
            {
                "mainTitle": "choose your drink",
                "quantity": "3",
                "isRequired": "true",
                "isMany": "",
                "isChoosed": "",
                "pitstopItemsOptionList": [
                    {
                        "itemOptionID": "1232",
                        "optionPrice": "25",
                        "dealOptionItemID": "12322",
                        "title": "Pepsi"
                    }, {
                        "itemOptionID": "1232",
                        "optionPrice": "27",
                        "dealOptionItemID": "12322",
                        "title": "Coke"
                    },
                    {
                        "itemOptionID": "12",
                        "optionPrice": "26",
                        "dealOptionItemID": "12322",
                        "title": "String"
                    }
                ]
            },

        ]
    }

    let initialState = {

        'generalProductOrDealDetail': [],
        'multipleSelectedItem': [],
        'singleSelectedItem': [],
        'notes': '',
        'itemCount': 1,
        selectedOptions: [],

    }
    const [state, setState] = useState(initialState)
    const { multipleSelectedItemArr, singleSelectedItemArr, multipleSelectedItem, singleSelectedItem, itemCount, generalProductOrDealDetail } = state
    const pitstopType = props.route.params.pitstopType ?? 4;
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOPS)[pitstopType]], Appearance.getColorScheme() === "dark");
    const productDetailsStyles = styleSheet.styles(colors)
    const propsProductDetails = props?.route?.params.propItem ?? {}
    const sliderData = useSelector(state => state.promotionsReducer)
    let productName = generalProductOrDealDetail.pitStopItemName || ""
    let productDetails = generalProductOrDealDetail.description || ""
    let productPrice = generalProductOrDealDetail.itemPrice || ""
    let optionsListArr = generalProductOrDealDetail.optionList ?? []
    let numberOfLines = 4
    let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null


    let tempararyArray = [{ ...singleSelectedItem }, { ...multipleSelectedItem }]


    const loadProductDetails = () => {
        postRequest(Endpoints.PRODUCT_DETAILS, {
            "pitstopProductID": 55278,
            "pitstopDealID": 0,
            "hardwareID": "string",
            "userID": "string"


        }, (res) => {
            // console.log('if GET_PRODUCTDETAIL  res', res);
            setState((pre) => ({
                ...pre,
                generalProductOrDealDetail: res.data.generalProductOrDealDetail

            }))


        }, err => {
            sharedExceptionHandler(err);
            console.log('GET_PRODUCTDETAIL err', err);


        }, {}, false);

    }
    const goBack = () => {
        NavigationService.NavigationActions.common_actions.goBack()
    }
    const temp = (item = { itemOptionID: 891312 }, isMany = true, parentIndex = 0) => {
        let list = [];
        if (isMany) {
            list = generalProductOrDealDetail.pitStopItemsOptionList.map((opt, j) => {
                if (opt.itemOptionID === item.itemOptionID) {
                    return { ...opt, isChoosed: true }
                }
                return { ...opt, isChoosed: opt.isChoosed };
            })
        }
        console.log("list", list);
        setState(pre => ({
            ...pre, generalProductOrDealDetail: {
                ...pre.generalProductOrDealDetail,
                pitstopItemsOptionList: list
            }
        }))
    }
    function getOccurrence(array, value) {
        var count = 0;
        array.forEach((v) => (v.parentIndex === value && count++));
        return count;
    }
    const onPressHandler = (item, isMany, parentIndex, quantity = null) => {
        console.log("isMany", isMany, quantity, getOccurrence(state.selectedOptions, parentIndex));
        const alreadyExist = state.selectedOptions.filter(op => op.itemOptionID === item.itemOptionID)[0];
        if (quantity && getOccurrence(state.selectedOptions, parentIndex) === quantity) {
            if (alreadyExist) {
                const newArr = state.selectedOptions.filter(x => x.itemOptionID !== item.itemOptionID);
                setState(pre => ({ ...pre, selectedOptions: newArr }));
            } else return;
        };
        if (!isMany && quantity === null && getOccurrence(state.selectedOptions, parentIndex) > 0) {
            const newArr = [...state.selectedOptions.filter(x => x.parentIndex !== parentIndex), { ...item, parentIndex }];
            console.log('newARr', newArr);
            setState(pre => ({ ...pre, selectedOptions: newArr }));
            return;
        }
        if (alreadyExist) {
            const newArr = state.selectedOptions.filter(x => x.itemOptionID !== item.itemOptionID);
            setState(pre => ({ ...pre, selectedOptions: newArr }));
        } else {
            setState(pre => ({ ...pre, selectedOptions: [...pre.selectedOptions, { ...item, parentIndex }] }));
        }


        // console.log("onPressHandler key=>>", key);
        // if (key === true) {
        //     console.log("muliple",);
        //     setState((pre) => ({ ...pre, multipleSelectedItem: item }))

        // }
        // else {
        //     console.log("single");
        //     setState(pre => ({ ...pre, singleSelectedItem: item, }))

        // }
        // let key = isMany ? "multipleSelectedItem" : "singleSelectedItem"
        // setState((pre) => ({ ...pre, [key]: item }))
    }


    const itemCountOnPress = (key) => {
        let updatedItemCount
        if (key === 'minus') {
            updatedItemCount = itemCount - 1
            if (updatedItemCount === 0) return
            setState((pre) => ({
                ...pre,
                itemCount: updatedItemCount

            }))
        }
        else {
            updatedItemCount = itemCount + 1
            setState((pre) => ({
                ...pre,
                itemCount: updatedItemCount

            }))

        }

    }


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

                    <TouchableScale
                        onPress={() => { itemCountOnPress("minus") }}
                    >
                        <VectorIcon
                            name="minus"
                            type="MaterialCommunityIcons"
                            size={25}
                            color={"black"}
                        />
                    </TouchableScale>
                    <TouchableScale>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, justifyContent: 'center', alignItems: 'center', color: 'black', paddingHorizontal: 16 }}>{itemCount}</Text>
                    </TouchableScale>
                    <TouchableScale
                        onPress={() => { itemCountOnPress("plus") }}
                    >
                        <VectorIcon
                            name="plus"
                            type="MaterialCommunityIcons"
                            size={25}
                            color={"black"}
                        />
                    </TouchableScale>
                </View>
                <View style={{ marginLeft: 9, }}>
                    <Button
                        onPress={() => temp()}
                        text={`Add to cart - ${productPrice}`}
                        textStyle={{ textAlign: 'center', fontSize: 16 }}
                        style={{ paddingHorizontal: 16, alignSelf: "center", paddingVertical: 10, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}
                    />
                </View>

            </AnimatedView>


        )

    }


    useEffect(() => {
        loadProductDetails()

    }, [])

    console.log("if state=>>", state);


    return (
        <SafeAreaView style={productDetailsStyles.mainContainer}>

            <ScrollView   >
                <CustomHeader
                    leftIconName={"chevron-back"}
                    onLeftIconPress={() => { goBack() }}
                    containerStyle={productDetailsStyles.customHeaderMainContainer}
                    hideFinalDestination={true}
                    leftContainerStyle={productDetailsStyles.customHeaderLeftRightContainer}
                    leftIconColor={productDetailsStyles.customHeaderLeftRightIconColor}
                    rightContainerStyle={productDetailsStyles.customHeaderLeftRightContainer}
                    rightIconColor={productDetailsStyles.customHeaderLeftRightIconColor}
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
                    paginationDotStyle={{ borderColor: 'red', backgroundColor: colors.primary, }}
                    uriKey="promoImg"
                    height={180}
                // width={400}
                />
                <LinearGradient
                    // colors={['blue', 'green', 'red', 'yellow']}
                    colors={['#F6F5FA00', '#F6F5FA00', '#F6F5FA', '#F6F5FA']}
                    // colors={['#F6F5FA00', '#F6F5FA', '#F6F5FA', '#F6F5FA']}

                    style={{ top: 150, width: '100%', height: 40, position: 'absolute', }}
                >
                </LinearGradient>
                <AnimatedView style={productDetailsStyles.primaryContainer}>
                    <Text style={productDetailsStyles.productNametxt} numberOfLines={1} fontFamily="PoppinsMedium">{productName}</Text>
                    <Text style={productDetailsStyles.productDescriptionTxt} fontFamily="PoppinsRegular">{productDetails}</Text>
                    <AnimatedView style={productDetailsStyles.productPriceContainer}>
                        <Text style={productDetailsStyles.productPricelabel} fontFamily="PoppinsRegular">Price:</Text>
                        <Text style={productDetailsStyles.productPricetxt}
                            fontFamily='PoppinsRegular'
                        >{` PKR - ${productPrice}`}</Text>
                    </AnimatedView>

                    <RadioButton
                        data={generalProductOrDealDetail.optionList}
                        onPressCb={onPressHandler}
                        // onPressCb={(item, isMany, parentIndex) => { onPressHandler(item, isMany, parentIndex) }}
                        selectedItem={singleSelectedItem}
                        productDetailsStyles={productDetailsStyles}
                        selectedOptions={state.selectedOptions}


                    />



                    {/* <RadioButton
                        data={tempArray}
                        // data={multipleSelectedItemArr}
                        // onPressCb={(value) => onPressHandler(value)}
                        onPressCb={(value, key) => { onPressHandler(value, "multipleSelectedItem") }}
                        selectionTittle={selectionTittle}
                        requiredTittle={requiredTittle}
                        isMultipleSelection={true}
                        selectedItem={multipleSelectedItem}
                        selectCOndition={2}
                        productDetailsStyles={productDetailsStyles}
                        isRequired={isRequired}

                    /> */}
                    {/* <RadioButton
                        data={singleSelectedItemArr}
                        // onPressCb={(value) => { setState(pre => ({ ...pre, singleSelectedItem: value, })) }}
                        onPressCb={(value, key) => { onPressHandler(value, "singleSelectedItem") }}
                        selectionTittle={selectionTittle2}
                        requiredTittle={requiredTittle}
                        isMultipleSelection={true}
                        selectedItem={singleSelectedItem}
                        selectCOndition={3}
                        productDetailsStyles={productDetailsStyles}
                        isRequired={isRequired}

                    /> */}


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
            {/* <GotoCartButton /> */}
        </SafeAreaView>
    )

}



