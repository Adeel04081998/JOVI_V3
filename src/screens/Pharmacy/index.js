import React from 'react';
import { Appearance, Animated, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import Recording from '../../components/organisms/Recording';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import sharedStyles from '../../res/sharedStyles';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import Regex from '../../utils/Regex';
import PitStopEstPrice from '../JoviJob/components/PitStopEstPrice';
import PitStopEstTime from '../JoviJob/components/PitStopEstTime';
import RestaurantProductMenuHeader from '../RestaurantProductMenu/components/RestaurantProductMenuHeader';
import PharmacyHeader, { PharmacyHeaderContainer } from './Components/PharmacyHeader';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const WINDOW_HEIGHT = constants.window_dimensions.height;
const ICON_CONTAINER_SIZE = 40;
const BORDER_RADIUS = 15;
const HEADER_MARGIN = 270;
const BOTTOM_MARGIN = 370;
const SPACING = 10;
const WIDTH = constants.window_dimensions.width
let recordingItem = null;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.PHARMACY]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    const userReducer = useSelector(state => state.userReducer);
    const _styles = styles(colors);
    const data = {
        title: 'Pharmacy',
    };
    const [headerHeight, setHeaderHeight] = React.useState(WINDOW_HEIGHT * 0.4);
    const [estimateTimeCollapsed, setEstimateTimeCollapsed] = React.useState(true);
    const [state, setState] = React.useState({
        medicineName: '',
        detail: '',
        voiceRecording: null,
        latitude: null,
        longitude: null,
        title: null,
        estTime: {
            "text": "0-15 mins",
            "value": 1
        },
        estimatePrice: 0,
        pickUpPitstop: {
            instructions: '',
            latitude: null,
            longitude: null,
            title: null
        },
    });
    const [isAttachment, setIsAttachment] = React.useState(false);
    const cartReducer = useSelector((store) => {
        return store.cartReducer;
    });
    const remainingAmount = cartReducer.joviRemainingAmount;
    const animScroll = React.useRef(new Animated.Value(0)).current;
    const headerTop = animScroll.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight + getStatusBarHeight())],
        extrapolate: "clamp",
        useNativeDriver: true
    });
    const customRecordingRef = React.useRef(null);
    const voiceNoteRef = React.useRef(null);





    const toggleAttachment = (isAttachmentBool = false) => {
        console.log('toggleAttachment', isAttachmentBool);
        setIsAttachment(isAttachmentBool);
    }
    const getRemainingAmount = () => {
        let RA = remainingAmount - state.estimatePrice
        return RA
    }
    const handlePickupLocation = (location = {}) => {
        setState(pre => ({
            ...pre, pickUpPitstop: {
                ...pre.pickUpPitstop,
                ...location,
            }
        }))
    }
    const handlePharmacyLocation = (location = {}) => {
        setState(pre => ({
            ...pre,
            ...location,
        }))
    }
    const locationTypeEnum = {
        1: handlePharmacyLocation,
        2: handlePickupLocation
    }
    const onChangeText = (value, key = '') => {
        setState(pre => ({ ...pre, [key]: value }));
    }
    const onLocationPress = (locationType = '1') => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name, { colors: colors, onNavigateBack: (placeName) => locationTypeEnum[locationType](placeName), index: 1 })
    }
    const renderSubHeading = (text = '', extraStyles = {}) => (<Text style={{ fontSize: 14, color: colors.black, ...extraStyles }} fontFamily={'PoppinsMedium'}>{text}</Text>);
    const renderLocationButton = (onPress = () => onLocationPress()) => (<Button
        onPress={onPress}
        text="Select location from map"
        textStyle={_styles.btnText}
        fontFamily="PoppinsRegular"
        leftComponent={() => {
            return (
                <VectorIcon name="pin-outline" type="MaterialCommunityIcons" size={20} color={colors.white} />
            )
        }}
        style={[_styles.locButton, { width: '100%', marginVertical: SPACING, backgroundColor: colors.black, height: 35, zIndex: -1 }]} />)
    const renderInput = (inputProps = {}, extraStyles = {},) => (<TextInput
        style={{
            width: '100%',
            height: 50,
            backgroundColor: colors.light_grey,
            margin: -13,
            marginVertical: -15,
            ...extraStyles,
        }}
        {...inputProps}
    />);
    const renderRecorder = () => {
        return <Recording
            ref={customRecordingRef}
            colors={colors}
            recordingItem={recordingItem}
            onDeleteComplete={() => {
                recordingItem = null;
                voiceNoteRef.current = {}
                setState(pre => ({ ...pre, voiceRecording: null }));
            }}
            onRecordingComplete={(recordItem) => {
                recordingItem = recordItem;
                voiceNoteRef.current = recordItem
                setState(pre => ({ ...pre, voiceRecording: recordingItem }));
            }}
            onPlayerStopComplete={() => {
                // if (closeSecondCard) {
                //     updateCardOnHeaderPress(updateCardOnHeaderPressItem);
                //     closeSecondCard = false;
                // }
            }}
            caption="Record your voice note."
        />;
    }
    const renderPitStopEstTime = (isOpened, index, disabled) => {
        return (
            <PitStopEstTime
                collapsed={estimateTimeCollapsed}
                estTime={state.estTime}
                isOpened={true}
                onEstTimePress={(item) => {
                    console.log('item ==>>>', item);
                    setState(pre => ({ ...pre, estTime: item }));
                    setEstimateTimeCollapsed(!estimateTimeCollapsed)
                }}
                onPressDropDown={() => {
                    setEstimateTimeCollapsed(!estimateTimeCollapsed)
                }}
                hideHeading
            />
        )
    }
    const renderPitstopEstPrice = () => {
        return (
            <PitStopEstPrice
                estVal={isNaN(parseInt(`${state.estimatePrice}`)) ? '' : parseInt(`${state.estimatePrice}`)}
                textinputVal={`${state.estimatePrice}`}
                isOpened={true}
                hideHeading={true}
                colors={colors}
                bottomSectionStyles={{
                    marginLeft: 0
                }}
                onChangeSliderText={newsliderValue => {
                    if (Regex.numberOnly.test(newsliderValue)) {
                        let remainingAmountLength = (`${remainingAmount}`.length) - 1;
                        if (remainingAmountLength < 1) {
                            remainingAmountLength = 1;
                        }
                        const maxLengthRegex = new RegExp(`^([0-${remainingAmountLength > 1 ? '9' : remainingAmount}]{0,${remainingAmountLength}}|${remainingAmount})$`, "g");
                        if (maxLengthRegex.test(newsliderValue)) {
                            setState(pre => ({ ...pre, estimatePrice: newsliderValue }));
                        }
                    }
                    else {
                        setState(pre => ({ ...pre, estimatePrice: 0 }));
                    }
                }
                }
                getRemainingAmount={() => getRemainingAmount()}
                onSliderChange={(newsliderValue) => {
                    setState(pre => ({ ...pre, estimatePrice: newsliderValue }));
                }} />
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <StatusBar backgroundColor={colors.white} />
            <PharmacyHeaderContainer
                colors={colors}
                animScroll={animScroll}
                headerHeight={headerHeight}
                setHeaderHeight={setHeaderHeight}
                headerTop={headerTop}
            />
            <Animated.View style={{ flex: 1,transform:[{
                translateY:animScroll.interpolate({
                    inputRange:[0,10],
                    outputRange:[0,0.74]
                })
            }] }}>
                <ScrollView
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: animScroll } } }]
                    )}
                    contentContainerStyle={{ backgroundColor: colors.white, paddingHorizontal: 20, paddingVertical: 10, marginTop: HEADER_MARGIN, paddingBottom: BOTTOM_MARGIN, ..._styles.borderTopRadius }} style={{ flex: 1 }}>
                    <View style={{ ..._styles.subSection, ..._styles.borderTopRadius, }}>
                        {renderSubHeading('Prescription')}
                        <Text style={{ fontSize: 12, color: colors.grey, }} fontFamily={'PoppinsLight'}>Attach Prescription OR Add Pit-Stop & Pick Up Prescription</Text>
                        <View style={{ width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => toggleAttachment(true)} style={{ height: 40, width: '47%', backgroundColor: isAttachment ? colors.black : colors.white, borderRadius: 12, ...sharedStyles._styles(colors).placefor_specific_shadow, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, color: isAttachment ? colors.white : colors.black }} fontFamily={'PoppinsLight'}>Attach File</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleAttachment(false)} style={{ height: 40, width: '47%', backgroundColor: isAttachment ? colors.white : colors.black, borderRadius: 12, ...sharedStyles._styles(colors).placefor_specific_shadow, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, color: isAttachment ? colors.black : colors.white }} fontFamily={'PoppinsRegular'}>Pick it</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ ..._styles.subSection, }}>
                        {renderSubHeading('Location')}
                        {renderLocationButton(() => onLocationPress('2'))}
                        {state.pickUpPitstop.latitude && renderSubHeading(state.pickUpPitstop.title ?? '')}
                        {renderSubHeading('Instructions', { marginTop: SPACING * 2,marginBottom:SPACING })}
                        {
                            renderInput({
                                placeholder: 'Enter any instructions for the rider',
                                value: state.pickUpPitstop.instructions,
                                onChangeText: (value) => {
                                    setState(pre => ({ ...pre, pickUpPitstop: { ...pre.pickUpPitstop, instructions: value } }));
                                }
                            })
                        }
                    </View>
                    <View style={{ ..._styles.subSection, }}>
                        {renderSubHeading('Medicine Name')}
                        {
                            renderInput({
                                placeholder: 'Please Enter Medicine Name',
                                value: state.medicineName,
                                onChangeText: (value) => onChangeText(value, 'medicineName')
                            })
                        }
                    </View>
                    <View style={{ ..._styles.subSection, }}>
                        {renderSubHeading('Pharmacy Location')}
                        {renderLocationButton(() => onLocationPress('1'))}
                        {state.latitude && renderSubHeading(state.title ?? '')}
                    </View>
                    <View style={{ ..._styles.subSection, }}>
                        {renderSubHeading('Detail',{marginBottom:SPACING})}
                        {
                            renderInput({
                                placeholder: 'Please Type Your Detail',
                                value: state.detail,
                                multiline: true,
                                onChangeText: (value) => onChangeText(value, 'detail')
                            }, {
                                height: 150
                            })
                        }
                    </View>
                    <View style={{ ..._styles.subSection, zIndex: 999 }}>
                        {renderSubHeading('Voice Note', { marginBottom: SPACING })}
                        {renderRecorder()}
                    </View>
                    <View style={{ ..._styles.subSection, zIndex: 999 }}>
                        {renderSubHeading('Estimated Time', { marginBottom: SPACING })}
                        {renderPitStopEstTime()}
                    </View>
                    <View style={{ ..._styles.subSection, ..._styles.borderBottomRadius }}>
                        {renderSubHeading('Estimated Price', { marginBottom: SPACING })}
                        {renderPitstopEstPrice()}
                    </View>
                </ScrollView>
            </Animated.View>
                <Button
                    onPress={() => { }}
                    text="Save and Continue"
                    textStyle={{
                        fontSize: 16,
                        fontFamily: FontFamily.Poppins.Regular
                    }}
                    fontFamily="PoppinsRegular"
                    style={[_styles.locButton, { width: '95%', marginVertical: SPACING, backgroundColor: colors.primary, marginHorizontal: SPACING, height: 60, zIndex: 999 }]} />
        </SafeAreaView>
    );
};

const styles = (colors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    subSection: {
        padding: SPACING, backgroundColor: colors.light_grey, marginBottom: 3, zIndex: 0
    },
    borderTopRadius: { borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS },
    borderBottomRadius: { borderBottomLeftRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS },
    btnText: {
        fontSize: 12,
        fontWeight: '600'
    },
    locButton: {
        // width: WIDTH - 50,
        height: 35,
        borderRadius: 8,
        alignSelf: 'center'
    },
});