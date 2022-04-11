import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
import View from "../../../components/atoms/View";
import { VALIDATION_CHECK } from "../../../helpers/SharedActions";
import constants from "../../../res/constants";

interface Props {
    onIndexChange?: (index: number | string) => void;
    dotLength?: number;
    initialIndex?: number;
    containerStyle?: StyleProp<ViewStyle>;
    secondaryContainerStyle?: StyleProp<ViewStyle>;
    circleContainer?: StyleProp<ViewStyle>;
    customCircle?: () => React.ReactNode;
    selectedCustomCircle?: () => React.ReactNode;
    disabled?: boolean;
}

const defaultProps = {
    onIndexChange: undefined,
    dotLength: 5,
    initialIndex: 1,
    disabled: false,
};
const SLIDER_WIDTH = constants.window_dimensions.width * 0.7;

const RatingSliderUI = (props: Props) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number>(props?.initialIndex ?? defaultProps.initialIndex) //0 TO 4
    const [DOT_LENGTH, updateDOT_LENGTH] = React.useState<number>(props?.dotLength ?? defaultProps.dotLength);
    const skipEffect = React.useRef(false);

    React.useEffect(() => {
        if (skipEffect.current) {
            skipEffect.current = false;
            return;
        }
        updateDOT_LENGTH(props?.dotLength ?? defaultProps.dotLength);
    }, [props.dotLength]);

    React.useEffect(() => {
        const ii = props?.initialIndex ?? defaultProps.initialIndex;
        if (ii !== selectedIndex) {
            skipEffect.current = true;
            setSelectedIndex(ii);
        }
    }, [props.initialIndex])


    React.useEffect(() => {
        if (skipEffect.current) {
            skipEffect.current = false;
            return;
        }
        if (props.onIndexChange) {
            props.onIndexChange(selectedIndex + 1);
        }
        return () => { };
    }, [selectedIndex])
    // console.log('selectedIndex ', selectedIndex);
    // console.log('DOT_LENGTH ', DOT_LENGTH - 1);

    // console.log('selectedIndex<DOT_LENGTH ', selectedIndex < DOT_LENGTH);

    return (
        <View style={[{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'space-between',
            alignSelf: "center",
            backgroundColor: '#fff',
            width: SLIDER_WIDTH,
            height: 2,
            marginTop: "10%",

        }, props.containerStyle,
        ]}>
            <>
                {new Array(DOT_LENGTH).fill({}).map((_, index) => {
                    const isFirstOrLast = index === 0 ? "first" : index === DOT_LENGTH - 1 ? "last" : null;
                    if (props.customCircle) {
                        return props.customCircle()
                    }
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setSelectedIndex(index);
                            }}
                            wait={0}
                            disabled={index === selectedIndex || props.disabled}
                            activeOpacity={0.9}
                            style={[{
                                borderColor: '#fff',
                                borderWidth: selectedIndex === index ? 2 : 0,
                                borderRadius: 10,
                                padding: 10,
                                ...isFirstOrLast === "first" && {
                                    marginLeft: -15,
                                },
                                ...isFirstOrLast === "last" && {
                                    marginRight: -15,
                                },
                            }, props.secondaryContainerStyle]}>
                            {selectedIndex === index ? <>
                                {props.selectedCustomCircle ? props.selectedCustomCircle() :
                                    <View style={[{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 99, }, props.circleContainer]} />
                                }
                            </> :
                                <View style={[{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 99, }, props.circleContainer]} />
                            }

                        </TouchableOpacity>
                    )
                })}
            </>
        </View>
    )

}

RatingSliderUI.defaultProps = defaultProps;
export default RatingSliderUI;