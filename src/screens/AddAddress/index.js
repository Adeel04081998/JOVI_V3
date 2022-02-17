import React, { useState } from 'react'
import { Appearance, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import SharedMapView from '../../components/atoms/GoogleMaps/SharedMapView';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import addressStyles from './styles';

export default (props) => {

    const HEIGHT = constants.screen_dimensions.height;
    const WIDTH = constants.screen_dimensions.width;
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = addressStyles(colors, HEIGHT, WIDTH)

    let initState = {
        "inputs": [
            {
                val: '',
                placeHolder: 'Street# 22',

            },
            {
                val: '',
                placeHolder: 'House#645',

            },
            {
                val: '',
                placeHolder: '(Optional) Note to Rider',

            }
        ],
        "addressTypeList": [
            {
                iconName : (color)=>  svgs.homeAddIcon(),
                lable: 'Home',
                borderColor: null,
                color: colors.black
            },
            {
                iconName: (color)=> svgs.bagIcon(),
                lable: 'Work',
                borderColor: null,
                color: colors.black
            },
            {
                iconName: (color)=> svgs.relationIcon(),
                lable: 'Relation',
                borderColor: null,
                color: colors.black
            },
            {
                iconName: (color)=> svgs.plusIcon(),
                lable: 'Other',
                borderColor: null,
                color: colors.black
            },
        ]
    }
    const [state, setState] = useState(initState)
    const { inputs, addressTypeList } = state;


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
                    onMapPress={() => { NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name) }} />
                <View style={styles.modalView} >
                    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} >

                        <Text style={styles.mainText} fontFamily="PoppinsMedium" >Your current location</Text>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.touchableField} onPress={() => {
                                NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name)
                            }} >
                                <VectorIcon name="map-marker"
                                    type="FontAwesome"
                                    // style={styles.marker}
                                    size={30}
                                    color={colors.primary} />
                                <View style={styles.touchableFieldTextContainer} >
                                    <Text style={styles.addressText} fontFamily="PoppinsMedium" >{props.route.params.finalDestObj.placeName}</Text>
                                    <Text style={styles.subAddressText} fontFamily="PoppinsRegular" >{props.route.params.finalDestObj.placeName}</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                                {
                                    inputs.map((item, index) => {
                                        return (
                                            <TextInput key={`textinput  ${index}`} value={item.val} placeholder={item.placeHolder} onChangeText={(text) => { console.log('text', text) }} />
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
                                        onPress={() => {
                                            let modifiedArr = addressTypeList;
                                            modifiedArr[index].borderColor = colors.primary

                                            setState(pre => ({
                                                ...pre,

                                            }))
                                        }
                                        }
                                    >
                                        <View style={styles.addressList}>
                                            <SvgXml xml={item.iconName(item.color)} height={20} width={20} />
                                        </View>
                                        <Text fontFamily="PoppinsRegular" style={{ fontSize: 12, color: colors.black }} >{item.lable}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                        <Button
                            onPress={() => { }}
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