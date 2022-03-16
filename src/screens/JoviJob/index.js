import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Animated, Appearance, Easing, Image as RNImage, ScrollView, Platform, Alert, TextInput as RNTextInput, Keyboard, FlatList, ActivityIndicator, } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import svgs from '../../assets/svgs';
import VectorIcon from '../../components/atoms/VectorIcon';
import CustomHeader from '../../components/molecules/CustomHeader';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import RNMediaMeta from "../../../RNMediaMeta";
import StopWatch from "react-native-stopwatch-timer/lib/stopwatch";
import { Recorder, Player } from '@react-native-community/audio-toolkit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import CardHeader from './components/CardHeader';
import PitStopBuy from './components/PitStopBuy';
import PitStopDetails from './components/PitStopDetails';
import PitStopEstPrice from './components/PitStopEstPrice';
import PitStopEstTime from './components/PitStopEstTime';
import PitStopLocation from './components/PitStopLocation';
import Button from '../../components/molecules/Button';
import GV from '../../utils/GV';
import theme from '../../res/theme';
import joviJobStyles from './styles';
import constants from '../../res/constants';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import { askForAudioRecordPermission, sharedLaunchCameraorGallery } from '../../helpers/Camera';
import { hybridLocationPermission } from '../../helpers/Location';
import { multipartPostRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import AudioplayerMultiple from '../../components/atoms/AudioplayerMultiple';
import Image from '../../components/atoms/Image';
import { confirmServiceAvailabilityForLocation, sharedAddUpdatePitstop, sharedConfirmationAlert, sharedExceptionHandler, uniqueKeyExtractor } from '../../helpers/SharedActions';
import Toast from '../../components/atoms/Toast';
import Regex from '../../utils/Regex';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/actions';
import FontFamily from '../../res/FontFamily';
import Recording from '../../components/organisms/Recording';

export const PITSTOP_CARD_TYPES = Object.freeze({ "location": 0, "description": 1, "estimated-time": 2, "buy-for-me": 3, "estimated-price": 4, });
let updateCardOnHeaderPressItem = {};
let closeSecondCard = false;
let recordingItem = null;

export default ({ navigation, route }) => {
    const transition = (
        <Transition.Together>
            <Transition.Out
                type="fade"
                durationMs={200}
            />
            <Transition.Change />
            <Transition.In
                type="fade"
                durationMs={200}
            />
        </Transition.Together>
    );
    /******** Start of Main variables *******/

    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    // colors.primary will recieve value from colors.js file's colors
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    const dispatch = useDispatch()
    const { prevOrders } = useSelector(state => state.userReducer)
    const { stack_actions, common_actions, drawer_actions } = NavigationService.NavigationActions
    const { APP_STACKS } = ROUTES;
    const homeFadeIn = React.useRef(new Animated.Value(0)).current;

    const initCartData = [
        {
            "idx": 1,
            "title": "Pitstop",
            "desc": "Please Add Your Pitstop Location",
            "svg": svgs.pitstopPin(),
            "isOpened": true,
            "headerColor": colors.primary,
            "key": PITSTOP_CARD_TYPES["location"],
            "disabled": false,
        },
        {
            "idx": 2,
            "title": "Pitstop Details",
            "desc": "What Would You Like Your Jovi To Do ?",
            "svg": svgs.pitstopPin(),
            "isOpened": false,
            // "isOpened": __DEV__ ? true : false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["description"],
            "disabled": true,
            // "disabled": __DEV__ ? false : true,
        },
        {
            "idx": 3,
            "title": "Estimated Waiting Time",
            "desc": "What Is The Estimated Time Of The Job ?",
            "svg": svgs.pitStopEstTime(),
            "isOpened": false,
            // "isOpened": __DEV__ ? true : false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["estimated-time"],
            "disabled": true,
            // "disabled": __DEV__ ? false : true,
        },
        {
            "idx": 4,
            "title": "Buy For Me ?",
            "desc": "Do You Want Us To Buy For You ?",
            "svg": svgs.pitStopBuy(),
            // "isOpened": __DEV__ ? true : false,
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["buy-for-me"],
            "disabled": true,
            // "disabled": __DEV__ ? false : true,

        },
        {
            "idx": 5,
            "title": "Estimated Price",
            "desc": "What is the Estimated Price?",
            "svg": svgs.pitStopEstPrice(),
            "isOpened": false,
            // "isOpened": __DEV__ ? true : false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["estimated-price"],
            "disabled": true,
            // "disabled": __DEV__ ? false : true,

        },
    ]
    const [cardData, setCardData] = useState(initCartData)

    const cardRef = React.useRef(initCartData);
    /******** End of Main variables *******/
    React.useEffect(() => {
        cardRef.current = cardData;
    }, [cardData]);



    /******** Start of Animation variables *******/

    const ref = React.useRef();
    const spinValue = new Animated.Value(0);

    /******** End of Animation variables *******/




    /******** Start of pitsTop Location variables *******/

    const [nameval, setNameVal] = useState('')
    const [cityVal, setCityVal] = useState('')
    const [placeName, setPlaceName] = useState('')
    const [locationVal, setLocationVal] = useState('')
    // const [locationVal, setLocationVal] = useState(__DEV__ ? 'Islamabad' : '')
    const [scrollEnabled, setScrollEnabled] = useState(true)
    const latitudeRef = React.useRef(__DEV__ ? constants.i8_markaz.latitude : null);
    const longitudeRef = React.useRef(__DEV__ ? constants.i8_markaz.longitude : null);

    const animatedValues = [
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,
        React.useRef(new Animated.Value(0)).current,

    ]//currently animated Tabs are here in array, due to some issue, dynamic animated tabs couldn't be used right now, in future it will be implemented IA
    const loadEach = (index) => {
        setTimeout(() => {
            Animated.timing(animatedValues[index], {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        }, index === 0 ? 50 : ((index / 10) * 1000) + (100 * index))
    }
    /******** End of pitsTop Location variables *******/



    /******** Start of Pitstop Details variables *******/

    // const [description, setDescription] = useState(__DEV__ ? 'HELLOO' : '')
    const [description, setDescription] = useState('')
    const [imageData, updateImagesData] = useState([]);

    const [, updateStateaaa] = React.useState();
    const forceUpdate = React.useCallback(() => updateStateaaa({}), []);



    const [progress, updateProgress] = useState(0);
    const [recordingUploading, setRecordingUploading] = useState(false);
    const [isRecord, setIsRecord] = useState(false);
    const recorderRef = useRef(null);
    const customRecordingRef = useRef(null);
    const recordTimeRef = useRef(null);
    const [micPress, setMicPress] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [forceDeleted, setForceDeleted] = useState(false);
    const [loader, setLoader] = useState(false);
    const [voiceNote, setVoiceNote] = useState({})

    /******** End of Pitstop Details variables *******/




    /******** Start of other Pitstop variables *******/
    const cartReducer = useSelector((store) => {
        return store.cartReducer;
    });
    const remainingAmount = cartReducer.joviRemainingAmount;
    const [estVal, setEstVal] = useState('')
    // const [estVal, setEstVal] = useState(__DEV__ ? "1500" : '')
    const [initialEstVal, setInitialEstVal] = useState('')
    const [switchVal, setSwitch] = useState(remainingAmount === 0 ? false : true);
    // const [estTime, setEstTime] = React.useState({
    //     text: __DEV__ ? '0-15 mins' : "Estimated Time",
    //     value: __DEV__ ? 1 : 0
    // });
    const [estTime, setEstTime] = React.useState({
        text: "Estimated Time",
        value: 0
    });
    const [collapsed, setCollapsed] = React.useState(true);


    /******** End of other Pitstop variables *******/






    const clearData = () => {
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Cart.screen_name);
        setCardData(initCartData);
        setNameVal("");
        setCityVal("");

        setLocationVal("");

        setScrollEnabled(true);

        setDescription("");

        updateImagesData([]);

        setRecordingUploading(false);


        setIsRecord(false);

        setMicPress(false);
        setIsDeleted(false);
        setVoiceNote({});

        setEstVal("");

        setSwitch(true);

        setEstTime({ text: "Estimated Time", value: 0 })
        setCollapsed(true)

    }
    /*****************************     Start of  useEffect            ***********************************/


    // to be used for editing purposes
    useEffect(() => {
        if (route?.params?.pitstopItemObj) {
            const { title, nameval, imageData, voiceNote, estTime, description, estimatePrice } = route.params.pitstopItemObj;
            setLocationVal(title)
            setNameVal(nameval)
            updateImagesData(imageData)
            setVoiceNote(voiceNote)
            setEstTime(estTime)
            setDescription(description)
            setEstVal(estimatePrice)
        }
    }, [route])


    React.useEffect(() => {
        if (forceDeleted) {
            updateCardOnHeaderPress(updateCardOnHeaderPressItem);
            setForceDeleted(false);
        }
    }, [forceDeleted]);

    React.useEffect(() => {
        if (isDeleted) {
            setVoiceNote({});
            setIsRecord(false);
            setIsDeleted(false);
        }
    }, [isDeleted])


    const locationHandler = async () => {
        await hybridLocationPermission();
    }
    /*****************************     End of useEffect            ***********************************/





    const toggleCardData = (key = PITSTOP_CARD_TYPES["location"], color = colors.primary) => {
        const cardData = cardRef.current;
        const index = cardData.findIndex(i => i.key === key);
        cardData[index].headerColor = color;
        cardData[index].isOpened = true;
        setCardData(cardData);
        forceUpdate()
    };//end of toggleCardData



    /************   Start of functions of Pitstop location Component Funcs    **************/


    const handleLocationSelected = (locData, geometry, index, pinData, modifyPitstops = true, forceMode) => {
        locationHandler()
        const { lat, lng } = geometry.location
        Keyboard.dismiss();
        confirmServiceAvailabilityForLocation(postRequest, lat, lng, (resp) => {
            const { data } = resp
            latitudeRef.current = lat
            longitudeRef.current = lng
            setCityVal(data.googleAddressViewModel.city)
            setLocationVal(locData && (locData.name ? locData.name : locData.description))
            setScrollEnabled(true)
            toggleCardData(PITSTOP_CARD_TYPES["description"], colors.primary)
        }, (error) => {
            sharedExceptionHandler(error);
        })
    };

    const onLocationSearchInputChange = (value) => {
    }
    const handleSetFavClicked = () => { }


    const onLocationPress = () => {
        common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name, { onNavigateBack: (placeName) => cb(placeName), index: 1 })
    }
    const cb = (resp) => {
        latitudeRef.current = resp.latitude
        longitudeRef.current = resp.longitude
        setLocationVal(resp.title)
        toggleCardData(PITSTOP_CARD_TYPES["description"], colors.primary)
    }
    /************   End of functions of Pitstop location Component Funcs    **************/



    const getRemainingAmount = () => {
        let RA = remainingAmount - estVal
        return RA
    }



    /************   Start of functions of Pitstop Details Component  Funcs   **************/


    const getPicture = picData => {
        let slicedImages = null;
        if (imageData.length) {
            slicedImages = [...imageData];
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
                id: Math.floor(Math.random() * 100000),
                fileName: _p.uri.split('/').pop(),
                path: _p.uri,
                isUploading: true,
            }))
        }
        // toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
        updateImagesData(slicedImages);

    };


    React.useEffect(() => {
    }, [micPress])

    /************   End of functions of Pitstop Details Component  Funcs   **************/


    // /************   Start of MAIN UI function     **************/
    const renderMainUI = (idx, title, desc, svg, isOpened, key, headerColor, disabled, index) => {
        return (
            <Animated.View
                key={`card mapping ${idx}`}
                style={[{
                    ...styles.cardView, zIndex: idx === 3 ? 99 : 9, opacity: animatedValues[index],
                    transform: [{
                        scale: animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.6, 1]
                        })
                    }],
                }]}>

                {renderHeader(idx, title, desc, svg, isOpened, key, headerColor, index, disabled)}
                {renderBody(idx, title, desc, svg, isOpened, key, headerColor, index, disabled)}
            </Animated.View >
        )
    }

    /************   End of MAIN UI function  **************/



    // /************   Start of Shared Card Header function     **************/
    const disabledHandler = (index, disabled) => {
        let isDisable = true;
        if (disabled) {
            if (index === 1 && locationVal.length) {
                // console.log('index wise Condition','1',index,index === 1 && locationVal.length);
                isDisable = false;
            }
            else if (index === 2 && (description.length || imageData.length || Object.keys(voiceNote).length)) {
                // console.log('index wise Condition','2',index,index === 2 && description.length || imageData.length || Object.keys(voiceNote).length);
                isDisable = false;
            }
            else if (index === 3 && estTime.value > 0) {
                // console.log('index wise Condition','3',index,index === 3 && estTime.value > 0);
                isDisable = false
            }
            else if (index === 4 && (estTime.value !== 0)) {
                // console.log('index wise Condition','4',index, );
                isDisable = false;
            }

        } else {
            isDisable = false;
        }
        return isDisable;
    }


    const updateCardOnHeaderPress = (item) => {
        const { idx, isDisabled, } = item;
        setCardData([...cardData].map(object => {
            if (object.idx === idx) {
                return {
                    ...object,
                    isOpened: !object.isOpened,
                    headerColor: isDisabled ? colors.lightGreyBorder : colors.primary,
                }
            }
            else return object;
        }))
        ref.current.animateNextTransition();
    }

    const renderHeader = (idx, title, desc, svg, isOpened, key, headerColor, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);

        return (
            <CardHeader
                title={title}
                description={desc}
                xmlSrc={svg}
                isOpened={isOpened}
                style={styles.cardContainer}
                headerBackgroundColor={isDisabled ? colors.lightGreyBorder : headerColor}
                activeOpacity={0.9}
                disabled={isDisabled}
                onHeaderPress={() => {
                    const isRecording=customRecordingRef.current?.isRecording()??false;
                    updateCardOnHeaderPressItem = {
                        idx, title, desc, svg, isOpened, headerColor, index, disabled, isDisabled
                    };

                    if (idx === 2 && isOpened && isRecording) { //AHMED KH RHA KOI 2 ko change nh kry ga... ;-P
                        //WHEN DESCRIPTION TOGGLE 
                        closeSecondCard = true;
                        customRecordingRef.current?.setStopRecording(true);
                        customRecordingRef.current?.setStopAudioPlayer(true);
                    } else {
                        updateCardOnHeaderPress(updateCardOnHeaderPressItem);
                    }
                    setScrollEnabled(true)
                }} />
        )
    }

    // /************   End of Shared Card Header function     **************/






    /************   Start of Body function     **************/
    const renderBody = (idx, title, desc, svg, isOpened, key, headerColor, index, disabled) => {

        if (idx === 1) {
            return renderPitStopLocation(idx, title, desc, svg, isOpened, key, headerColor, index, disabled)
        } else if (idx === 2) {
            return renderPitStopDetails(idx, title, desc, svg, isOpened, key, headerColor, index, disabled)
        } else if (idx === 3) {
            return renderPitStopEstTime(idx, title, desc, svg, isOpened, key, headerColor, index, disabled)
        } else if (idx === 4) {
            return renderPitStopBuy(idx, title, desc, svg, isOpened, key, headerColor, index, disabled)
        } else if (idx === 5) {
            return renderPitStopEstPrice(idx, title, desc, svg, isOpened, key, headerColor, index, disabled)
        }
        else {
            return <View />
        }
    }


    /************   End of Body function     **************/



    /************   Start of pitstopLocation component     **************/

    const renderPitStopLocation = (idx, title, desc, svg, isOpened, key, headerColor, index, disabled) => {

        return (
            <PitStopLocation
                nameVal={nameval}
                // locationVal={locationVal}
                isOpened={isOpened}
                onChangeName={(text) => { setNameVal(text) }}
                onLocationPress={onLocationPress}
                handleLocationSelected={handleLocationSelected}
                onLocationSearchInputChange={onLocationSearchInputChange}
                onNearbyLocationPress={() => locationHandler()}
                clearInputField={() => setLocationVal('')}
                handleInputFocused={(index, isFocus) => {
                    setScrollEnabled(isFocus)
                }}
                handleSetFavClicked={handleSetFavClicked}
                textToShow={locationVal}
            />
        )
    }
    /************   End of pitstopLocation component  **************/



    /************   Start of render pitstop details  function     **************/


    const renderPitStopDetails = (idx, title, desc, svg, isOpened, key, headerColor, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);
        return (
            <PitStopDetails
                description={description}
                isOpened={isDisabled ? false : isOpened}
                onChangeDescription={(t) => {
                    setDescription(t)
                    toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
                }}>
                <View>
                    <Button
                        disabled={!(imageData.length < GV.MAX_PITSTOP_IMAGE_LIMIT)}
                        onPress={() => {
                            if (imageData.length < GV.MAX_PITSTOP_IMAGE_LIMIT)
                                // onBrowsePress
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

                        }}
                        text="Browse"
                        textStyle={styles.btnText}
                        fontFamily="PoppinsRegular"
                        style={{ ...styles.locButton, width: WIDTH - 70 }} />
                    <ScrollView horizontal={true} style={styles.galleryIcon} >
                        {
                            imageData.map((item, index) => {
                                return (
                                    <View key={uniqueKeyExtractor()} style={[styles.galleryIcon, {
                                        borderRadius: 5,
                                        padding: 5,
                                        height: 50,
                                        width: 60,
                                        justifyContent: 'center',
                                        alignItems: 'center'

                                    }]}>
                                        <VectorIcon name="closecircleo" type="AntDesign" size={15} style={{ position: 'absolute', top: 0, right: 0 }} onPress={() => {
                                            let tempArr = imageData.filter((item, _indx) => _indx !== index)
                                            updateImagesData(tempArr)
                                        }} />
                                        <Image source={{ uri: item.path }} style={{ height: 30, width: 30, resizeMode: "cover", borderRadius: 6 }} />
                                    </View>
                                )
                            })}
                    </ScrollView>
                </View>


                <Text style={styles.attachment} >Voice Notes</Text>
                <Recording
                    ref={customRecordingRef}
                    colors={colors}
                    recordingItem={recordingItem}
                    onDeleteComplete={() => {
                        recordingItem = null;
                    }}
                    onRecordingComplete={(recordItem) => {
                        recordingItem = recordItem;
                        if (closeSecondCard) {
                            updateCardOnHeaderPress(updateCardOnHeaderPressItem);
                            closeSecondCard = false;
                        }
                    }}
                    onPlayerStopComplete={() => {
                        if (closeSecondCard) {
                            updateCardOnHeaderPress(updateCardOnHeaderPressItem);
                            closeSecondCard = false;
                        }
                    }}
                    caption="Record your voice note."
                />
            </PitStopDetails>
        )
    }

    /************   End of render pitstop details  function     **************/




    /************   Start of render pitstop est time  function     **************/

    const renderPitStopEstTime = (idx, title, desc, svg, isOpened, key, headerColor, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);

        return (
            <PitStopEstTime
                collapsed={collapsed}
                estTime={estTime}
                isOpened={isDisabled ? false : isOpened}
                onEstTimePress={(item) => {
                    console.log('item ==>>>', item);
                    setEstTime(item);
                    setCollapsed(true);
                    toggleCardData(PITSTOP_CARD_TYPES["buy-for-me"]);
                }}
                onPressDropDown={() => {
                    setCollapsed(!collapsed)

                }}
            />
        )
    }

    /************   end of render pitstop est time  function     **************/



    const renderPitStopBuy = (idx, title, desc, svg, isOpened, key, headerColor, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);
        return (
            <PitStopBuy
                switchVal={switchVal}
                isOpened={isDisabled ? false : isOpened}
                onToggleSwitch={(bool) => {
                    toggleCardData(PITSTOP_CARD_TYPES["estimated-price"], colors.primary)
                    setSwitch(bool)
                }} />
        )
    } // End of pitstop BUY


    const renderPitStopEstPrice = (idx, title, desc, svg, isOpened, key, headerColor, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);

        return (
            <PitStopEstPrice
                estVal={isNaN(parseInt(`${estVal}`)) ? '' : parseInt(`${estVal}`)}
                textinputVal={`${estVal}`}
                isOpened={isDisabled ? false : isOpened}
                onChangeSliderText={newsliderValue => {
                    if (Regex.numberOnly.test(newsliderValue)) {
                        let remainingAmountLength = (`${remainingAmount}`.length) - 1;
                        if (remainingAmountLength < 1) {
                            remainingAmountLength = 1;
                        }
                        const maxLengthRegex = new RegExp(`^([0-${remainingAmountLength > 1 ? '9' : remainingAmount}]{0,${remainingAmountLength}}|${remainingAmount})$`, "g");
                        if (maxLengthRegex.test(newsliderValue)) {
                            setEstVal(newsliderValue);
                            setInitialEstVal(newsliderValue);
                        }
                    }
                    else {
                        setEstVal('');
                        setInitialEstVal(0);
                    }
                }
                }
                getRemainingAmount={() => getRemainingAmount()}
                onSliderChange={(newsliderValue) => {
                    setEstVal(newsliderValue);
                }} />
        )
    } //End of Pitstop est Price

    const toggleEstPriceCard = () => {
        if (switchVal) return true
        else return false
    }

    const validationCheck = () => {
        if (locationVal !== '' && (description !== '' || Object.keys(voiceNote).length || imageData.length) && (estTime.text.includes('mins') || estTime.text.includes('hour')) && (switchVal ? parseInt(estVal) > 0 : true)) return false
        else return true
    }

    const onSaveAndContinue = () => {
        setLoader(true)
        let pitstopData = {
            pitstopIndex: route?.params?.pitstopIndex ?? null, // on update will get from params, 
            title: locationVal,
            description: description.trim(),
            pitstopName: 'Jovi Job',
            pitstopType: route.params.pitstopType,
            nameval: nameval.trim(),
            imageData,
            voiceNote,
            estTime,
            estimatePrice: parseInt(estVal),
            latitude: latitudeRef.current,
            longitude: longitudeRef.current
        }
        sharedAddUpdatePitstop(pitstopData, false, [], false, false, clearData);
        setLoader(false)

    }//end of save and continue function

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <CustomHeader leftIconColor={colors.primary} rightIconColor={colors.primary} leftIconSize={30} onLeftIconPress={() => common_actions.goBack()} />

            <Transitioning.View
                ref={ref}
                transition={transition}
                style={styles.container}>
                <KeyboardAwareScrollView nestedScrollEnabled={true} scrollEnabled={scrollEnabled} style={{}} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    {prevOrders && prevOrders.length !== 0 &&
                        <>
                            <Text style={{ fontFamily: FontFamily.Poppins.Regular, fontSize: 16, color: colors.greyish_black, paddingLeft: 15, paddingTop: 5 }} >Previous Orders</Text>
                            <ScrollView horizontal contentContainerStyle={{ marginTop: 5 }} >
                                {prevOrders.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={`prevOrders ${index}`} style={{ backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.primary, marginLeft: 15, width: WIDTH * 0.4, height: HEIGHT * 0.05, justifyContent: 'center', paddingLeft: 10 }} >
                                            <Text numberOfLines={1} style={{ fontSize: 12, color: colors.black, fontFamily: FontFamily.Poppins.Regular, width: WIDTH * 0.36 }} >{`${item.pitstopData.title}`}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: 8, fontFamily: FontFamily.Poppins.Regular, color: colors.black, opacity: 0.6, width: WIDTH * 0.36 }} >{item.pitstopData.date || `29-11-2021 Tuesday`}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </>
                    }
                    <View style={{
                        margin: 15, borderRadius: 10, backgroundColor: colors.white,
                        marginBottom: !collapsed ? 50 : 0
                    }} >
                        {cardData.map(({ idx, title, desc, svg, isOpened, key, headerColor, disabled }, index) => {
                            loadEach(index);
                            return (
                                idx === 5 ? (
                                    toggleEstPriceCard() === true &&
                                    renderMainUI(idx, title, desc, svg, isOpened, key, headerColor, disabled, index)
                                ) :
                                    renderMainUI(idx, title, desc, svg, isOpened, key, headerColor, disabled, index)

                            );
                        })
                        }
                    </View>
                </KeyboardAwareScrollView>
                <Button
                    text="Save and Continue"
                    onPress={onSaveAndContinue}
                    disabled={validationCheck()}
                    isLoading={loader}
                    style={[styles.locButton, { height: 60, marginVertical: 10 }]}
                    textStyle={[styles.btnText, { fontSize: 16 }]}
                    fontFamily="PoppinsRegular"
                    wait={0.4}
                />
            </Transitioning.View>
        </SafeAreaView >
    );
}


