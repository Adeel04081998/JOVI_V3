import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Animated, Appearance, Easing, Image, ScrollView, Platform } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import svgs from '../../assets/svgs';
import VectorIcon from '../../components/atoms/VectorIcon';
import CustomHeader from '../../components/molecules/CustomHeader';
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
import { sharedLaunchCameraorGallery } from '../../helpers/Camera';
import images from '../../assets/images';
import { addressInfo } from '../../helpers/Location';
import Modal from '../../components/atoms/Modal';
import FontFamily from '../../res/FontFamily';
import { multipartPostRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';


export const PITSTOP_CARD_TYPES = Object.freeze({ "location": 0, "description": 1, "estimated-time": 2, "buy-for-me": 3, "estimated-price": 4, });


export default ({ navigation, route }) => {


    const transition = (
        <Transition.Together>
            <Transition.Out
                type="fade"
                durationMs={200}
            // interpolation="easeOut"
            />
            <Transition.Change />
            <Transition.In
                type="fade"
                durationMs={200}
            // interpolation="easeIn"
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
            "showSubCard": true
        },
        {
            "idx": 2,
            "title": "Pitstop Details",
            "desc": "What Would You Like Your Jovi To Do ?",
            "svg": svgs.pitstopPin(),
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["description"],
            "showSubCard": true
        },
        {
            "idx": 3,
            "title": "Estimated Waiting Time",
            "desc": "What Is The Estimated Time Of The Job ?",
            "svg": svgs.pitStopBuy(),
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["estimated-time"],
            "showSubCard": true
        },
        {
            "idx": 4,
            "title": "Buy For Me ?",
            "desc": "Do You Want Us To Buy For You ?",
            "svg": svgs.pitStopEstTime(),
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["buy-for-me"],
            "showSubCard": true
        },
        {
            "idx": 5,
            "title": "Estimated Price",
            "desc": "What is the Estimated Price?",
            "svg": svgs.pitStopEstTime(),
            "isOpened": false,
            "headerColor": colors.lightGreyBorder,
            "key": PITSTOP_CARD_TYPES["estimated-price"],
            "showSubCard": false
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

    /******** End of pitsTop Location variables *******/



    /******** Start of Pitstop Details variables *******/

    const [description, setDescription] = useState('')
    const [imageData, updateImagesData] = useState([]);

    /******** End of Pitstop Details variables *******/




    /******** Start of other Pitstop variables *******/

    const [estVal, setEstVal] = useState('')
    const [switchVal, setSwitch] = useState(false);
    const [estTime, setEstTime] = React.useState({
        text: __DEV__ ? "00-15 mins" : "Estimated Time",
        value: __DEV__ ? 1 : 0
    });
    const [collapsed, setCollapsed] = React.useState(true);


    /******** End of other Pitstop variables *******/







    /*****************************     Start of  useEffect            ***********************************/




    useEffect(() => {
        if (route.params !== undefined && route.params !== null) {
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



    /************   Start of functions of Pitstop location Component     **************/

    const handleLocationSelected = async (data, geometry, index) => {
        console.log('data', data);
        let city = "";
        const addressObj = data;
        let adrInfo = await addressInfo(geometry.location.lat, geometry.location.lng)
        if (addressObj?.terms && Array.isArray(addressObj?.terms) && addressObj?.terms?.length >= 2) {
            city = addressObj.terms[addressObj.terms.length - 2]?.value;
        }
        else if (addressObj?.plus_code?.compound_code) {
            city = addressObj.plus_code.compound_code.replace(/\,/gi, "")?.split(/\s/gi)?.[1];
        }
        setCityVal(city)
        setPlaceName(adrInfo)
        setLocationVal(addressObj.description)
        toggleCardData(PITSTOP_CARD_TYPES["description"]);
    }
    const onLocationSearchInputChange = (text) => {
        setLocationVal(text)
        toggleCardData(PITSTOP_CARD_TYPES["description"]);
    }
    const handleSetFavClicked = () => { }




    /************   End of functions of Pitstop location Component     **************/







    /************   Start of functions of Pitstop Details Component     **************/

    const pitStopImage = (obj = null, deleteIndex = null) => {

        const index = state?.focusedFieldIndex ?? -1;
        const pitStopArr = (JSON.parse(JSON.stringify(state?.pitstops)) ?? []);

        if (deleteIndex !== null) {
            pitStopArr[index].imagesArr.splice(deleteIndex, 1);
        } else {
            if (!("imagesArr" in pitStopArr[index])) {
                pitStopArr[index].imagesArr = [];
            }

            pitStopArr[index].imagesArr.push(obj);
        }

        setState((prevState) => ({
            ...prevState,
            pitstops: pitStopArr
        }));

    };

    const getPicture = picData => {
        pitStopImage({
            id: Math.floor(Math.random() * 100000),
            fileName: picData.uri.split('/').pop(),
            isUploading: true,
        }, null);


        const obj = {
            id: Math.floor(Math.random() * 100000),
            uri: Platform.OS === 'android' ? picData.uri : picData.uri.replace("file://", ""),
            name: picData.uri.split('/').pop(),
            type: picData.type,
        }
        let formData = new FormData()
        for (let index = 0; index < [{ ...obj }].length; index++) {

            formData.append(`JoviImageList[${index}].JoviImage`, obj[index])
            formData.append(`JoviImageList[${index}].JoviImageID`, 0)
            formData.append(`JoviImageList[${index}].FileType`, 21) //21 because of adding in order
            formData.append(`JoviImageList[${index}].FileExtensionType`, 1)
        }

        multipartPostRequest(
            Endpoints.ADD_PITSTOPIMAGE,
            formData,
            res => {
                //SUCCESS HANDLER
                const resAt0 = res.joviImageReturnViewModelList[0];
                pitStopImage({
                    id: resAt0.joviImageID,
                    fileName: resAt0.joviImage.split('/').pop(),
                    path: resAt0.joviImage,
                    ...resAt0,
                }, null);
                toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
            },
            err => {
                pitStopImage(null, imageData.lastIndex);
            },
            {})
    };

    /************   End of functions of Pitstop Details Component     **************/


    const onSliderChange = () => {

    }



    // /************   Start of Shared Card Header function     **************/

    const renderHeader = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index) => {
        return (
            <CardHeader
                title={title}
                description={desc}
                xmlSrc={svg}
                isOpened={isOpened}
                style={styles.cardContainer}
                headerBackgroundColor={headerColor}
                activeOpacity={0.9}
                disabled={key === PITSTOP_CARD_TYPES["estimated-price"] && !(description)}
                onHeaderPress={() => {
                    setCardData([...cardData].map(object => {
                        if (object.idx === idx) {
                            return {
                                ...object,
                                isOpened: !object.isOpened,
                                headerColor: colors.primary
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

    const renderBody = (idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index) => {

        if (idx === 1) {
            return (
                <PitStopLocation
                    nameVal={nameval}
                    locationVal={locationVal}
                    isOpened={isOpened}
                    onChangeName={(text) => { setNameVal(text) }}
                    onLocationPress={() => {
                        navigation.navigate(ROUTES.APP_ROUTES.Map.screen_name)
                    }}
                    handleLocationSelected={handleLocationSelected}
                    onLocationSearchInputChange={onLocationSearchInputChange}
                    onNearbyLocationPress={() => onLocationSearchInputChange(false)}
                    // handleInputFocused={(index) => { }}
                    handleSetFavClicked={handleSetFavClicked}
                />
            )

        } else if (idx === 2) {
            return (
                <PitStopDetails
                    description={description}
                    isOpened={isOpened}
                    onChangeDescription={(t) => {
                        setDescription(t)
                        toggleCardData(PITSTOP_CARD_TYPES["estimated-time"]);
                    }}
                    onBrowsePress={() => {
                        // sharedLaunchCameraorGallery(1, () => { }, picData => { })
                        setModalVisible(true)
                    }} />
            )
        } else if (idx === 3) {
            return (
                <PitStopEstTime
                    collapsed={collapsed}
                    estTime={estTime}
                    isOpened={isOpened}
                    onEstTimePress={(item) => {
                        setEstTime(item);
                        setCollapsed(!collapsed);
                        toggleCardData(PITSTOP_CARD_TYPES["buy-for-me"]);
                    }}
                    onPressDropDown={() => {
                        setCollapsed(!collapsed)
                    }}
                    onSliderChange={onSliderChange}
                />
            )
        } else if (idx === 4) {
            return (
                <PitStopBuy
                    switchVal={switchVal}
                    isOpened={isOpened}
                    onToggleSwitch={(bool) => { setSwitch(bool) }} />
            )
        } else if (idx === 5) {
            return (
                <PitStopEstPrice
                    isOpened={isOpened}
                    onChangeSliderText={(text) => { setEstVal(text) }}
                    onSliderChange={() => { }} />
            )
        }
        else {
            return <View />
        }
    }


    /************   End of Body function     **************/

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <CustomHeader leftIconName="keyboard-backspace" leftIconType="MaterialCommunityIcons" leftIconSize={30} />
            <Transitioning.View
                ref={ref}
                transition={transition}
                style={styles.container}>
                <KeyboardAwareScrollView nestedScrollEnabled keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1 }} scrollEventThrottle={200}>
                    {cardData.map(({ idx, title, desc, svg, isOpened, key, headerColor, showSubCard }, index) => {
                        return (
                            showSubCard &&
                            <View
                                key={`card mapping ${idx}`}
                                style={[styles.cardView]}>
                                {renderHeader(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index)}
                                {renderBody(idx, title, desc, svg, isOpened, key, headerColor, showSubCard, index)}
                            </View >

                        );
                    })
                    }
                    <>
                        <Button
                            text="Save and Continue"
                            onPress={() => {
                                console.log(nameval, locationVal,);
                            }}
                            style={[styles.locButton, { height: 45, marginVertical: 10 }]}
                            textStyle={styles.btnText}
                            fontFamily="PoppinsRegular"
                        />
                    </>
                </KeyboardAwareScrollView>
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
                </Modal>
            </Transitioning.View>
        </SafeAreaView >
    );
}
