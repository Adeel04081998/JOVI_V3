import React, { useRef, useState } from 'react';
import { Appearance, Animated, Easing } from 'react-native';
import { SvgXml } from 'react-native-svg';
import constants from '../../../res/constants';
import svgs from '../../../assets/svgs';
import VectorIcon from '../../../components/atoms/VectorIcon';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';

const CardHeader = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);

    return (
        <TouchableOpacity activeOpacity={1} style={[styles.header]}
            disabled={props.disabled}
            onPress={props.onHeaderPress}>
            <View style={styles.svg} >
                <SvgXml xml={props.xmlSrc || svgs.pitstopPin()} height={HEIGHT * 0.07} width={WIDTH * 0.14} />
            </View>
            <View style={styles.pitstopTextContainer} >
                <Text style={styles.pitstopText} fontFamily={"PoppinsMedium"} >{props.title}</Text>
                <Text style={styles.pitStopLoc} fontFamily={"PoppinsRegular"} numberOfLines={1} >{props.description}</Text>
            </View>
            <View
                style={[styles.arrow, { backgroundColor: props.headerBackgroundColor ? props.headerBackgroundColor : colors.lightGreyBorder }]}
            >
                <Animated.View style={{

                }}>
                    <VectorIcon name={props.isOpened ? "keyboard-arrow-up" : "keyboard-arrow-down"} type="MaterialIcons" color={colors.textColor} />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
}
export default CardHeader;




