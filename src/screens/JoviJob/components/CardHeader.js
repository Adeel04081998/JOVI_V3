import React, { useRef } from 'react';
import { Appearance, Animated } from 'react-native';
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
import { PITSTOP_CARD_TYPES } from '..';

const CardHeader = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    return (
         <View style={[styles.header]} >
                <View style={styles.svg} > 
                    <SvgXml xml={props.xmlSrc || svgs.pitstopPin()} height={HEIGHT * 0.07} width={WIDTH * 0.14} />
                </View>
                <View style={styles.pitstopTextContainer} >
                    <Text style={styles.pitstopText} fontFamily={"PoppinsMedium"} >{props.title}</Text>
                    <Text style={styles.pitStopLoc} fontFamily={"PoppinsRegular"} >{props.description}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.arrow, { backgroundColor: props.headerBackgroundColor ? props.headerBackgroundColor : colors.lightGreyBorder }]}
                    onPress={props.onHeaderPress}
                    disabled={props.disabled}
                >
                    <View style={{}}>
                        <VectorIcon name="keyboard-arrow-down" type="MaterialIcons" color={colors.textColor} />
                    </View>
                </TouchableOpacity>
            </View>
    );
}
export default CardHeader;




