import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, StyleProp, ViewStyle, Image } from 'react-native';

import { VALIDATION_CHECK } from '../../helpers/SharedActions';
import images from '../../assets/images';
import Text from '../atoms/Text';
import Button from '../molecules/Button';
import { ImageSourcePropType } from 'react-native';
import { initColors } from '../../res/colors';
//END OF IMPORT's

const WINDOW_WIDTH = Dimensions.get('window').width;

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    title?: any;
    description?: any;

    buttonText?: any;
    buttonWidth?: any;
    onButtonPress?(): void;

    color?: typeof initColors;
    image: ImageSourcePropType,
}//end of INTERFACE 

const defaultProps = {
    containerStyle: {},
    title: 'No record found!',
    description: '',
    buttonText: '',
    buttonWidth: "65%",
    onButtonPress: undefined,

    image: images.noRecord(),
    color: initColors,
};

const NoRecord = (props: Props) => {
    const colors = props?.color ?? defaultProps.color;
    const styles = stylesFunc(colors);

    return (
        <View style={[styles.containerStyle, props.containerStyle]}>
            {VALIDATION_CHECK(props.image) &&
                <Image
                    style={styles.image}
                    source={props.image}
                />
            }

            {VALIDATION_CHECK(props.title) &&
                <Text fontFamily='PoppinsBold' style={[styles.title, {
                }]} numberOfLines={2}>{props.title}</Text>
            }


            {VALIDATION_CHECK(props.description) &&
                <Text style={[styles.description, {

                }]}>{props.description}</Text>
            }

            {(VALIDATION_CHECK(props.buttonText)) &&
                <View style={[styles.buttonContainer, {
                    width: props.buttonWidth
                }]}>
                    <Button
                        style={{
                            backgroundColor: colors.primary,
                            borderRadius: 10,

                        }}
                        text={props.buttonText}
                        wait={0}
                        onPress={props.onButtonPress} />
                </View>
            }
        </View>
    )
}

NoRecord.defaultProps = defaultProps;
export default NoRecord;


const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    containerStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white,
    },
    image: {
        width: WINDOW_WIDTH * 0.5,
        height: WINDOW_WIDTH * 0.5,
    },
    title: {

        color: colors.primary, //"#333333",
        marginTop: 20,
        marginHorizontal: 30,
        textAlign: "center",
        fontSize: 22,
    },
    description: {
        marginTop: 8,
        color: "rgba(151, 150, 161, 0.7)",
        marginHorizontal: 30,
        textAlign: "center",
        fontSize: 13,
    },
    buttonContainer: {
        marginHorizontal: 30,
        marginTop: 30,
        width: "65%",
    },

}); //end of StyleSheet STYLES
