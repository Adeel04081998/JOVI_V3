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
const Voucher = ({ parentScrollHandler = () => { }, item = {}, index = {}, colors = {} }) => {
    const [state, setState] = React.useState({
        opened: false
    });
    const styles = voucherStyles(colors);
    const renderVoucherWebView = () => {
        if (state.opened) {
            return (
                <View style={styles.voucherDetailsContainer}>
                    <CustomWebView
                        key={`customer_promo_key_${index}`}
                        html={item.promoHtml}
                        screenStyles={styles.voucherWebViewScreen}
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
            <VoucherUi colors={colors} title={item.title} description={item.promoCode} discountPercentage={item.discountValue ?? ''} discountValidityDate={item.expiryTime} maxDiscount={item.discountCap} voucherOpened={state.opened} onPress={() => { setState(pre => ({ ...pre, opened: !pre.opened })); console.log('voucherPressed', state.opened); }} />
            {renderVoucherWebView()}
        </View>
    );
}
const VoucherUi = ({ title = "", colors = {}, voucherOpened = false, discountPercentage = "", description = "", discountCategory = "", maxDiscount = "", discountValidity = "", discountValidityDate = '', onPress = () => { }, activeTheme = {}, arcBackground = "", style, promoCodeApplied = "" }) => {
    const styles = voucherUIStyles(colors);
    return (
        <View style={styles.container}>
            <View style={styles.svgContainer}>
                <SvgXml xml={voucherOpened ? svgs.voucherUISelected() : svgs.voucherUI()} width={'100%'} />
            </View>
            <TouchableOpacity onPress={onPress} style={{
                height: 85,
                width: '89%',
                position: 'absolute', top: 0,
                marginHorizontal: 20,
                marginTop: 8,
            }}>
                <View style={styles.voucherTopContainer}>
                    <View style={{ width: '95%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ ...styles.topText, maxWidth: '90.3%' }} fontFamily={'PoppinsBold'} numberOfLines={1}>{title}</Text>
                        <Text style={{ ...styles.topText, }} fontFamily={'PoppinsBold'}>{discountPercentage}</Text>
                    </View>
                    <View style={{ width: '95%' }}>
                        <Text style={styles.lowerText} numberOfLines={1}>{description}</Text>
                    </View>
                </View>
                <View style={{ height: '45%', paddingTop: 5, paddingLeft: 10 }}>
                    <DashedLine containerStyles={styles.lineSeparator} />
                    <View style={{ width: '95%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 10, color: colors.primary, }} >T&C</Text>
                    </View>
                    <View style={{ width: '95%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.lowerText}>Max Disc: </Text>
                            <Text style={styles.lowerText} fontFamily={'PoppinsBold'}>{renderPrice(maxDiscount)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.lowerText}>Valid until </Text>
                            <Text style={styles.lowerText} fontFamily={'PoppinsBold'} numberOfLines={1}>{discountValidityDate}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const voucherStyles = (colors) => StyleSheet.create({
    voucherDetailsContainer: { marginHorizontal: 23, bottom: Platform.OS === 'android' ? 5 : 2, height: 200, },
    voucherWebViewScreen: { width: '100%', minHeight: 200, height: 200, backgroundColor: "#fff", },
});
const voucherUIStyles = (colors) => StyleSheet.create({
    container: { position: 'relative', paddingTop: 10, height: 100, },
    svgContainer: {
        flexDirection: "column", marginHorizontal: 20, bottom: 10,
    },
    voucherTopContainer:{ height: '55%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
    lowerText:{ fontSize: 10, color: colors.black },
    lineSeparator:{ top: -7, position: 'absolute', width: '97%', alignSelf: 'center' },
    topText:{fontSize: 15, color: colors.black},

});