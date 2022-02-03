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

const PitStopDetails = () => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    return (
        <View style={styles.pitStopLocationContainer} >
            <TextInput title="Pitstop Description" placeholder="Please Add Your Description" style={{
                height: 120,
                textAlignVertical: 'top',
                ...Platform.select({
                    ios: {
                        lineHeight: 0 // as same as height
                    },
                    android: {}
                }),
            }} multiline={true} />
            <Text style={styles.attachment} >Attachments</Text>
            <Button
                onPress={() => { }}
                text="Drag & Drop Or Browse"
                textStyle={styles.btnText}
                fontFamily="PoppinsRegular"
                style={styles.locButton} />
            <View style={styles.galleryIcon} >
                <VectorIcon name="image" type="Ionicons" color={colors.primary} size={25} style={{ marginRight: 5 }} />
                <VectorIcon name="image" type="Ionicons" color={colors.text} size={25} style={{ marginRight: 5 }} />
                <VectorIcon name="image" type="Ionicons" color={colors.text} size={25} style={{ marginRight: 5 }} />
            </View>
            <Text style={{ marginLeft: 10 }} >Voice Notes</Text>
            <View style={styles.voiceNoteContainer} >
                <View style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: colors.primary, justifyContent: "center", alignItems: 'center' }} >
                    <VectorIcon name="keyboard-voice" type="MaterialIcons" color={colors.textColor} size={20} />
                </View>
                <Text style={{ marginLeft: 5 }} >Record your voice note.</Text>
            </View>
        </View>
    );
}
export default PitStopDetails;




