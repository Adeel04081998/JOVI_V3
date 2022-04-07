import React, { useState } from 'react';
import { ActivityIndicator, Appearance, Platform, ScrollView, TouchableOpacity, } from 'react-native';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import View from '../../components/atoms/View';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';

export default (props) => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const data = props.route.params.data
    const [searchQry, setSearchQry] = useState('')
    const [isLoading, setIsLoading] = useState(true)


    const _onChangeText = searchQry => setSearchQry(searchQry)


    if (isLoading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
    </View>
    else if (!isLoading && !data.length) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16 }}>No contacts found</Text>
    </View>
    else return (
        <View style={{ flex: 1 }}>
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <TextInput
                    containerStyle={{
                        borderColor: '#000',
                        height: 50,
                        justifyContent: "center",
                        alignItems: 'center',
                        color: "#000",
                        borderRadius: 30,
                        paddingLeft: 10
                    }}
                    placeholderTextColor="#707070"
                    placeholder="Search"
                    onChangeText={val => _onChangeText(val)}
                />
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 5, marginBottom: 10 }}>
                    {
                        (data || []).filter(item => searchQry === '' ? item : (item?.givenName ?? item?.displayName ?? "").trim().toLowerCase().includes(searchQry.trim().toLowerCase())).sort((a, b) => (a?.givenName ?? a?.displayName ?? "").toLowerCase().localeCompare((b?.givenName ?? b?.displayName ?? "").toLowerCase(), 'en', { ignorePunctuation: true })).map((item, i) => {
                            return <TouchableOpacity style={{
                                marginVertical: 15,
                                height: 50,
                                marginHorizontal: 10,
                                flexDirection: 'row',
                                borderBottomColor: 'rgba(0,0,0,0.1)',
                                borderBottomWidth: 1,
                                paddingBottom: 20,
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }} key={i}
                                onPress={() => onPress(item, i)}
                            >
                                <View style={{ flexDirection: 'column', paddingHorizontal: 10 }}>
                                    <Text style={{ alignSelf: 'flex-start', fontSize: 16, color: colors.greyish_black }} fontFamily="PoppinsMedium" >
                                        {item?.givenName ?? item?.displayName ?? "No name"}
                                    </Text>
                                    <Text style={{ alignSelf: 'flex-start', fontSize: 12, color: colors.grey }} fontFamily="PoppinsRegular" >
                                        {(Array.isArray(item.phoneNumbers) && item.phoneNumbers.length) ? item.phoneNumbers?.[0]?.number ?? "" : ""}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                </ScrollView>
            </View>
        </View >
    );
}
