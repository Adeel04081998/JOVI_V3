import React from 'react';
import { Appearance, FlatList, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import CustomWebView from '../../components/organisms/CustomWebView';
import DashedLine from '../../components/organisms/DashedLine';
import { renderPrice, sharedExceptionHandler } from '../../helpers/SharedActions';
import { getRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const ICON_CONTAINER_SIZE = 40;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    const _styles = styles(colors);
    const [state, setState] = React.useState({
        data: []
    });
    const [scrollEnabled, setScrollEnabled] = React.useState(true);
    const getData = () => {
        getRequest(Endpoints.GET_PROMOS, (res) => {
            console.log('[GET_PROMOS]', res);
            if (res.data.statusCode === 200) {
                setState(prevState => ({ ...prevState, data: res.data.promoList ? res.data.promoList : [] }))
            }
        }, err => {
            sharedExceptionHandler(err);
        });
    }
    React.useEffect(() => {
        getData();
    }, []);
    const _renderHeader = () => (<CustomHeader
        leftCustom={(
            <TouchableScale wait={0} onPress={() => {
                NavigationService.NavigationActions.common_actions.goBack();
            }} style={customheaderStyles.iconContainer}>
                <SvgXml xml={svgs.hamburgerMenu(colors.primary)} height={HEADER_ICON_SIZE} width={HEADER_ICON_SIZE} />
            </TouchableScale>
        )}
        rightIconName={null}
        title={`Goody Bag`}
        titleStyle={{
            fontFamily: FontFamily.Poppins.SemiBold,
            fontSize: 16,
        }}
        defaultColor={colors.primary}
    />)
    const renderItem = (item, i) => {
        return <Voucher
            colors={colors}
            item={item}
            index={i}
            key={i}
            parentScrollHandler={setScrollEnabled}
        />
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F5FA' }}>
            {_renderHeader()}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={state.data}
                    scrollEnabled={scrollEnabled}
                    renderItem={({ item, index }) => renderItem(item, index)}
                />
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
const Voucher = ({ parentScrollHandler = () => { }, item = {}, index = {}, colors = {} }) => {
    const [state, setState] = React.useState({
        opened: false
    });
    const renderVoucherWebView = () => {
        if (state.opened) {
            return (
                <View style={{ marginHorizontal: 23, bottom: Platform.OS === 'android' ? 5 : 2, height: 200, }}>
                    <CustomWebView
                        key={`customer_promo_key_${index}`}
                        html={item.promoHtml}
                        screenStyles={{ width: '100%', minHeight: 200, height: 200, backgroundColor: "#fff", }}
                        webViewProps={{
                            injectedJavaScript: "document.body.style.userSelect = 'none'",
                            onTouchStart: () => {
                                parentScrollHandler(false)
                            },
                            onTouchEnd: () => {
                                parentScrollHandler(true)
                            },
                            onTouchEndCapture: () => {
                                parentScrollHandler(true)
                            },
                            onTouchCancel: () => {
                                parentScrollHandler(true)
                            }
                        }}
                    />
                </View>
            )
        }
    }
    return (
        <View>
            <VoucherUi colors={colors} title={item.title} description={item.promoCode} discountPercentage={'10%'} discountValidityDate={item.expiryTime} maxDiscount={item.discountCap} voucherOpened={state.opened} onPress={() => { setState(pre => ({ ...pre, opened: !pre.opened })); console.log('voucherPressed', state.opened); }} />
            {renderVoucherWebView()}
        </View>
    );
}
const VoucherUi = ({ title = "", colors = {}, voucherOpened = false, discountPercentage = "", description = "", discountCategory = "", maxDiscount = "", discountValidity = "", discountValidityDate = '', onPress = () => { }, activeTheme = {}, arcBackground = "", style, promoCodeApplied = "" }) => {
    return (
        <View style={{ position: 'relative', paddingTop: 10, height: 100, }}>
            <View style={{
                flexDirection: "column", marginHorizontal: 20, bottom: 10,
            }}>
                <SvgXml xml={voucherOpened ? svgs.voucherUISelected() : svgs.voucherUI()} width={'100%'} />
            </View>
            <TouchableOpacity onPress={onPress} style={{
                height: 85,
                width: '89%',
                position: 'absolute', top: 0,
                marginHorizontal: 20,
                marginTop: 8,
            }}>
                <View style={{ height: '55%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 }}>
                    <View style={{ width: '95%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 15, color: colors.black, maxWidth: '90.3%' }} fontFamily={'PoppinsBold'} numberOfLines={1}>{title}</Text>
                        <Text style={{ fontSize: 15, color: colors.black }} fontFamily={'PoppinsBold'}>{discountPercentage}</Text>
                    </View>
                    <View style={{ width: '95%' }}>
                        <Text style={{ fontSize: 10, color: colors.black }} numberOfLines={1}>{description}</Text>
                    </View>
                </View>
                <View style={{ height: '45%', paddingTop: 5, paddingLeft: 10 }}>
                    <DashedLine containerStyles={{ top: -7, position: 'absolute', width: '97%', alignSelf: 'center' }} />
                    <View style={{ width: '95%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 10, color: colors.primary, }} >T&C</Text>
                    </View>
                    <View style={{ width: '95%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 10, color: colors.black }}>Max Disc: </Text>
                            <Text style={{ fontSize: 10, color: colors.black }} fontFamily={'PoppinsBold'}>{renderPrice(maxDiscount)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 10, color: colors.black }}>Valid until </Text>
                            <Text style={{ fontSize: 10, color: colors.black }} fontFamily={'PoppinsBold'} numberOfLines={1}>{discountValidityDate}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}