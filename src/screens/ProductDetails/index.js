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
import GV, { PITSTOP_TYPES } from "../../utils/GV";
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
import AnimatedLottieView from "lottie-react-native";
import Regex from "../../utils/Regex";


export default (props) => {
    // const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark"
    let initialState = {

        'generalProductOrDealDetail': [],
        'notes': '',
        'itemCount': 1,
        totalAddOnPrice: 0,
        selectedOptions: [],
        loading: true

    }
    const [state, setState] = useState(initialState)
    const { itemCount, generalProductOrDealDetail, selectedOptions, notes, totalAddOnPrice, loading } = state
    const pitstopType = props.route.params.pitstopType ?? 4;
    const propItem = props.route.params.propItem
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)[pitstopType]], Appearance.getColorScheme() === "dark");
    const productDetailsStyles = styleSheet.styles(colors)
    let productName = generalProductOrDealDetail.pitStopItemName || ""
    let productDetails = generalProductOrDealDetail.description || ""
    let productPrice = generalProductOrDealDetail.itemPrice || ""
    let optionsListArr = generalProductOrDealDetail.optionList ?? []
    let images = generalProductOrDealDetail.images ?? []
    let numberOfLines = 4
    let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null
    console.log("propItem", propItem);


    const loadProductDetails = () => {
        postRequest(Endpoints.PRODUCT_DETAILS, {
            "pitstopProductID": propItem?.pitStopItemID ?? 55278,
            "pitstopDealID": propItem?.pitstopDealID ?? 0,
            "pitstopType": pitstopType
        }, (res) => {
            console.log('if GET_PRODUCTDETAIL  res', res);
            setState((pre) => ({
                ...pre,
                generalProductOrDealDetail: res.data.generalProductOrDealDetail,
                loading: false

            }))


        }, err => {
            sharedExceptionHandler(err);
            console.log('GET_PRODUCTDETAIL err', err);
            setState((pre) => ({
                ...pre,
                loading: false

            }))


        }, {}, false);

    }
    const goBack = () => {
        NavigationService.NavigationActions.common_actions.goBack()
    }

    function getOccurrence(array, value) {
        var count = 0;
        array.forEach((v) => (v.parentIndex === value && count++));
        return count;
    }

    const onPressHandler = (item, isMany, parentIndex, quantity = null) => {
        const alreadyExist = state.selectedOptions.filter(op => op.itemOptionID === item.itemOptionID)[0];
        let updatedArr = [...state.selectedOptions];
        if (quantity && getOccurrence(state.selectedOptions, parentIndex) === quantity) {
            if (alreadyExist) {
                updatedArr = updatedArr.filter(x => x.itemOptionID !== item.itemOptionID);
            } else return;
        };
        if (!isMany && quantity === null && getOccurrence(state.selectedOptions, parentIndex) > 0) {
            updatedArr = [...updatedArr.filter(x => x.parentIndex !== parentIndex), { ...item, parentIndex }];
        } else if (alreadyExist) {
            updatedArr = updatedArr.filter(x => x.itemOptionID !== item.itemOptionID);
        } else {
            updatedArr.push({ ...item, parentIndex });
        }
        setState(pre => ({
            ...pre, selectedOptions: updatedArr, totalAddOnPrice: updatedArr.reduce((previousValue, currentValue) => { return parseInt(previousValue) + parseInt(currentValue.optionPrice) },
                0)
        }));
    }

    const addToCartHandler = () => {
        let dataToSend = {
            selectedOptions: selectedOptions,
            itemCount: itemCount,
            notes: notes,
            totalAddOnPrice: totalAddOnPrice,
        }
        // NavigationService.NavigationActions.common_actions.navigate({ dataToSend })


        setState((pre) => ({ ...pre, selectedOptions: [], totalAddOnPrice: 0, itemCount: 1, notes: "" }))
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
            <AnimatedView style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center', marginHorizontal: 12, height: 80 }}>
                <View style={{
                    flexDirection: 'row', alignSelf: 'center', backgroundColor: 'white', borderRadius: 30, alignItems: 'center', paddingHorizontal: Platform.OS === "android" ? 6 : 20, paddingVertical: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2, },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: '35%'
                }}>

                    <TouchableScale
                    wait={0}
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
                    wait={0}
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
                <View style={{
                    marginLeft: 9,
                    width: '65%'
                }}>
                    <Button
                        onPress={() => addToCartHandler()}
                        text={`Add to cart ${productPrice ? '- ' + (parseInt(productPrice) + parseInt(state.totalAddOnPrice)) : ''}`}
                        textStyle={{ textAlign: 'center', fontSize: 16 }}
                        style={{ paddingHorizontal: 16, alignSelf: "center", paddingVertical: 10, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}
                    />
                </View>

            </AnimatedView>


        )

    }
    const renderLoader = () => {
        return <View style={{ flex: 1 }}>
            <AnimatedLottieView
                autoSize={true}
                resizeMode={'contain'}
                style={{ width: '100%' }}
                source={require('../../assets/gifs/ProductDetailsLoading.json')}
                autoPlay
                loop
            />
        </View>
    }
    useEffect(() => {
        loadProductDetails()

    }, [])
    return (
        <View style={{ flex: 1 }} >
            {

                loading ? renderLoader() :
                    <SafeAreaView style={productDetailsStyles.mainContainer}>
                        <CustomHeader
                            leftIconName={"chevron-back"}
                            onLeftIconPress={() => { goBack() }}
                            containerStyle={[productDetailsStyles.customHeaderMainContainer,]}
                            hideFinalDestination={true}
                            leftContainerStyle={productDetailsStyles.customHeaderLeftRightContainer}
                            leftIconColor={productDetailsStyles.customHeaderLeftRightIconColor}
                            rightContainerStyle={productDetailsStyles.customHeaderLeftRightContainer}
                            rightIconColor={productDetailsStyles.customHeaderLeftRightIconColor}
                        />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View>
                                <ImageCarousel
                                    data={images}
                                    containerStyle={{
                                        borderRadius: 0,
                                        borderBottomWidth: 0,
                                        marginVertcal: 4,
                                        marginHorizontal: 0,
                                    }}
                                    imageStyle={{ borderRadius: 0 }}
                                    paginationDotStyle={{ borderColor: 'red', backgroundColor: colors.primary, }}
                                    uriKey="joviImage"
                                    height={180}
                                />
                            </View>
                            <LinearGradient
                                colors={['#F6F5FA00', '#F6F5FA00', '#F6F5FA', '#F6F5FA']}
                                style={{ top: 150, width: '100%', height: 40, position: 'absolute', }}
                            >
                            </LinearGradient>
                            <AnimatedView style={[productDetailsStyles.primaryContainer]}>
                                <Text style={productDetailsStyles.productNametxt} numberOfLines={1} fontFamily="PoppinsMedium">{productName}</Text>
                                {productDetails ? <Text style={productDetailsStyles.productDescriptionTxt} fontFamily="PoppinsRegular">{productDetails}</Text> : null}
                                <AnimatedView style={productDetailsStyles.productPriceContainer}>
                                    <Text style={productDetailsStyles.productPricelabel} fontFamily="PoppinsRegular">Price:</Text>
                                    <Text style={productDetailsStyles.productPricetxt}
                                        fontFamily='PoppinsRegular'
                                    >{` PKR - ${productPrice}`}</Text>
                                </AnimatedView>
                                <RadioButton
                                    data={optionsListArr}
                                    onPressCb={onPressHandler}
                                    productDetailsStyles={productDetailsStyles}
                                    selectedOptions={state.selectedOptions}

                                />

                                <TextInput
                                    containerStyle={{ backgroundColor: 'white', marginVertical: 30, margin: 0, }}
                                    placeholder="Types your notes"
                                    titleStyle={{ color: 'black', fontSize: 14, }}
                                    title="Please add your instructions"
                                    textAlignVertical='top'
                                    style={{ textAlign: "left", backgroundColor: '#0000002E', borderColor: '#0000002E', opacity: 0.3, margin: 10, borderRadius: 10, minHeight: minHeight, }}
                                    placeholder="Types your notes"
                                    onChangeText={(text) => {
                                        if (Regex.Space_Regex.test(text)) return
                                        setState((pre) => ({ ...pre, notes: text }))
                                    }}
                                    multiline={true} // ios fix for centering it at the top-left corner 
                                    numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
                                />
                            </AnimatedView>
                        </ScrollView>
                        {renderButtonsUi()}
                    </SafeAreaView>
            }
        </View>

    )

}



