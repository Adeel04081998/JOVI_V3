import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Animated, Appearance, Easing, Platform, SafeAreaView, ScrollView, StatusBar } from 'react-native';
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
import { sharedExceptionHandler, VALIDATION_CHECK } from '../../helpers/SharedActions';
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

// #region :: CONSTANT's START's FROM HERE 
const HEADER_ICON_SIZE_RIGHT = CustomHeaderIconBorder.size * 0.7;
const RATING_SIZE = constants.window_dimensions.height * 0.3;
let selectedItem = null;

const splitArray = (array, n) => {
    let [...arr] = array;
    let res = [];
    while (arr.length) {
        res.push(arr.splice(0, n));
    }
    return res;
};

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

    const orderID = 120;

    // #region :: REDUCER START's FROM HERE 
    const messagesReducer = useSelector(s => s.messagesReducer);
    const joviRatingTitle = messagesReducer?.homeScreenDataViewModel?.joviRatingTitleList[0];
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
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <>
                <StatusBar backgroundColor={colors.primary} animated barStyle={"light-content"} />
                <TouchableOpacity
                    wait={0}
                    onPress={() => { NavigationService.NavigationActions.common_actions.goBack() }}
                    style={customheaderStyles.iconContainer}>
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
    const skipEffect = React.useRef(false);
    const [rating, setRating] = React.useState(2);//1 TO 5
    const [switchVal, setSwitchVal] = React.useState(true);
    const [disableSubmit, setDisableSubmit] = React.useState(true);
    const [amount, setAmount] = React.useState('');
    const [ratingData, setRatingData] = React.useState([]);//ALL RATING GETTING FROM SERVER
    const [data, updateData] = React.useState({
        heading: joviRatingTitle?.header ?? 'Rate your Jovi',
        headingDescription: joviRatingTitle?.body ?? 'Your rating helps us improve',
        commentData: [],
    })

    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: API IMPLEMENTATION START's FROM HERE 
    React.useEffect(() => {
        loadData();
        return () => { };
    }, []);

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

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

    // #region :: CHANGE COMMENT DATA ON RATING OR RATING DATA CHANGED START's FROM HERE 
    const setDataAccToRating = () => {
        const isRatingExist = ratingData.findIndex(x => x.ratingLevel === rating);
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
        console.log('PARAMS  ', params);

        postRequest(Endpoints.SUBMIT_RATING_FOR_RIDER_ORDER, params, (res) => {
            if (res.data.statusCode === 200) {
                NavigationService.NavigationActions.common_actions.goBack()
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
        </LinearGradient >
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT

// #region :: RATING SLIDER UI START's FROM HERE 
const DOT_LENGTH = 5;
const RatingSliderUI = ({ onIndexChange = (value) => undefined }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(1) //0 TO 4
    const SLIDER_WIDTH = constants.window_dimensions.width * 0.7;

    React.useEffect(() => {
        if (onIndexChange) {
            onIndexChange(selectedIndex + 1);
        }
        return () => { };
    }, [selectedIndex])
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'space-between',
            alignSelf: "center",
            backgroundColor: '#fff',
            width: SLIDER_WIDTH,
            height: 2,
            marginTop: "10%",
        }}>
            {new Array(DOT_LENGTH).fill().map((_, index) => {
                const isFirstOrLast = index === 0 ? "first" : index === DOT_LENGTH - 1 ? "last" : null;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            setSelectedIndex(index);
                        }}
                        wait={0}
                        disabled={index === selectedIndex}
                        activeOpacity={0.9}
                        style={{
                            borderColor: '#fff',
                            borderWidth: selectedIndex === index ? 2 : 0,
                            borderRadius: 10,
                            padding: 10,
                            ...isFirstOrLast === "first" && {
                                marginLeft: -15,
                            },
                            ...isFirstOrLast === "last" && {
                                marginRight: -15,
                            },
                        }}>
                        <View style={{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 99, }} />
                    </TouchableOpacity>
                )
            })}
        </View>
    )

}

// #endregion :: RATING SLIDER UI END's FROM HERE 

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