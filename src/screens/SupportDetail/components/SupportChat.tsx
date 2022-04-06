import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Appearance, Dimensions, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { GiftedChat, Send } from '../../../../libs/react-native-gifted-chat';
import RecordButton from '../../../../libs/react-native-gifted-chat/RecordButton';
import ChangeWindowManager from '../../../../NativeModules/ChangeWindowManager';
import svgs from '../../../assets/svgs';
import AudioplayerMultiple from '../../../components/atoms/AudioplayerMultiple';
import Image from '../../../components/atoms/Image';
import Text from '../../../components/atoms/Text';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import TouchableScale from '../../../components/atoms/TouchableScale';
import View from '../../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../../components/molecules/CustomHeader';
import ImageWithTextInput from '../../../components/organisms/ImageWithTextInput';
import NoRecord from '../../../components/organisms/NoRecord';
import { padToTwo, renderFile, sharedExceptionHandler, sharedFetchOrder, sharedNotificationHandlerForOrderScreens, sharedRiderRating, uniqueKeyExtractor, uuidGenerator, VALIDATION_CHECK, validURL } from '../../../helpers/SharedActions';
import { getRequest, multipartPostRequest } from '../../../manager/ApiManager';
import Endpoints from '../../../manager/Endpoints';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import { store } from '../../../redux/store';
import constants from '../../../res/constants';
import FontFamily from '../../../res/FontFamily';
import theme from '../../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../../utils/GV';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { initColors } from '../../../res/colors';
import MultipleImagesUI from './MultipleImagesUI';
dayjs.extend(customParseFormat)


const CHAT_TYPE_ENUM = { image: "image", audio: "audio", text: "text" };

let attachmentProps: any = null;

interface SupportChatProps {
    colors?: typeof initColors;
    allowVoiceNote?: boolean;
    allowImageAttachment?: boolean;
    complaintID?: string | number;
    orderID?: string | number;
    data?: [];
    allowMultipleImages?: boolean;
    disableChat?: boolean;
};
const defaultProps = {
    colors: initColors,
    allowVoiceNote: false,
    allowImageAttachment: true,
    complaintID: 0,
    orderID: 0,
    allowMultipleImages: true,
    disableChat: false
};


