import { Recorder, Player } from '@react-native-community/audio-toolkit';
import * as React from "react";
import { StyleProp, StyleSheet, View as RNView, ViewStyle, Image as RNImage, Platform, Alert } from "react-native";
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SvgXml, Text } from "react-native-svg";
import svgs from "../../src/assets/svgs";
import TouchableOpacity from "../../src/components/atoms/TouchableOpacity";
import View from "../../src/components/atoms/View";
import { askForAudioRecordPermission } from "../../src/helpers/Camera";
import Composer from "./Composer";
import { GiftedChat, GiftedChatProps, } from "./GiftedChat";
import Send, { GCSendStyles } from "./Send";

export interface RecordButtonItemProps {
    id: number | string;
    uri: string;
    name: string;
    type: "audio/mp4" | "mp4" | "mp3";
}

interface Props {
    children?: any;

    containerStyle?: StyleProp<ViewStyle>
    iconStyle?: StyleProp<ViewStyle>
    renderComposer: any
    stop?: boolean;
    onRecordAudio?: (item: RecordButtonItemProps) => void;
    useHold?: boolean;
};

const defaultProps = {
    stop: false,
};

const RecordButton = React.forwardRef<Recorder, Props>((props: Props, ref: any) => {
    const [isMicPress, setIsMicPress] = React.useState(false);
    const [duration, setDuration] = React.useState('00:00');
    let recorderRef = React.useRef<Recorder>();

    React.useEffect(() => {
        const lastNumber = duration.slice(duration.length - 1);
        const secondNumber = duration.slice(1);
        if (parseInt(`${lastNumber}`) > 0 || parseInt(`${secondNumber}`) > 0) {

            if (props.onRecordAudio) {
                //@ts-ignore
                const path = recorderRef.current?._fsPath;
                const obj: RecordButtonItemProps = {
                    id: Math.floor(Math.random() * 100000),
                    uri: Platform.OS === "android" ? `file://${path}` : path,
                    name: path.split('/').pop(),
                    type: "audio/mp4",
                };
                props.onRecordAudio(obj);
            }

            //RESTTING AFTER USING PATH AND DURATION 
            recorderRef.current = undefined;
            setDuration('00:00');
        }

    }, [duration])

    React.useEffect(() => {
        if (props.stop) {
            recordingPress(false);

        }
    }, [props.stop])

    const recordingPress = async (startRecording: boolean,) => {

        if (startRecording) {

            check(Platform.OS === "android" ? PERMISSIONS.ANDROID.RECORD_AUDIO : PERMISSIONS.IOS.MICROPHONE)
                .then((result: any) => {
                    if (result === RESULTS.GRANTED) {
                        const fileName = "record-" + new Date().getTime() + ".mp4";
                        recorderRef.current = new Recorder(fileName).record();
                        setIsMicPress(true);
                        props.renderComposer(true);
                    } else {
                        askForAudioRecordPermission((allowRecording: boolean) => { })
                    }

                })
                .catch((error: any) => {
                    // …
                });

        } else {
            if (recorderRef.current !== null) {
                recorderRef.current?.stop((error) => {
                    if (Platform.OS === "ios") {
                        new Player("playerDestroyer.mp4").prepare((err) => { }).destroy(); //ADDING THIS TO DESTROY RECORDER FOR iOS Devices 
                    }

                    if (!error) {
                        stopRecording();
                    }
                    else {
                        Alert.alert("Error Occurred while Recording Audio!");
                        stopRecording();
                    }
                });
            } else {
                stopRecording();
            }

        }
    };//end of recordingPress

    const stopRecording = () => {
        props.renderComposer(false);
        setIsMicPress(false);
    }

    React.useImperativeHandle(ref, () => ({
        setDuration,
        recorderRef,
    }), [setDuration, recorderRef])

    return (
        <TouchableOpacity
            accessible
            style={[GCSendStyles.container, {
            }, props.containerStyle]}
            {...props.useHold ? {
                onPress: () => {
                    if (isMicPress) {
                        recordingPress(false);
                    } else {
                        recordingPress(true);
                    }
                }
            } :
                {
                    onPressIn: () => {
                        recordingPress(true,);
                    },
                    onPressOut: () => {
                        recordingPress(false);
                    }
                }}
            activeOpacity={1}>
            <View>
                {props.children || (
                    <>
                        {isMicPress ? (
                            <>
                                <RNImage
                                    source={require('../../src/assets/gifs/Record.gif')}
                                    style={{ height: 50, width: 50, opacity: 1, zIndex: 99999, }}
                                />
                            </>
                        )

                            :
                            <SvgXml xml={svgs.order_chat_mic()} height={23} width={23} style={[
                                GCSendStyles.text, props.iconStyle
                            ]} />
                        }
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
});

RecordButton.displayName = 'RecordButton';
//@ts-ignore
RecordButton.defaultProps = defaultProps;
export default RecordButton;

const styles = StyleSheet.create({
    container: {
        // height: 44,
        justifyContent: 'center',
    },
    icon: {
        marginLeft: 6
    },
});