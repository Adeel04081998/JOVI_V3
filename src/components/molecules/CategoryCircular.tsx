import * as React from "react";
import { Animated, ColorValue, Easing, TouchableOpacity } from "react-native";
import { VALIDATION_CHECK } from "../../helpers/SharedActions";
import AnimatedCircle from "../atoms/AnimatedCircle";
import AnimatedView from "../atoms/AnimatedView";
import VectorIcon from "../atoms/VectorIcon";
import View from "../atoms/View";

interface CategoryCircularItem {
    id: number,
    iconName?: string;
    key: any;
    iconType?: 'Ionicons' | 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Fontisto' | 'MaterialCommunityIcons' | 'MaterialIcons' | "Foundation" | "SimpleLineIcons" | 'Zocial' | 'Octicons';
    iconSize?: number;
    iconColor?: ColorValue;
    onPress?: () => void;
    customComponent?: () => void;
};

type Props = React.ComponentProps<typeof AnimatedCircle> & {
    children?: any;
    data: CategoryCircularItem[];
    itemSize?: number;
    isShown: boolean;
};

const defaultProps = {
    data: [],
    itemSize: 60,
    isShown: false
};

const CategoryCircular = (props: Props) => {

    const animate = React.useRef(new Animated.Value(0)).current;
    const ITEM_SIZE = props?.itemSize ?? defaultProps.itemSize;
    const [state, setState] = React.useState({
        circleShown: false
    })
    React.useEffect(() => {
        if (props.isShown) {
            setState(pre => ({ ...pre, circleShown:true}));
            Animated.timing(animate, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        } else {
            Animated.timing(animate, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if (finished) {
                    setState(pre => ({ ...pre, circleShown:false}));
                }
            });
        }

    }, [props.isShown])

    const _renderItem = (obj: any) => {
        const item: CategoryCircularItem = obj.item;
        const index: number = obj.index;

        const iconType = VALIDATION_CHECK(item?.iconType ?? '') ? item.iconType : 'Ionicons';
        const iconSize = VALIDATION_CHECK(item?.iconSize ?? '') ? item.iconSize : 22;
        const iconColor = VALIDATION_CHECK(item?.iconColor ?? '') ? item.iconType : '#A3ABB4';

        return (
            <TouchableOpacity style={{
                flex: 1,
                padding: 11,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                height: ITEM_SIZE,
                width: ITEM_SIZE,
                borderRadius: ITEM_SIZE,

            }} key={index}
                disabled={!VALIDATION_CHECK(item.onPress)}
                onPress={() => {
                    item.onPress && item.onPress();
                }}>
                {VALIDATION_CHECK(item.customComponent) ?
                    item.customComponent
                    :
                    <VectorIcon name={item.iconName} type={iconType} size={iconSize} color={iconColor} />
                }

            </TouchableOpacity>
        )
    };
    if (!props.isShown && !state.circleShown) return null;
    return (
        <Animated.View style={{
            position: "absolute",
            bottom: 100,
            width: "100%",
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            left: "25%",
            right: 0,
            zIndex: 999,
            opacity: animate,
            transform:[{
                translateY:animate.interpolate({
                    inputRange:[0,1],
                    outputRange:[100,0]
                })
            }]

        }}>
            <AnimatedCircle
                {...props}
                data={props.data}
                keyExtractor={(item, index) => `${index}`}
                renderItem={_renderItem}
            />
        </Animated.View>
    );
}

CategoryCircular.defaultProps = defaultProps;
export default CategoryCircular;
