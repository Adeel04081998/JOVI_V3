import React, { useState } from 'react'
import { Appearance, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import svgs from '../../assets/svgs';
import SharedMapView from '../../components/atoms/GoogleMaps/SharedMapView';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
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



const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


export default (props) => {

    const HEIGHT = constants.screen_dimensions.height;
    const WIDTH = constants.screen_dimensions.width;
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = addressStyles(colors, HEIGHT, WIDTH)
    const { AddressTypeEnum } = useSelector(obj => obj.enumsReducer)
    const dispatch = useDispatch()

    let initState = {
        "inputs": [
            {
                key: 1,
                val: '',
                placeHolder: 'Street# 22',
                shown: true

            },
            {
                key: 2,
                val: '',
                placeHolder: 'House#645',
                shown: true

            },
            {
                key: 3,
                val: '',
                placeHolder: '(Optional) Note to Rider',
                shown: true

            },
            {
                key: 4,
                val: '',
                placeHolder: 'e.g Chutti Dedo',
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
        ]
    }
    const [state, setState] = useState(initState)
    const { inputs, addressTypeList, selectedRegion } = state;

    const IS_DISABLED = () => {
        let addressType = addressTypeList.find(x => x.selected === true)
        if (addressType) return false
        else return true
    }

    const onPressSaveAndContinue = () => {
        let addressType = addressTypeList.filter(x => x.selected === true)
        postRequest(Endpoints.AddorUpdateAddress,
            {
                "addressID": 0,
                "title": props.route.params.finalDestObj.title,
                "latitude": props.route?.params?.finalDestObj.latitude,
                "longitude": props.route?.params?.finalDestObj.longitude,
                "latitudeDelta": LATITUDE_DELTA,
                "longitudeDelta": LONGITUDE_DELTA,
                "note": inputs[2].val,
                "city": props.route?.params?.finalDestObj.city,
                "addressType": addressType[0]?.key || '',
                "AddressTypeStr": addressType[0]?.lable || ''
            },
            res => {
                console.log("ADDorUPDATE ADDRESS.RESPONSE", res);
                if (res.data.statusCode === 200) {
                    dispatch(ReduxActions.setUserFinalDestAction({ ...props.route.params.finalDestObj }))
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name)
                }
                // setData(res.data.vendorCategoriesViewModel.vendorList.map((item,i)=>{return {...item,cardType:!i%2===0?2:1}}));
            },
            err => {
                sharedExceptionHandler(err)
            },
            {},
            false,
        );
    }

    const onPresslabel = (item, index) => {
        let modifiedArray = state.addressTypeList.map((object, idx) => {
            if (idx === index) {
                return { ...object, selected: !object.selected }
            } else return { ...object, selected: false }

        })
        setState(pre => ({
            ...pre,
            addressTypeList: modifiedArray
        }))
    }


    const onChangeText = (val, index) => {
        state.inputs[index].val = val
        setState(pre => ({
            ...pre,
        }))
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container} >
                <SharedMapView
                    latitude={props.route?.params?.finalDestObj.latitude}
                    longitude={props.route?.params?.finalDestObj.longitude}
                    showCurrentLocationBtn={false}
                    showContinueBtn={false}
                    mapHeight={(HEIGHT * 1.4) - HEIGHT}
                    markerStyle={{
                        zIndex: 3,
                        position: 'absolute',
                        marginTop: -15,
                        marginLeft: -11,
                        left: WIDTH / 2,
                        top: ((HEIGHT * 1.35) - HEIGHT) / 2,
                    }}
                    onMapPress={() => { NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name,) }} />
                <View style={styles.modalView} >
                    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} >

                        <Text style={styles.mainText} fontFamily="PoppinsMedium" >Your current location</Text>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.touchableField} onPress={() => {
                                NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name)
                            }} >
                                <SvgXml xml={svgs.pinField()} />
                                <View style={styles.touchableFieldTextContainer} >
                                    <Text numberOfLines={1} style={styles.addressText} fontFamily="PoppinsMedium" >{props.route.params.finalDestObj.title}</Text>
                                    <Text numberOfLines={1} style={styles.subAddressText} fontFamily="PoppinsRegular" >{props.route.params.finalDestObj.city}</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                                {
                                    inputs.map((item, index) => {
                                        return (
                                            item.shown &&
                                            <TextInput key={`textinput  ${item.key}`} value={item.val} placeholder={item.placeHolder} onChangeText={(text) => { onChangeText(text, index) }} />
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
                                        <Text fontFamily="PoppinsRegular" style={{ fontSize: 12, color: item.selected ? colors.primary : item.color}} >{item.lable}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                        <Button
                            onPress={onPressSaveAndContinue}
                            disabled={IS_DISABLED()}
                            text="Save and Continue"
                            textStyle={{
                                fontSize: 16,
                                fontFamily: FontFamily.Poppins.Regular
                            }}
                            style={{ width: WIDTH * 0.9, alignSelf: 'center' }}
                        />
                    </KeyboardAwareScrollView>

                </View>
            </View>
        </SafeAreaView>
    )
}