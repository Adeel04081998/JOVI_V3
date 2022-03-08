import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Appearance, Platform, SafeAreaView, Text as RNText, TextInput as RNTextInput } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { GiftedChat } from '../../../libs/react-native-gifted-chat';
import RecordButton from '../../../libs/react-native-gifted-chat/RecordButton';
import svgs from '../../assets/svgs';
import AudioplayerMultiple from '../../components/atoms/AudioplayerMultiple';
import Image from '../../components/atoms/Image';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import ImageWithTextInput from '../../components/organisms/ImageWithTextInput';
import { sharedLaunchCameraorGallery } from '../../helpers/Camera';
import { getRandomInt, renderFile, sharedConfirmationAlert, sharedExceptionHandler, uuidGenerator, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { multipartPostRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import { store } from '../../redux/store';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { CHAT_STATIC_DATA, IMAGES_STATIC } from './StaticData';
import { headerStyles, stylesFunc } from './styles';

const HEADER_ICON_SIZE_LEFT = CustomHeaderIconBorder.size * 0.7;
const HEADER_ICON_SIZE_RIGHT = CustomHeaderIconBorder.size * 0.6;

const DATA = CHAT_STATIC_DATA(40, 20);
const MY_USER_ID = DATA.MY_USER_ID;
const MY_USER = DATA.MY_USER;
const CHAT_TYPE_ENUM = { image: "image", audio: "audio", text: "text" };
const padToTwo = (number) => (number <= 9 ? `0${number}` : number);
let attachmentProps = null;

export default ({ navigation, route }) => {

    const enumsReducer = useSelector(c => c.enumsReducer);
    const userReducer = store.getState().userReducer;
    const orderID = route?.params?.orderID;
    const riderPicture = route?.params?.riderProfilePic;
    const getEnumValue = (value) => {
        const ChatFileTypeEnum = enumsReducer.ChatFileTypeEnum;
        let typeNo = 0;
        for (let i = 0; i < ChatFileTypeEnum.length; i++) {
            if (`${value}`.trim().toLowerCase() === `${ChatFileTypeEnum[i].text}`.trim().toLowerCase()) {
                typeNo = parseInt(`${ChatFileTypeEnum[i].value}`);
                break;
            }
        }
        return typeNo;
    }

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary), ...headerStyles };
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={customheaderStyles.primaryContainer}>
                <CustomHeader
                    containerStyle={customheaderStyles.containerStyle}
                    leftCustom={(
                        <TouchableScale wait={0} onPress={() => {
                            NavigationService.NavigationActions.common_actions.goBack();
                        }} style={customheaderStyles.iconContainer}>
                            <SvgXml xml={svgs.order_chat_header_location(colors.primary)} height={HEADER_ICON_SIZE_LEFT} width={HEADER_ICON_SIZE_LEFT} />
                        </TouchableScale>
                    )}
                    rightCustom={(
                        <TouchableScale wait={0} onPress={() => {
                            NavigationService.NavigationActions.stack_actions.replace(ROUTES.APP_DRAWER_ROUTES.OrderPitstops.screen_name, { orderID: orderID }, ROUTES.APP_DRAWER_ROUTES.OrderChat.screen_name)
                        }} style={customheaderStyles.iconContainer}>
                            <SvgXml xml={svgs.order_chat_header_receipt(colors.primary)} height={HEADER_ICON_SIZE_RIGHT} width={HEADER_ICON_SIZE_RIGHT} />
                        </TouchableScale>
                    )}
                    centerCustom={() => (
                        <View style={customheaderStyles.imageNameContainer}>
                            <Image source={{ uri: renderFile(riderPicture) }} style={customheaderStyles.image} tapToOpen={false} />
                            <Text fontFamily='PoppinsSemiBold' style={customheaderStyles.name} numberOfLines={1}>{`Order ID # ${orderID}`}</Text>
                        </View>
                    )}
                    defaultColor={colors.primary}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: STATE's & REF's START's FROM HERE 
    const giftedChatRef = React.useRef(null);
    const recordButtonRef = React.useRef(null);
    const [stopRecording, setStopRecording] = React.useState(false);
    const [query, updateQuery] = React.useState({
        data: [],
        isLoading: false,
        error: false,
        errorText: '',
        refreshing: false,
    });
    const [messages, setMessages] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [micTimer, toggleMicTimer] = React.useState(false);
    const [showPickOption, toggleShowPickOption] = React.useState(false);

    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: LOADING AND ERROR UI START's FROM HERE 
    if (query.isLoading) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <AnimatedLottieView
                source={require('../../assets/gifs/Processingloading.json')}
                autoPlay
                loop
                style={{
                    height: '100%',
                    width: "100%",
                    alignSelf: "center",
                    marginTop: 10,
                    marginBottom: 15,
                }}
            />
        </View>
    }

    // #endregion :: LOADING AND ERROR UI END's FROM HERE 

    // #region :: STOPWATCH START's FROM HERE 
    const timerTextRef = React.useRef(null);
    const timer = React.useRef(null);
    const time = React.useRef({
        min: 0,
        sec: 0,
    });
    const resetTimer = () => {
        time.current = {
            min: 0,
            sec: 0,
        }

        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }

    }

    const handleStart = (value) => {
        if (value) {
            resetTimer();
            timer.current = setInterval(() => {
                if (time.current.sec !== 59) {
                    if (time.current.min >= constants.recording_duration_max_limit) {
                        setStopRecording(true);
                        recordButtonRef.current.setDuration(`${padToTwo(time.current.min)} : ${padToTwo(time.current.sec)}`)
                        resetTimer();
                        return
                    }
                    const newTime = `${padToTwo(time.current.min)} : ${padToTwo(time.current.sec + 1)}`;
                    timerTextRef.current?.setNativeProps({ text: newTime })
                    time.current = {
                        min: time.current.min,
                        sec: time.current.sec + 1
                    }
                } else {
                    const nextMin = time.current.min + 1;
                    if (nextMin >= constants.recording_duration_max_limit) {
                        setStopRecording(true);
                        recordButtonRef.current.setDuration(`${padToTwo(nextMin)} : ${padToTwo(0)}`)
                        resetTimer();
                        return
                    }
                    const newTime = `${padToTwo(nextMin)} : ${padToTwo(0)}`;
                    timerTextRef.current?.setNativeProps({ text: newTime })
                    time.current = {
                        min: nextMin,
                        sec: 0
                    }
                }
            }, 1000);

        } else {
            recordButtonRef.current.setDuration(`${padToTwo(time.current.min)} : ${padToTwo(time.current.sec)}`)
            resetTimer();
        }
    };

    const renderMicTimer = (rcProps) => {
        return (
            <View style={{
                flex: 1,
                paddingHorizontal: constants.spacing_horizontal * 2,
            }}>
                <RNTextInput
                    ref={timerTextRef}
                    multiline={false}
                    showSoftInputOnFocus={false}
                    editable={false}
                    caretHidden={true}
                    value={"00 : 00"}
                    placeholder={""}
                    style={{
                        fontSize: 15,
                        color: colors.primary,
                        fontFamily: FontFamily.Poppins.SemiBold,
                    }} />
            </View>
        )
    }

    // #endregion :: STOPWATCH END's FROM HERE 

    const onAttachmentPress = (props) => {
        attachmentProps = props;
        toggleShowPickOption(true);
    }

    React.useEffect(() => {
        console.log('enumsReducer ,', enumsReducer);
        const newData = DATA.data.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        setMessages(newData);
        return () => { }
    }, [])

    const onMessageSend = React.useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, []);

    // #region :: SEND MESSAGE TO RIDER START's FROM HERE 
    const sendMessageToRider = (type = "", text, item) => {

        let formData = new FormData();
        formData.append("OrderID", "63342266");
        formData.append("UserID", "3d407674-eae5-4f62-86df-7b1f28bebe2c");//CURRENT USER ID
        formData.append("ReceiverID", "70ea8ed1-e773-4e0a-a969-f97777187d54"); //RIDER ID
        const chatType = getEnumValue(type);
        formData.append("Type", chatType);
        console.log('SEND_MESSAGE_TO_RIDER item ', item);
        if (item) {
            formData.append("File", {
                uri: Platform.OS === 'android' ? item.uri : item.uri.replace("file://", ""),
                name: item.uri.split('/').pop(),
                type: item.type
            });
        }

        if (VALIDATION_CHECK(text)) {
            formData.append("Message", text);
        } else {
            formData.append("Message", item?.text ?? '');
        }


        console.log('SEND_MESSAGE_TO_RIDER formData --- ', formData);

        multipartPostRequest(Endpoints.SEND_MESSAGE_TO_RIDER, formData, (res) => {
            console.log('SEND_MESSAGE_TO_RIDER', res);
            if ((res.data?.statusCode ?? 400) === 200) {
                //REQUEST SUCCESSFULLY....
                return
            }


        }, (err) => {
            console.log('SEND_MESSAGE_TO_RIDER ERROR ', err);
            sharedExceptionHandler(err);
        }, false, { Authorization: `Bearer ${userReducer?.token?.authToken}` });
    }//end of sendMessageToRider    

    // #endregion :: SEND MESSAGE TO RIDER END's FROM HERE 

    return (
        <View style={styles.primaryContainer}>
            {_renderHeader()}
            <ImageWithTextInput
                showPickOption={showPickOption}
                onRequestClose={() => { toggleShowPickOption(false) }}
                onSendPress={(newImages) => {
                    const { onSend: propOnSend } = attachmentProps;
                    for (const item of newImages) {
                        sendMessageToRider(CHAT_TYPE_ENUM.image, null, item)
                        propOnSend({
                            _id: uuidGenerator(),
                            image: `${item.uri}`,
                            ...VALIDATION_CHECK(item?.text ?? '') && {
                                text: item?.text ?? '',
                            },
                            user: MY_USER,
                            createdAt: new Date(),
                        }, true)
                    }
                    toggleShowPickOption(false);
                }}
            />

            <GiftedChat
                ref={giftedChatRef}
                renderAvatar={null}
                showAvatarForEveryMessage={false}
                showUserAvatar={false}
                messages={messages}
                onSend={messages => onMessageSend(messages)}
                user={MY_USER_ID}
                {...micTimer && {
                    renderComposer: renderMicTimer
                }}
                renderMessageAudio={(props) => {
                    const currentMessage = props.currentMessage;
                    const isMyUser = currentMessage.user._id === MY_USER_ID._id;
                    const audioMessage = JSON.parse(currentMessage.audio);
                    return (
                        <View style={{ paddingTop: 6, }}>
                            <AudioplayerMultiple
                                {...isMyUser ? {
                                    maximumTrackTintColor: "rgba(255,255,255,0.3)",
                                    timeStyle: {
                                        color: colors.white,
                                        textAlign: "left",
                                        position: "absolute",
                                    },
                                    activeTheme: { primary: "rgba(255,255,255,0.9)" }
                                } : {
                                    activeTheme: colors,
                                    timeStyle: {
                                        textAlign: "left",
                                        position: "absolute",
                                    }
                                }}
                                timeContainerStyle={{}}
                                audioURL={audioMessage.uri}
                                // forceStopAll={isDeleted || forceDeleted}
                                width={Platform.OS === "ios" ? "90%" : "95%"}
                            />

                        </View>
                    )
                }}
                renderSend={(rsProps) => {
                    const hasText = (rsProps.text && rsProps.text.trim().length > 0);

                    return (
                        <View style={{
                            flexDirection: "row", alignItems: "center",
                            marginLeft: 10,
                            marginRight: 10,
                        }}>
                            <TouchableOpacity
                                testID='send'
                                accessible
                                accessibilityLabel='send'
                                style={styles.composerIconContainer}
                                onPress={() => {
                                    const { text, onSend: propOnSend } = rsProps;
                                    if (text && propOnSend) {
                                        sendMessageToRider(CHAT_TYPE_ENUM.text, text, null);
                                        propOnSend({ _id: uuidGenerator(), text: text.trim(), user: MY_USER, createdAt: new Date(), }, true)
                                    }
                                }}
                                disabled={!hasText}>

                                <SvgXml
                                    xml={svgs.order_chat_send(hasText ? colors.primary : "#272727", hasText ? 1 : 0.5)}
                                    height={23}
                                    width={23}
                                    style={styles.composerIcon} />
                            </TouchableOpacity>


                            {/* ****************** Start of MIC ICON ****************** */}
                            <RecordButton
                                ref={recordButtonRef}
                                stop={stopRecording}
                                renderComposer={(val) => {
                                    handleStart(val);
                                    toggleMicTimer(val);
                                }}
                                onRecordAudio={(item) => {
                                    const { onSend: propOnSend } = rsProps;
                                    sendMessageToRider(CHAT_TYPE_ENUM.audio, null, item)
                                    propOnSend({ _id: uuidGenerator(), audio: `${JSON.stringify(item)}`, user: MY_USER, createdAt: new Date(), }, true)
                                    setStopRecording(false);
                                }}
                            />

                            {/* ****************** End of MIC ICON ****************** */}



                            {/* ****************** Start of ATTACHMENT ICON ****************** */}
                            <TouchableOpacity
                                accessible
                                style={styles.composerIconContainer}
                                onPress={() => { onAttachmentPress(rsProps); }}>
                                <SvgXml xml={svgs.order_chat_attachment()}
                                    height={23}
                                    width={23}
                                    style={styles.composerIcon} />
                            </TouchableOpacity>

                            {/* ****************** End of ATTACHMENT ICON ****************** */}



                        </View>
                    )
                }}
            // keyboardShouldPersistTaps='never'
            // {...platformConf}
            // isKeyboardInternallyHandled


            />

        </View>
    )
};//end of EXPORT DEFAULT
