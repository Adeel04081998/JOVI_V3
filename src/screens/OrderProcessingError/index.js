import * as React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import Text from '../../components/atoms/Text';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import OrderEstTimeCard from '../../components/organisms/Card/OrderEstTimeCard';
import DashedLine from '../../components/organisms/DashedLine';
import { renderPrice, VALIDATION_CHECK } from '../../helpers/SharedActions';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { OrderProcessingChargesUI, OrderProcessingEstimatedTotalUI } from '../OrderProcessing';
import { stylesFunc } from './styles';

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


            {/* ****************** Start of STATIC DATA ****************** */}

            <View style={styles.cardContainer}>
                <CardTitle pitstopType={1} pitstopNumber="01" title="Rahat Bakers I-8" strikethrough />
                <DashedLine />
                <CardSubTitle type={CARD_SUB_TITLE_TYPES.cancelled} />

                <View style={styles.greyCardContainer}>
                    <CardText title='Pepperoni Pizza' price='Rs. 850.00' strikethrough />
                    <CardText title='Red N Hot Pizza - Tika' price='Rs. 1050.00' strikethrough />
                    <CardText title='Beef Patty Burger' price='Rs. 550.00' strikethrough />
                </View>
            </View>

            <View style={styles.cardContainer}>
                <CardTitle pitstopType={PITSTOP_TYPES.SUPER_MARKET}
                    pitstopNumber="3" title="Madina Cash & Carry" />
                <DashedLine />
                <CardSubTitle type={CARD_SUB_TITLE_TYPES.outOfStock} />

                <View style={styles.greyCardContainer}>
                    <CardText title='Nido 1 plus - 2 kg' price='Rs. 750.00' strikethrough />
                </View>

                <CardSubTitle type={CARD_SUB_TITLE_TYPES.replaced} />

                <View style={styles.greyCardContainer}>
                    <CardText title='Red Chilli Powder - 150 g' price='Rs. 32.00' strikethrough />
                    <CardText title='Red Chilli Powder - 250 g' price='Rs. 50.00' strikethrough />
                </View>
            </View>

            {/* ****************** End of STATIC DATA ****************** */}

            <View style={styles.cardContainer}>
                <OrderProcessingChargesUI title='GST' value='120' />
                <OrderProcessingChargesUI title='Service Charges(Incl S.T 76)' value='120' />
                <DashedLine />
                <OrderProcessingChargesUI title='Discount' value='-158' />
                <DashedLine />

                <OrderProcessingEstimatedTotalUI estimatedPrice='4924' />
            </View>

        </View>
    )
};//end of EXPORT DEFAULT

// #region :: CARD TEXT UI START's FROM HERE 
const CardText = ({ title = '', price = '', strikethrough = false, }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
            <Text fontFamily='PoppinsMedium' style={{
                maxWidth: "70%",
                fontSize: 12,
                color: strikethrough ? "#B1B1B1" : "#272727",
                textDecorationLine: strikethrough ? "line-through" : "none",
                textDecorationColor: "#B1B1B1",

            }} numberOfLines={1}>{`${title}`}</Text>
            <Text fontFamily='PoppinsMedium' style={{
                maxWidth: "30%",
                fontSize: 12,
                color: strikethrough ? "#B1B1B1" : "#272727",
                textDecorationLine: strikethrough ? "line-through" : "none",
                textDecorationColor: "#B1B1B1",
            }} numberOfLines={1}>{`${renderPrice(`${price}`)}`}</Text>
        </View>
    )
}

// #endregion :: CARD TEXT UI END's FROM HERE 

// #region :: CODE SUB TITLE UI START's FROM HERE 
const CARD_SUB_TITLE_TYPES = {
    "cancelled": 1,
    "outOfStock": 2,
    "replaced": 3,
}
const CardSubTitle = ({ type = CARD_SUB_TITLE_TYPES.cancelled }) => {
    let color = "#D80D30";//DEFAULT IS CANCELLED
    let text = "Vendor was unable to fulfil your order";
    if (type === CARD_SUB_TITLE_TYPES.outOfStock) {
        color = "#F98500";
        text = "Out of stock";
    } else if (type === CARD_SUB_TITLE_TYPES.replaced) {
        color = "#2D5AD5";
        text = "Replaced";
    }
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: constants.spacing_horizontal,
            paddingTop: constants.spacing_vertical,
        }}>
            <VectorIcon name='shopping-bag' type='FontAwesome5' color={color} />
            <Text fontFamily='PoppinsSemiBold' style={{
                paddingLeft: 6,
                color: "#272727",
                fontSize: 12,
            }}>{text}</Text>
        </View>
    )
}

// #endregion :: CODE SUB TITLE UI END's FROM HERE 

// #region :: CARD TITLE UI START's FROM HERE 
const CardTitle = ({ pitstopType, strikethrough = false, pitstopNumber = '', title = '' }) => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
    pitstopNumber = `${pitstopNumber}`.trim();
    title = `${title}`.trim();
    if (strikethrough) {
        return (
            <Text style={{
                padding: constants.spacing_horizontal,
                fontSize: 17,
                color: "#D80D30",
                textDecorationLine: "line-through",
                textDecorationColor: "#D80D30",
            }}>{`Pitstop ${pitstopNumber} - ${title}`}
            </Text>
        )
    }
    return (
        <Text style={{
            padding: constants.spacing_horizontal,
            fontSize: 17,
            color: "#272727",
        }}>{`Pitstop ${pitstopNumber} - `}
            <Text style={{
                color: colors.primary,
            }}>{`${title}`}</Text>
        </Text>
    )
}

     // #endregion :: CARD TITLE UI END's FROM HERE 