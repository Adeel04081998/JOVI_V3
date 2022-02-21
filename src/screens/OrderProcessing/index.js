import * as React from 'react';
import { Appearance, Image, SafeAreaView, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard';
import DashedLine from '../../components/organisms/DashedLine';
import { renderPrice } from '../../helpers/SharedActions';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { stylesFunc } from './styles';

const DOUBLE_SPACING = constants.spacing_horizontal + 6;
const IMAGE_SIZE = constants.window_dimensions.width * 0.3;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE 
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.JOVI;
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");

    const styles = stylesFunc(colors);

    // #endregion :: STYLES & THEME END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={{ ...styles.primaryContainer, flex: 0, }}>
                <CustomHeader
                    rightIconName='home'
                    rightIconSize={22}
                    defaultColor={colors.primary} />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    return (
        <View style={styles.primaryContainer}>
            {_renderHeader()}

            <OrderEstTimeCard
                imageHeight={IMAGE_SIZE * 0.6}
                color={colors}
                middle={{
                    value: `Now 30 - 45 min`
                }} />

            <Image source={require('../../assets/gifs/OrderProcessing.gif')}
                style={{
                    height: IMAGE_SIZE,
                    width: IMAGE_SIZE,
                    alignSelf: "center",
                }}
            />

            <Text fontFamily='PoppinsMedium' style={{
                fontSize: 16,
                color: colors.primary,
                textAlign: "center",
                alignItems: "center",
                paddingTop: 0,
                paddingBottom: 15,
            }}>{`Processing order`}</Text>

            <Image source={require('../../assets/gifs/OrderProcessingLoadingBar.gif')}
                style={{
                    height: 6,
                    width: "70%",
                    alignSelf: "center",
                    marginBottom: 15,
                }}
            />

            {/* ****************** Start of ORDER DETAIL CARD ****************** */}
            <View style={styles.cardContainer}>
                <Text fontFamily='PoppinsMedium' style={{
                    color: "#272727",
                    fontSize: 16,
                    paddingHorizontal: DOUBLE_SPACING,
                }}>{`Order Details`}</Text>


                <View style={{
                    backgroundColor: "#707070",
                    height: 1,
                    marginTop: 10,
                }} />
                <ScrollView contentContainerStyle={{ paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}>


                    <OrderNumberUI colors={colors} orderNumber={`#68954`} />
                    <DeliveryAddressUI address={`2nd floor, Pakland plaza, I8 Markaz, Islamabad  2nd floor, Pakland plaza, I8 Markaz, Islamabad`} />

                    <View style={{
                        backgroundColor: "#707070",
                        height: 1,
                        marginHorizontal: DOUBLE_SPACING * 2,
                        marginTop: 8,
                        marginBottom: 12,
                    }} />

                    <PitStopItemUI
                        pitstopTitle='Rahat Bakers'
                        data={[{
                            id: 1,
                            title: 'Pepperoni Pizza - Medium',
                            value: '750.00',
                        }]}
                    />

                    <PitStopItemUI
                        pitstopTitle='Rahat Bakers'
                        data={[{
                            id: 1,
                            title: 'Pepperoni Pizza - Medium',
                            value: '750.00',
                        }]}
                        pitstopNumber={2}
                    />


                    <OrderProcessingChargesUI title='GST' value='120' />
                    <OrderProcessingChargesUI title='Service Charges(Incl S.T 76)' value='120' />
                    <DashedLine />
                    <OrderProcessingChargesUI title='Discount' value='-158' />
                    <DashedLine />

                    <OrderProcessingEstimatedTotalUI estimatedPrice='4924' />

                    <View style={{
                        backgroundColor: "#707070",
                        height: 1,
                        marginHorizontal: DOUBLE_SPACING * 1.5,
                        marginTop: 8,
                        marginBottom: 12,
                    }} />


                    <PaidWithUI price={'1320'} />
                </ScrollView>
            </View>

            {/* ****************** End of ORDER DETAIL CARD ****************** */}


        </View>
    )
};//end of EXPORT DEFAULT

// #region :: PAID WITH UI START's FROM HERE 
const PaidWithUI = ({ title = 'Cash on delivery', price = '' }) => {
    return (
        <>
            <Text fontFamily='PoppinsMedium' style={{
                color: "#272727",
                fontSize: 14,
                paddingHorizontal: constants.spacing_horizontal,
            }}>{`Paid with`}</Text>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: constants.spacing_horizontal,
                paddingTop: 15,
            }}>
                <SvgXml xml={svgs.dollar()} height={15} width={23} />
                <View style={{ flexDirection: "row", flex: 1, paddingLeft: 8, alignItems: "center", justifyContent: "space-between", }}>
                    <Text fontFamily='PoppinsSemiBold' style={{
                        color: "#272727",
                        fontSize: 11,
                    }}>{`${title}`}</Text>
                    <Text fontFamily='PoppinsSemiBold' style={{
                        color: "#272727",
                        fontSize: 11,
                        textAlign: "right",
                    }}>{`${renderPrice(price)}`}</Text>
                </View>
            </View>
        </>
    )
}

