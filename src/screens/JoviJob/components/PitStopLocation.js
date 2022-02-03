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

const PitStopLocation = () => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    return (
        <View style={styles.pitStopLocationContainer} >
            <TextInput title="Location" placeholder="Please Add Your Pitstop Location" />
            <Button
                onPress={() => { }}
                text="Select location from map"
                textStyle={styles.btnText}
                fontFamily="PoppinsRegular"
                icon={true}
                iconName="pin-outline"
                iconType="MaterialCommunityIcons"
                iconSize={20}
                iconColor={colors.textColor}
                style={styles.locButton} />
                <TextInput title="Name (Optional)" placeholder="Please Add Your Name" containerStyle={{marginTop:30}} />
        </View>
    );
}
export default PitStopLocation;




