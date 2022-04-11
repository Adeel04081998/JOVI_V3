import React, { useState } from 'react';
import { ActivityIndicator, Appearance, Linking, Platform, ScrollView, StyleSheet, TouchableOpacity, } from 'react-native';
import { useSelector } from 'react-redux';
// import Share from 'react-native-share';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import Endpoints from '../../manager/Endpoints';
import { initColors } from '../../res/colors';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';

export default (props) => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const data = props.route.params?.data
    const [searchQry, setSearchQry] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const _styles = styles(colors);
    const userReducer = useSelector(state => state.userReducer);
    const inviteCode = userReducer.referralCode;

    React.useEffect(() => {
        setIsLoading(false)
    }, [data])

    const _onChangeText = searchQry => setSearchQry(searchQry)

    const onPress = async (item, index) => {
        let cellNo = (item.phoneNumbers?.[0]?.number ?? "").split()[0]
        cellNo = cellNo ? cellNo.replace(/(\s|\+|\-)/gi, "") : "";
        setSearchQry("")
        let message = `${GV.BASE_URL.current}/${Endpoints.REFERRAL}${cellNo}/${inviteCode}`;
        const separator = Platform.OS === 'ios' ? '&' : '?'
        const url = `sms:${cellNo}${separator}body=${message}`
        // const options = {
        //     message: message,
        //     title: 'Go GO',
        //     recipient: cellNo,
        //     url: url
        // }
        // Share.open(options)
        //     .then((res) => {
        //         console.log('res', res);
        //     })
        //     .catch((err) => {
        //         err && console.log('err', err);
        //     });
   
        Linking.openURL(url)
    };
    const _renderHeader = () => (<CustomHeader
        rightIconName={null}
        title={`Contacts`}
        titleStyle={{
            fontFamily: FontFamily.Poppins.SemiBold,
            fontSize: 16,
        }}
        defaultColor={colors.primary}
    />)

    const _renderSearchInput = () => {
        return (
            <View style={_styles.inputView}>
                <TextInput
                    containerStyle={_styles.inputContainer}
                    placeholderTextColor={colors.border}
                    placeholder="Search"
                    onChangeText={val => _onChangeText(val)}
                    style={{
                        fontFamily: FontFamily.Poppins.Regular
                    }}
                />
            </View>
        )

    }

    const contactData = (data || []).filter(item => searchQry === '' ? item : (item?.givenName ?? item?.displayName ?? "")
        .trim()
        .toLowerCase()
        .includes(searchQry.trim().toLowerCase()))
        .sort((a, b) => (a?.givenName ?? a?.displayName ?? "")
            .toLowerCase()
            .localeCompare((b?.givenName ?? b?.displayName ?? "")
                .toLowerCase(), 'en', { ignorePunctuation: true }))

    const _renderContacts = () => {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 5, marginBottom: 10 }}>
                    {
                        contactData.map((item, i) => {
                            return <TouchableOpacity style={_styles.contactContainer} key={i}
                                onPress={() => onPress(item, i)}
                            >
                                <View style={{ flexDirection: 'column', paddingHorizontal: 10 }}>
                                    <Text style={_styles.nameStyle} fontFamily="PoppinsMedium" >
                                        {item?.givenName ?? item?.displayName ?? "No name"}
                                    </Text>
                                    <Text style={_styles.phoneNumberStyle} fontFamily="PoppinsRegular" >
                                        {(Array.isArray(item.phoneNumbers) && item.phoneNumbers.length) ? item.phoneNumbers?.[0]?.number ?? "" : ""}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                </ScrollView>
            </View>
        )
    }

    const _renderLoading = () => {
        return (
            <View style={_styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        )
    }

    const _renderError = () => {
        return (
            <View style={_styles.errorConatiner}>
                <Text style={{ fontSize: 16 }}>No contacts found</Text>
            </View>
        )
    }

    if (isLoading) return _renderLoading()
    else if (!isLoading && !data.length) return _renderError()
    else return (
        <SafeAreaView style={_styles.primaryContainer}>
            {_renderHeader()}
            <View style={{ flex: 1 }}>
                {_renderSearchInput()}
                {_renderContacts()}
            </View >
        </SafeAreaView>
    );
}

const styles = (colors = initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    errorConatiner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    contactContainer: {
        marginVertical: 15,
        height: 50,
        marginHorizontal: 10,
        flexDirection: 'row',
        borderBottomColor: colors.input_background,
        borderBottomWidth: 1,
        paddingBottom: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputContainer:
    {
        borderColor: colors.black,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
        color: colors.black,
        borderRadius: 30,
        paddingLeft: 10
    },
    nameStyle: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: colors.greyish_black
    },
    phoneNumberStyle: {
        alignSelf: 'flex-start',
        fontSize: 12,
        color: colors.grey
    }

})