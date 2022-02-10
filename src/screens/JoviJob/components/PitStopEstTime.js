import React from 'react';
import { Appearance, StyleSheet } from 'react-native';
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
import Dropdown from '../../../components/molecules/Dropdown/Index';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import ENUMS from '../../../utils/ENUMS';

const PitStopEstTime = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);

    return (
        // <View style={styles.pitStopLocationContainer} >
        //     {
        props.isOpened &&
        <View style={{ marginBottom: 5, position: 'relative', zIndex: 9999 }}>
            <Text style={styles.attachment} >
                Set Time
            </Text>
            <TouchableOpacity activeOpacity={1} style={styles.otpDropdownView} onPress={props.onPressDropDown} >
                <Text style={{ color: "#000", ...styles.textAlignCenter }}>{props.estTime.text}</Text>
                <VectorIcon type='AntDesign' name={props.collapsed ? "down" : "up"} style={{ position: 'absolute', right: 10, alignSelf: 'center' }} size={18} color={"#000"} />
            </TouchableOpacity>
            <Dropdown collapsed={props.collapsed}
                scrollViewStyles={{ top: 42 }}
                options={ENUMS.ESTIMATED_TIME}
                itemUI={(item, index, collapsed) =>
                    <TouchableOpacity key={`estTime-key-${index}`}
                        style={{
                            paddingVertical: 4,
                            borderWidth: 0.5,
                            borderTopWidth: 0,
                            borderColor: 'rgba(0,0,0,0.3)',
                            backgroundColor: 'white',
                            zIndex: 9999,
                            borderBottomRightRadius: index === ENUMS.ESTIMATED_TIME.length - 1 ? 12 : 0,
                            borderBottomLeftRadius: index === ENUMS.ESTIMATED_TIME.length - 1 ? 12 : 0,
                        }}
                        onPress={() => props.onEstTimePress(item)}>
                        <Text style={{ textAlign: "center", paddingVertical: 3, color: 'black' }}>{item.text}</Text>
                    </TouchableOpacity>} />
        </View>
        //     }
        // </View>
    );
}
export default PitStopEstTime;
