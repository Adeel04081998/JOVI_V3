import React, { useState } from 'react';
import { Appearance, FlatList, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import svgs from '../../assets/svgs';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import TouchableScale from '../../components/atoms/TouchableScale';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import { sharedConfirmationAlert, sharedExceptionHandler, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import actions from '../../redux/actions';
import FontFamily from '../../res/FontFamily';
import sharedStyles from '../../res/sharedStyles';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const SPACING = 10;
const ICON_CONTAINER_SIZE = 40;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    const userReducer = useSelector(state => state.userReducer);
    const dispatch = useDispatch()
    // const addresses = userReducer?.addresses ?? [];
    const [addresses, setAddresses] = useState(userReducer?.addresses ?? [])
    const _styles = styles(colors);
    React.useEffect(() => {
        setAddresses(userReducer?.addresses)
    }, [userReducer?.addresses])
    const renderFavIcon = {
        1: svgs.homeAddIcon(colors.primary),
        2: svgs.bagIcon(colors.primary),
        3: svgs.relationIcon(colors.primary),
        4: svgs.addOtherLocation(colors.primary),
        5: svgs.relationIcon(colors.primary),
        6: svgs.addOtherLocation(colors.primary),
    }
    const _renderHeader = () => (<CustomHeader
        leftCustom={(
            <TouchableScale wait={0} onPress={() => {
                NavigationService.NavigationActions.common_actions.goBack();
            }} style={customheaderStyles.iconContainer}>
                <SvgXml xml={svgs.hamburgerMenu(colors.primary)} height={HEADER_ICON_SIZE} width={HEADER_ICON_SIZE} />
            </TouchableScale>
        )}
        rightIconName={null}
        title={`Delivery Address`}
        titleStyle={{
            fontFamily: FontFamily.Poppins.SemiBold,
            fontSize: 16,
        }}
        defaultColor={colors.primary}
    />)

    const deleteAddressHandler = (addressObj, index) => {
        postRequest(
            `${Endpoints.DELETE_ADDRESS}/${addressObj.addressID}`,
            {},
            async (res) => {
                let filteredAddresses = addresses.filter(ad => ad.addressID !== addressObj.addressID);
                setAddresses(filteredAddresses)
                dispatch(actions.setUserAction({ ...filteredAddresses }));
            },
            err => {
                console.log(err)
                sharedExceptionHandler(err)
            },
        )

    };
    const deleteAddressWarn = (addressObj, index) => sharedConfirmationAlert("Alert", "Are You sure you want to delete the address?", [
        {
            text: "OK",
            onPress: () => { deleteAddressHandler(addressObj, index) }
        },
        {
            text: "Cancel",
            onPress: () => {
                console.log('cancel pressed');
            }
        },
    ])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            {_renderHeader()}
            <View style={{ flex: 1, }}>
                <Text style={{ ..._styles.title, marginHorizontal: SPACING }} fontFamily={'PoppinsSemiBold'}>Saved Address</Text>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={addresses}
                        contentContainerStyle={{ paddingHorizontal: SPACING, paddingBottom: 70 }}
                        renderItem={({ item, index }) => (
                            <View style={{ height: 120, marginVertical: SPACING, padding: SPACING * 2, width: '100%', backgroundColor: colors.white, borderRadius: 6, ...sharedStyles._styles(colors).placefor_specific_shadow }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <SvgXml height={14} width={14} xml={renderFavIcon[item.addressType ?? 4]} style={{ marginRight: SPACING, alignSelf: 'center' }} />
                                        <Text style={{ fontSize: 14, color: colors.primary }} fontFamily="PoppinsBold">{VALIDATION_CHECK(item.addressTypeStr) ? item.addressTypeStr : 'Other'}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, { finalDestObj: item, index: 4 })} >
                                            <VectorIcon size={17} color={colors.primary} name={'edit'} type={'MaterialIcons'} style={{ marginRight: 5 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteAddressWarn(item, index)} >
                                            <VectorIcon size={17} color={colors.primary} name={'delete'} type={'MaterialCommunityIcons'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flex: 2, paddingTop: SPACING }}>
                                    <Text style={{ fontSize: 14, color: colors.black }} fontFamily="PoppinsMedium" numberOfLines={2}>{item.title}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View style={{ height: 70, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, }}>
                    <Button
                        text={'Add Address'}
                        onPress={() => {
                            NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Map.screen_name, { onNavigateBack: (placeName) => { }, index : 3 })

                        }}
                        style={{
                            width: 142,
                            borderRadius: 40,
                            height: 37
                        }}
                        textStyle={{
                            fontSize: 16
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};
const styles = (colors) => StyleSheet.create({
    title: { fontSize: 16, color: colors.black },
});