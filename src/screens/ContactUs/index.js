import React from 'react';
import { Appearance, Linking, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import svgs from '../../assets/svgs';
import Image from '../../components/atoms/Image';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import TouchableScale from '../../components/atoms/TouchableScale';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import NavigationService from '../../navigations/NavigationService';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const ICON_CONTAINER_SIZE = 40;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    const userReducer = useSelector(state => state.userReducer);
    const _styles = styles(colors);
    const onDialerPress = () => {
        Linking.openURL(`tel:${userReducer?.customerHelpNumber ?? ''}`)
    }
    const onEmailPress = () => {
        Linking.openURL(`mailto:${userReducer?.customerHelpEmail}`)
    }
    const _renderHeader = () => (<CustomHeader
        renderLeftIconAsDrawer
        renderRightIconForHome
        rightIconName={null}
        title={`Contact Us`}
        titleStyle={{
            fontFamily: FontFamily.Poppins.SemiBold,
            fontSize: 16,
        }}
        defaultColor={colors.primary}
    />)
    const _renderContactUsBlock = (onPress = () => { }, title = "Email", icon = { name: 'email', type: 'Entypo' }, extraStyles = {}) => (<TouchableOpacity style={{
        ..._styles.contactUsBlock,
        ...extraStyles
    }}
        onPress={onPress}
    >
        <View style={_styles.iconContainer}>
            <VectorIcon name={icon.name} type={icon.type} color={colors.white} />
        </View>
        <Text style={{ color: colors.black }}>{title}</Text>
    </TouchableOpacity>);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            {_renderHeader()}
            <View style={{ flex: 1 }}>
                <View style={{ height: '55%' }}>
                    <Image source={require('../../assets/images/contactUs.png')} tapToOpen={false} resizeMode={'stretch'} style={{ height: '100%', width: '100%' }} />
                </View>
                <View style={{ height: '45%', marginTop: -30 }}>
                    <View style={{ height: 115, alignItems: 'center' }}>
                        <Text style={_styles.contactUsTitle} fontFamily={'PoppinsBold'}>How can we Help You?</Text>
                        <Text style={_styles.contactUsText} >Experiencing Problems Signing Up?</Text>
                        <Text style={_styles.contactUsText} >We are here to help.</Text>
                        <Text style={_styles.contactUsText} >Please get in touch with us.</Text>
                    </View>
                    <View style={{ height: 150, justifyContent: 'center', flexDirection: 'row' }}>
                        {_renderContactUsBlock(onDialerPress, 'Call', { name: 'call', type: 'Ionicons' }, { marginRight: 30 })}
                        {_renderContactUsBlock(onEmailPress)}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = (colors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    contactUsBlock: {
        height: 95,
        width: 95,
        borderRadius: 12,
        borderWidth: 0.4,
        paddingTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactUsText: { fontSize: 14, color: colors.black },
    contactUsTitle: { fontSize: 18, color: colors.black },
    iconContainer: { height: ICON_CONTAINER_SIZE, width: ICON_CONTAINER_SIZE, marginVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: ICON_CONTAINER_SIZE / 2, backgroundColor: colors.primary }
});