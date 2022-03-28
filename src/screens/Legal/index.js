import React from 'react';
import { Appearance, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import TouchableScale from '../../components/atoms/TouchableScale';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:colors.white }}>
            <CustomHeader
                // containerStyle={customheaderStyles.containerStyle}
                leftCustom={(
                    <TouchableScale wait={0} onPress={() => {
                        NavigationService.NavigationActions.common_actions.goBack();
                    }} style={customheaderStyles.iconContainer}>
                        <SvgXml xml={svgs.hamburgerMenu(colors.primary)} height={HEADER_ICON_SIZE} width={HEADER_ICON_SIZE} />
                    </TouchableScale>
                )}
                rightIconName={null}
                title={`Legal`}
                titleStyle={{
                    fontFamily: FontFamily.Poppins.SemiBold,
                    fontSize: 16,
                }}
                defaultColor={colors.primary}
            />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={
                        [{
                            id: 1,
                            title: 'Terms and Conditions',
                            url: ''
                        }, {
                            id: 1,
                            title: 'Privacy Policy',
                            url: ''
                        }, {
                            id: 1,
                            title: 'Terms and Conditions - Promotions',
                            url: ''
                        }, {
                            id: 1,
                            title: 'Terms and Conditions',
                            url: ''
                        }, {
                            id: 1,
                            title: 'Terms and Conditions',
                            url: ''
                        },]
                    }
                    contentContainerStyle={{
                        padding: 10,
                    }}
                    renderItem={({ item, index }) => (<TouchableOpacity
                        style={{
                            height: 50,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            borderWidth: 0.5,
                            borderColor: "rgba(0,0,0,0.5)",
                            borderRadius: 5,
                            marginVertical: 10,
                            backgroundColor: colors.white
                        }}
                    >
                        <Text style={{ color: colors.black }} numberOfLines={1}>{item.title}</Text>
                        <VectorIcon size={20} color={colors.black} name={'keyboard-arrow-right'} type={'MaterialIcons'} />
                    </TouchableOpacity>)}
                />
            </View>
        </SafeAreaView>
    );
};