import * as React from "react";
import { Animated, Dimensions, Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import svgs from "../../../assets/svgs";
import { VALIDATION_CHECK } from "../../../helpers/SharedActions";
import AppStyles from "../../../res/AppStyles";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";
import FontFamily from "../../../res/FontFamily";
import Text from "../../atoms/Text";
import View from "../../atoms/View";
import images from '../../../assets/images/index'

// #region :: INTERFACE START's FROM HERE 

interface TextValueInterface {
    title?: string;
    value: string;
}

interface Props {
    children?: any;
    color: typeof initColors,

    contentContainerStyle?: StyleProp<ViewStyle>;
    leftContainerStyle?: StyleProp<ViewStyle>;
    middleContainerStyle?: StyleProp<ViewStyle>;
    rightContainerStyle?: StyleProp<ViewStyle>;

    xmlImage: string;

    middle?: TextValueInterface;
    right?: TextValueInterface;

    imageHeight?: string | number;
    imageWidth?: string | number;
    isShow?: boolean

};

const defaultProps = {
    xmlImage: svgs.orderProcessing_jovi_box(),
    middle: { title: `Estimated Delivery Time`, value: undefined },
    right: { title: `Total Pitstops`, value: undefined },

    imageWidth: "90%",
    imageHeight: 80,
    isShow: false
};
// #endregion :: INTERFACE END's FROM HERE 

const CARD_INSIDE_PADDING_HORIZONTAL = 6;

const OrderEstTimeCard = (props: Props) => {

    const colors = props.color;
    const styles = stylesFunc(colors);

    const xmlImage = VALIDATION_CHECK(props.xmlImage) ? props.xmlImage : defaultProps.xmlImage;


    return (
        <View style={[styles.primaryContainer, props.contentContainerStyle]}>

            {/* ****************** Start of LEFT SIDE ****************** */}
            {/* <View style={[styles.leftSideContainer, { paddingLeft: 0 }, props.leftContainerStyle]}>
                <SvgXml xml={xmlImage} height={props.imageHeight} width={props.imageWidth} style={{ paddingHorizontal: 5 }} />
            </View> */}

            {props.isShow ?
                <View style={[styles.leftSideContainer, {}, props.leftContainerStyle]}>
                    <View style={{ width: 80, height: 80, backgroundColor: "#6D51BB", borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            // style={{ width: '100%', height: '100%', }}
                            style={{ width: props.imageWidth, height: props.imageHeight }}
                            source={images.joviNewBox()}
                            resizeMode="contain"
                        />
                    </View>

                </View>
                :
                <View style={[styles.leftSideContainer, { paddingLeft: 0 }, props.leftContainerStyle]}>
                    <SvgXml xml={xmlImage} height={props.imageHeight} width={props.imageWidth} style={{ paddingHorizontal: 5, }} />
                </View>

            }



            {/* ****************** End of LEFT SIDE ****************** */}

            {/* ****************** Start of MID ****************** */}
            {(VALIDATION_CHECK(props.middle) && VALIDATION_CHECK(props.middle?.value ?? '')) &&
                <View style={[styles.middleContainer, props.middleContainerStyle]}>
                    <Text style={styles.title}>{props.middle?.title ?? defaultProps.middle.title}</Text>
                    <Text style={styles.value}>{props.middle?.value}</Text>
                </View>
            }

            {/* ****************** End of MID ****************** */}


            {/* ****************** Start of RIGHT SIDE ****************** */}
            {(VALIDATION_CHECK(props.right) && VALIDATION_CHECK(props.right?.value ?? '')) &&
                <View style={[styles.rightSideContainer, props.rightContainerStyle]}>
                    <Text style={styles.title}>{props.right?.title ?? defaultProps.right.title}</Text>
                    <Text style={{
                        ...styles.value,
                        fontSize: 20,
                    }}>{props.right?.value}</Text>
                </View>
            }

            {/* ****************** End of RIGHT SIDE ****************** */}


        </View >
    );
}

OrderEstTimeCard.defaultProps = defaultProps;
export default React.memo(OrderEstTimeCard);

// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    value: {
        fontSize: 17,
        color: "#272727",
        textAlign: "center",
        fontFamily: FontFamily.Poppins.SemiBold,
    },
    title: {
        fontSize: 12,
        color: "#272727",
        textAlign: "center",
        fontFamily: FontFamily.Poppins.Regular,
    },
    rightSideContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderStartWidth: 0.5,
        borderStartColor: "#272727",
        paddingHorizontal: CARD_INSIDE_PADDING_HORIZONTAL,
    },
    middleContainer: {
        flex: 3,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: CARD_INSIDE_PADDING_HORIZONTAL,
    },
    leftSideContainer: {
        flex: 1,
        borderEndWidth: 0.5,
        borderEndColor: "#272727",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: CARD_INSIDE_PADDING_HORIZONTAL,
        paddingRight: CARD_INSIDE_PADDING_HORIZONTAL*2,
    },
    primaryContainer: {
        ...AppStyles.shadow,
        flexDirection: "row",
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingVertical: constants.spacing_vertical,
        marginTop: constants.spacing_horizontal,
        marginHorizontal: constants.spacing_horizontal,
    },


});//end of stylesFunc

// #endregion :: STYLES END's FROM HERE 