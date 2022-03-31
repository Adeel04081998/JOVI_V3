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
        data: [
            {
                "faqid": 27,
                "faqCategoryID": 10,
                "question": "What can I order with the Jovi app?",
                "answer": "You can order food from your favorite restaurant, purchase grocery and cosmetic items, buy vaping products, get medicines from reputable pharmacies, purchase confectionary or stationery items, and get anything (including parcels and gifts) delivered anywhere in the twin cities at any time of the day."
            },
            {
                "faqid": 28,
                "faqCategoryID": 10,
                "question": "Can I make my orders round the clock?",
                "answer": "No, you can place your orders from 8 am till 12 am, seven days a week."
            },
            {
                "faqid": 29,
                "faqCategoryID": 10,
                "question": "What is a pitstop?",
                "answer": "The Jovi app allows you to add five pitstops in a single order. A pitstop could be a restaurant, pharmacy, bakery, grocery store, or any shop, office, or residential address where you want the Jovi rider to deliver or pick your order."
            },
            {
                "faqid": 30,
                "faqCategoryID": 10,
                "question": "What if my ordered product is not available?",
                "answer": "Your rider will keep in touch with you. By using our app’s chat option, you can either tell your Jovi rider to replace the product or cancel the order. You can’t cancel or replace the order once your rider has purchased it."
            },
            {
                "faqid": 31,
                "faqCategoryID": 10,
                "question": "Do I have any minimum order requirements?",
                "answer": "No. You do not have to meet any minimum order requirements. You can order anything in any quantity from your desirable shop, store, bakery, pharmacy, or restaurant. You can add up to five pitstops in a single order."
            },
            {
                "faqid": 32,
                "faqCategoryID": 10,
                "question": "How can I place my order on Jovi?",
                "answer": "You can easily place your order on Jovi by following the steps listed below:\n\n•\tSignup/Sign in to your account\n•\tSelect your actual location\n•\tChoose the Vendors available in your vicinity\n•\tSelect the items or products you want to order\n•\tAdd them to Your Cart\n•\tAdd the promo code (If you do have any)\n•\tClick on the Check Out button\n•\tAdd the Final Destination Address (Where you want the products to be delivered)\n•\tSelect payment method\n•\tPress the “MangWOW!” button\n"
            },
            {
                "faqid": 33,
                "faqCategoryID": 10,
                "question": "Can I cancel my order on the Jovi app?",
                "answer": "Yes, you can cancel your order as long as the rider has not paid for it to the vendor. Once the order is processed, you cannot cancel it."
            },
            {
                "faqid": 34,
                "faqCategoryID": 10,
                "question": "Can I make any changes in my order on the Jovi app?",
                "answer": "It is not possible to update or change once it is placed on the Jovi app. Also, you can’t change or update the pitstop locations once you have confirmed your order. In case you want to add some other items, you will have to place a new order."
            },
            {
                "faqid": 35,
                "faqCategoryID": 10,
                "question": "Can I check the status of my order on the Jovi app?",
                "answer": "Yes, you can. Simply go to the “My Orders” tab in your Jovi app and monitor the progress of your order."
            },
            {
                "faqid": 36,
                "faqCategoryID": 10,
                "question": "How can I communicate with the Jovi Rider if I have to request special instructions?",
                "answer": "You can communicate with your Jovi Rider via voice chat and text chat options on the Jovi app."
            },
            {
                "faqid": 37,
                "faqCategoryID": 10,
                "question": "How can I retrieve my lost or forgotten login information on the Jovi app?",
                "answer": "You can retrieve your last or forgotten login information by clicking on the “Forgot Password” button and receiving information at your email address."
            },
            {
                "faqid": 38,
                "faqCategoryID": 10,
                "question": "Where do I find new promo codes on the Jovi app?",
                "answer": "You can check out the latest promo codes on both the Jovi website and app. Jovi will also send its loyal customers periodic promo codes via emails or text messages."
            },
            {
                "faqid": 39,
                "faqCategoryID": 10,
                "question": "Will I be refunded if I cancel my order?",
                "answer": "If you cancel the order before it’s picked by Jovi rider, you won’t get a refund. You can always request a refund by contacting Jovi’s customer service officer if you received a below-standard product or if your Jovi rider doesn’t deliver the requested product."
            }
        ],
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
                    ...pre, data: res.data.faqCategoryData,
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
        // getData();///call this when api is ready
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