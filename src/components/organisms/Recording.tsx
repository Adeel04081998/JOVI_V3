import * as React from "react";
import { Platform, StyleProp, TextInput as RNTextInput, ViewStyle } from "react-native";
import RecordButton, { RecordButtonItemProps } from "../../../libs/react-native-gifted-chat/RecordButton";
import { VALIDATION_CHECK } from "../../helpers/SharedActions";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";
import AudioplayerMultiple from "../atoms/AudioplayerMultiple";
import TouchableOpacity from "../atoms/TouchableOpacity";
import VectorIcon from "../atoms/VectorIcon";
import View from "../atoms/View";

interface Props {
    colors: typeof initColors;
    micContainerStyle?: StyleProp<ViewStyle>;
    playerContainerStyle?: StyleProp<ViewStyle>;
    useHold?: boolean;
    onRecordingComplete?: (item: RecordButtonItemProps) => void;
    onPlayerStopComplete?: () => void;
    onDeleteComplete?: () => void;
    onRecordingRef?: (recorderRef: any) => void;
    recordingItem?: any;
};
const defaultProps = {
    useHold: true,
    onRecordingComplete: undefined,
    onPlayerStopComplete: undefined,
};

const padToTwo = (number: number | string) => (number <= 9 ? `0${number}` : number);
let recordingItem: RecordButtonItemProps | undefined | null = undefined;;

const Recording = React.forwardRef((props: Props, ref) => {
    const colors = props.colors;
    // #region :: STATE & REF's START's FROM HERE 
    const recordButtonRef = React.useRef<any>(null);
    const [stopRecording, setStopRecording] = React.useState(false);
    const [micTimer, toggleMicTimer] = React.useState(false);
    const [stopAudioPlayer, setStopAudioPlayer] = React.useState(false);
    const [, updateStateaaa] = React.useState<any>();
    const forceUpdate = React.useCallback(() => updateStateaaa({}), []);

    // #endregion :: STATE & REF's END's FROM HERE 
    React.useEffect(() => {
        console.log('props.recordingItem ', props.recordingItem,);
        console.log('recordingItem ', recordingItem,);
        if (VALIDATION_CHECK(props.recordingItem)) {
            if (!VALIDATION_CHECK(recordingItem)) {
                recordingItem = props.recordingItem;
                forceUpdate();
            }
        }

    }, [props.recordingItem])

    // #region :: STOPWATCH START's FROM HERE 
    const timerTextRef = React.useRef<any>(null);
    const timer = React.useRef<any>(null);
    const time = React.useRef<any>({
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
                        recordButtonRef.current?.setDuration(`${padToTwo(nextMin)} : ${padToTwo(0)}`)
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
            recordButtonRef.current?.setDuration(`${padToTwo(time.current.min)} : ${padToTwo(time.current.sec)}`)
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

    React.useEffect(() => {
        console.log('recordingItem in stop audio player ', recordingItem);
        if (stopAudioPlayer && recordingItem) {
            setStopAudioPlayer(false);
            handlePlayerCompletion();
            recordingItem = null;
        }
    }, [stopAudioPlayer])

    React.useEffect(() => {
        console.log('stopRecording useEffect--  ', stopRecording);
        if (stopRecording) {

            console.log('recordButtonRef.current ', recordButtonRef.current);
            recordButtonRef.current && recordButtonRef.current.setDuration(`${padToTwo(time.current.min)} : ${padToTwo(time.current.sec)}`)
            resetTimer();
            // setStopRecording(false);
            return
        }
        return () => { }
    }, [stopRecording])


    const handleOnCompletion = (item: RecordButtonItemProps | null) => {
        if (item) {
            props.onRecordingComplete && props.onRecordingComplete(item);
            return
        } else {
            (props.onRecordingComplete && recordingItem) && props.onRecordingComplete(recordingItem);
        }
    }

    const handlePlayerCompletion = () => {
        props.onPlayerStopComplete && props.onPlayerStopComplete();
    }

    const onDeletePress = () => {
        props.onDeleteComplete && props.onDeleteComplete();
        setStopAudioPlayer(true);
    };

    React.useImperativeHandle(ref, () => ({
        setStopAudioPlayer,
        setStopRecording,
        recordingItem,
    }), [setStopAudioPlayer])
    return (
        <>
            {(recordingItem) ?
                <View style={[{ flexDirection: "row", alignItems: "center", maxWidth: "90%", }, props.playerContainerStyle]}>
                    <AudioplayerMultiple
                        activeTheme={colors}
                        audioURL={recordingItem.uri}
                        forceStopAll={stopAudioPlayer}
                        width={Platform.OS === "ios" ? "90%" : "95%"}
                    />

                    <TouchableOpacity wait={0} onPress={onDeletePress} style={{ marginTop: -20 }}>
                        <VectorIcon
                            name={"delete-outline"}
                            type="MaterialCommunityIcons"
                            color={"red"}
                            size={30} />
                    </TouchableOpacity>

                </View>

                :
                <>
                    {/* ****************** Start of MIC ICON ****************** */}
                    <View style={[{ flexDirection: "row", alignItems: "center" }, props.micContainerStyle]}>
                        <RecordButton
                            useHold={props.useHold}
                            ref={recordButtonRef}
                            stop={stopRecording}
                            renderComposer={(val: boolean) => {
                                if (val)
                                    setStopRecording(false);
                                handleStart(val);
                                toggleMicTimer(val);
                            }}
                            onRecordAudio={(item) => {

                                recordingItem = item;
                                handleOnCompletion(item);
                                setStopRecording(false);
                            }}
                        />
                        {micTimer && renderMicTimer()}
                    </View>

                    {/* ****************** End of MIC ICON ****************** */}
                </>
            }


        </>
    );
});

Recording.displayName = 'Recording';
Recording.defaultProps = defaultProps;
export default Recording;
