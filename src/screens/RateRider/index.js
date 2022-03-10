import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Animated, Appearance, Easing, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from '../../../libs/react-native-keyboard-aware-scroll-view';
import Switch from '../../components/atoms/Switch';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import NoRecord from '../../components/organisms/NoRecord';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import NavigationService from '../../navigations/NavigationService';
import { initColors } from '../../res/colors';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import Regex from '../../utils/Regex';
import { headerStyles, sliderStylesFunc, stylesFunc } from './styles';

const HEADER_ICON_SIZE_RIGHT = CustomHeaderIconBorder.size * 0.7;
const RATING_SIZE = constants.window_dimensions.height * 0.3;

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

export default ({ navigation, route }) => {

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

    // #region :: STATE's & REF's START's FROM HERE 
    const [rating, setRating] = React.useState(3);
    const [switchVal, setSwitchVal] = React.useState(true);
    const [amount, setAmount] = React.useState('');
    const [query, updateQuery] = React.useState({
        data: [],
        isLoading: false,
        error: false,
        errorText: '',
    });
    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: ROBOT / JSON ANIMATION START's FROM HERE 
    const animatedValues = React.useRef(new Animated.Value(0)).current;
    const robotAnimation = (toValue = 0, reAnimate = true, onComplete = () => { }) => {
        Animated.timing(animatedValues, {
            toValue: toValue,
            useNativeDriver: true,
            duration: 300,
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

    // #region :: LOADING AND ERROR UI START's FROM HERE 
    if (query.isLoading) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <View style={{
                flex: 1,
                marginTop: -80,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <AnimatedLottieView
                    source={require('../../assets/LoadingView/OrderChat.json')}
                    autoPlay
                    loop
                    style={{
                        height: 120,
                        width: 120,
                    }}
                />
            </View>
        </View>
    } else if (query.error) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <NoRecord
                color={colors}
                title={query.errorText}
                buttonText={`Refresh`}
                onButtonPress={() => { loadData() }} />
        </View>
    }

    // #endregion :: LOADING AND ERROR UI END's FROM HERE 

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
                    <Text fontFamily='PoppinsMedium' style={styles.rateJoviHeading}>{`Rate your Jovi`}</Text>
                    <Text fontFamily='PoppinsLight' style={styles.helpUsText}>{`Your rating helps us improve`}</Text>

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
                                    {splitArray(new Array(4).fill({ name: 'Order was late' }), NUMBER_OF_COLUMN).map((item, index) => {
                                        return (
                                            <View style={{ maxWidth: constants.window_dimensions.width * 0.8, }} key={index}>
                                                <RatingCardUI colors={colors}
                                                    itemKey={'name'}
                                                    dataArr={item} />
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
                    colors={colors}
                    text={`Submit`}
                    onPress={() => { NavigationService.NavigationActions.common_actions.goBack() }}
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
    const [selectedIndex, setSelectedIndex] = React.useState(2)
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

const TextWithBoxUI = ({ onPress = () => { }, colors = initColors, text = '', containerStyle = {} }) => {

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{
            borderColor: colors.white,
            borderWidth: 1,
            borderRadius: 7,
            paddingVertical: 5,
            paddingHorizontal: 7,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            ...containerStyle
        }}>
            <Text ontFamily='PoppinsRegular' style={{
                fontSize: 12,
                color: colors.white,
            }} numberOfLines={1}>{`${text}`}</Text>
        </TouchableOpacity>
    )

}

// #endregion :: TEXT BOX  END's FROM HERE 

// #region :: RATING CARD START's FROM HERE ##usage: for showing text using array
const RatingCardUI = ({ dataArr = [], itemKey = 'text', colors = initColors, }) => {

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
                    <TextWithBoxUI colors={colors} text={`${dataArr[0][itemKey]}`} />
                </View>
            )}
        </View>

    )
}

// #endregion :: RATING CARD END's FROM HERE 


