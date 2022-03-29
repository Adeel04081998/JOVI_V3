import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { Appearance, FlatList, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import TouchableScale from '../../components/atoms/TouchableScale';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import NoRecord from '../../components/organisms/NoRecord';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import { getRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary) };
    const _styles = styles(colors);
    const [state, setState] = React.useState({
        data: [],
        error: false,
        isLoading: true,
    });
    const getData = () => {
        setState(pre => ({ ...pre, isLoading: true, error: false }));
        getRequest(Endpoints.GET_LEGAL_CERTIFICATES, (res) => {
            if (res.data.statusCode === 200) {
                setState(pre => ({
                    ...pre, data: res.data.legalListViewModels,
                    isLoading: false,
                    error: false,
                }));
            } else {
                setState(pre => ({ ...pre, isLoading: false, error: true }));
            }
        }, (err) => {
            setState(pre => ({ ...pre, isLoading: false, error: true }));
            sharedExceptionHandler(err);
        });
    }
    const onPress = args => {
        setState(pre => ({ ...pre, isLoadingHtml: true }));
        getRequest(Endpoints.GET_LEGAL_HTML + `/${args.id}`, serverRes => {
            if (serverRes.data.statusCode === 200) {
                NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.WebView.screen_name, { html: serverRes.data._legalvm.description, title: args.title });
            }
            setState(pre => ({ ...pre, isLoadingHtml: false }));
        }, serverErr => {
            if (serverErr) sharedExceptionHandler(serverErr);
            setState(pre => ({ ...pre, isLoadingHtml: false }));
        });
    };
    const _renderHeader = () => (<CustomHeader
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
    />)
    const _renderLoader = (customStyles = {}) => (<View style={{
        flex: 1,
        marginTop: -80,
        alignItems: "center",
        justifyContent: "center",
        ...customStyles
    }}>
        <AnimatedLottieView
            source={require('../../assets/LoadingView/OrderChat.json')}
            autoPlay
            loop
            style={{
                height: 120,
                width: 120,
            }}
        />
    </View>);
    const renderItem = (item,index) => (<TouchableOpacity
        onPress={() => onPress(item)}
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
    </TouchableOpacity>);
    React.useEffect(() => {
        getData();
    }, []);
    if (state.isLoading) {
        return <View style={_styles.primaryContainer}>
            {_renderHeader()}
            {_renderLoader()}
        </View>
    } else if (state.error) {
        return <View style={_styles.primaryContainer}>
            {_renderHeader()}
            <NoRecord
                color={colors}
                title={'No Record Found'}
                buttonText={`Refresh`}
                onButtonPress={() => {
                    getData();
                }} />
        </View>
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            {_renderHeader()}
            {state.isLoadingHtml ? _renderLoader({
                position: 'absolute',
                top: 30,
                marginTop: -50,
                backgroundColor: 'rgba(0,0,0,0.1)',
                zIndex: 9999,
                height: constants.screen_dimensions.height,
                width: constants.screen_dimensions.width,
                justifyContent: 'center',
            }) : null}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={
                        state.data
                    }
                    contentContainerStyle={{
                        padding: 10,
                    }}
                    renderItem={({ item, index }) => renderItem(item,index)}
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
});