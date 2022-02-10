import React, { useRef, useState } from 'react';
import { Appearance,  StyleSheet, Image } from 'react-native';
import constants from '../../../res/constants';
import RNMediaMeta from "../../../../RNMediaMeta";
import AudioPlayerMultiple from "../../../components/atoms/AudioplayerMultiple";
import StopWatch from "react-native-stopwatch-timer/lib/stopwatch";
import VectorIcon from '../../../components/atoms/VectorIcon';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import TextInput from '../../../components/atoms/TextInput';
import Button from '../../../components/molecules/Button';
import FontFamily from '../../../res/FontFamily';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import { askForAudioRecordPermission } from '../../../helpers/Camera';
import { Recorder } from '@react-native-community/audio-toolkit';

const PitStopDetails = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    const recorderRef = useRef(null);
    const recordTimeRef = useRef(null);
    const [progress, updateProgress] = useState(0);
    const [micPress, setMicPress] = useState(false);
    const [recordingUploading, setRecordingUploading] = useState(false);
    const [isRecord, setIsRecord] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);


    const deleteRecording = async () => {
        if (isRecord) {
            const joviImageID = recorderRef.current?.joviImageID ?? -1;
            console.log('VR IS===> on del joviImageID', joviImageID);
            if (joviImageID !== -1)
                Multipart.deleteFile(joviImageID, { ...parentProps, dispatch: parentDispatch }, () => {
                    //SUCCESS HANDLER
                    setIsDeleted(true);

                    updateProgress(0);
                }, () => {
                    //ERROR HANDLER
                    setIsDeleted(false);

                    updateProgress(0);
                });


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
                                    setRecordingUploading(true);
                                    Multipart.upload([{ ...obj }], { ...parentProps, dispatch: parentDispatch }, false, (uploadPercentage) => {
                                        //UPLOAD PROGRESS HANDLER
                                        updateProgress(parseInt(uploadPercentage));
                                    }, (res) => {
                                        //SUCCESS HANDLER

                                        const resAt0 = res.joviImageReturnViewModelList[0];

                                        pitStopVoiceNote({
                                            _fsPath: renderPicture(resAt0.joviImage),
                                            ...resAt0,
                                        }, false);

                                        setIsRecord(true);
                                        toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
                                        updateProgress(0);
                                        setRecordingUploading(false);

                                    }, () => {
                                        //ERROR HANDLER
                                        updateProgress(0);
                                        setIsRecord(false);
                                        setIsDeleted(true);
                                        setRecordingUploading(false);
                                    })

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


    return (
        // <View style={styles.pitStopLocationContainer} >
        //     {
        props.isOpened &&
        <View style={{ marginVertical: 10 }} >
            <TextInput title="Pitstop Description"
                placeholder="Please Add Your Description"
                style={{
                    height: 120,
                    textAlignVertical: 'top',
                    ...Platform.select({
                        ios: {
                            lineHeight: 0 // as same as height
                        },
                        android: {}
                    }),
                }}
                containerStyle={{
                    width: WIDTH - 40,
                    alignSelf: 'center'
                }}
                multiline={true}
                titleStyle={{ opacity: 0.8, color: '#000', fontFamily: FontFamily.Poppins.Regular, fontSize: 12 }}
                value={props.description}
                onChangeText={props.onChangeDescription}
            />
            <Text style={styles.attachment} >Attachments</Text>
            {props.children}
        </View>
        //     }
        // </View>
    );
}
export default PitStopDetails;



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
