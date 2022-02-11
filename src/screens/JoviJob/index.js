import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Animated, Appearance, Easing, Image as RNImage, ScrollView, Platform, Alert, TextInput as RNTextInput, Keyboard, } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import svgs from '../../assets/svgs';
import VectorIcon from '../../components/atoms/VectorIcon';
import CustomHeader from '../../components/molecules/CustomHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import RNMediaMeta from "../../../RNMediaMeta";
import StopWatch from "react-native-stopwatch-timer/lib/stopwatch";
import { Recorder } from '@react-native-community/audio-toolkit';

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
import { addressInfo, logGoogleApiHit } from '../../helpers/Location';
import Modal from '../../components/atoms/Modal';
import FontFamily from '../../res/FontFamily';
import { multipartPostRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import AudioplayerMultiple from '../../components/atoms/AudioplayerMultiple';
import Image from '../../components/atoms/Image';
import Toast from '../../components/atoms/Toast';


export const PITSTOP_CARD_TYPES = Object.freeze({ "location": 0, "description": 1, "estimated-time": 2, "buy-for-me": 3, "estimated-price": 4, });


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
    const { stack_actions, common_actions, drawer_actions } = NavigationService.NavigationActions
    const { APP_STACKS } = ROUTES;
    const [modalVisible, setModalVisible] = useState(false)
    const [cardData, setCardData] = useState([
        {
            "idx": 1,
            "title": "Pitstop",
            "desc": "Please Add Your Pitstop Location",
            "svg": svgs.pitstopPin(),
            "isOpened": true,
            "headerColor": colors.primary,
            "key": PITSTOP_CARD_TYPES["location"],
            "showSubCard": true,
            "disabled": false,
        },
        {
            "idx": 2,
            "title": "Pitstop Details",
            "desc": "What Would You Like Your Jovi To Do ?",
            "svg": svgs.pitstopPin(),
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["description"],
            "showSubCard": true,
            "disabled": true,
        },
        {
            "idx": 3,
            "title": "Estimated Waiting Time",
            "desc": "What Is The Estimated Time Of The Job ?",
            "svg": svgs.pitStopBuy(),
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["estimated-time"],
            "showSubCard": true,
            "disabled": true,
        },
        {
            "idx": 4,
            "title": "Buy For Me ?",
            "desc": "Do You Want Us To Buy For You ?",
            "svg": svgs.pitStopEstTime(),
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["buy-for-me"],
            "showSubCard": true,
            "disabled": true,

        },
        {
            "idx": 5,
            "title": "Estimated Price",
            "desc": "What is the Estimated Price?",
            "svg": svgs.pitStopEstTime(),
            "isOpened": true,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["estimated-price"],
            "showSubCard": true,
            "disabled": false,

        },
    ])

    /******** End of Main variables *******/




    /******** Start of Animation variables *******/

    const ref = React.useRef();
    const spinValue = new Animated.Value(0);

    /******** End of Animation variables *******/




    /******** Start of pitsTop Location variables *******/

    const [nameval, setNameVal] = useState('')
    const [cityVal, setCityVal] = useState('')
    const [placeName, setPlaceName] = useState('')
    const [locationVal, setLocationVal] = useState('')
    const [scrollEnabled, setScrollEnabled] = useState(true)

    /******** End of pitsTop Location variables *******/



    /******** Start of Pitstop Details variables *******/

    const [description, setDescription] = useState('')
    const [imageData, updateImagesData] = useState([]);
    const [progress, updateProgress] = useState(0);
    const [recordingUploading, setRecordingUploading] = useState(false);
    const [isRecord, setIsRecord] = useState(false);
    const recorderRef = useRef(null);
    const recordTimeRef = useRef(null);
    const [micPress, setMicPress] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [voiceNote, setVoiceNote] = useState({})

    /******** End of Pitstop Details variables *******/




    /******** Start of other Pitstop variables *******/

    const [estVal, setEstVal] = useState('')
    const [switchVal, setSwitch] = useState(false);
    const [estTime, setEstTime] = React.useState({
        text: __DEV__ ? "Estimated Time" : "Estimated Time",
        value: __DEV__ ? 1 : 0
    });
    const [collapsed, setCollapsed] = React.useState(true);


    /******** End of other Pitstop variables *******/







    /*****************************     Start of  useEffect            ***********************************/




    useEffect(() => {
        console.log('here');
        if (route.params !== undefined && route.params !== null) {
            console.log('route.params', route.params);
            setLocationVal(route.params)
        }
    }, [route])


    /*****************************     End of useEffect            ***********************************/





    const toggleCardData = (key = PITSTOP_CARD_TYPES["location"], color = colors.primary) => {
        const index = cardData.findIndex(i => i.key === key);
        // cardData[index].isOpened = open;
        cardData[index].headerColor = color;
        setCardData(cardData);
    };//end of toggleCardData



    /************   Start of functions of Pitstop location Component Funcs    **************/


    const handleLocationSelected = (data, geometry, index, pinData, modifyPitstops = true, forceMode) => {
        Keyboard.dismiss();
        let city = "";
        if (data) {
            const addressObj = data;
            if (addressObj?.terms && Array.isArray(addressObj?.terms) && addressObj?.terms?.length >= 2) {
                city = addressObj.terms[addressObj.terms.length - 2]?.value;
            }
            else if (addressObj?.plus_code?.compound_code) {
                city = addressObj.plus_code.compound_code.replace(/\,/gi, "")?.split(/\s/gi)?.[1];
            }
        }
        else if (pinData) {
            const addressObj = pinData?.addressObj;
            if (addressObj?.plus_code?.compound_code) {
                city = addressObj.plus_code.compound_code.replace(/\,/gi, "")?.split(/\s/gi)?.[1];
            }
        }
        setCityVal(city)
        setLocationVal(data && (data.name ? data.name : data.description))
        toggleCardData(PITSTOP_CARD_TYPES["description"]);
    };

    const onLocationSearchInputChange = (value) => {
        if ((value && value !== '') || value === false) {
            setLocationVal(value)
        }
    }
    const handleSetFavClicked = () => { }


    const onLocationPress = () => {
        common_actions.navigate(ROUTES.APP_ROUTES.Map.screen_name)
    }

    /************   End of functions of Pitstop location Component Funcs    **************/


    const getRemainingAmount = () => {
        let RA = GV.MAX_JOVI_AMOUNT - estVal
        return RA
    }



    /************   Start of functions of Pitstop Details Component  Funcs   **************/

    const pitStopImage = (obj = null) => {
        // if (deleteIndex !== null) {
        //     pitStopArr[index].imagesArr.splice(deleteIndex, 1);
        // } else {
        //     if (!("imagesArr" in pitStopArr[index])) {
        //         pitStopArr[index].imagesArr = [];
        //     }

        //     pitStopArr[index].imagesArr.push(obj);
        // }

        // setState((prevState) => ({
        //     ...prevState,
        //     pitstops: pitStopArr
        // }));
        imageData.push(obj)
        updateImagesData(imageData)

    };

    const getPicture = picData => {
        if (picData.length > 1) {
            for (let i = 0; i < 3; i++) {
                pitStopImage({
                    id: Math.floor(Math.random() * 100000),
                    fileName: picData[i].path.split('/').pop(),
                    path: picData[i].path,
                    isUploading: true,
                }, null)
            }
        }
        else {
            pitStopImage({
                id: Math.floor(Math.random() * 100000),
                fileName: picData[0].path.split('/').pop(),
                path: picData[0].path,
                isUploading: true,
            }, null);
        }



        // const obj = {
        //     id: Math.floor(Math.random() * 100000),
        //     uri: Platform.OS === 'android' ? picData.uri : picData.uri.replace("file://", ""),
        //     name: picData.uri.split('/').pop(),
        //     type: picData.type,
        // }
        // let formData = new FormData()
        // for (let index = 0; index < [{ ...obj }].length; index++) {

        //     formData.append(`JoviImageList[${index}].JoviImage`, obj[index])
        //     formData.append(`JoviImageList[${index}].JoviImageID`, 0)
        //     formData.append(`JoviImageList[${index}].FileType`, 21) //21 because of adding in order
        //     formData.append(`JoviImageList[${index}].FileExtensionType`, 1)
        // }

        // multipartPostRequest(
        //     Endpoints.ADD_PITSTOPIMAGE,
        //     formData,
        //     res => {
        //         //SUCCESS HANDLER
        //         const resAt0 = res.joviImageReturnViewModelList[0];
        //         pitStopImage({
        //             id: resAt0.joviImageID,
        //             fileName: resAt0.joviImage.split('/').pop(),
        //             path: resAt0.joviImage,
        //             ...resAt0,
        //         }, null);
        //         toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
        //     },
        //     err => {
        //         pitStopImage(null, imageData.lastIndex);
        //     },
        //     {})
    };



    const pitStopVoiceNote = (obj = null, del = false) => {
        if (del) {
            setVoiceNote(null)
            setIsDeleted(true)
            setIsRecord(false)
        } else {
            setVoiceNote(obj)
        }
    };



    const deleteRecording = async () => {
        if (isRecord) {
            pitStopVoiceNote(null, true);
            // const joviImageID = recorderRef.current?.joviImageID ?? -1;
            // console.log('VR IS===> on del joviImageID', joviImageID);

            // if (joviImageID !== -1) { 

            // }
            // Multipart.deleteFile(joviImageID, { ...parentProps, dispatch: parentDispatch }, () => {
            //     //SUCCESS HANDLER

            //     updateProgress(0);
            // }, () => {
            //     //ERROR HANDLER
            //     setIsDeleted(false);

            //     updateProgress(0);
            // });


        }
    };//end of deleteRecording

    const recordingPress = async () => {
        if (!micPress) {
            askForAudioRecordPermission((allowRecording) => {
                console.log('allowRecording ', allowRecording);
                const fileName = "record-" + new Date().getTime() + ".mp4";
                recorderRef.current = new Recorder(fileName).record();
                setMicPress(!micPress);
                console.log('recorderRef.current ', recorderRef.current);
            })
        } else {
            setMicPress(!micPress);
            if (recorderRef.current !== null) {
                recorderRef.current.stop((error) => {
                    if (!error) {
                        const path = recorderRef.current._fsPath;
                        RNMediaMeta.get(`${path}`)
                            .then(metadata => {
                                if (`${metadata.duration}` > `0`) {

                                    const obj = {
                                        id: Math.floor(Math.random() * 100000),
                                        uri: Platform.OS === "android" ? `file://${path}` : path,
                                        name: path.split('/').pop(),
                                        type: "audio/mp4",
                                    }

                                    setIsRecord(true);
                                    setRecordingUploading(false);
                                    //SUCCESS HANDLER

                                    // const resAt0 = res.joviImageReturnViewModelList[0];

                                    pitStopVoiceNote(obj, false);

                                    setIsRecord(true);
                                    toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
                                    // updateProgress(0);
                                    // setRecordingUploading(false);
                                    // Multipart.upload([{ ...obj }], { ...parentProps, dispatch: parentDispatch }, false, (uploadPercentage) => {
                                    //     //UPLOAD PROGRESS HANDLER
                                    //     updateProgress(parseInt(uploadPercentage));
                                    // }, (res) => {
                                    //     //SUCCESS HANDLER

                                    //     const resAt0 = res.joviImageReturnViewModelList[0];

                                    //     pitStopVoiceNote({
                                    //         _fsPath: renderPicture(resAt0.joviImage),
                                    //         ...resAt0,
                                    //     }, false);

                                    //     setIsRecord(true);
                                    //     toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
                                    //     updateProgress(0);
                                    //     setRecordingUploading(false);

                                    // }, () => {
                                    //     //ERROR HANDLER
                                    //     updateProgress(0);
                                    //     setIsRecord(false);
                                    //     setIsDeleted(true);
                                    //     setRecordingUploading(false);
                                    // })

                                }
                            })
                            .catch(err => {
                                console.log('recorderRef.current Media meta Error   ', err)
                                setIsRecord(false);
                            });
                    }
                    else {
                        Alert.alert("Error Occurred while Recording Audio!");
                        setIsRecord(false);
                    }
                });
            } else {
                setIsRecord(false);
            }

        }
    };//end of recordingPress

    /************   End of functions of Pitstop Details Component  Funcs   **************/




    // /************   Start of Shared Card Header function     **************/
    const disabledHandler = (index, disabled) => {
        let isDisable = true;
        if (disabled) {
            if (index === 1 && locationVal.length) {
                isDisable = false;
            }
            if (index === 2 && description.length) {
                isDisable = false;
            }
            if (index === 3 && estTime.text.includes('mins' || 'hour')) {
                isDisable = false;
            }
            if (index === 4 && estTime.text.includes('mins' || 'hour') && switchVal) {
                isDisable = false;
            }

        } else {
            isDisable = false;
        }
        return isDisable;
    }
    const renderHeader = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled) => {
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
                    setCardData([...cardData].map(object => {
                        if (object.idx === idx) {
                            return {
                                ...object,
                                isOpened: !object.isOpened,
                                headerColor: isDisabled ? colors.lightGreyBorder : colors.primary,
                                showSubCard: (
                                    idx === 5 ?
                                        switchVal ?
                                            true :
                                            false :
                                        true
                                )
                            }
                        }
                        else return object;
                    }))
                    ref.current.animateNextTransition();
                }} />
        )
    }

    // /************   End of Shared Card Header function     **************/






    /************   Start of Body function     **************/
    const renderBody = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled) => {

        if (idx === 1) {
            return renderPitStopLocation(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled)
        } else if (idx === 2) {
            return renderPitStopDetails(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled)
        } else if (idx === 3) {
            return renderPitStopEstTime(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled)
        } else if (idx === 4) {
            return renderPitStopBuy(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled)
        } else if (idx === 5) {
            return renderPitStopEstPrice(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled)
        }
        else {
            return <View />
        }
    }


    /************   End of Body function     **************/



    /************   Start of pitstopLocation component     **************/

    const renderPitStopLocation = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled) => {

        return (
            <PitStopLocation
                nameVal={nameval}
                locationVal={locationVal}
                isOpened={isOpened}
                onChangeName={(text) => { setNameVal(text) }}
                onLocationPress={onLocationPress}
                handleLocationSelected={handleLocationSelected}
                onLocationSearchInputChange={onLocationSearchInputChange}
                onNearbyLocationPress={() => onLocationSearchInputChange(false)}
                clearInputField={() => setLocationVal('')}
                handleInputFocused={(index, isFocus) => {
                    console.log('index', index)
                    setScrollEnabled(isFocus)
                }}
                handleSetFavClicked={handleSetFavClicked}
            />
        )
    }
    /************   End of pitstopLocation component  **************/



    /************   Start of render pitstop details  function     **************/


    const renderPitStopDetails = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled) => {
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
                                setModalVisible(true)

                        }}
                        text="Browse"
                        textStyle={styles.btnText}
                        fontFamily="PoppinsRegular"
                        style={styles.locButton} />
                    {(imageData.length > 0 ? imageData : new Array(1).fill({ index: 1 })).map((item, index) => {
                        const itemSize = Object.keys(item).length;
                        if (itemSize > 1) {
                            return (
                                <View key={`item path ${item.path}`} style={styles.galleryIcon}>
                                    <Image source={{ uri: item.path }} style={{ height: 25, width: 25, resizeMode: "cover", borderRadius: 6 }} />
                                </View>
                            )
                        }
                        return (
                            <View key={`item path ${item.index}`} style={styles.galleryIcon} >
                                <VectorIcon name="image" type="Ionicons" color={colors.primary} size={25} style={{ marginRight: 5 }} />
                                <VectorIcon name="image" type="Ionicons" color={colors.text} size={25} style={{ marginRight: 5 }} />
                                <VectorIcon name="image" type="Ionicons" color={colors.text} size={25} style={{ marginRight: 5 }} />
                            </View>
                        )
                    })}
                </View>


                <Text style={styles.attachment} >Voice Notes</Text>

                <View style={styles.voiceNoteContainer} >
                    {recordingUploading ?
                        <View style={descriptionStyles.progress}>
                            <View style={{
                                ...descriptionStyles.progressActive,
                                backgroundColor: colors.primary,
                                maxWidth: `${progress}%`,
                            }} />
                        </View>
                        : isRecord ?
                            <View style={{ ...styles.rowContainer, maxWidth: "90%", marginRight: 12, }}>
                                <AudioplayerMultiple
                                    activeTheme={colors}
                                    audioURL={recorderRef.current?._fsPath}
                                    forceStopAll={isDeleted}
                                    width={Platform.OS === "ios" ? "90%" : "95%"}
                                />

                                <TouchableOpacity onPress={deleteRecording} style={{ marginTop: -20 }}>
                                    <VectorIcon
                                        name={"delete-outline"}
                                        type="MaterialCommunityIcons"
                                        color={"red"}
                                        size={30} />
                                </TouchableOpacity>

                            </View>
                            :
                            <>
                                <TouchableOpacity style={{
                                    ...descriptionStyles.micIconContainer,
                                    ...!micPress && {
                                        height: 40,
                                        width: 40,
                                        backgroundColor: colors.primary,
                                    }

                                }}
                                    activeOpacity={1}
                                    onPressIn={recordingPress}>
                                    {micPress ?
                                        <RNImage
                                            source={require('../../assets/gifs/Record.gif')}
                                            style={{ height: 50, width: 50, }} />
                                        :
                                        <View style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: colors.primary, justifyContent: "center", alignItems: 'center' }} >
                                            <VectorIcon name="keyboard-voice" type="MaterialIcons" color={colors.textColor} size={20} />
                                        </View>
                                    }
                                </TouchableOpacity>

                                {micPress ?
                                    <>
                                        <RNTextInput
                                            ref={recordTimeRef}
                                            multiline={false}
                                            showSoftInputOnFocus={false}
                                            editable={false}
                                            caretHidden={true}
                                            placeholder={""}
                                            style={{ width: 65, color: 'red', fontSize: 15, borderRadius: 20, height: 40, paddingRight: 15, borderColor: "transparent", borderWidth: 0, paddingTop: 8, paddingBottom: 9 }}
                                        />
                                        <StopWatch
                                            start={true}
                                            reset={false}
                                            getTime={(time) => {
                                                console.log('time    ', time);
                                                recordTimeRef.current?.setNativeProps({ text: time.substring(time.indexOf(":") + 1, time.length) })
                                            }}
                                            options={{
                                                container: { backgroundColor: '#fff', display: "none" },
                                                text: { fontSize: 14, color: colors.primary, display: "none" }
                                            }}
                                        />
                                    </>
                                    :
                                    <Text style={{
                                        ...descriptionStyles.recordVoiceText,
                                    }}>{'Record your voice note'}</Text>
                                }
                            </>
                    }
                </View>

            </PitStopDetails>
        )
    }

    /************   End of render pitstop details  function     **************/




    /************   Start of render pitstop est time  function     **************/

    const renderPitStopEstTime = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);

        return (
            <PitStopEstTime
                collapsed={collapsed}
                estTime={estTime}
                isOpened={isDisabled ? false : isOpened}
                onEstTimePress={(item) => {
                    setEstTime(item);
                    setCollapsed(!collapsed);
                    toggleCardData(PITSTOP_CARD_TYPES["buy-for-me"]);
                }}
                onPressDropDown={() => {
                    setCollapsed(!collapsed)

                }}
            />
        )
    }

    /************   end of render pitstop est time  function     **************/



    const renderPitStopBuy = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);

        return (
            <PitStopBuy
                switchVal={switchVal}
                isOpened={isDisabled ? false : isOpened}
                onToggleSwitch={(bool) => {
                    if (switchVal) cardData[index + 1].showSubCard = false
                    else cardData[index + 1].showSubCard = true
                    setSwitch(bool)
                    setCardData(cardData)
                }} />
        )
    } // End of pitstop BUY



    const onChangeSlider = (value, num) => {
        let stringVal = value.toString()
        console.log("handleValueChange=>", stringVal)
        // if (num) setEstVal(stringVal)
        // else setEstVal(value)
        // setState((prevState) => {

        //     let updatedDftDetails = { ...(prevState.dftDetails || {}) };
        //     if (value) {
        //         updatedDftDetails[key] = parseInt(value)

        //     } else {
        //         delete updatedDftDetails.estCost;
        //     }
        //     if (key === "buyForMe" && !value) delete updatedDftDetails.estCost;

        //     return {
        //         ...prevState,
        //         dftDetails: updatedDftDetails,
        //         isChanged_pitstopDetails: true
        //     }
        // });



    }
    const renderPitStopEstPrice = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled) => {
        const isDisabled = disabledHandler(index, disabled);

        return (
            <PitStopEstPrice
                estVal={estVal}
                isOpened={isDisabled ? false : isOpened}
                onChangeSliderText={
                    newsliderValue => {
                        if (!isNaN(parseInt(newsliderValue))) {
                            setEstVal(parseInt(newsliderValue))
                        }
                    }
                }
                getRemainingAmount={()=>getRemainingAmount()}
                onSliderChange={
                    newsliderValue => {
                        if (!isNaN(parseInt(newsliderValue))) {
                            setEstVal(parseInt(newsliderValue))
                        }
                    }
                } />
        )
    } //End of Pitstop est Price





    /***************************** Start of modal **************************/
    const renderModal = () => {
        return (
            <Modal
                modalVisible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible) }}
                modalViewStyles={{}}
            >
                <Text style={{ paddingVertical: 20 }} >Pick an Option!</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <Button onPress={() => {
                        sharedLaunchCameraorGallery(1, () => { }, picData => {
                            getPicture(picData);
                            setModalVisible(false)
                        });
                    }} style={{ width: '30%', marginRight: 10 }} textStyle={{ fontFamily: FontFamily.Poppins.Medium, fontWeight: 'normal', fontSize: 9 }} text="Take Photo" />
                    <Button onPress={() => {
                        sharedLaunchCameraorGallery(0, () => { }, picData => {
                            getPicture(picData);
                            setModalVisible(false)
                        });
                    }} style={{ width: '30%' }} textStyle={{ fontFamily: FontFamily.Poppins.Medium, fontWeight: 'normal', fontSize: 9 }} text="Choose Image from Gallery" />
                </View>
            </Modal>)
    }
    /***************************** END of modal **************************/


    return (
        <SafeAreaView style={{ flex: 1 }} >
            <CustomHeader leftIconName="keyboard-backspace" leftIconType="MaterialCommunityIcons" leftIconSize={30} />
            <ScrollView nestedScrollEnabled={true} scrollEnabled={scrollEnabled} style={{ backgroundColor: 'white' }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always" >
                <Transitioning.View
                    ref={ref}
                    transition={transition}
                    style={styles.container}>
                    {cardData.map(({ idx, title, desc, svg, isOpened, key, headerColor, showSubCard, disabled }, index) => {
                        return (
                            showSubCard &&
                            <View
                                key={`card mapping ${idx}`}
                                style={[{ ...styles.cardView, zIndex: idx === 3 ? 99 : 9 }]}>
                                {renderHeader(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled)}
                                {renderBody(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index, disabled)}
                            </View >

                        );
                    })
                    }
                    <>
                        <Button
                            text="Save and Continue"
                            onPress={() => {
                                let pitstopData = {
                                    pitstopID: 123, // on update will got from params, 
                                    pitstopType: 2,
                                    nameval,
                                    locationVal,
                                    imageData,
                                    voiceNote,
                                    description,
                                    estTime,
                                    estVal
                                }
                                console.log('pitstopData', pitstopData);
                            }}
                            style={[styles.locButton, { height: 45, marginVertical: 10 }]}
                            textStyle={styles.btnText}
                            fontFamily="PoppinsRegular"
                        />
                    </>
                    {renderModal()}
                </Transitioning.View>
            </ScrollView>
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
        fontWeight: "bold",
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
