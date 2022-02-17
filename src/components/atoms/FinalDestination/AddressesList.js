import { View, Appearance, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import Text from '../Text';
import { useDispatch } from 'react-redux';
import VectorIcon from '../VectorIcon';
import { ScrollView, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TouchableOpacity from '../TouchableOpacity';
import constants from '../../../res/constants';
import Button from '../../molecules/Button';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import ReduxActions from './../../../redux/actions';


export default (props) => {
    let initState = {
        "addressList": [
            {
                iconName: "map-marker",
                title: 'Use my current location',
            },
            {
                iconName: "briefcase",
                title: 'Work',
                subText: '2nd Floor, Pakland Plaza, I8 Markaz'
            },
            {
                iconName: "home",
                title: 'Home',
                subText: 'House 67, St 33, I-8/3, Islamabad'
            },
            {
                iconName: "plus",
                title: 'Add New Location',
            }
        ]
    }
    const HEIGHT = constants.window_dimensions.height;
    const WIDTH = constants.window_dimensions.width;
    const dispatch = useDispatch();
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    const [state, setState] = useState(initState)

    const onConfirmAddress = () => {
        console.log('here');
    }

    const onAdressListPress = (item, index) => {
        dispatch(ReduxActions.setModalAction({ visible: false }))
        if (index == 0 || index === 3) {
            NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name, { onNavigateBack: (placeName) => props.finalDestFunc(placeName), index })
        } else {
           console.log('here');
        }
    }
    const renderAddressList = () => {
        return (
            <View style={{}}>
                {state.addressList.map((item, index) => {
                    return (
                        <TouchableOpacity activeOpacity={1} key={`addressList ${index}`} style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }} onPress={() => onAdressListPress(item, index)} >
                            <VectorIcon type="FontAwesome" name={item.iconName} size={20} color={colors.primary} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text fontFamily={"PoppinsMedium"} style={{ color: colors.primary, fontSize: 16 }}>{item.title}</Text>
                                {item.subText && <Text fontFamily={"PoppinsRegular"} style={{ color: colors.primary, fontSize: 10 }}>{item.subText}</Text>}
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
            <ScrollView style={{ maxHeight: 300 }}>
                {renderAddressList()}
            </ScrollView>
            <Button text="Confirm Button" onPress={onConfirmAddress} style={{ width: WIDTH * 0.95, height: HEIGHT / 15, alignSelf: 'center' }} />
        </View>
    )
}