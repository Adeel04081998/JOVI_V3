import React, { useState } from 'react';
import { Alert, Appearance, Linking, Platform, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import Contacts from 'react-native-contacts';
import svgs from '../../assets/svgs';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import { askForContactPermissions } from '../../helpers/Permissions';
import FontFamily from '../../res/FontFamily';
import sharedStyles from '../../res/sharedStyles';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
// import ContactList from './ContactsList';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const ICON_CONTAINER_SIZE = 40;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    const userReducer = useSelector(state => state.userReducer);
    const inviteCode = userReducer.referralCode.toUpperCase()
    const description = userReducer.description
    const _styles = styles(colors);



    const getContactsList = () => {
        const cbSuccess = () => {
            Contacts.getAll()
                .then(contacts => {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ContactsList.screen_name, { data: contacts })
                })
                .catch(err => {
                    sharedExceptionHandler(err)
                })
        }
        const cbFailure = (err) => {
            sharedExceptionHandler(err)
        }
        askForContactPermissions(cbSuccess, cbFailure)
    }

  
    const _renderHeader = () => (<CustomHeader
        rightIconName={null}
        title={`Invite Friends`}
        titleStyle={{
            fontFamily: FontFamily.Poppins.SemiBold,
            fontSize: 16,
        }}
        defaultColor={colors.primary}
    />)
    const _renderSvg = () => {
        return (
            <SvgXml xml={svgs.invite_friend()} style={{ alignSelf: 'center' }} width={"95%"} />
        )
    }
    const _renderInviteText = () => {
        return (
            <View>
                <Text style={_styles.inviteTextStyle} fontFamily="PoppinsSemiBold" >Invite your friends Reward yourself</Text>
                <Text style={[_styles.inviteTextStyle, { fontSize: 16 }]} fontFamily="PoppinsRegular" >{description}</Text>
            </View>
        )
    }
    const _renderInviteCode = () => {
        return (
            <View>
                <Text style={[_styles.inviteCodeTextStyle, { paddingTop: 20 }]} fontFamily="PoppinsSemiBold" >{inviteCode}</Text>
                <Text style={[_styles.inviteCodeTextStyle, { fontSize: 18, color: colors.grey }]} fontFamily="PoppinsRegular">Your invite code</Text>
            </View>
        )
    }
    const _renderButton = () => {
        return (
            <Button wait={0} style={_styles.inviteBtnStyle} textStyle={{ color: colors.primary, fontSize: 16 }} text="Invite from contacts" onPress={() => { getContactsList() }} />
        )
    }
    const _renderShareLink = () => {
        return (
            <TouchableOpacity onPress={()=>{}} >
                <Text style={_styles.inviteLinkTextStyle} fontFamily="PoppinsRegular">Share Link</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={_styles.primaryContainer}>
            {_renderHeader()}
            <View style={{ flex: 1 }}>
                {_renderSvg()}
                {_renderInviteText()}
                {_renderInviteCode()}
                {_renderButton()}
                {/* {_renderShareLink()} */}
            </View>
        </SafeAreaView>
    );
};

const styles = (colors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    inviteCodeTextStyle: {
        color: colors.primary,
        fontSize: 30,
        textAlign: 'center'
    },
    inviteLinkTextStyle: {
        color: colors.grey,
        fontSize: 14,
        textAlign: 'center',
        paddingTop: 10
    },
    inviteTextStyle: {
        color: colors.greyish_black,
        fontSize: 25,
        textAlign: 'center',
        paddingHorizontal: 50,
        paddingTop: 10
    },
    inviteBtnStyle: {
        borderRadius: 50,
        alignSelf: 'center',
        width: 233,
        height: 45,
        backgroundColor: colors.white,
        ...sharedStyles._styles(colors).placefor_specific_shadow,
        marginTop: 50
    }

});