const descriptionStyles = StyleSheet.create({
    primaryContainer: {
        marginHorizontal: 12,
        justifyContent: "center",
        marginBottom: 17,
    },
    headingContainer: {
        marginTop: 0,
        marginBottom: 6,
        marginLeft: 0,
        marginRight: 12,
    },
    inputHeading: {
        fontWeight: "600",
        textAlign: "left",
    },
    uploadAttachmentContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,

        borderColor: "#707070",
        flexDirection: "row",
        alignItems: "center",
        height: 40,
        paddingVertical: 5,
        paddingLeft: 12,
        borderRadius: 10,
    },
    uploadAttachmentText: {
        color: "#A6A6A6",
        flex: 1,
    },
    attachmentIconContainer: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,

    },
    recordAudioContainer: {
        // marginTop: 16,
        marginLeft: 10
    },
    micIconContainer: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 40,
    },
    recordVoiceText: {
        color: "#272727",
        marginLeft: 8,
        fontFamily: FontFamily.Poppins.Regular
    },

    imageFileContainer: {
        justifyContent: "space-between",
        marginTop: 8,
    },
    fileNameText: {
        marginLeft: 6,

    },
    deleteIconContainer: {
        marginLeft: 8,
    },
    progress: {
        backgroundColor: "#C1C1C1",
        flex: 1,
        height: 10,
        borderRadius: 10,
        marginLeft: 6,
        marginRight: 12,
    },
    progressActive: {
        borderRadius: 10,
        flex: 1,
    },

});
