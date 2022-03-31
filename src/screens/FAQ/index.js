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
        data:[],
        activeIndex: null,
        error: false,
        isLoading: true,
    });
    const getData = () => {
        setState(pre => ({ ...pre, isLoading: true, error: false }));
        getRequest(Endpoints.GET_FAQs, (res) => {
            console.log('[GET_FAQs]', res);
            if (res.data.statusCode === 200) {
                setState(pre => ({
                    ...pre, data: res.data.faqData,
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
    const onPress = (item, index) => {

        setState(pre => ({ ...pre, activeIndex: index === pre.activeIndex ? null : index }));
    };
    const _renderHeader = () => (<CustomHeader
        renderLeftIconAsDrawer
        rightIconName={null}
        title={`FAQ's`}
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
    const renderItem = (item, index) => (<View style={{ ..._styles.itemStyles, ...index === 0?{borderTopWidth:0}:{} }}>
        <TouchableOpacity
            onPress={() => onPress(item, index)}
            style={_styles.itemQuestion}
        >
            <Text style={{ color: colors.black, maxWidth: '90%' }} numberOfLines={2}>{item.question}</Text>
            <VectorIcon size={20} color={colors.black} name={'keyboard-arrow-right'} type={'MaterialIcons'} />
        </TouchableOpacity>
        {
            state.activeIndex === index && <Text style={_styles.itemAnswer}>{item.answer}</Text>
        }
    </View>);
    React.useEffect(() => {
        getData();///call this when api is ready
        setState(pre => ({ ...pre, isLoading: false }));//delete this line when the api call is ready
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
            <View style={{ flex: 1 }}>
                <FlatList
                    data={
                        state.data
                    }
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
    screenLoaderStyles: {
        position: 'absolute',
        top: 30,
        marginTop: -50,
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 9999,
        height: constants.screen_dimensions.height,
        width: constants.screen_dimensions.width,
        justifyContent: 'center',
    },
    itemStyles: {
        // height: 70,

        paddingHorizontal: 20,
        borderTopWidth: 0.5,
        borderColor: "rgba(0,0,0,0.5)",
        borderRadius: 5,
        // marginVertical: 10,
        backgroundColor: colors.white
    },
    itemQuestion:{
        paddingVertical: 20,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemAnswer:{marginTop:-10,fontSize:12,marginBottom:10},
});