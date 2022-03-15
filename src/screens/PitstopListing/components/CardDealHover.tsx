import * as React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import Text from "../../../components/atoms/Text"
import View from "../../../components/atoms/View"
import { VALIDATION_CHECK } from "../../../helpers/SharedActions";
import { initColors } from '../../../res/colors';

interface Props {
    colors?: typeof initColors;
    text?: number | string;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const defaultProps = {
    text: '',
};

const CardDealHover = (props: Props) => {
    const colors = props?.colors ?? initColors;

    if (!VALIDATION_CHECK(props.text)) return null;
    return (
        <View style={{ alignItems: "flex-end", }}>
            <View style={[{
                backgroundColor: colors.primary,
                minHeight: 20,
                minWidth: 10,
                borderTopLeftRadius: 13,
                borderBottomLeftRadius: 13,
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
            }, props.containerStyle]}>
                <Text style={[{ fontSize: 12, color: colors.white }, props.textStyle]} numberOfLines={1}>{props.text}</Text>
            </View>
        </View>
    )
}

CardDealHover.defaultProps = defaultProps;
export default CardDealHover;