const SupportChat = (supportChatProps: SupportChatProps) => {

    // #region :: REDUCER  START's FROM HERE 
    const enumsReducer = useSelector((c: any) => c.enumsReducer);
    const userReducer = store.getState().userReducer;
    const MY_USER = {
        _id: userReducer.id,
        name: `${userReducer.firstName} ${userReducer.lastName}`,
    }
    const complaintID = supportChatProps?.complaintID ?? defaultProps.complaintID;
    const orderID = supportChatProps?.orderID ?? defaultProps.orderID;



    // #region :: STYLES & THEME START's FROM HERE 
    const colors = supportChatProps?.colors ?? defaultProps.colors;
    const styles = stylesFunc(colors);
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE's & REF's START's FROM HERE 
    const giftedChatRef = React.useRef(null);
    const recordButtonRef = React.useRef<any>(null);
    const [stopRecording, setStopRecording] = React.useState(false);
    const [query, updateQuery] = React.useState({
        data: [],
        isLoading: false,
        error: false,
        errorText: '',
    });
    const [messages, setMessages] = React.useState(supportChatProps?.data ?? []);
    const [micTimer, toggleMicTimer] = React.useState(false);
    const [showPickOption, toggleShowPickOption] = React.useState(false);

    // #endregion :: STATE's & REF's END's FROM HERE 

    React.useEffect(() => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, (supportChatProps?.data ?? [])));
        return () => { setMessages([]) }
    }, [supportChatProps.data]);

    // #region :: STOPWATCH START's FROM HERE 
    const timerTextRef = React.useRef<RNTextInput>(null);
    const timer = React.useRef<null | any>(null);
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

    const handleStart = (value: boolean) => {
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

    const renderMicTimer = () => {
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

    // #region :: ON ATTACHMENT PRESS START's FROM HERE 
    const onAttachmentPress = (props: Send['props']) => {
        attachmentProps = props;
        toggleShowPickOption(true);
    }

    // #endregion :: ON ATTACHMENT PRESS END's FROM HERE 

    // #region :: API IMPLEMENTATION START's FROM HERE 
    React.useEffect(() => {
        ChangeWindowManager.setAdjustResize();
        // loadData();
        return () => {
            ChangeWindowManager.setAdjustPan();
        };
    }, []);


    // #endregion :: API IMPLEMENTATION END's FROM HERE 



    // #region :: SEND MESSAGE TO ADMIN START's FROM HERE 
    const onMessageSend = React.useCallback((messages = []) => {
        console.log('messages', messages);
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, []);

    const sendMessageToAdmin = (type = "", text: any, item: any) => {

        let formData = new FormData();
        formData.append("complaintID", parseInt(`${complaintID}`));
        formData.append("orderID", `${orderID}`);
        formData.append("userID", MY_USER._id);//CURRENT USER ID
        formData.append("naem", MY_USER.name);//CURRENT USER NAME
        formData.append("isAdmin", false); //SENDING FROM APP
        formData.append("ComplaintDateTime", dayjs().format(constants.server_time_format));

        if (item) {
            if (Array.isArray(item)) {
                for (const singleitem of item) {
                    formData.append("PictureList", {
                        uri: Platform.OS === 'android' ? singleitem.uri : singleitem.uri.replace("file://", ""),
                        name: singleitem.uri.split('/').pop(),
                        type: singleitem.type,
                        text: singleitem?.text?.trim() ?? ''
                    });
                }
            } else {
                formData.append("PictureList", {
                    uri: Platform.OS === 'android' ? item.uri : item.uri.replace("file://", ""),
                    name: item.uri.split('/').pop(),
                    type: item.type,
                });
                if (VALIDATION_CHECK(`${item?.text ?? ''}`.trim()))
                    formData.append("description", `${item?.text ?? ''}`.trim());
            }
        }


        if (type === CHAT_TYPE_ENUM.audio) {
            const dm = item.duration.split(':')[0].trim();
            const sm = item.duration.split(':')[1].trim();
            const second = (parseInt(`${dm}`) * 60) + parseInt(`${sm}`);
            formData.append("AudioDuration", second);
        }
        if (VALIDATION_CHECK(text)) {
            formData.append("description", text?.trim());
        }
        console.log('resssss PARAM ', formData);
        multipartPostRequest(Endpoints.SEND_COMPLAINT_MESSAGE_TO_ADMIN, formData, (res: any) => {
            console.log('resssss 22222 ', res);
            if ((res.data?.statusCode ?? 400) === 200) {
                //REQUEST SUCCESSFULLY....
                return
            }

        }, (err: any) => {
            sharedExceptionHandler(err);
        }, false, { Authorization: `Bearer ${userReducer?.token?.authToken}` });
    };//end of sendMessageToAdmin    

    // #endregion :: SEND MESSAGE TO ADMIN END's FROM HERE 

    // #region :: LOADING AND ERROR UI START's FROM HERE 
    if (query.isLoading) {
        return <View style={styles.primaryContainer}>
            <View style={{
                flex: 1,
                marginTop: -80,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <AnimatedLottieView
                    source={require('../../../assets/LoadingView/OrderChat.json')}
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
            <NoRecord
                color={colors}
                title={query.errorText}
                buttonText={`Refresh`}
                onButtonPress={() => { }} />
        </View>
    }

    // #endregion :: LOADING AND ERROR UI END's FROM HERE 

    // #region :: UI START's FROM HERE 
    return (
        <View style={styles.primaryContainer}>
            <ImageWithTextInput
                showPickOption={showPickOption}
                onRequestClose={() => { toggleShowPickOption(false) }}
                onSendPress={(newImages) => {
                    const { onSend: propOnSend } = attachmentProps;
                    const hasAnyText = newImages.findIndex(i => VALIDATION_CHECK(i.text));

                    if (hasAnyText === -1) {
                        //SEND IN ARRAY BECAUSE WE DON't HAVE ANY TEXT
                        sendMessageToAdmin(CHAT_TYPE_ENUM.image, null, newImages)
                        propOnSend({
                            _id: uuidGenerator(),
                            image: newImages,
                            isFile: true,
                            // ...VALIDATION_CHECK(item?.text ?? '') && {
                            //     text: item?.text ?? '',
                            // },
                            user: MY_USER,
                            createdAt: new Date(),
                        }, true)

                    } else {
                        for (const item of newImages) {
                            sendMessageToAdmin(CHAT_TYPE_ENUM.image, null, item)
                            propOnSend({
                                _id: uuidGenerator(),
                                image: `${item.uri}`,
                                isFile: true,
                                ...VALIDATION_CHECK(item?.text ?? '') && {
                                    text: item?.text ?? '',
                                },
                                user: MY_USER,
                                createdAt: new Date(),
                            }, true)
                        }
                    }

                    toggleShowPickOption(false);
                }}
            />
            <GiftedChat
                ref={giftedChatRef}
                renderAvatar={undefined}
                showAvatarForEveryMessage={false}
                showUserAvatar={false}
                maxInputLength={200}
                messages={messages}
                onSend={messages => onMessageSend(messages)}
                user={{ _id: userReducer.id }}

                {...micTimer && {
                    renderComposer: renderMicTimer
                }}
                {...(supportChatProps.allowMultipleImages) && {
                    renderMessageImage: (props) => {
                        const currentMessage: any = props.currentMessage;
                        let images = currentMessage?.image ?? [];
                        const isLocal = currentMessage?.isFile ?? false;
                        if (isLocal) {
                            if (Array.isArray(images)) {
                                images = images.map((i: any) => i.uri);
                            } else {
                                images = [images]
                            }
                        }
                        return (
                            <View>
                                <MultipleImagesUI data={images} isLocal={isLocal} />
                            </View>
                        )
                    }
                }}
                renderMessageAudio={(props) => {
                    const currentMessage: any = props.currentMessage;
                    const isMyUser = currentMessage.user._id === userReducer.id;
                    const isLocal = currentMessage?.isFile ?? false;
                    const audioMessage = isLocal ? currentMessage.audio : renderFile(currentMessage.audio);

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
                                timeContainerStyle={undefined}
                                audioURL={audioMessage}
                                // forceStopAll={isDeleted || forceDeleted}
                                width={Platform.OS === "ios" ? "90%" : "95%"}
                            />

                        </View>
                    )
                }}
                {...supportChatProps.disableChat && {
                    renderInputToolbar: () => null,
                    renderComposer: () => null,
                }}
                renderSend={(rsProps) => {
                    if (supportChatProps.disableChat) {
                        return null
                    }
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
                                        sendMessageToAdmin(CHAT_TYPE_ENUM.text, text, null);
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
                            {supportChatProps.allowVoiceNote &&
                                <RecordButton
                                    ref={recordButtonRef}
                                    stop={stopRecording}
                                    renderComposer={(val: boolean) => {
                                        handleStart(val);
                                        toggleMicTimer(val);
                                    }}
                                    onRecordAudio={(item) => {
                                        const { onSend: propOnSend } = rsProps;
                                        sendMessageToAdmin(CHAT_TYPE_ENUM.audio, null, item);
                                        //@ts-ignore
                                        propOnSend({
                                            _id: uuidGenerator(),
                                            audio: item.uri,
                                            //@ts-ignore
                                            isFile: true,
                                            user: MY_USER, createdAt: new Date(),
                                        }, true)
                                        setStopRecording(false);
                                    }}
                                />
                            }

                            {/* ****************** End of MIC ICON ****************** */}



                            {/* ****************** Start of ATTACHMENT ICON ****************** */}
                            {supportChatProps.allowImageAttachment &&
                                <TouchableOpacity
                                    accessible
                                    style={styles.composerIconContainer}
                                    onPress={() => { onAttachmentPress(rsProps); }}>
                                    <SvgXml xml={svgs.order_chat_attachment()}
                                        height={23}
                                        width={23}
                                        style={styles.composerIcon} />
                                </TouchableOpacity>
                            }

                            {/* ****************** End of ATTACHMENT ICON ****************** */}



                        </View>
                    )
                }}

            />
        </View>
    )

    // #endregion :: UI END's FROM HERE 

};

SupportChat.defaultProps = defaultProps;
export default SupportChat;

const stylesFunc = (colors: typeof initColors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    composerIconContainer: {
        justifyContent: 'center',
    },
    composerIcon: {
        marginLeft: 6,
        height: 23,
        width: 23,
    },

});//end of stylesFunc

