import React, { } from 'react';
import { Appearance, Keyboard } from 'react-native';
import constants from '../../../res/constants';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import TextInput from '../../../components/atoms/TextInput';
import FontFamily from '../../../res/FontFamily';

const PitStopDetails = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);

    return (
        props.isOpened &&
        <View style={{ marginVertical: 10 }} >
            <TextInput title="Pitstop Description"
                placeholder="Please Add Your Description"
                // returnKeyType= ""
                style={{
                    height: 120,
                    textAlignVertical: 'top',
                    ...Platform.select({
                        ios: {
                            lineHeight: 0 // as same as height
                        },
                        android: {}
                    }),
                }}
                containerStyle={{
                    width: WIDTH - 70,
                    alignSelf: 'center',
                    backgroundColor: colors.white,
                    borderWidth: 1, borderColor: colors.light_input_border,
                    borderRadius: 10
                }}
                multiline={true}
                titleStyle={{ opacity: 0.8, color: '#000', fontFamily: FontFamily.Poppins.Regular, fontSize: 12 }}
                value={props.description}
                onChangeText={props.onChangeDescription}
                // onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Text style={styles.attachment} >Attachments</Text>
            {props.children}
        </View>
    );
}
export default PitStopDetails;
