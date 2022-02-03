import React, { useEffect } from 'react';
import { Animated, Easing, StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { NumberProp, SvgXml } from 'react-native-svg';
import { VALIDATION_CHECK } from '../../helpers/SharedActions';
import AnimatedView from '../atoms/AnimatedView';
import Text from '../atoms/Text';


type Props = React.ComponentProps<typeof TouchableOpacity> & {
    children?: any;
    containerStyle?: StyleProp<ViewStyle>;
    imageContainerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;

    xml: string | null;
    width?: NumberProp;
    height?: NumberProp;

    title?: string;
};

const defaultProps = {
    xml: null,
    imageContainerStyle: {},
    containerStyle: {},
    textStyle: {},
    width: 95,
    height: 130,
    title: '',
}

const CategoryCardItem = (props: Props) => {
    const transFormAngle = React.useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(transFormAngle, {
            duration: 600,
            toValue: 1,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();
    }, []);

    return (
        <TouchableOpacity {...props} style={[{
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,

            backgroundColor: '#fff',
            borderRadius: 10,

        }, props.containerStyle, {
            height: props.height,
            width: props.width,

        }]}>
            <AnimatedView style={[{
                opacity: transFormAngle.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1]
                }),
                transform: [{
                    rotate: transFormAngle.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['270deg', '360deg']
                    })
                }]
            }, props.imageContainerStyle, {
                justifyContent: 'center',
                alignItems: "center",
            }]}>
                <SvgXml xml={props.xml} height={"80%"} width={"90%"} />
            </AnimatedView>
            {VALIDATION_CHECK(props.title) &&
                <Text
                numberOfLines={1}
                style={[{
                    opacity: transFormAngle.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1]
                    }),
                    color: "#272727",
                    textAlign: "center",
                    fontSize: 16,
                }, props.textStyle]}
                    fontFamily={"PoppinsMedium"} >{props.title}</Text>
            }
        </TouchableOpacity>
    );
}

CategoryCardItem.defaultProps = defaultProps;
export default CategoryCardItem;