import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Appearance, Button as RNButton, FlatList, InputAccessoryView, Keyboard, Platform, SafeAreaView, TextInput as RNTextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import AnimatedModal from '../../components/organisms/AnimatedModal';
import Card from '../../components/organisms/Card';
import DashedLine from '../../components/organisms/DashedLine';
import NoRecord from '../../components/organisms/NoRecord';
import ReceiptItem from '../../components/organisms/ReceiptItem';
import { getBottomPadding, makeArrayRepeated, renderPrice, sharedExceptionHandler, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { getRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { isIOS, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import HistoryItemCardUI from '../OrderHistory/components/HistoryItemCardUI';
import { headerFuncStyles, stylesFunc } from './styles';

// #region :: CONSTANT's START's FROM HERE 
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const NUMBER_OF_INPUT_LINE = 4
const INPUT_ACCESSORY_VIEW_ID = 'feedbackDoneButton';
const FEEDBACK_INPUT_MINIMUM_LENGTH = 4;
// #endregion :: CONSTANT's END's FROM HERE 

export default ({ navigation, route }) => {

    // #region :: NAVIGATION PARAM's START's FROM HERE 
    const navigationParams = {
        orderID: route?.params?.orderID ?? 70083610,
        isDelivered: route?.params?.isDelivered ?? false,
        noOfPitstops: route?.params?.noOfPitstops ?? '',
        dateTime: route?.params?.dateTime ?? '',

    };

    // #endregion :: NAVIGATION PARAM's END's FROM HERE 

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const insets = useSafeAreaInsets();
    const styles = stylesFunc(colors, insets);
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary), ...headerFuncStyles };

    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE's & REF's START's FROM HERE 
    const [data, updateData] = React.useState({});
    const [query, updateQuery] = React.useState({
        isLoading: false,
        error: false,
        errorText: '',
    });
    const [feedbackModal, updateFeedbackModal] = React.useState({ visible: false, text: '', submitLoading: false, });

    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={customheaderStyles.primaryContainer}>
                <CustomHeader
                    containerStyle={customheaderStyles.containerStyle}

                    rightCustom={(
                        <TouchableScale wait={0} onPress={() => {
                            NavigationService.NavigationActions.stack_actions.popToTop();
                        }} style={customheaderStyles.iconContainer}>
                            <SvgXml xml={svgs.hamburgerHome(colors.primary)} height={HEADER_ICON_SIZE} width={HEADER_ICON_SIZE} />
                        </TouchableScale>
                    )}
                    title={`Order Details`}
                    titleStyle={{
                        fontFamily: FontFamily.Poppins.SemiBold,
                        fontSize: 16,
                    }}
                    defaultColor={colors.primary}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: API IMPLEMENTATION START's FROM HERE 

    React.useEffect(() => {
        loadData();
        return () => { };
    }, []);

    const loadData = () => {
        updateQuery({
            isLoading: true,
            error: false,
            errorText: '',
        });
        getRequest(`${Endpoints.FetchOrder}/${navigationParams.orderID}`, (res) => {
            console.log('resresresres resData ', res);
            const statusCode = res.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const resData = res.data?.order ?? {};
                updateQuery({
                    isLoading: false,
                    error: false,
                    errorText: '',
                });
                updateData(resData);

            } else {
                updateQuery({
                    isLoading: false,
                    error: true,
                    errorText: sharedExceptionHandler(res),
                });
                updateData({});
            }
        }, (err) => {
            sharedExceptionHandler(err);
            updateData({});
            updateQuery({
                isLoading: false,
                error: true,
                errorText: sharedExceptionHandler(err),
            });
        })
    };//end of loadData

    // #endregion :: API IMPLEMENTATION END's FROM HERE 

    // #region :: LOADING AND ERROR UI START's FROM HERE 
    if (query.isLoading) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <HistoryItemCardUI
                colors={colors}
                isDelivered={navigationParams.isDelivered}
                orderID={navigationParams.orderID}
                noOfPitstops={navigationParams.noOfPitstops}
                dateTime={navigationParams.dateTime}
            />
            <View style={{
                flex: 1,
                marginTop: -80,
                alignItems: "center",
                justifyContent: "center",
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
            </View>
        </View>
    } else if (query.error) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <HistoryItemCardUI
                colors={colors}
                isDelivered={navigationParams.isDelivered}
                orderID={navigationParams.orderID}
                noOfPitstops={navigationParams.noOfPitstops}
                dateTime={navigationParams.dateTime}
            />
            <NoRecord
                color={colors}
                title={query.errorText}
                buttonText={`Refresh`}
                onButtonPress={() => { loadData() }} />
        </View>
    }

    // #endregion :: LOADING AND ERROR UI END's FROM HERE 

    // #region :: FLATLIST RENDER ITEM START's FROM HERE 
    const renderItem = ({ item, index }) => {
        if (index === (data?.pitStopsList ?? []).length - 1) return;//final destination is not in receipt
        const isJoviJob = item.pitstopType === PITSTOP_TYPES.JOVI;
        const pitstopName = isJoviJob ? 'Jovi Job' : item.title
        const individualPitstopTotal = isJoviJob ? item.paidAmount : item.paidAmount;
        let checkOutItemsListVM = item?.jobItemsListViewModel ?? [];
        if (isJoviJob) {
            checkOutItemsListVM = [{
                ...item,
                estimatePrice: individualPitstopTotal,
            }];
        }

        return (
            <View style={{ flex: 0, }} key={index}>
                <ReceiptItem
                    useInHistory
                    showLeftBorder
                    colors={colors}
                    showItemTotalPrice
                    title={pitstopName}
                    type={item.pitstopType}
                    pitstopNumber={index + 1}
                    isJoviJob={isJoviJob}
                    itemData={checkOutItemsListVM}
                    showDetail={true}
                    totalPrice={individualPitstopTotal}
                    containerStyle={{
                        paddingBottom: 16,
                        paddingTop: index !== 0 ? 8 : 0,
                        ...index === 0 && {
                            borderTopLeftRadius: 5,
                        },

                    }}
                    titleContainerStyle={{
                        paddingBottom: 0,
                        paddingHorizontal: constants.spacing_horizontal,
                    }}
                    itemContainerStyle={{
                        paddingHorizontal: constants.spacing_horizontal,
                    }}

                    customTitleBelowUI={() => {
                        return (
                            <DashedLine containerStyles={styles.dashlineContentContainerStyle} />
                        )
                    }}
                    customEndUI={() => {
                        return (
                            <View style={styles.itemSeperator} />
                        )
                    }}
                />
            </View>
        )

    };//end of renderItem


    // #endregion :: FLATLIST RENDER ITEM END's FROM HERE 

    // #region :: FEEDBACK OPEN & CLOSE MODAL START's FROM HERE 
    const openFeedbackModal = () => {
        updateFeedbackModal(p => ({
            ...p,
            visible: true,
        }))
    }
    const closeFeedbackModal = () => {
        if (feedbackModal.submitLoading) return;
        updateFeedbackModal(p => ({
            text: '',
            submitLoading: false,
            visible: false,
        }))
    }


    // #endregion :: FEEDBACK OPEN & CLOSE MODAL END's FROM HERE 

    // #region :: ON FEEDBACK BUTTON PRESS START's FROM HERE 
    const onFeedbackSubmitPress = () => {
        if (`${feedbackModal.text.trim()}`.length < FEEDBACK_INPUT_MINIMUM_LENGTH) return;
        updateFeedbackModal(p => ({ ...p, submitLoading: true }));
        const params = {
            "description": feedbackModal.text,
            "orderID": navigationParams.orderID,
        };
        postRequest(Endpoints.ADD_ORDER_FEEDBACK, params, (res) => {
            console.log('ress ', res);
            updateFeedbackModal(p => ({ ...p, submitLoading: false }));
            sharedExceptionHandler(res);
            closeFeedbackModal();
        }, (err) => {
            console.log('err ', err);
            sharedExceptionHandler(err);
            updateFeedbackModal(p => ({ ...p, submitLoading: false }));
        });
    }

    // #endregion :: ON FEEDBACK BUTTON PRESS END's FROM HERE 

    // #region :: COMPLAINT & FEEDBACK BUTTON START's FROM HERE 
    const _renderButton = () => {
        return (
            <>
                {/* ****************** Start of BUTTON ****************** */}
                <View style={styles.buttonPrimaryContainer}>
                    <TouchableOpacity style={styles.buttonContainerLeft} activeOpacity={0.5}>
                        <Text style={styles.buttonText}>{`Complaint`}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainerRight} activeOpacity={0.5} onPress={() => { openFeedbackModal() }}>
                        <Text style={styles.buttonText}>{`Feedback`}</Text>
                    </TouchableOpacity>
                </View>

                {/* ****************** End of BUTTON ****************** */}
            </>
        )
    }

    // #endregion :: COMPLAINT & FEEDBACK BUTTON END's FROM HERE 

    // #region :: UI START's FROM HERE 
    return (
        <View style={styles.primaryContainer}>
            {_renderHeader()}

            <HistoryItemCardUI
                colors={colors}
                noOfPitstops={navigationParams.noOfPitstops}
                isDelivered={navigationParams.isDelivered}
                orderID={navigationParams.orderID}
                dateTime={navigationParams.dateTime}
                disabled
            />

            <Card contentContainerStyle={{
                ...styles.cardContentContainerStyle,
                flex: 1,
                flexDirection: "column",
                marginBottom: getBottomPadding(insets, 10, -15),
            }}>
                <FlatList
                    bounces={false}
                    style={{
                        flex: 1,
                        flexGrow: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    data={makeArrayRepeated(data?.pitStopsList ?? [], 1)}
                    renderItem={renderItem}
                />


                {/* ****************** Start of GST, Service Charges, Discount & ESTIMATED TOTAL ****************** */}
                <View style={{ paddingTop: 20, paddingBottom: 12, }}>
                    <ServiceChargesUI
                        text='GST'
                        value={`${data?.orderReceiptVM?.chargeBreakdown?.totalProductGST ?? 0}`}
                    />
                    <ServiceChargesUI
                        text={`Service Charges (Incl S.T ${data?.orderReceiptVM?.gst ?? 0})`}
                        value={`${data?.orderReceiptVM?.serviceChargesIncTax ?? 0}`}
                    />
                    <DashedLine contentContainerStyle={{ paddingVertical: 8, }} />

                    <ServiceChargesUI
                        text={`Discount`}
                        value={`${data?.orderReceiptVM?.discount ?? 0}`}
                        pricePrefix='Rs. -'
                    />
                    <DashedLine contentContainerStyle={{ paddingVertical: 8, }} />

                    <TotalChargesUI
                        text={`Total`}
                        value={`${data?.orderReceiptVM?.totalAmount ?? 0}`}
                    />
                </View>

                {/* ****************** End of GST, Service Charges, Discount & ESTIMATED TOTAL ****************** */}


            </Card>

            {_renderButton()}


            {feedbackModal.visible &&
                <AnimatedModal
                    position='center'
                    useKeyboardAvoidingView
                    visible={feedbackModal.visible}
                    onRequestClose={() => { closeFeedbackModal(); }}
                    contentContainerStyle={{ borderRadius: 7, width: "95%", maxHeight: "60%", }}>

                    <View style={{ paddingHorizontal: constants.spacing_horizontal * 2, marginVertical: constants.spacing_vertical * 1.5, }}>
                        <Text fontFamily='PoppinsSemiBold' style={{ fontSize: 18, color: "#272727", textAlign: "center" }}>{`Feedback`}</Text>
                        <Text style={{ fontSize: 14, color: "#272727", paddingTop: 30, paddingBottom: 10, }}>{`Enter your feedback`}</Text>
                        <RNTextInput
                            style={{
                                borderColor: "#272727",
                                borderWidth: 0.5,
                                borderRadius: 5,
                                paddingHorizontal: 8,
                                paddingVertical: 10,
                                textAlignVertical: "top",
                                minHeight: (Platform.OS === 'ios' && NUMBER_OF_INPUT_LINE) ? (20 * NUMBER_OF_INPUT_LINE) : null,
                            }}
                            autoCorrect={false}
                            textAlignVertical="top"
                            multiline={true} // ios fix for centering it at the top-left corner 
                            numberOfLines={Platform.OS === "ios" ? null : NUMBER_OF_INPUT_LINE}
                            inputAccessoryViewID={INPUT_ACCESSORY_VIEW_ID}
                            value={feedbackModal.text}
                            maxLength={250}
                            onChangeText={(text) => {
                                updateFeedbackModal(p => ({
                                    ...p,
                                    text: text,
                                }))
                            }}
                        />

                        <View style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            marginTop: constants.spacing_vertical * 2,
                            marginBottom: constants.spacing_vertical * 0.8,
                            marginLeft: constants.spacing_horizontal * 4, marginRight: constants.spacing_horizontal * 2,
                        }}>
                            <Button
                                onPress={() => { closeFeedbackModal(); }}
                                style={{ width: "48%", height: 40, borderRadius: 5, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary, }}
                                textStyle={{ color: colors.primary, fontFamily: FontFamily.Poppins.Medium, fontSize: 16 }}
                                text={`Cancel`}
                            />
                            <Button
                                onPress={() => { onFeedbackSubmitPress(); }}
                                style={{ width: "48%", height: 40, borderRadius: 5, }}
                                textStyle={{ fontFamily: FontFamily.Poppins.Medium, fontSize: 16 }}
                                disabled={`${feedbackModal.text.trim()}`.length < FEEDBACK_INPUT_MINIMUM_LENGTH}
                                isLoading={feedbackModal.submitLoading}
                                loaderSize={"small"}
                                text={`Submit`}
                            />
                        </View>
                    </View>
                </AnimatedModal>
            }

            {isIOS&&<InputAccessoryView nativeID={INPUT_ACCESSORY_VIEW_ID}>
                <View style={{ backgroundColor: '#fff', alignItems: "flex-end", }}>
                    <RNButton
                        onPress={() => {
                            Keyboard.dismiss();
                            onFeedbackSubmitPress();
                        }}
                        title="Done"
                    />
                </View>
            </InputAccessoryView>}
        </View>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT

// #region :: SERVICE CHARGES UI START's FROM HERE 
const ServiceChargesUI = ({ text = '', value = '', pricePrefix = 'Rs. ' }) => {
    if (!VALIDATION_CHECK(value)) return null;
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: constants.spacing_horizontal, }}>
            <Text style={{ color: "#4D4D4D", fontSize: 13, }}>{text}</Text>
            <Text style={{ color: "#4D4D4D", fontSize: 13, }}>{renderPrice({ showZero: true, price: value, }, pricePrefix)}</Text>
        </View>
    )
}

// #endregion :: SERVICE CHARGES UI END's FROM HERE 

// #region :: TOTAL CHARGES TEXT UI START's FROM HERE 
const TotalChargesUI = ({ text = '', value = '', pricePrefix = 'Rs. ' }) => {
    if (!VALIDATION_CHECK(value)) return null;
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: constants.spacing_horizontal, }}>
            <Text fontFamily='PoppinsSemiBold' style={{ color: "#272727", fontSize: 16, }}>{text}</Text>
            <Text fontFamily='PoppinsSemiBold' style={{ color: "#272727", fontSize: 16, }}>{renderPrice({ showZero: true, price: value, }, pricePrefix)}</Text>
        </View>
    )
}


     // #endregion :: TOTAL CHARGES TEXT UI END's FROM HERE 