// #endregion :: PAID WITH UI END's FROM HERE 

// #region :: ESTIMATED TOTAL PRICE UI START's FROM HERE 
export const OrderProcessingEstimatedTotalUI = ({ estimatedPrice = '', title = `Estimated Total` }) => {
    return (
        <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: constants.spacing_horizontal,
        }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 16,
            }}>{`${title}`}</Text>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 16,
            }}>{`${estimatedPrice}`}</Text>
        </View>

    )
}

// #endregion :: ESTIMATED TOTAL PRICE UI END's FROM HERE 

// #region :: CHARGES, GST, DISCOUNT UI START's FROM HERE 
export const OrderProcessingChargesUI = ({ title = '', value = '', }) => {
    return (
        <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: constants.spacing_horizontal,
        }}>
            <Text style={{
                color: "#4D4D4D",
                fontSize: 13,
            }}>{`${title}`}</Text>
            <Text style={{
                color: "#4D4D4D",
                fontSize: 13,
            }}>{`${value}`}</Text>
        </View>
    )
}

// #endregion :: CHARGES, GST, DISCOUNT UI END's FROM HERE 

// #region :: PITSTOP ITEM UI  START's FROM HERE 
const PitStopItemUI = ({ pitstopTitle = '', pitstopNumber = 1, data = [], dataLeftKey = "title", dataRightKey = "value" }) => {
    return (

        <View style={{ marginVertical: 8, }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 13,
                paddingHorizontal: DOUBLE_SPACING,
            }}>{`Pit Stop ${pitstopNumber} - ${pitstopTitle}`}</Text>

            {data.map((item, index) => {
                return (
                    <View style={{ flexDirection: "row", alignItems: "center", }} key={index}>
                        <Text style={{
                            color: "#6B6B6B",
                            fontSize: 12,
                            paddingHorizontal: DOUBLE_SPACING * 1.5,
                            width: "75%",
                        }} numberOfLines={2}>{`${item[dataLeftKey]}`}</Text>

                        <Text style={{
                            color: "#272727",
                            fontSize: 12,
                            paddingHorizontal: DOUBLE_SPACING,
                            width: "25%",
                            textAlign: "right",
                        }} numberOfLines={1}>{`${item[dataRightKey]}`}</Text>
                    </View>
                )
            })}
        </View>
    )
};

// #endregion :: PITSTOP ITEM UI  END's FROM HERE 

// #region :: DELIVERY ADDRESS UI START's FROM HERE 
const DeliveryAddressUI = ({ address }) => {
    return (
        <View style={{ marginTop: 6, }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 13,
                paddingHorizontal: DOUBLE_SPACING,
            }}>{`Delivery Address:`}</Text>

            <Text style={{
                color: "#272727",
                fontSize: 12,
                paddingHorizontal: DOUBLE_SPACING * 2,
            }}>{`${address}`}</Text>
        </View>
    )
}

// #endregion :: DELIVERY ADDRESS UI END's FROM HERE 

// #region :: ORDER NUMBER UI START's FROM HERE 
const OrderNumberUI = ({ colors, orderNumber = '' }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
            <Text fontFamily='PoppinsSemiBold' style={{
                color: "#272727",
                fontSize: 13,
                paddingHorizontal: DOUBLE_SPACING,
            }}>{`Your order number:`}</Text>

            <Text fontFamily='PoppinsMedium' style={{
                color: colors.primary,
                fontSize: 14,
                paddingHorizontal: DOUBLE_SPACING,
            }}>{`${orderNumber}`}</Text>
        </View>
    )
}

     // #endregion :: ORDER NUMBER UI END's FROM HERE 