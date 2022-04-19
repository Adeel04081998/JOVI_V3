import React, { useRef, useState, useEffect } from 'react';
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

export default React.memo((props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);


    return (
        <TouchableOpacity activeOpacity={1} style={[props.headerStyles || styles.header]}
            disabled={props.disabled}
            onPress={props.onHeaderPress}>
            <View style={[props.svgStyles || styles.svg]} >
                <SvgXml xml={props.xmlSrc || svgs.pitstopPin()} height={HEIGHT * 0.07} width={WIDTH * 0.14} />
            </View>
            <View style={styles.pitstopTextContainer} >
                <Text style={styles.pitstopText} fontFamily={"PoppinsMedium"} >{props.title}</Text>
                <Text style={styles.pitStopLoc} fontFamily={"PoppinsRegular"} numberOfLines={1} >{props.description}</Text>
            </View>
            {props.isArrowIcon &&
                <View
                    style={[styles.arrow, { backgroundColor: props.headerBackgroundColor ? props.headerBackgroundColor : colors.lightGreyBorder }]}>
                    <VectorIcon name={props.isOpened ? "keyboard-arrow-up" : "keyboard-arrow-down"} type="MaterialIcons" color={colors.textColor} />
                </View>
            }
            {
                !props.isArrowIcon &&
                props.disabled &&
                <>
                  <View style={{ flexDirection: 'row', height: 50, width: '100%', borderRadius: 5, opacity: 0.6, alignItems: 'center', backgroundColor: '#444', position: 'absolute' }} />
                      <View style={{ height: 50, width: "100%", position: "absolute", justifyContent: 'center', }}/>
                </>}
        </TouchableOpacity >
    );
}, ((n, p) => {
    return n === p
}))




