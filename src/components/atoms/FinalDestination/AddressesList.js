import { View, Appearance, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import Text from '../Text';
import { useDispatch, useSelector } from 'react-redux';
import VectorIcon from '../VectorIcon';
import { ScrollView, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TouchableOpacity from '../TouchableOpacity';
import constants from '../../../res/constants';
import Button from '../../molecules/Button';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import ReduxActions from './../../../redux/actions';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../assets/svgs';


export default (props) => {
    const { enumsReducer, userReducer } = useSelector(state => state)
    let initState = {
        "addressList": [
            ...userReducer.addresses
        ]
    }
    const HEIGHT = constants.window_dimensions.height;
    const WIDTH = constants.window_dimensions.width;
    const dispatch = useDispatch();
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const [state, setState] = useState(initState)
    const [, updateStateaaa] = React.useState();
    const forceUpdate = React.useCallback(() => updateStateaaa({}), []);
    const adrObjRef = useRef(null)

    const onConfirmAddress = () => {
        let finalDestObj = adrObjRef.current
        dispatch(ReduxActions.closeModalAction());
        dispatch(ReduxActions.setUserFinalDestAction({ finalDestObj }))
        setState(initState)
    }

    const onAdressListPress = (item, index) => {
        adrObjRef.current = item
        let modifiedArray = state.addressList.map(object => {
            if (object.addressID === item.addressID) {
                return { ...object, iconColor: object.iconColor ? null : colors.black }
            } else return { ...object, iconColor: null }

        })
        setState(pre => ({
            ...pre,
            addressList: modifiedArray
        }))
    }

    const onTitlePress = (index) => {
        dispatch(ReduxActions.closeModalAction());
        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name, { onNavigateBack: (placeName) => {}, index })
    }

    const renderAddressList = () => {
        return (
            <View style={{}}>
                {state.addressList.map((item, index) => {
                    return (
                        <TouchableOpacity activeOpacity={1} key={`addressList ${index}`} style={{ flexDirection: 'row', padding: 20, alignItems: 'center', backgroundColor: item.iconColor ? colors.light_primary_color  : colors.white  }} onPress={() => onAdressListPress(item, index)} >
                            <SvgXml xml={item.addressType ? item.addressType === 1 ? svgs.homeAddIcon(item.iconColor ? item.iconColor : colors.primary) : item.addressType === 2 ? svgs.bagIcon(item.iconColor ? item.iconColor : colors.primary) : svgs.relationIcon(item.iconColor ? item.iconColor : colors.primary) : svgs.plusIcon(item.iconColor ? item.iconColor : colors.primary)} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text fontFamily={"PoppinsMedium"} style={{ color: item.iconColor ? item.iconColor : colors.primary, fontSize: 16 }}>{item.addressTypeStr || 'Other'}</Text>
                                {item.title && <Text numberOfLines={1} fontFamily={"PoppinsRegular"} style={{ color: colors.subTextGreyColor || item.iconColor, fontSize: 10 }}>{item.title}</Text>}
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }
    return (
        <View style={{ marginBottom: 20 }} >
            <Text style={{ padding: 20, color: colors.black, fontSize: 18 }} fontFamily="PoppinsMedium" >Can you confirm if this is your location?</Text>
            <TouchableOpacity style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }} onPress={() => onTitlePress(0)}>
                <VectorIcon name="map-marker" type="FontAwesome" size={20} color={colors.primary} />
                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text fontFamily={"PoppinsMedium"} style={{ color: colors.primary, fontSize: 16 }}>{'Use my current location'}</Text>
                </View>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: 300 }}>
                {renderAddressList()}
            </ScrollView>
            <TouchableOpacity style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }} onPress={() => onTitlePress(3)} >
                <VectorIcon name="plus" type="FontAwesome" size={20} color={colors.primary} />
                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text fontFamily={"PoppinsSemiBold"} style={{ color: colors.primary, fontSize: 16 }}>{'Add New Location'}</Text>
                </View>
            </TouchableOpacity>
            <Button text="Confirm Button" onPress={onConfirmAddress} style={{ width: WIDTH * 0.95, height: HEIGHT / 15, alignSelf: 'center' }} />
        </View>
    )
}