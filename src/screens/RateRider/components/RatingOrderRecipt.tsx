import React, { useState } from 'react'
import { SvgXml } from 'react-native-svg'
import svgs from '../../../assets/svgs'
import AnimatedView from '../../../components/atoms/AnimatedView'
import Text from '../../../components/atoms/Text'
import TouchableOpacity from '../../../components/atoms/TouchableOpacity'
import View from '../../../components/atoms/View'
import DashedLine from '../../../components/organisms/DashedLine'
import { renderPrice, sharedCalculatedTotals, sharedGetPrice, VALIDATION_CHECK } from '../../../helpers/SharedActions'
import { PITSTOP_TYPES } from '../../../utils/GV'
import DefaultColors, { initColors } from '../../../res/colors';
import { Appearance, ScrollView, StyleProp, ViewStyle } from 'react-native'


const subDetailListTxtFontFamily = 'PoppinsRegular'
interface Props {
    data?: any[];
    checkOutStyles: any;
    colors?: typeof initColors;
    showDetail?: boolean;
    totalGST?: string | number;
    serviceCharges?: string | number;
    discount?: string | number;
    total?: string | number;
    rightText?: any;
    onRightTextPress?: () => void;
    useScrollView?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
};

const defaultProps = {
    colors: initColors,
    showDetail: true,
    totalGST: '',
    serviceCharges: '',
    discount: '',
    total: '',

    rightText: 'Close',
    onRightTextPress: undefined,
    useScrollView: true,
};

// const RatingOrderRecipt= ({ checkOutStyles = {}, cartReducer = [], colors = {}, secondData = [] }) => {
const RatingOrderRecipt = (props: Props) => {
    const checkOutStyles = props.checkOutStyles;
    const colors = props.colors;
    const defaultColors = Appearance.getColorScheme() === "dark" ? DefaultColors.dark_mode : DefaultColors.light_mode;

    React.useEffect(() => {
        setShowDetails(props?.showDetail ?? false);
    }, [props.showDetail]);
    const [showDetails, setShowDetails] = useState(false);

    const pitStops = props.data || []
    const onShowDetails = () => {
        setShowDetails(!showDetails)
    }
    const RenderSubPitStopDetailsUi = ({ data = [] }) => {
        return (
            <>
                {data.map((item: any, i: number) => {
                    const pitStopItemName = item.productItemName;
                    const pitstopActualPrice = item.actualPrice;
                    const pitstopDiscountedPrice = item.price;

                    return <View style={{ flex: 1, flexDirection: 'row', marginBottom: -2, justifyContent: "space-between" }} key={i}>
                        <Text style={[checkOutStyles.reciptSubDetailspitStopItemName, {}]} numberOfLines={1} fontFamily={subDetailListTxtFontFamily}>
                            {`${pitStopItemName}`.trimStart()}
                        </Text>
                        <View style={{ justifyContent: 'flex-end', alignItems: "center", flexDirection: 'row', paddingHorizontal: 5, flex: 1 }}>
                            <Text style={checkOutStyles.reciptSubDetailspitStopItemPrice} fontFamily={subDetailListTxtFontFamily}>{renderPrice({ showZero: true, price: pitstopDiscountedPrice, })}</Text>
                            <Text style={checkOutStyles.reciptSubDetailspitStopItemPriceLineThrough} fontFamily={subDetailListTxtFontFamily}>{renderPrice({ showZero: true, price: pitstopActualPrice, })}</Text>
                        </View>
                    </View>
                })
                }

            </>
        )
    }



    const RenderGSTServiceChargeUi = ({ }) => {
        return (
            <View style={{}}>
                <View style={checkOutStyles.gstMainContainer}>
                    <RenderGSTPrice1
                        checkOutStyles={checkOutStyles}
                        text={"Service Charge"}
                        value={props.serviceCharges}
                    />
                </View>

                <View style={{ marginHorizontal: 1 }}>
                    <DashedLine dashLineStyles={{ color: "#707070" }} />
                </View>
                <RenderGSTPrice2
                    checkOutStyles={checkOutStyles}
                    text={"Discount"}
                    value={props.discount}
                />

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

    const dotColor = (pitstopType: any) => {
        let clrs = defaultColors.default;
        if (pitstopType === PITSTOP_TYPES.DEFAULT) clrs = defaultColors.restaurant
        if (pitstopType === PITSTOP_TYPES.JOVI) clrs = defaultColors.jovi
        if (pitstopType === PITSTOP_TYPES.RESTAURANT) clrs = defaultColors.restaurant
        if (pitstopType === PITSTOP_TYPES.SUPER_MARKET) clrs = defaultColors.jovi_mart
        if (pitstopType === PITSTOP_TYPES.PHARMACY) clrs = defaultColors.pharamcy
        if (pitstopType === PITSTOP_TYPES.JOVI_MART) clrs = defaultColors.jovi_mart
        return clrs;
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
                        pitStops.map((x, i) => {
                            if (i === pitStops.length - 1) return;//final destination is not in receipt
                            let pitStopNumber = i + 1
                            let pitstopName = x.title
                            let individualPitstopTotal = x.jobAmount;
                            let checkOutItemsListVM = x?.jobItemsListViewModel ?? [];
                            return <View style={{ flex: 1 }} key={i}>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', flex: 1, paddingVertical: i === 0 ? 0 : 0,
                                    // marginTop: i === 0  ? 0 : 7,
                                    marginTop: showDetails === false ? 0 : (i === 0 ? 0 : 7)

                                }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: dotColor(x.pitstopType)?.primary, }} />
                                    <Text style={checkOutStyles.reciptMainDetailsPitstopNo} fontFamily='PoppinsMedium'>{`Pit Stop 0${pitStopNumber}-`}</Text>
                                    <Text style={checkOutStyles.reciptMainDetailsPitstopName} fontFamily='PoppinsMedium' numberOfLines={1}>{`${pitstopName}`.substring(0, 25)}</Text>
                                    {!showDetails &&
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', flex: 1 }}>
                                            <Text style={checkOutStyles.reciptMainDetailsindividualPitstopTotal} fontFamily='PoppinsMedium'>{`${renderPrice({ showZero: true, price: individualPitstopTotal })}`}</Text>
                                        </View>
                                    }
                                </View>
                                {showDetails &&
                                    <RenderSubPitStopDetailsUi data={checkOutItemsListVM} />
                                }
                            </View>
                        })
                    }

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
const RenderGSTPrice1 = ({ checkOutStyles, text, value }: PriceInter) => {
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

const RenderGSTPrice2 = ({ checkOutStyles, text, value }: PriceInter) => {
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

const RenderTotal = ({ text, value }: PriceInter) => {
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