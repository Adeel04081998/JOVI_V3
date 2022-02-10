import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text, Platform } from "react-native";
import Slider from '@react-native-community/slider';
import { SvgXml } from "react-native-svg";
import svgs, { pauseIcon, playIcon } from "../../assets/svgs/index";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Player, Recorder } from "@react-native-community/audio-toolkit";
import { secToHourMinSec } from "../../helpers/SharedActions";


let timer = null;
const playerRefArr = [];


export default AudioPlayer = ({ activeTheme, loader = false, audioURL = '', width = "90%", forceStopAll = false, }) => {
    // let isPlaying = (chatPlayingVoice && chatPlayingVoiceIndex === index);

    let soundPlayerRef = useRef();

    const [isPlaying, setIsPlaying] = useState(false);

    const [totalDuration, setTotalDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [displayTime, setDisplayTime] = useState(0);

    const [icon, setIcon] = useState();


    useEffect(() => {
        Icon.getImageSource('checkbox-blank-circle', 15, activeTheme.primary)
            .then(setIcon);
    }, []);


    useEffect(() => {
        setupSoundPlayer();

        return () => {
        }

    }, [audioURL])

    useEffect(() => {
        if (forceStopAll)
            stopAudio();


    }, [forceStopAll])



    const setupSoundPlayer = async () => {


        const chatAudioplayer = new Player(audioURL, error => {
            if (error) {
                console.log("failed to load the sound", error);

                return;
            }

            const duration = parseInt(chatAudioplayer?.getDuration());
            setTotalDuration(duration > 0 ? duration : 0);
            setDisplayTime(duration > 0 ? duration : 0);
            setCurrentTime(0);

            playerRefArr.push({
                url: audioURL,
                ref: chatAudioplayer,
                key: chatAudioplayer._key,
                pauseAudioFunc: () => {
                    setIsPlaying(false);
                    chatAudioplayer?.pause();
                    clearInterval(timer);
                },
            });
            soundPlayerRef.current = chatAudioplayer;

        });



    };

    const pauseAll = () => {
        for (let i = 0; i < playerRefArr.length; i++) {
            playerRefArr[i].pauseAudioFunc();
        }
    };//end of pauseAll

    const playAudio = () => {
        pauseAll();
        setIsPlaying(true);
        soundPlayerRef.current?.play(() => { stopAudio(); });
        timer = setInterval(() => {
            soundPlayerRef.current?.getCurrentTime(sec => {
                if (sec > 0) {
                    if (Platform.OS === "android") {
                        sec += 1;
                    }
                    setDisplayTime(sec >= 0 ? sec : totalDuration);
                    setCurrentTime(sec >= 0 ? sec : 0);


                }
                else {
                    setCurrentTime(sec > 0 ? sec : 0);
                    pauseAudio();
                }

            });
        }, 1000)
    };//end of playAudio

    const stopAudio = () => {
        setDisplayTime(totalDuration);
        setCurrentTime(0);
        setIsPlaying(false);
        soundPlayerRef.current?.stop();
        clearInterval(timer);
    };//end of stopAudio

    const pauseAudio = () => {
        setIsPlaying(false);
        pauseAll();
        clearInterval(timer);
    };//end of pauseAudio

    const sliderPause = () => {
        setIsPlaying(false);
        pauseAll();

    };//end of sliderPause

    const sliderPlay = (startFrom = 0) => {
        soundPlayerRef.current?.setCurrentTime(startFrom);
        if (currentTime < 1) {
            playAudio();
            return;
        }
        setIsPlaying(true);
        soundPlayerRef.current?.play();
    };//end of sliderPlay


    return (
        <View style={styles.primaryContainer}>

            <View style={styles.container}>

                {loader ?
                    <ActivityIndicator style={styles.activityIndicator} size={18} color={activeTheme.primary} />
                    :
                    <>
                        <TouchableOpacity onPress={() => {
                            console.log('soundPlayerRef ', soundPlayerRef.current);
                            if (isPlaying)
                                pauseAudio();
                            else
                                playAudio();
                        }}>
                            <SvgXml
                                xml={isPlaying ? svgs.pauseIcon() : svgs.playIcon()}
                                width={20}
                                height={20}
                                style={{
                                    ...styles.playIcon,
                                    ...isPlaying && { left: -2, }
                                }} />
                        </TouchableOpacity>

                        <Slider
                            style={{
                                ...styles.slider,
                                width: width
                            }}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            // thumbImage={SliderCircle}
                            thumbImage={icon}
                            minimumTrackTintColor={activeTheme.primary}
                            maximumTrackTintColor={`rgba(115, 89, 190, 0.5)`}
                            // thumbTintColor={activeTheme.default}
                            value={parseInt(currentTime)}
                            minimumValue={0}
                            maximumValue={parseInt(totalDuration)}

                            onSlidingStart={() => {
                                sliderPause();
                            }}
                            onSlidingComplete={(value) => {
                                sliderPlay(parseInt(value))
                            }}
                            onValueChange={(value) => {
                                setDisplayTime(parseInt(value));

                            }}
                        />
                    </>
                }
            </View>

            <Text style={styles.durationText}>{`${secToHourMinSec(displayTime)}`}</Text>

        </View>
    )
};//end of export default AUDIO PLAYER

const styles = StyleSheet.create({
    primaryContainer: {
        backgroundColor: "transparent",
        borderRadius: 10,
        minHeight: 33,
        width: "100%",
        paddingHorizontal: 12,
        paddingTop: Platform.OS === "android" ? 12 : 0,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    slider: {
        width: "90%",

    },
    playIcon: {
        left: 0,
        marginRight: 8,
    },
    activityIndicator: {
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginLeft: 9,
        marginTop: 10,
    },
    durationText: {
        textAlign: "right",
        paddingBottom: 8,
        paddingTop: 4,
        fontSize: 12,
        color: `rgba(0,0,0,0.8)`,
    },
})