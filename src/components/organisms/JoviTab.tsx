import * as React from "react";
import { Platform, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { initColors } from "../../res/colors";
import Text from "../atoms/Text";
import TouchableScale from "../atoms/TouchableScale";
import View from "../atoms/View";

interface Props {
    color?: typeof initColors;
    data: [];
    key?: string;
    initialIndex?: number;
    onActiveIndexChanged?: (item: any, index: number) => void;

    containerStyle?: StyleProp<ViewStyle>;
    itemContainerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

const defaultProps = {
    color: initColors,
    key: undefined,
    initialIndex: 0,
    onActiveIndexChanged: undefined,
};
const JoviTab = React.memo((props: Props) => {
    const key = props?.key ?? defaultProps.key;
    const colors = props?.color ?? defaultProps.color;
    const initialIndex = props?.initialIndex ?? defaultProps.initialIndex;
    const styles = stylesFunc(colors);

    const [selectedIndex, setSelectedIndex] = React.useState<number>(initialIndex);

    React.useEffect(() => {
        if (initialIndex !== props.initialIndex) {
            setSelectedIndex(props?.initialIndex ?? defaultProps.initialIndex);
        }
        return () => { };
    }, [props.initialIndex])

    React.useEffect(() => {
        if (props.onActiveIndexChanged) {
            const dataItem = props.data[selectedIndex];
            props.onActiveIndexChanged(dataItem, selectedIndex);
        }
        return () => { };
    }, [selectedIndex]);

    return (
        <View style={[styles.primaryContainer, props.containerStyle]}>
            {props.data.map((item, index) => {
                const text = key ? item[key] : item;
                const isSelected = selectedIndex === index;

                return (
                    <TouchableScale wait={0}
                        disabled={isSelected}
                        key={index}
                        onPress={() => {
                            setSelectedIndex(index);
                        }}
                        style={[styles.itemContainer, props.itemContainerStyle, {
                            backgroundColor: isSelected ? colors.primary : colors.white,
                        }]}>
                        <Text style={[styles.itemText, props.textStyle, {
                            color: isSelected ? colors.white : colors.primary,
                        }]}>{text}</Text>
                    </TouchableScale>
                )
            })}
        </View>
    );
}, (n, p) => n !== p);

//@ts-ignore
JoviTab.defaultProps = defaultProps;
export default JoviTab;

const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    itemText: {
        fontSize: 16,
    },
    itemContainer: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    primaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        padding: 5,
        borderRadius: Platform.OS === "android" ? 4 : 10,
        borderColor: colors.primary,
        borderWidth: StyleSheet.hairlineWidth*0.7,
    },

});
