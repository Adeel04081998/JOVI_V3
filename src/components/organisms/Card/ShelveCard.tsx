import * as React from "react";
import { Animated, Dimensions, ImageStyle, StyleProp, StyleSheet, Image as RNImage, ImageSourcePropType } from "react-native";
import Image from "../../atoms/Image";
import TouchableScale from "../../atoms/TouchableScale";
import View from "../../atoms/View";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";
import AppStyles from "../../../res/AppStyles";
import Text from "../../atoms/Text";
import FontFamily from "../../../res/FontFamily";
import { VALIDATION_CHECK } from "../../../helpers/SharedActions";
import ImageBackground from "../../atoms/ImageBackground";
import { SvgXml } from "react-native-svg";
import svgs from "../../../assets/svgs";

// #region :: INTERFACE START's FROM HERE 
const WINDOW_WIDTH = Dimensions.get('window').width;

interface ShelveCardItem {
    title?: string;
    image: ImageSourcePropType;
}

interface Props  {
    children?: any;
    color: typeof initColors,
    cardWidth?: number,
    cardHeight?: number,
    imageStyle?: StyleProp<ImageStyle>,
    containerStyle?: StyleProp<ImageStyle>,

    customItem?: () => React.Component;

    item?: ShelveCardItem;

    seeAll?: boolean;

    onItemPress?: (item: ShelveCardItem) => void;

    itemDisabled?: boolean;
};

const defaultProps = {
    cardWidth: WINDOW_WIDTH * 0.3,
    cardHeight: WINDOW_WIDTH * 0.1,
    imageStyle: {},
    containerStyle: {},
    item: { title: '', description: '', price: '', image: constants.DEFAULT_JOVI_IMAGE },
    customItem: undefined,
    seeAll: false,
    onItemPress: undefined,
    itemDisabled: false,
};
// #endregion :: INTERFACE END's FROM HERE 

const ShelveCard = (props: Props) => {
    const propItem: ShelveCardItem = props?.item ?? defaultProps.item;
    const propsSeeAll = props?.seeAll ?? defaultProps.seeAll;

    const colors = props.color;
    const styles = stylesFunc(colors);
    const cardWidth = props.cardWidth ?? defaultProps.cardWidth;
    const cardHeight = props.cardHeight ?? defaultProps.cardHeight;

    return (
        <TouchableScale activeOpacity={0.8}
            style={[{
                height: cardHeight,
                width: cardWidth,
                ...styles.primaryContainer,
                ...propsSeeAll && {
                    alignItems: "center",
                    justifyContent: "center",
                }
            }, props.containerStyle]}
            disabled={props.itemDisabled}
            onPress={() => {
                props.onItemPress && props.onItemPress(propItem);
            }}>

            {propsSeeAll ?
                <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                }}>
                    <SvgXml xml={svgs.shelveSeeAll()} height={15} width={15} style={{ marginRight: 8, }} />
                    <Text fontFamily="PoppinsMedium" style={{
                        color: "#272727",
                        fontSize: 14,
                    }} >{`See All`}</Text>

                </View>

                : VALIDATION_CHECK(props.customItem) ?
                    props.customItem && props.customItem()
                    :
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: cardHeight,
                        width: cardWidth,
                        paddingLeft: 10,
                    }}>

                        <Text style={{
                            color: "#272727",
                            fontSize: 12,
                            maxWidth: (cardWidth) / 2,
                        }} >{`${propItem.title}`}</Text>

                        <Image
                            source={propItem.image}
                            style={[{
                                height: cardHeight,
                                width: cardWidth / 3,
                                borderRadius: 10,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                resizeMode: "cover"
                            }, props.imageStyle]}
                            tapToOpen={false}
                            resizeMode={"cover"}
                        />
                        {/* <ImageBackground
                            source={propItem.image}
                            style={[{
                                height: cardHeight,
                                width: cardWidth,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                            }, props.imageStyle]}
                            imageStyle={[{
                                height: cardHeight,
                                width: cardWidth,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                resizeMode: 'cover',
                            }, props.imageStyle]}
                            tapToOpen={false}
                            resizeMode="cover"
                        >
                        
                        </ImageBackground> */}



                    </View>
            }
        </TouchableScale>
    );
}

ShelveCard.defaultProps = defaultProps;
export default ShelveCard;

// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors: typeof initColors) => StyleSheet.create({

    primaryContainer: {
        backgroundColor: colors?.white ?? "#fff",
        ...AppStyles.shadow,
        borderRadius: 7,
    },

});//end of stylesFunc

// #endregion :: STYLES END's FROM HERE 