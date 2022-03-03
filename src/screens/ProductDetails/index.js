import lodash from 'lodash'; // 4.0.8
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Animated, Appearance, Easing, Platform, ScrollView, TextInput as RNTextInput } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import AnimatedView from "../../components/atoms/AnimatedView";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import Text from "../../components/atoms/Text";
import TextInput from "../../components/atoms/TextInput";
import TouchableScale from "../../components/atoms/TouchableScale";
import VectorIcon from "../../components/atoms/VectorIcon";
import View from "../../components/atoms/View";
import Button from "../../components/molecules/Button";
import CustomHeader from "../../components/molecules/CustomHeader";
import ImageCarousel from "../../components/molecules/ImageCarousel";
import { renderPrice, sharedAddToCartKeys, sharedAddUpdatePitstop, sharedExceptionHandler } from "../../helpers/SharedActions";
import { postRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import NavigationService from "../../navigations/NavigationService";
import theme from "../../res/theme";
import GV, { PITSTOP_TYPES } from "../../utils/GV";
import Regex from "../../utils/Regex";
import RadioButton from "./components/RadioButton";
import styleSheet from "./style";
import Image from '../../components/atoms/Image';
import deviceInfoModule from 'react-native-device-info';
import { KeyboardAwareScrollView } from '../../../libs/react-native-keyboard-aware-scroll-view';



export default (props) => {
    console.log("props product Details=>>", props);
    // const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark"
    let initialState = {

        'generalProductOrDealDetail': {},
        'notes': '',
        'itemCount': 1,
        discountedPriceWithGst: 0,
        totalPriceWithoutDiscount: 0,
        totalAddOnPrice: 0,
        totalDiscount: 0,
        totalGst: 0,
        selectedOptions: [],
        loading: true,
        addToCardAnimation: false
    }
    const [state, setState] = useState(initialState);
    const [enable, setEnable] = useState({
        enableBtn: false,
        requiredIds: [],
    });
    const { itemCount, generalProductOrDealDetail, discountedPriceWithGst, selectedOptions, notes, totalAddOnPrice, loading, addToCardAnimation } = state;
    const { data } = props;
    const pitstopType = props.route.params?.pitstopType ?? 4;
    const propItem = props.route.params?.propItem ?? {};
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)[pitstopType]], Appearance.getColorScheme() === "dark");
    const productDetailsStyles = styleSheet.styles(colors)
    let productName = generalProductOrDealDetail.pitStopItemName || ""
    let productDetails = generalProductOrDealDetail.description || ""
    let gstAddedPrice = generalProductOrDealDetail.gstAddedPrice || ""
    let productPrice = generalProductOrDealDetail.discountedPrice || gstAddedPrice || ""
    let discountedPrice = generalProductOrDealDetail.discountedPrice || ""
    let optionsListArr = generalProductOrDealDetail.optionList ?? []
    let images = generalProductOrDealDetail.images ?? []
    let numberOfLines = 4
    let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null
    // console.log("propItem", propItem);
    const discountTypeCallbacks = {
        1: (amount, discount) => discount > 0 ? (amount - ((discount / 100) * amount)) : amount,
        2: (amount, discount) => discount > 0 ? (amount - discount) : amount,
    };



    const loadProductDetails = () => {

        postRequest(Endpoints.PRODUCT_DETAILS, {
            "pitstopProductID": propItem?.pitStopItemID,
            "pitstopDealID": propItem?.pitStopDealID,
            "pitstopType": pitstopType
        }, (res) => {
            console.log('if GET_PRODUCTDETAIL  res', res);
            setState((pre) => ({
                ...pre,
                generalProductOrDealDetail: {
                    ...res.data.generalProductOrDealDetail,
                    // gstAmount: 40,
                    // discountAmount: 20,
                    // gstPercentage: 10,
                    // gstAddedPrice: res.data.generalProductOrDealDetail.gstAddedPrice + 40
                },
                loading: false

            }));
            setEnable(pre => ({
                ...pre,
                enableBtn: (res.data.generalProductOrDealDetail.optionList ?? []).length < 1,
                requiredIds: (res.data.generalProductOrDealDetail?.optionList ?? []).filter(item => item.isRequired === true).map((_, i) => (i))
            }));


        }, err => {
            sharedExceptionHandler(err);
            console.log('GET_PRODUCTDETAIL err', err);
            setState((pre) => ({ ...pre, loading: false }))


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
    const enableDisable = (updatedArr = []) => {
        updatedArr = [...new Set(updatedArr.map(item => { return item.parentIndex }))];
        let enableBtn = enable.enableBtn;
        const updatedArrSorted = updatedArr.slice().sort();
        enableBtn = enable.requiredIds.slice().sort().every(function (value, index) {
            return value === updatedArrSorted[index];
        });
        setEnable(pre => ({ ...pre, enableBtn: enableBtn }));
    }

    const onPressHandler = (item, isMany, parentIndex, quantity = null) => {
        // console.log([1,2,3].)
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
        enableDisable(updatedArr);
        const totalAddOnPrice = updatedArr.reduce((previousValue, currentValue) => { return parseInt(previousValue) + parseInt(currentValue.optionPrice) }, 0);
        const discountAmount = generalProductOrDealDetail.discountAmount;
        let totalAmountWithoutGst = totalAddOnPrice + generalProductOrDealDetail.itemPrice;
        let totalDiscount = discountAmount > 0 ? totalAmountWithoutGst * (discountAmount / 100) : 0;
        let discountedPriceWithoutGst = discountTypeCallbacks[1](totalAmountWithoutGst, discountAmount);
        const totalGst = ((generalProductOrDealDetail.gstPercentage / 100) * totalAmountWithoutGst);
        let discountedPriceWithGst = discountedPriceWithoutGst + totalGst;
        const totalPriceWithoutDiscount = discountedPriceWithGst + totalDiscount;
        // console.log('discountedPrice', totalAmountWithoutGst, discountedPriceWithoutGst, (totalAddOnPrice + generalProductOrDealDetail.itemPrice) * 0.2, (totalAddOnPrice + generalProductOrDealDetail.itemPrice) - ((20 / 100) * (totalAddOnPrice + generalProductOrDealDetail.itemPrice)));
        console.log('Item', generalProductOrDealDetail);
        setState(pre => ({
            ...pre, selectedOptions: updatedArr, totalAddOnPrice: totalAddOnPrice,
            discountedPriceWithoutGst,
            discountedPriceWithGst,
            totalPriceWithoutDiscount,
            totalDiscount,
            totalGst,
            generalProductOrDealDetail: {
                ...pre.generalProductOrDealDetail,
                // gstAddedPrice: discountedPrice,
                // discountedPrice: pre.generalProductOrDealDetail.discountAmount > 0 ? discountedPrice : pre.generalProductOrDealDetail.discountedPrice
            }
        }));
    }

    const addToCartHandler = () => {
        let dataToSend = {
            pitstopType,
            itemDetails: {
                ...generalProductOrDealDetail,
                selectedOptions,
                quantity: itemCount,
                notes,
                gstAddedPrice: state.discountedPriceWithGst,
                _itemPriceWithoutDiscount: state.totalPriceWithoutDiscount,
                _itemPrice: state.discountedPriceWithGst,
                _totalGst: state.totalGst,
                _totalDiscount: state.totalDiscount,
                totalAddOnPrice,
                actionKey: propItem.pitStopItemID ? "pitStopItemID" : "pitStopDealID",
                estimatePrepTime: pitstopType === PITSTOP_TYPES.RESTAURANT ? generalProductOrDealDetail.estimateTime : "",
                ...pitstopType === PITSTOP_TYPES.SUPER_MARKET ? { ...sharedAddToCartKeys(null, state.generalProductOrDealDetail).item } : {},

            },
            vendorDetails: { ...propItem.vendorDetails, pitstopType, pitstopActionKey: "marketID" },
        }
        setState((pre) => ({
            ...pre,
            selectedOptions: [],
            totalAddOnPrice: 0,
            itemCount: 1,
            addToCardAnimation: true,
            notes: "",
            discountedPriceWithGst: 0,
            totalPriceWithoutDiscount: 0,
            totalAddOnPrice: 0,
            totalDiscount: 0,
            totalGst: 0,
        }));
        sharedAddUpdatePitstop(dataToSend, false, [], true)

        // NavigationService.NavigationActions.common_actions.navigate({ dataToSend })

        setEnable(pre => ({
            ...pre,
            enableBtn: optionsListArr.length < 1,
            requiredIds: [],
        }));
    }
    // console.log("[generalProductOrDealDetail]", state.generalProductOrDealDetail)


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
                <View style={{ marginLeft: 9, width: '65%' }}>
                    <Button
                        disabled={!enable.enableBtn}
                        onPress={() => addToCartHandler()}
                        text={`Add to cart${optionsListArr.length > 0 ? ' - ' + discountedPriceWithGst : ''}`}
                        // text={`Add to cart ${productPrice ? '- ' + (parseInt(productPrice) + parseInt(state.totalAddOnPrice)) : ''}`}
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
    const RenderPutItemInCartBox = ({ addToCardAnimation }) => {
        const animateAddToCart = React.useRef(new Animated.Value(0)).current;
        const animateLoader = (toValue = 1) => {
            Animated.timing(animateAddToCart, {
                toValue: toValue,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.ease,
            }).start(finished => {
                if (finished && toValue === 0) {
                    setState(pre => ({ ...pre, addToCardAnimation: false }))
                }
            });
        }
        React.useEffect(() => {

            let timeToshowGif = Platform.OS === 'ios' ? (deviceInfoModule.hasNotch() ? 2800 : 4000) : 6000
            if (addToCardAnimation === true) {
                console.log("if here", addToCardAnimation);
                animateLoader();
                setTimeout(() => {
                    animateLoader(0)
                }, timeToshowGif);

            }

        }, [addToCardAnimation]);
        return (
            <AnimatedView style={{ opacity: animateAddToCart, display: addToCardAnimation === true ? 'flex' : 'none', position: 'absolute', height: "100%", backgroundColor: 'rgba(0,0,1,0.5)', width: '100%', justifyContent: 'flex-start', alignContent: 'flex-start' }}>

                <Animated.Image
                    source={require('../../assets/gifs/AddToCart.gif')}
                    resizeMethod={'auto'}
                    resizeMode={'contain'}
                    style={{ justifyContent: 'flex-end', alignContent: 'center', alignSelf: 'center', width: "90%" }}
                    height={70}
                    width={40}
                />

                {/* <AnimatedLottieView
                    source={require('../../assets/gifs/Add To Cart.json')}
                    onAnimationFinish={() => {
                        animateLoader(0);
                    }}
                    style={{
                        marginTop: Platform.OS === 'ios' ? -105 : -180
                    }}
                    resizeMode={'contain'}
                    autoPlay loop={false}
                /> */}
            </AnimatedView>
        )
    }
    useEffect(() => {
        loadProductDetails()

    }, [])

    const inputRef = React.useRef(null);
    return (
        <View style={{ flex: 1 }} >


            {

                loading ? renderLoader() :
                    <SafeAreaView style={[productDetailsStyles.mainContainer,]}>
                        <CustomHeader
                            leftIconName={"chevron-back"}
                            onLeftIconPress={goBack}
                            containerStyle={[productDetailsStyles.customHeaderMainContainer,]}
                            hideFinalDestination={true}
                            leftContainerStyle={productDetailsStyles.customHeaderLeftRightContainer}
                            leftIconColor={productDetailsStyles.customHeaderLeftRightIconColor}
                            rightContainerStyle={productDetailsStyles.customHeaderLeftRightContainer}
                            rightIconColor={productDetailsStyles.customHeaderLeftRightIconColor}
                        />
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            enableOnAndroid
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled"
                            {...Platform.OS === "ios" && {
                                getTextInputRefs: () => {
                                    return [
                                        inputRef.current,
                                    ];
                                }
                            }
                            }>
                            <RenderProductImages colors={colors} images={images} />
                            {/* <View>
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
                                    // height={180}
                                    height={330}


                                />
                            </View>
                            <LinearGradient
                                // colors={['#F6F5FA00', '#F6F5FA00', '#F6F5FA', '#F6F5FA']}
                                colors={['#F6F5FA00', '#F6F5FA00', '#F6F5FA', '#F6F5FA']}
                                // style={{ top: 150, width: '100%', height: 40, position: 'absolute', }}
                                style={{ top: 280, width: '100%', height: 60, position: 'absolute', }}
                            >
                            </LinearGradient> */}

                            <AnimatedView style={[productDetailsStyles.primaryContainer]}>
                                <Text style={productDetailsStyles.productNametxt} numberOfLines={1} fontFamily="PoppinsMedium">{productName}</Text>
                                {productDetails ? <Text style={productDetailsStyles.productDescriptionTxt} fontFamily="PoppinsRegular" numberOfLines={2}>{`${productDetails}`}</Text> : null}
                                <AnimatedView style={productDetailsStyles.productPriceContainer}>
                                    <Text style={productDetailsStyles.productPricelabel} fontFamily="PoppinsRegular">Price:</Text>
                                    <Text style={productDetailsStyles.productPricetxt}
                                        fontFamily='PoppinsRegular'
                                    >{` ${renderPrice(productPrice)}`}</Text>
                                    {
                                        discountedPrice.length > 0 ?
                                            <Text style={[productDetailsStyles.productPricetxt, { paddingHorizontal: 5, textDecorationLine: "line-through", color: colors.grey }]}
                                                fontFamily='PoppinsRegular'
                                            >{`${renderPrice(gstAddedPrice, '')}`}</Text>
                                            : null

                                    }
                                </AnimatedView>

                                <RadioButton
                                    data={optionsListArr}
                                    onPressCb={onPressHandler}
                                    productDetailsStyles={productDetailsStyles}
                                    selectedOptions={state.selectedOptions}
                                />
                                {pitstopType === 4 ?
                                    <View style={{ marginVertical: 25, }}>
                                        <TextInput
                                            ref={inputRef}
                                            containerStyle={{ backgroundColor: 'white', margin: 0, }}
                                            placeholder="Types your instructions"
                                            placeholderTextColor={"#CFCFCF"}
                                            titleStyle={{ color: 'black', fontSize: 14, marginVertical: -8 }}
                                            title="Please add your instructions"
                                            textAlignVertical='top'
                                            style={{ textAlign: "left", backgroundColor: colors.drWhite, borderColor: 'rgba(112, 112, 112, 0.1)', borderWidth: 1, color: 'black', margin: 10, borderRadius: 10, minHeight: minHeight, }}
                                            onChangeText={(text) => {
                                                if (Regex.Space_Regex.test(text)) return
                                                setState((pre) => ({ ...pre, notes: text }))
                                            }}
                                            multiline={true} // ios fix for centering it at the top-left corner 
                                            numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
                                            returnKeyType='done'
                                        />
                                    </View>
                                    : null}
                            </AnimatedView>
                        </KeyboardAwareScrollView>
                        {renderButtonsUi()}
                    </SafeAreaView>

            }
            {state.addToCardAnimation ? <RenderPutItemInCartBox addToCardAnimation={state.addToCardAnimation} /> : <View />}

        </View>

    )

}



const RenderProductImages = React.memo(({ images, colors }) => {

    return <>
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
                // height={180}
                height={330}
                pagination={images.length > 1 ? true : false}


            />
        </View>
        <LinearGradient
            // colors={['#F6F5FA00', '#F6F5FA00', '#F6F5FA', '#F6F5FA']}
            colors={['#F6F5FA00', '#F6F5FA00', '#F6F5FA', '#F6F5FA']}
            // style={{ top: 150, width: '100%', height: 40, position: 'absolute', }}
            style={{ top: 280, width: '100%', height: 60, position: 'absolute', }}
        >
        </LinearGradient>
    </>
}, (n, p) => n !== p);