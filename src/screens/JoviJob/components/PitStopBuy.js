import React from 'react';
import { Appearance } from 'react-native';
import { SvgXml } from 'react-native-svg';
import constants from '../../../res/constants';
import svgs from '../../../assets/svgs';
import VectorIcon from '../../../components/atoms/VectorIcon';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import TextInput from '../../../components/atoms/TextInput';
import Button from '../../../components/molecules/Button';

const PitStopBuy = () => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    return (
        <View style={styles.pitStopLocationContainer} >
            <Text style={styles.attachment} >
                Buy For Me
            </Text>
            <View style={[styles.attachment, { borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: 20, justifyContent: 'space-between', paddingHorizontal:10 }]}>
                <Text>Yes</Text>

            </View>
        </View>
    );
}
export default PitStopBuy;




