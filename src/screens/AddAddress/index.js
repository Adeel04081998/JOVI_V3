import React, { useRef, useState } from 'react'
import { Alert, Appearance, BackHandler, PixelRatio, Platform, ScrollView } from 'react-native'
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import svgs from '../../assets/svgs';
import SharedMapView from '../../components/atoms/GoogleMaps/SharedMapView';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import { confirmServiceAvailabilityForLocation, sharedExceptionHandler, sharedGetUserAddressesApi } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import ReduxActions from "../../redux/actions/index";
import addressStyles from './styles';
import Toast from '../../components/atoms/Toast';
import { KeyboardAwareScrollView } from '../../../libs/react-native-keyboard-aware-scroll-view';



const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


export default (props) => {

    const baseHeight = 550
    const WINDOW_HEIGHT = constants.window_dimensions.height;

    const HEIGHT = constants.screen_dimensions.height;
    const WIDTH = constants.screen_dimensions.width;

    const SCALED_HEIGHT = PixelRatio.roundToNearestPixel(WINDOW_HEIGHT * (WINDOW_HEIGHT / baseHeight));

    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = addressStyles(colors, HEIGHT, WIDTH)
    const { AddressTypeEnum } = useSelector(obj => obj.enumsReducer)
    const scrollRef = useRef(null)
    const dispatch = useDispatch()
    const finalDestinationObj = props?.route?.params?.finalDestObj ?? {};
    const fromScreenIndex = props?.route?.params?.index ?? null


    let initState = {
        "inputs": [
            {
                key: 1,
                val: '',
                placeHolder: '(Optional) Street# 22',
            },
            {
                key: 2,
                val: '',
                placeHolder: '(Optional) House#645',
            },
            {
                key: 3,
                val: '',
                placeHolder: '(Optional) Note to Rider',
            },
            {
                key: 4,
                val: '',
                placeHolder: 'e.g Jovi Office',
                shown: false
            }
        ],
        "addressTypeList": [
            {
                key: AddressTypeEnum[0].value,
                iconName: (color) => svgs.homeAddIcon(color),
                lable: 'Home',
                borderColor: null,
                color: colors.black,
                selected: false
            },
            {
                key: AddressTypeEnum[1].value,
                iconName: (color) => svgs.bagIcon(color),
                lable: 'Work',
                borderColor: null,
                color: colors.black,
                selected: false
            },
            {
                key: AddressTypeEnum[4].value,
                iconName: (color) => svgs.relationIcon(color),
                lable: 'Relation',
                borderColor: null,
                color: colors.black,
                selected: false
            },
            {
                key: AddressTypeEnum[5].value,
                iconName: (color) => svgs.plusIcon(color),
                lable: 'Other',
                borderColor: null,
                color: colors.black,
                selected: false
            },
        ],
        "isOtherPressed": false
    }
    const [state, setState] = useState(initState)
    const { inputs, addressTypeList, selectedRegion } = state;

    const backAction = () => {
        onBackPress()
        return true
    };

    React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    React.useEffect(() => {
        if (props.route) {
            if (props.route.params !== null && props.route.params !== undefined) {
                if (fromScreenIndex === 4) {
                    if (finalDestinationObj?.note) inputs[2].val = finalDestinationObj?.note
                    if (finalDestinationObj?.house) inputs[1].val = finalDestinationObj?.house
                    if (finalDestinationObj?.street) inputs[0].val = finalDestinationObj?.street
                    if (finalDestinationObj?.addressType === parseInt(AddressTypeEnum[5].value)) {
                        inputs[3].val = finalDestinationObj?.addressTypeStr
                        inputs[3].shown = true
                    }
                    let modifiedArray = addressTypeList.map((item, index) => {
                        if (item.key === finalDestinationObj?.addressType?.toString()) {
                            return { ...item, selected: true }
                        } else {
                            return { ...item }
                        }
                    })
                    setState(pre => ({
                        ...pre,
                        addressTypeList: modifiedArray,

                    }))
                }

            }
        }
    }, [props.route]);


    const IS_DISABLED = () => {
        let addressType = addressTypeList.find(x => x.selected === true);
        if (addressType) {
            if (addressType.key === AddressTypeEnum[5].value) {
                return inputs[3].val ? false : true;
            }
            return false
        }
        else return true
    }

    const onPressSaveAndContinue = () => {
        const finalDestObj = props.route?.params?.finalDestObj;
        confirmServiceAvailabilityForLocation(postRequest, props.route?.params?.finalDestObj.latitude, props.route?.params?.finalDestObj.longitude,
            (resp) => {
                let addressType = addressTypeList.filter(x => x.selected === true)
                postRequest(Endpoints.AddorUpdateAddress,
                    {
                        "addressID": 0,
                        "title": props.route.params.finalDestObj.title,
                        "latitude": props.route?.params?.finalDestObj.latitude,
                        "longitude": props.route?.params?.finalDestObj.longitude,
                        "latitudeDelta": LATITUDE_DELTA,
                        "longitudeDelta": LONGITUDE_DELTA,
                        "note": inputs[2].val.trim() ?? '',
                        "city": props.route?.params?.finalDestObj.city,
                        "addressType": addressType[0]?.key ?? '',
                        "addressTypeStr": inputs[3].val.trim() ?? '',
                        "house": inputs[1].val.trim() ?? '',
                        "street": inputs[0].val.trim() ?? '',
                    },
                    res => {
                        console.log("ADDorUPDATE ADDRESS.RESPONSE", res);
                        if (res.data.statusCode === 200) {
                            sharedGetUserAddressesApi();
                            dispatch(ReduxActions.setUserFinalDestAction({
                                finalDestObj: {
                                    ...finalDestObj,
                                    "addressType": addressType[0]?.key || '',
                                    "addressTypeStr": inputs[3].val || ''
                                },
                            }))
                            onBackPress(fromScreenIndex === 4 ? false : true);
                        }
                    },
                    err => {
                        sharedExceptionHandler(err)
                    },
                    {},
                    false,
                );

            }, (error) => {
                sharedExceptionHandler(error)
            })

    }

    const onPresslabel = (item, index) => {
        scrollRef.current.scrollToEnd()
        let modifiedArray = addressTypeList.map((object, idx) => {
            if (idx === index) {
                return { ...object, selected: !object.selected }
            } else return { ...object, selected: false }

        })
        if (index === 3) inputs[3].shown = !inputs[3].shown
        else inputs[3].shown = false
        setState(pre => ({
            ...pre,
            addressTypeList: modifiedArray,
            isOtherPressed: true
        }))
    }


    const onChangeText = (val, index) => {
        state.inputs[index].val = val
        setState(pre => ({
            ...pre,
        }))
    }

    const onBackPress = (forcePop = false) => {
        const isFromEdit = props.route.params?.isFromEdit ?? false;
        if (isFromEdit || forcePop) {
            NavigationService.NavigationActions.stack_actions.pop(2);
        } else {
            NavigationService.NavigationActions.common_actions.goBack();
        }
    };


    const onPressToGoMap = () => {
        props.route.params.updateFinalDestination(props.route.params.finalDestObj);
        if (fromScreenIndex === 4) NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name, { latitude: finalDestinationObj.latitude, longitude: finalDestinationObj.longitude, index: fromScreenIndex });
        else NavigationService.NavigationActions.stack_actions.pop(1);
    }



    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container} >
                <SharedMapView
                    onBackPress={() => { onBackPress() }}
                    latitude={props.route?.params?.finalDestObj.latitude}
                    longitude={props.route?.params?.finalDestObj.longitude}
                    route={props.route}
                    showCurrentLocationBtn={false}
                    showContinueBtn={false}
                    showDirections={false}
                    showMarker={true}
                    mapHeight={SCALED_HEIGHT * 0.27}
                    markerStyle={{
                        zIndex: 3,
                        position: 'absolute',
                        marginTop: -15,
                        marginLeft: -11,
                        left: WIDTH / 2,
                        top: ((SCALED_HEIGHT * 1.3) - SCALED_HEIGHT) / 2,
                    }}
                    pitchEnabled={false}
                    zoomEnabled={false}
                    scrollEnabled={false}
                    selectFinalDestination={true}
                    newFinalDestination={finalDestinationObj}
                    onMapPress={onPressToGoMap} />
                <View style={styles.modalView} >
                    <KeyboardAwareScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1 }} >

                        <Text style={styles.mainText} fontFamily="PoppinsMedium" >Your current location</Text>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.touchableField} onPress={onPressToGoMap} >
                                <SvgXml xml={svgs.pinField()} />
                                <View style={styles.touchableFieldTextContainer} >
                                    <Text numberOfLines={1} style={styles.addressText} fontFamily="PoppinsMedium" >{props.route.params.finalDestObj.title}</Text>
                                    <Text numberOfLines={1} style={styles.subAddressText} fontFamily="PoppinsRegular" >{props.route.params.finalDestObj.city}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{}} >
                                {
                                    inputs.map((item, index) => {
                                        return (
                                            index !== 3 &&
                                            <TextInput key={`textinput  ${item.key}`} value={item.val} placeholder={item.placeHolder} onChangeText={(text) => { onChangeText(text, index) }} maxLength={50} />
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <Text style={styles.labelTitle} fontFamily="PoppinsMedium" >ADD A LABEL</Text>
                        <ScrollView horizontal contentContainerStyle={{ flex: 1, flexGrow: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                            {addressTypeList.map((item, index) => {
                                return (
                                    <TouchableOpacity key={`addressTypeList  ${index}`} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
                                        onPress={() => onPresslabel(item, index)}
                                    >
                                        <View style={{ ...styles.addressList, borderWidth: item.selected ? 1 : 0, borderColor: item.selected ? colors.primary : item.color }}>
                                            <SvgXml xml={item.iconName(item.selected ? colors.primary : item.color)} height={20} width={20} />
                                        </View>
                                        <Text fontFamily="PoppinsRegular" style={{ fontSize: 12, color: item.selected ? colors.primary : item.color }} >{item.lable}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                        {
                            inputs.map((item, index) => {
                                return (
                                    index == 3 ?
                                        item.shown === true &&
                                        <TextInput key={`textinput  ${item.key}`} value={item.val} placeholder={item.placeHolder} onChangeText={(text) => { onChangeText(text, index) }} containerStyle={{ width: WIDTH - 50, alignSelf: 'center' }} maxLength={50} />
                                        : null
                                )
                            })
                        }

                    </KeyboardAwareScrollView>
                    <Button
                        onPress={onPressSaveAndContinue}
                        disabled={IS_DISABLED()}
                        wait={0}
                        text="Save and Continue"
                        textStyle={{
                            fontSize: 16,
                            fontFamily: FontFamily.Poppins.Regular
                        }}
                        style={{ width: WIDTH * 0.9, alignSelf: 'center', marginVertical: 5 }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}