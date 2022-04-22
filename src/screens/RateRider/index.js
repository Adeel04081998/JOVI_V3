import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Animated, Appearance, BackHandler, Easing, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from '../../../libs/react-native-keyboard-aware-scroll-view';
import Switch from '../../components/atoms/Switch';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import AnimatedModal from '../../components/organisms/AnimatedModal';
import { sharedExceptionHandler, sharedFetchOrder, splitArray, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import { initColors } from '../../res/colors';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import Regex from '../../utils/Regex';
import { headerStyles, sliderStylesFunc, stylesFunc } from './styles';
import CheckoutStyles from "../CheckOut/styles";
import RatingOrderRecipt from './components/RatingOrderRecipt';
import RatingSliderUI from './components/RatingSliderUI';
import Toast from '../../components/atoms/Toast';

// #region :: CONSTANT's START's FROM HERE 
const HEADER_ICON_SIZE_RIGHT = CustomHeaderIconBorder.size * 0.7;
const RATING_SIZE = constants.window_dimensions.height * 0.3;
let selectedItem = null;
const DEFAULT_RATING_NUMBER = 2;


const RATING_JSON = {
    Entry: require('../../assets/rating_json/1_star_entry.json'),
    1: require('../../assets/rating_json/1_star.json'),
    2: require('../../assets/rating_json/2_star.json'),
    3: require('../../assets/rating_json/3_star.json'),
    4: require('../../assets/rating_json/4_star.json'),
    5: require('../../assets/rating_json/5_star.json'),
}
const NUMBER_OF_COLUMN = 2;

// #endregion :: CONSTANT's END's FROM HERE 


export default ({ navigation, route }) => {

    // #region :: ORDER ID HANDLING START's FROM HERE 

    const orderArray = route?.params?.orderArray ?? [];
    const [orderID, setorderID] = React.useState(route?.params?.orderID ?? 0);
    const orderIDArrayIndex = React.useRef(0);

    const updateOrderID = () => {
        if (orderIDArrayIndex.current < orderArray.length - 1) {
            orderIDArrayIndex.current++;
            setorderID(orderArray[orderIDArrayIndex.current].customOrderID);
            resetState();
        } else {
            onBackPress(false);
            // NavigationService.NavigationActions.common_actions.goBack();//incase we have to show rating one by one.
        }
        return;
    }

    // #endregion :: ORDER ID HANDLING END's FROM HERE 

    // #region :: BACK HANDLER HANDLING START's FROM HERE 
    const onBackPress = (useIgnoreOrder = true) => {
        if (useIgnoreOrder) {
            ignoreOrder();
        }
        NavigationService.NavigationActions.common_actions.goBack();
        // updateOrderID();//incase we have to show rating one by one.
        return true;
    }

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            onBackPress,
        );
        return () => backHandler.remove();
    }, []);

    // #endregion :: BACK HANDLER HANDLING END's FROM HERE 

    // #region :: REDUCER START's FROM HERE 
    const messagesReducer = useSelector(s => s?.messagesReducer);
    const joviRatingTitle = messagesReducer?.homeScreenDataViewModel?.joviRatingTitle;
    React.useEffect(() => {
        updateData(pre => ({
            ...pre,
            heading: joviRatingTitle?.header ?? 'Rate your Jovi',
            headingDescription: joviRatingTitle?.body ?? 'Your rating helps us improve',
        }))
    }, [joviRatingTitle]);

    // #endregion :: REDUCER END's FROM HERE 

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = { ...stylesFunc(colors), };
    const sliderStyles = sliderStylesFunc(colors);
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary), ...headerStyles(colors) };
    const checkOutStyles = CheckoutStyles.styles(colors);

    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <>
                <StatusBar backgroundColor={colors.primary} animated barStyle={"light-content"} />
                {orderArray.length > 0 &&
                    <View style={{
                        ...customheaderStyles.pendingOrderNumberContainer,
                        zIndex: receiptVisible ? -9 : 9999,
                    }}>
                        <Text style={{
                            ...customheaderStyles.pendingOrderNumber,
                        }}>{`${orderIDArrayIndex.current + 1} / ${orderArray.length}`}</Text>
                    </View>
                }

                <TouchableOpacity
                    wait={0}
                    onPress={() => { onBackPress(); }}
                    style={{
                        ...customheaderStyles.iconContainer,
                        zIndex: receiptVisible ? -9 : 9999,
                    }}>
                    <VectorIcon color={"#fff"} type="MaterialCommunityIcons" name='close' size={HEADER_ICON_SIZE_RIGHT} />
                </TouchableOpacity>
                <SafeAreaView />
            </>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: ROBOT / JSON ANIMATION START's FROM HERE 
    const animatedValues = React.useRef(new Animated.Value(0)).current;
    const robotAnimation = (toValue = 0, reAnimate = true, onComplete = () => { }) => {
        Animated.timing(animatedValues, {
            toValue: toValue,
            useNativeDriver: true,
            duration: 250,
            easing: Easing.ease
        }).start(finished => {
            if (finished) {
                if (reAnimate) {
                    robotAnimation(1, false);
                    onComplete();
                }
            }
        });
    }

    // #endregion :: ROBOT / JSON ANIMATION END's FROM HERE 

    // #region :: STATE's & REF's START's FROM HERE 
    const userReducer = useSelector(state => state.userReducer);
    const ratingReasonsList = userReducer?.ratingReasonsList??[];
    const skipEffect = React.useRef(false);
    const [rating, setRating] = React.useState(DEFAULT_RATING_NUMBER);//1 TO 5
    const [switchVal, setSwitchVal] = React.useState(true);
    const [receiptVisible, setReceiptVisible] = React.useState(false);
    const [receiptData, setReceiptData] = React.useState({});
    const [disableSubmit, setDisableSubmit] = React.useState(true);
    const [amount, setAmount] = React.useState('');
    const [ratingData, setRatingData] = React.useState(ratingReasonsList??[]);//ALL RATING GETTING FROM SERVER
    const [data, updateData] = React.useState({
        heading: joviRatingTitle?.header ?? 'Rate your Jovi',
        headingDescription: joviRatingTitle?.body ?? 'Your rating helps us to improve',
        commentData: [],
    })
    const resetState = () => {
        if (parseInt(`${rating}`) === parseInt(`${DEFAULT_RATING_NUMBER}`)) {
            setDataAccToRating(DEFAULT_RATING_NUMBER - 1);
        } else {
            skipEffect.current = false;
            setRating(DEFAULT_RATING_NUMBER);
        }
        setSwitchVal(true);
        setReceiptVisible(false);
        setDisableSubmit(true);
        setAmount('');
    };//end of resetState

    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: API IMPLEMENTATION START's FROM HERE 
    React.useEffect(() => {
        if (!ratingReasonsList) {
            loadData();

        }
        return () => { };
    }, []);

    React.useEffect(() => {
        getOrderDetailFromServer();
        return () => { };
    }, [orderID]);

    const getOrderDetailFromServer = () => {
        sharedFetchOrder(orderID, (res) => {
            if (res.data.statusCode === 200) {
                setReceiptData(res.data.order);
            } else {
                setReceiptData({});
            }
        }, (err) => {
            setReceiptData({});
        });
    };

    const loadData = () => {
        const params = {
            ratingLevel: 0
        };

        postRequest(Endpoints.GET_RIDER_ORDER_RATING_REASON, params, (res) => {
            if (res.data.statusCode === 200) {
                const resData = (res.data.reasonsList?.ratingLevels ?? []);
                setRatingData(resData);
            } else {
                return
            }
        }, (err) => {
            sharedExceptionHandler(err);
        })
    };//end of loadData

    const ignoreOrder = () => {
        const params = { customOrderID: orderID }
        postRequest(Endpoints.IGNORE_ORDER_FOR_ORDER_RATING, params, (res) => {

        }, (err) => {
            sharedExceptionHandler(err);
        })
    };//end of ignoreOrder

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

    // #region :: CHANGE COMMENT DATA ON RATING OR RATING DATA CHANGED START's FROM HERE 
    const setDataAccToRating = (ratingVal = -1) => {
        const isRatingExist = ratingVal !== -1 ? ratingVal : ratingData.findIndex(x => x.ratingLevel === rating);
        if (isRatingExist !== -1) {
            const newData = ratingData[isRatingExist].reasonsList.map(i => ({ ...i, isSelected: false, }));
            updateData(pre => ({
                ...pre,
                commentData: newData,
            }))
            return
        }
    };//end of setDataAccToRating

    React.useEffect(() => {
        if (skipEffect.current) {
            skipEffect.current = false;
            return
        }
        setDisableSubmit(true);
        setAmount('');
        setDataAccToRating();

        return () => { }
    }, [rating, ratingData])

    // #endregion :: CHANGE COMMENT DATA ON RATING OR RATING DATA CHANGED END's FROM HERE 

    // #region :: ON SUBMIT PRESS START's FROM HERE 
    const onSubmitPress = () => {
        //ADDING RATING TO SERVER
        const params = {
            "customOrderID": orderID,
            "rating": rating,
            "description": selectedItem?.description ?? '',
            "tipAmount": amount
        };
        // console.log('PARAMS  ', params);

        postRequest(Endpoints.SUBMIT_RATING_FOR_RIDER_ORDER, params, (res) => {
            if (res.data.statusCode === 200) {
                Toast.success(sharedExceptionHandler(res, true));
                updateOrderID();
            } else {
                sharedExceptionHandler(res);
                return
            }
        }, (err) => {
            sharedExceptionHandler(err);

        })
    }


    // #endregion :: ON SUBMIT PRESS END's FROM HERE 

    // #region :: ON COMMENT SELECTION CHANGE START's FROM HERE 
    const changeCommentSelection = (item, childIndex) => {
        const newCommentData = data.commentData;
        const arrayIndex = newCommentData.findIndex(i => item[childIndex].ratingReasonID === i.ratingReasonID);
        let isAnySelected = false;
        for (let i = 0; i < newCommentData.length; i++) {
            if (i === arrayIndex) {
                selectedItem = newCommentData[i];
                isAnySelected = true;
                newCommentData[i].isSelected = true;
            }
            else {
                newCommentData[i].isSelected = false;
            }
        }
        if (isAnySelected) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
        skipEffect.current = true;
        updateData(pre => ({
            ...pre,
            commentData: newCommentData
        }));
    }

    // #endregion :: ON COMMENT SELECTION CHANGE END's FROM HERE 

    // #region :: UI START's FROM HERE 
    return (
        <LinearGradient
            start={{ x: 1, y: 1 }} end={{ x: 1, y: 1 }}
            colors={['rgba(0,0,0,0.3)', colors.primary,]}
            style={styles.primaryContainer}>
            {_renderHeader()}
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }} bounces={false} nestedScrollEnabled>
                {/* ****************** Start of UPPER VIEW ****************** */}
                <View style={{ flex: 1, paddingTop: getStatusBarHeight(false), }}>
                    <Text fontFamily='PoppinsMedium' style={styles.rateJoviHeading}>{`${data.heading}`}</Text>
                    <Text fontFamily='PoppinsLight' style={styles.helpUsText}>{`${data.headingDescription}`}</Text>

                    <Animated.View style={{ ...styles.jsonContainer, opacity: animatedValues }}>
                        <AnimatedLottieView
                            source={RATING_JSON[rating]}
                            autoPlay
                            loop
                            style={{
                                marginTop: -5,
                                marginBottom: -15,
                                height: RATING_SIZE,
                                width: RATING_SIZE,
                            }}
                        />
                    </Animated.View>
                </View>

                {/* ****************** End of UPPER VIEW ****************** */}


                {/* ****************** Start of BOTTOM VIEW ****************** */}
                <View style={{ flex: 5, }}>
                    <Text fontFamily='PoppinsLight' style={styles.optionHeading}>{`What could've been better?`}</Text>

                    {rating < 4 ?
                        <>
                            {/* ****************** Start of COMMENT OPTION's ****************** */}
                            <ScrollView style={{ flex: 0, flexGrow: 0, }} contentContainerStyle={{ flexGrow: 0, }} bounces={false}>
                                <View style={{ alignItems: "center", justifyContent: "center", }}>
                                    {splitArray(data.commentData, NUMBER_OF_COLUMN).map((item, index) => {
                                        return (
                                            <View style={{ maxWidth: constants.window_dimensions.width * 0.8, }} key={index}>
                                                <RatingCardUI
                                                    colors={colors}
                                                    itemKey={'description'}
                                                    dataArr={item}
                                                    onPress={(childIndex) => { changeCommentSelection(item, childIndex); }}
                                                />
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>

                            {/* ****************** End of COMMENT OPTION's ****************** */}
                        </>
                        : <>
                            {/* ****************** Start of TIP SWITCH YES OR NO ****************** */}
                            <View style={styles.tipSwitchPrimaryContainer}>
                                <Text style={styles.tipSwitchText}>{`Were you satisfied enough to tip your Jovi?`}</Text>

                                <View style={styles.tipSwitchContainer}>
                                    <Text style={styles.switchText}>{`No`}</Text>
                                    <View style={styles.switchContainer}>
                                        <Switch
                                            onToggleSwitch={(bool) => {
                                                setAmount('');
                                                setSwitchVal(bool)
                                            }}
                                            switchVal={switchVal}
                                            width={30}
                                            height={18}
                                            switchContainerActive={sliderStyles.switchContainerActive}
                                            switchContainerInActive={sliderStyles.switchContainerInActive}
                                            subSwitchContainerActive={sliderStyles.subSwitchContainerActive}
                                            subSwitchContainerInActive={sliderStyles.subSwitchContainerInActive}
                                        />
                                    </View>
                                    <Text style={styles.switchText}>{`Yes`}</Text>
                                </View>
                            </View>

                            {/* ****************** End of TIP SWITCH YES OR NO ****************** */}
                        </>
                    }
                    {(switchVal && rating > 3) && (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: "10%", marginTop: 6 }}>
                            <Text style={{
                                fontSize: 13,
                                color: colors.white,
                            }}>{`Amount`}</Text>

                            <TextInput
                                containerStyle={{
                                    width: 120,
                                    marginRight: 0,
                                    backgroundColor: 'transparent',
                                    borderWidth: 1,
                                    borderColor: colors.white,
                                    margin: 0,
                                }}
                                maxLength={4}
                                placeholder=""
                                selectionColor={colors.white}
                                style={{
                                    paddingVertical: 5,
                                    color: colors.white,
                                    fontSize: 12
                                }}
                                contextMenuHidden
                                keyboardType={Platform.OS === "android" ? "numeric" : "number-pad"}
                                value={amount}
                                onChangeText={(text) => {
                                    if (Regex.numberWithSpace.test(text)) {
                                        setAmount(text)
                                    }
                                }}
                            />


                        </View>
                    )
                    }

                    {/* ****************** Start of RATING SLIDER ****************** */}
                    <RatingSliderUI
                        initialIndex={rating - 1}
                        onIndexChange={(value) => {
                            skipEffect.current = false;
                            robotAnimation(0, true, () => {
                                setRating(value);
                            });
                        }}
                    />

                    {/* ****************** End of RATING SLIDER ****************** */}



                </View>

                {/* ****************** End of BOTTOM VIEW ****************** */}
            </KeyboardAwareScrollView>

            {/* ****************** Start of RECIPT & SUBMIT BUTTON ****************** */}
            <View style={{ ...styles.reciptSubmitButtonContainer, }}>
                <TextWithBoxUI
                    colors={colors}
                    text={`Receipt`}
                    containerStyle={styles.reciptSubmitButton}
                    onPress={() => {
                        setReceiptVisible(true);
                    }}
                />

                <TextWithBoxUI
                    disabled={rating < 4 ? disableSubmit : (switchVal ? (!VALIDATION_CHECK(amount)) : switchVal)}
                    colors={colors}
                    text={`Submit`}
                    onPress={() => { onSubmitPress(); }}
                    containerStyle={styles.reciptSubmitButton}
                />
            </View>

            {/* ****************** End of RECIPT & SUBMIT BUTTON ****************** */}
            <SafeAreaView />

            {receiptVisible &&
                <AnimatedModal
                    position={"bottom"}
                    visible={receiptVisible}
                    onRequestClose={() => { setReceiptVisible(false) }}
                    contentContainerStyle={{ backgroundColor: 'transparent', }}
                    skipBottom>

                    <RatingOrderRecipt
                        containerStyle={{ maxHeight: constants.window_dimensions.height * 0.7 }}
                        checkOutStyles={checkOutStyles}
                        colors={colors}
                        data={receiptData?.pitStopsList ?? []}
                        subTotal={receiptData?.orderReceiptVM?.subTotal ?? ''}
                        totalGST={receiptData?.orderReceiptVM?.chargeBreakdown?.totalProductGST ?? ''}
                        serviceCharges={receiptData?.orderReceiptVM?.actualServiceCharges ?? 0}
                        estimateServiceTax={receiptData?.orderReceiptVM?.actualServiceTax ?? 0}
                        discount={receiptData?.orderReceiptVM?.chargeBreakdown?.discount ?? 0}
                        total={receiptData?.orderReceiptVM?.actualTotalPlusPitstopAmount ?? 0}
                        onRightTextPress={() => {
                            setReceiptVisible(false);
                        }}
                    />
                </AnimatedModal>
            }
        </LinearGradient>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT

// #region :: TEXT BOX  START's FROM HERE ##usage: for showing text with box

const TextWithBoxUI = ({ onPress = () => { }, colors = initColors, text = '', containerStyle = {}, isSelected = false, disabled = false, }) => {

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{
            borderColor: disabled ? 'grey' : colors.white,
            borderWidth: 1,
            borderRadius: 7,
            paddingVertical: 5,
            paddingHorizontal: 7,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            backgroundColor: isSelected ? colors.white : 'transparent',
            ...containerStyle
        }} disabled={isSelected || disabled}>
            <Text ontFamily='PoppinsRegular' style={{
                fontSize: 12,
                color: disabled ? 'grey' : isSelected ? colors.primary : colors.white,
            }} numberOfLines={1}>{`${text}`}</Text>
        </TouchableOpacity>
    )

}

// #endregion :: TEXT BOX  END's FROM HERE 

// #region :: RATING CARD START's FROM HERE ##usage: for showing text using array
const RatingCardUI = ({ dataArr = [], itemKey = 'text', colors = initColors, onPress = (childIndex) => { } }) => {
    if ((dataArr.length < 1)) return null;
    return (
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", }}>
            {dataArr.length > 1 ? (
                <>
                    {dataArr.map((item, index) => {
                        return (
                            <View key={index} style={{
                                flex: 1,
                            }}>
                                <TextWithBoxUI
                                    colors={colors}
                                    text={`${item[itemKey]}`}
                                    isSelected={item.isSelected}
                                    onPress={() => { onPress(index) }}
                                    containerStyle={{
                                        ...(index === 0) && {
                                            marginRight: 16,
                                        }
                                    }}
                                />
                            </View>
                        )
                    })}
                </>
            ) : (
                <View style={{ flex: 1, }}>
                    <TextWithBoxUI colors={colors} text={`${dataArr[0][itemKey]}`} isSelected={dataArr[0].isSelected} onPress={() => onPress(0)} />
                </View>
            )}
        </View>

    )
}

// #endregion :: RATING CARD END's FROM HERE 