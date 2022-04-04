import React from 'react'
import { ScrollView, StyleProp, ViewStyle } from 'react-native'
import { SvgXml } from 'react-native-svg'
import svgs from '../../../assets/svgs'
import AnimatedView from '../../../components/atoms/AnimatedView'
import Text from '../../../components/atoms/Text'
import TouchableOpacity from '../../../components/atoms/TouchableOpacity'
import View from '../../../components/atoms/View'
import DashedLine from '../../../components/organisms/DashedLine'
import ReceiptItem from '../../../components/organisms/ReceiptItem'
import { renderPrice, VALIDATION_CHECK } from '../../../helpers/SharedActions'
import { initColors } from '../../../res/colors'
import { PITSTOP_TYPES } from '../../../utils/GV'
interface Props {
    data?: any[];
    checkOutStyles: any;
    colors?: typeof initColors;
    totalGST?: string | number;
    serviceCharges: number;
    discount?: string | number;
    total?: string | number;
    rightText?: any;
    onRightTextPress?: () => void;
    useScrollView?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    estimateServiceTax: number;
    subTotal: number;
};

const defaultProps = {
    colors: initColors,
    totalGST: '',
    serviceCharges: 0,
    discount: '',
    total: '',

    rightText: 'Close',
    onRightTextPress: undefined,
    useScrollView: true,
    estimateServiceTax: 0,
    subTotal: 0,
};

// const RatingOrderRecipt= ({ checkOutStyles = {}, cartReducer = [], colors = {}, secondData = [] }) => {
const RatingOrderRecipt = (props: Props) => {
    const checkOutStyles = props.checkOutStyles;
    const colors = props?.colors ?? defaultProps.colors;

    const pitStops = props.data || []

    const RenderGSTServiceChargeUi = ({ }) => {
        return (
            <View style={{}}>
                <View style={checkOutStyles.gstMainContainer}>
                    <RenderGSTPrice1
                        checkOutStyles={checkOutStyles}
                        text={`Subtotal (Incl GST ${props.totalGST})`}
                        value={props.subTotal}
                    />
                </View>
                {/* <View style={checkOutStyles.gstMainContainer}>
                    <RenderGSTPrice1
                        checkOutStyles={checkOutStyles}
                        text={"Total Gst"}
                        value={props.totalGST}
                    />
                </View> */}
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <RenderGSTPrice2
                    checkOutStyles={checkOutStyles}
                    text={"Total Discount"}
                    value={props.discount}
                />
                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <View style={checkOutStyles.gstMainContainer}>
                    <RenderGSTPrice1
                        checkOutStyles={checkOutStyles}
                        text={`Service Charge (Incl S.T ${props.estimateServiceTax})`}
                        value={(props.serviceCharges + props.estimateServiceTax)}
                    />
                </View>

                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <RenderTotal
                    checkOutStyles={checkOutStyles}
                    text={"Total"}
                    value={props.total}
                />
            </View>

        )
    }



    const Wrapper = props.useScrollView ? ScrollView : View;
    return (
        <View style={[checkOutStyles.receiptMainContainer, props.containerStyle]}>
            <View style={checkOutStyles.receiptPrimaryContainer}>
                <SvgXml xml={svgs.compliance()} style={{ top: 2 }}></SvgXml>
                <Text style={checkOutStyles.orderReciptTxt} fontFamily='PoppinsSemiBold'>Order Receipt</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 0, paddingVertical: 2, borderWidth: 0 }} onPress={() => {
                    props.onRightTextPress && props.onRightTextPress();
                }}>
                    <Text style={checkOutStyles.detailTxt} fontFamily='PoppinsMedium'>{props.rightText}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 2 }}>
                <DashedLine dashLineStyles={checkOutStyles.dashedLine} />
            </View>
            <Wrapper>
                <AnimatedView style={{ margin: 12, marginTop: 0, }} >
                    {
                        pitStops.filter(item => ![3, 4, 5, 9].includes(item.joviJobStatus))
                            .map((x, i) => {
                                if (i === pitStops.length - 1) return;//final destination is not in receipt
                                const isJoviJob = x.pitstopType === PITSTOP_TYPES.JOVI;
                                const pitstopName = isJoviJob ? 'Jovi Job' : x.title
                                const individualPitstopTotal = isJoviJob ? x.paidAmount : x.jobAmount;
                                let checkOutItemsListVM = x?.jobItemsListViewModel ?? [];
                                if (isJoviJob) {
                                    checkOutItemsListVM = [{
                                        ...x,
                                    }]
                                }

                                return <View style={{ flex: 0 }} key={i}>
                                    <ReceiptItem
                                        colors={colors}
                                        title={pitstopName}
                                        type={x.pitstopType}
                                        pitstopNumber={i + 1}
                                        isJoviJob={isJoviJob}
                                        itemData={checkOutItemsListVM}
                                        showDetail={true}
                                        totalPrice={individualPitstopTotal}
                                    />
                                </View>
                            })}

                </AnimatedView>
                <RenderGSTServiceChargeUi />
            </Wrapper>
        </View>
    )
}

RatingOrderRecipt.defaultProps = defaultProps;
export default RatingOrderRecipt;

interface PriceInter {
    checkOutStyles: any,
    text: any, value: any,
}
export const RenderGSTPrice1 = ({ checkOutStyles, text, value }: PriceInter) => {
    if (!VALIDATION_CHECK(value)) return null;
    return (
        <View style={checkOutStyles.gstPrimaryContainer}>
            <Text style={checkOutStyles.gstCommonLabelTxtStyle} fontFamily='PoppinsRegular'>{text}</Text>
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                <Text style={checkOutStyles.gstCommonPriceTxtStyle} fontFamily='PoppinsRegular'>{`${renderPrice({ showZero: true, price: value })}`}</Text>
            </View>
        </View>
    )
}

export const RenderGSTPrice2 = ({ checkOutStyles, text, value }: PriceInter) => {
    if (!VALIDATION_CHECK(value)) return null;
    return (
        <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 12, borderWidth: 0, paddingVertical: -9 }}>
            <View style={{ flexDirection: "row", flex: 1, borderWidth: 0, marginTop: 7, }}>
                <Text style={[checkOutStyles.gstCommonLabelTxtStyle, { textAlignVertical: 'center', }]} fontFamily='PoppinsRegular'>{text}</Text>
                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1, }}>
                    {<Text style={[checkOutStyles.gstCommonPriceTxtStyle, { textAlignVertical: 'center', }]} fontFamily='PoppinsRegular'>{`${renderPrice({ showZero: true, price: value }, 'Rs -')}`}</Text>}
                </View>
            </View>
        </View>
    )
}

export const RenderTotal = ({ text, value }: PriceInter) => {
    if (!VALIDATION_CHECK(value)) return null;
    return (
        <View style={{ flex: 1, flexDirection: 'column', padding: 10, paddingVertical: 8 }}>
            <View style={{ flexDirection: "row", bottom: 2.5 }}>
                <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold'>{text}</Text>
                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                    <Text style={{ fontSize: 16, color: "#272727" }} fontFamily='PoppinsSemiBold' >{`${renderPrice({ showZero: true, price: value })}`}</Text>
                </View>
            </View>
        </View>
    )
}