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
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const ICON_CONTAINER_SIZE = 40;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    const userReducer = useSelector(state => state.userReducer);
    const inviteCode = userReducer.referralCode.toUpperCase()
    const _styles = styles(colors);
    const [contacts, setContacts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQry, setSearchQry] = useState("")

    

const getContactsList = () =>{
    const cbSuccess = () => {
        Contacts.getAll()
            .then(contacts => {
                console.log('contacts',contacts);
                setIsLoading(false)
                setContacts(contacts)
            })
            .catch(err => {
                setIsLoading(false)
                setContacts([])
                sharedExceptionHandler(err)
            })
    }
    const cbFailure = (err) => {
        sharedExceptionHandler(err)
    }
    askForContactPermissions(cbSuccess, cbFailure)
}

    const _onPress = async (item, index) => {
        let cellNo = (item.phoneNumbers?.[0]?.number ?? "").split()[0]
        cellNo = cellNo ? cellNo.replace(/(\s|\+|\-)/gi, "") : "";
        setContacts([])
        setSearchQry("")
        let message = `${GV.BASE_URL.current}/${Endpoints.REFERRAL}${cellNo}/${inviteCode}`;
        const separator = Platform.OS === 'ios' ? '&' : '?'
        const url = `sms:${cellNo}${separator}body=${message}`
        Linking.openURL(url)
    };
    const _onChangeText = searchQry => setSearchQry(searchQry)

    const _renderHeader = () => (<CustomHeader
        // renderLeftIconAsDrawer
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
                <Text style={[_styles.inviteTextStyle, { fontSize: 16 }]} fontFamily="PoppinsRegular" >Invite a friend and get 10% discount</Text>
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
            <Button wait={0} style={_styles.inviteBtnStyle} textStyle={{ color: colors.primary, fontSize: 16 }} text="Invite from contacts" onPress={() => {getContactsList() }} />
        )
    }
    const _renderShareLink = () => {
        return (
            <Text style={_styles.inviteLinkTextStyle} fontFamily="PoppinsRegular">Share Link</Text>
        )
    }
    // const _renderContacts = () =>{
    //     return(
    //         <ContactList data={contacts} isLoading={isLoading} onPress={_onPress} onChangeText={_onChangeText} searchQry={searchQry} />
    //     )
    // }
    return (
        <SafeAreaView style={_styles.primaryContainer}>
            {_renderHeader()}
            <View style={{ flex: 1 }}>
                { _renderSvg()}
                { _renderInviteText()}
                {_renderInviteCode()}
                {_renderButton()}
                {_renderShareLink()}
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