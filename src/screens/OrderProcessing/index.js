import * as React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard';
import { getStatusBarHeight } from '../../helpers/StatusBarHeight';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { stylesFunc } from './styles';

const DOUBLE_SPACING = constants.spacing_horizontal + 6;

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
                    rightIconSize={22} />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    return (
        <View style={styles.primaryContainer}>
            {_renderHeader()}

            <OrderEstTimeCard
                color={colors}
                middle={{
                    value: `Now 30 - 45 min`
                }} />




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
                    marginVertical: 10,
                }} />


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


                <ChargesUI title='GST' value='120' />
                <ChargesUI title='Service Charges(Incl S.T 76)' value='120' />
                <ChargesUI title='Discount' value='-158' />

            </View>

            {/* ****************** End of ORDER DETAIL CARD ****************** */}


        </View>
    )
};//end of EXPORT DEFAULT

// #region :: CHARGES, GST, DISCOUNT UI START's FROM HERE 
const ChargesUI = ({ title = '', value = '', }) => {
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