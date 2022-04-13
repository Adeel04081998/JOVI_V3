import React from 'react';
import { Animated, Appearance, KeyboardAvoidingView, StatusBar, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Image from '../../components/atoms/Image';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import Toast from '../../components/atoms/Toast';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import Recording from '../../components/organisms/Recording';
import { sharedLaunchCameraorGallery } from '../../helpers/Camera';
import { renderFile, sharedAddUpdatePitstop, sharedConfirmationAlert, sharedSendFileToServer, uniqueKeyExtractor } from '../../helpers/SharedActions';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import ENUMS from '../../utils/ENUMS';
import GV, { isIOS, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import Regex from '../../utils/Regex';
import PitStopEstPrice from '../JoviJob/components/PitStopEstPrice';
import PitStopEstTime from '../JoviJob/components/PitStopEstTime';
import { PharmacyHeaderContainer } from './Components/PharmacyHeader';
import styles from './styles';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const WINDOW_HEIGHT = constants.window_dimensions.height;
const ICON_CONTAINER_SIZE = 40;
const BORDER_RADIUS = 15;
const HEADER_MARGIN = 270;
const BOTTOM_MARGIN = 370;
const SPACING = 10;
const WIDTH = constants.window_dimensions.width
let recordingItem = null;
export default ({ route }) => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.PHARMACY]], Appearance.getColorScheme() === "dark");
    const cartReducer = useSelector((store) => {
        return store.cartReducer;
    });
    let doesPickupPitstopExists = null;
    if (doesPickupPitstopExists === null) {
        (cartReducer?.pitstops ?? []).map((item, i) => {
            if (item.isPickupPitstop) {
                doesPickupPitstopExists = true;
            }
        });
    }
    const _styles = styles(colors, BORDER_RADIUS, SPACING);
    const [headerHeight, setHeaderHeight] = React.useState(WINDOW_HEIGHT * 0.4);
    const [estimateTimeCollapsed, setEstimateTimeCollapsed] = React.useState(true);
    const pitstopItemObj = route?.params?.pitstopItemObj ?? null;

    let initState = __DEV__ ? {
        "pharmacyPitstopType": doesPickupPitstopExists ? ENUMS.PharmacyPitstopType[0].value : ENUMS.PharmacyPitstopType[1].value,
        "medicineName": "Ggg",
        "detail": "Tyy",
        "images": null,
        "voiceRecording": null,
        "latitude": 33.668588228350195,
        "longitude": 73.0749367363751,
        "title": "Vapes Direct",
        "estTime": {
            "text": "15-30 mins",
            "value": 2
        },
        "estimatePrice": 2500,
        "pickUpPitstop": {
            instructions: '',
            latitude: null,
            longitude: null,
            title: null
        },
        "latitudeDelta": 0.01,
        "longitudeDelta": 0.01,
        "city": "Islamabad"
    } : {
        pharmacyPitstopType: doesPickupPitstopExists ? ENUMS.PharmacyPitstopType[0].value : ENUMS.PharmacyPitstopType[1].value,
        medicineName: '',
        detail: '',
        images: null,
        voiceRecording: null,
        latitude: null,
        longitude: null,
        title: null,
        estTime: {
            "text": "0-15 mins",
            "value": 1
        },
        estimatePrice: '',
        pickUpPitstop: {
            instructions: '',
            latitude: null,
            longitude: null,
            title: null
        },
    };

    if (pitstopItemObj) { // Auto Fill Data when come from cart to edit.
        initState = {
            ...initState,
            ...pitstopItemObj,
            detail: pitstopItemObj.description,
            images: pitstopItemObj.imageData,
            voiceRecording: pitstopItemObj.voiceNote,
            pickUpPitstop: {
                ...initState.pickUpPitstop,
                ...pitstopItemObj.pickUpPitstop,
                instructions: pitstopItemObj?.pickUpPitstop?.description ?? ''
            },
        }
        recordingItem = pitstopItemObj.voiceNote;
    }
    const [state, setState] = React.useState(initState);
    const [loader, setLoader] = React.useState(false);
    const [isAttachment, setIsAttachment] = React.useState(pitstopItemObj?.isAttachment ?? true);
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
    const imageRef = React.useRef(null);
    const outputRangeParent = isIOS ? (state.pharmacyPitstopType === 1 ? [0, 0.54] : [0, 0.74]) : [0, 0.74];

    //Validation
    const pickupValidation = state.pharmacyPitstopType === 1 ? (!isAttachment ? (state.pickUpPitstop.latitude ?? false) : (state.images === null || state.images?.length <1)) : false;
    const disabledButton = pickupValidation || state.latitude === null || state.medicineName === '' || state.detail === '' || state.estimatePrice < 1;
    //Logical Functions
    const handlePickImage = () => {
        sharedConfirmationAlert("Alert", "Pick Option!",
            [
                {
                    text: "Choose from Gallery", onPress: () => {
                        sharedLaunchCameraorGallery(0, (error) => {
                        }, picData => {
                            getPicture(picData);
                        });
                    }
                },
                {
                    text: "Open Camera", onPress: () => {
                        sharedLaunchCameraorGallery(1, (error) => {
                        }, picData => {
                            getPicture(picData);
                        });
                    }
                },
                {
                    text: "Cancel", onPress: () => {
                        console.log('Cancel Pressed');
                    }
                }
            ],
            { cancelable: false }
        )
    };
    const getPicture = picData => {
        let slicedImages = null;
        if (state.images && state.images.length) {
            slicedImages = [...state.images];
            let maxIterator = slicedImages.length === 1 && picData.assets.length === 1 ? 1
                : slicedImages.length === 1 && picData.assets.length > 2 ? 2
                    : slicedImages.length === 2 ? 1 : 3;
            for (let index = 0; index < maxIterator; index++) {
                let imgObj = picData.assets[index];
                imgObj.id = Math.floor(Math.random() * 100000)
                imgObj.fileName = imgObj.uri.split('/').pop();
                imgObj.path = imgObj.uri
                imgObj.isUploading = true;
                slicedImages.push(imgObj);
            }
        } else {
            slicedImages = picData.assets.slice(0, 3).map(_p => ({
                ..._p,
                id: Math.floor(Math.random() * 100000),
                fileName: _p.uri.split('/').pop(),
                path: _p.uri,
                isUploading: true,
            }))
        }
        imageRef.current = slicedImages;
        setState(pre => ({ ...pre, images: slicedImages }));
        sharedSendFileToServer(slicedImages ?? [], (res) => {
            const images = slicedImages.map((item, i) => ({ ...item, isUploading: false, ...res.joviImageReturnViewModelList[i] }));
            imageRef.current = images;
            setState(pre => ({ ...pre, images: images }));
        });

    };

    const toggleAttachment = (isAttachmentBool = false) => {
        if (isAttachmentBool === false && doesPickupPitstopExists) {
            Toast.info('Pickup PitStop already exists')
            return;
        }
        if (isAttachmentBool && state.pickUpPitstop.latitude) {
            sharedConfirmationAlert('Selected Pickup Location', 'Your selected pickup location will be lost if you choose this option. Are you sure?', [{
                text: 'Yes',
                onPress: () => {
                    setIsAttachment(isAttachmentBool);
                    setState(pre => ({ ...pre, pickUpPitstop: initState.pickUpPitstop }));
                }
            }, {
                text: 'No',
                onPress: () => {
                }
            }]);
        } else if (!isAttachmentBool && state.images?.length) {
            sharedConfirmationAlert('Uploaded Images', 'Your uploaded images will be lost if you choose this option. Are you sure?', [{
                text: 'Yes',
                onPress: () => {
                    setIsAttachment(isAttachmentBool);
                    setState(pre => ({ ...pre, images: null }));
                }
            }, {
                text: 'No',
                onPress: () => {
                }
            }]);
        } else {
            setIsAttachment(isAttachmentBool);
        }
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
    const clearData = () => {
        setState({ ...initState });
        recordingItem = null;
        imageRef.current = null;
    }
    const onSave = () => {
        setLoader(true)
        const index = route?.params?.pitstopItemObj?.pitstopIndex ?? null;
        let pitstopData = {
            ...state,
            isAttachment,
            pitstopIndex: route?.params?.pitstopItemObj?.pitstopIndex ?? null, // on update will get from params, 
            title: state.title,
            description: state.detail,
            pitstopName: 'Pharmacy',
            pitstopType: route.params?.pitstopItemObj?.pitstopType ?? route.params?.pitstopType ?? PITSTOP_TYPES.PHARMACY,
            // nameval: nameval.trim(),
            imageData: state.images,
            voiceNote: state.voiceRecording,
            estTime: state.estTime,
            estimatePrice: parseInt(state.estimatePrice),
            latitude: state.latitude,
            longitude: state.longitude,
            buyForMe: true,
            pickUpPitstop: state.pickUpPitstop.latitude ? {
                ...state.pickUpPitstop,
                description: state.pickUpPitstop.instructions,
            } : null,
        }
        sharedAddUpdatePitstop(pitstopData, false, [], false, false, clearData);
        recordingItem = null
        if (index !== null) {
            NavigationService.NavigationActions.common_actions.goBack();
        } else {
            NavigationService.NavigationActions.stack_actions.replace(ROUTES.APP_DRAWER_ROUTES.Cart.screen_name, {});
        }
        setLoader(false)
    }

    //UI Render Functions
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
        style={[_styles.locButton, _styles.selectLocationButton]} />)
    const renderInput = (inputProps = {}, extraStyles = {},) => (<TextInput
        style={{
            ..._styles.inputStyle,
            ...extraStyles,
        }}
        {...inputProps}
    />);
    const renderRecorder = () => {
        return <Recording
            ref={customRecordingRef}
            colors={colors}
            recordingItem={state.voiceRecording}
            onDeleteComplete={() => {
                recordingItem = null;
                voiceNoteRef.current = {}
                setState(pre => ({ ...pre, voiceRecording: null }));
            }}
            onRecordingComplete={(recordItem) => {
                console.log('Record', recordItem);
                recordingItem = recordItem;
                voiceNoteRef.current = recordItem
                sharedSendFileToServer([recordItem], (data) => {
                    setState(pre => ({ ...pre, voiceRecording: data.joviImageReturnViewModelList[0] }));
                }, 21, 2);
            }}
            onPlayerStopComplete={() => {
            }}
            caption="Record your voice note."
        />;
    }
    const renderPitStopEstTime = () => {
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
    console.log('state', state);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <StatusBar backgroundColor={colors.white} />
            <PharmacyHeaderContainer
                colors={colors}
                animScroll={animScroll}
                headerHeight={headerHeight}
                setHeaderHeight={setHeaderHeight}
                headerTop={headerTop}
                pharmacyPitstopType={state.pharmacyPitstopType}
                onPressParent={(item) => {
                    setState(pre => ({ ...pre, pharmacyPitstopType: item.value, ...item.value === 2 ? { images: null, pickUpPitstop: initState.pickUpPitstop } : {} }));
                }}
            />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={isIOS ? "padding" : "height"}>
                <Animated.View style={{
                    flex: 1,
                    zIndex: 99,
                    ...isIOS ? {
                        marginTop: 20
                    } : {},
                    backgroundColor: colors.light_grey,
                    transform: [{
                        translateY: animScroll.interpolate({
                            inputRange: [0, 10],
                            outputRange: outputRangeParent
                        })
                    }]
                }}>
                    <Animated.ScrollView
                        bounces={0}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: animScroll } } }],
                            {}
                        )}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.white, paddingHorizontal: 20, paddingVertical: 10, marginTop: HEADER_MARGIN, paddingBottom: BOTTOM_MARGIN, ..._styles.borderTopRadius }} >
                        {state.pharmacyPitstopType === 1 && <><View style={{ ..._styles.subSection, ..._styles.borderTopRadius, }}>
                            {renderSubHeading('Prescription')}
                            <Text style={{ fontSize: 12, color: colors.grey, }} fontFamily={'PoppinsLight'}>Attach prescription OR add PitStop & pick-up prescription</Text>
                            <View style={{ width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                {
                                    [{
                                        text: 'Attach File',
                                        selected: isAttachment,
                                        disabled: false,
                                        value: true,
                                    }, {
                                        text: 'Pick Up',
                                        selected: !isAttachment,
                                        value: false,
                                        disabled: doesPickupPitstopExists,
                                    }].map((item, i) => {
                                        return <TouchableOpacity key={i} onPress={() => toggleAttachment(item.value)} style={{ backgroundColor: item.selected ? colors.black : colors.white, ..._styles.prescriptionButton }}>
                                            <Text style={{ fontSize: 14, color: item.selected ? colors.white : colors.black }} fontFamily={'PoppinsLight'}>{item.text}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                            {
                                isAttachment ? <View style={{ flexDirection: 'row' }}>
                                    {
                                        state.images && state.images.map((item, index) => {
                                            return (
                                                <View key={uniqueKeyExtractor()} style={[_styles.galleryIcon, {
                                                    borderRadius: 5,
                                                    padding: 5,
                                                    height: 50,
                                                    width: 60,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',

                                                }]}>
                                                    <VectorIcon name="closecircleo" type="AntDesign" size={15} style={{ position: 'absolute', top: 0, right: 0 }} onPress={() => {
                                                        let tempArr = state.images.filter((item, _indx) => _indx !== index)
                                                        imageRef.current = tempArr;
                                                        setState(pre => ({ ...pre, images: tempArr }));
                                                    }} />
                                                    {
                                                        item.isUploading ?
                                                            <View style={{ height: 30, width: 30, borderRadius: 6 }}>
                                                                <Text>...</Text>
                                                            </View>
                                                            :
                                                            <Image source={{ uri: renderFile(item.joviImage) }} style={{ height: 30, width: 30, resizeMode: "cover", borderRadius: 6 }} />
                                                    }
                                                </View>
                                            )
                                        })}
                                    {
                                        (state.images ? state.images?.length < 3 : true) && <TouchableOpacity onPress={handlePickImage} style={_styles.addImageButton}>
                                            <VectorIcon type={'Ionicons'} name={'add'} size={30} />
                                        </TouchableOpacity>
                                    }
                                </View> : null
                            }
                        </View>
                            {!isAttachment ? <View style={{ ..._styles.subSection, }}>
                                {renderSubHeading('Location')}
                                {renderLocationButton(() => onLocationPress('2'))}
                                {state.pickUpPitstop.latitude && renderSubHeading(state.pickUpPitstop.title ?? '')}
                                {renderSubHeading('Instructions', { marginTop: SPACING * 2, marginBottom: SPACING })}
                                {
                                    renderInput({
                                        placeholder: 'Add instructions for rider here',
                                        value: state.pickUpPitstop.instructions,
                                        onChangeText: (value) => {
                                            setState(pre => ({ ...pre, pickUpPitstop: { ...pre.pickUpPitstop, instructions: value } }));
                                        }
                                    })
                                }
                            </View> : null}
                        </>}
                        <View style={{ ..._styles.subSection, }}>
                            {renderSubHeading('Medicine Name')}
                            {
                                renderInput({
                                    placeholder: 'Enter medicine name',
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
                            {renderSubHeading('Detail', { marginBottom: SPACING })}
                            {
                                renderInput({
                                    placeholder: 'Enter details here',
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
                    </Animated.ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>
            <Button
                onPress={onSave}
                text="Save and Continue"
                textStyle={{
                    fontSize: 16,
                    fontFamily: FontFamily.Poppins.Regular
                }}
                fontFamily="PoppinsRegular"
                isLoading={loader}
                disabled={disabledButton}
                style={[_styles.locButton, _styles.saveButton]} />
        </SafeAreaView>
    );
};
