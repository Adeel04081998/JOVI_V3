import React, { useState } from 'react';
import { Appearance, PixelRatio, Platform, StyleSheet } from 'react-native';
import constants from '../../../res/constants';
import VectorIcon from '../../../components/atoms/VectorIcon';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import Dropdown from '../../../components/molecules/Dropdown/Index';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import ENUMS from '../../../utils/ENUMS';

const PitStopEstTime = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    // const baseWidth = Platform.OS === "android" ? 282 : 285
    // const MAX_WIDTH = 300 
    // const WINDOW_WIDTH = constants.screen_dimensions.width;

    const SCALING_VARIABLE = Platform.OS === "android" ? 47.5 : 50

    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height

    const SCALED_WIDTH = WIDTH - SCALING_VARIABLE

    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    const [disabled, setDisabled] = useState(false);
    const dropdownExtraMargin = props.hideHeading !== true? 0 : 30;
    return (
        props.isOpened &&
        <View style={{ marginBottom: 10, zIndex: 99999 }}>
            {props.hideHeading !== true&&<Text style={styles.attachment} >
                Set Time
            </Text>
}
            <TouchableOpacity activeOpacity={1} style={{ ...styles.otpDropdownView, borderBottomLeftRadius: props.collapsed ? 10 : 0, borderBottomRightRadius: props.collapsed ? 10 : 0 }} onPress={props.onPressDropDown}>
                <Text style={{ color: "#000", ...styles.textAlignCenter }}>{props.estTime.text}</Text>
                <VectorIcon type='AntDesign' name={props.collapsed ? "down" : "up"} style={{ position: 'absolute', right: 10, alignSelf: 'center' }} size={18} color={"#000"} />
            </TouchableOpacity>
            <Dropdown collapsed={props.collapsed}
                cb={(type) => {
                    if (type === 0) setDisabled(true)
                    else setDisabled(false)
                }}
                scrollViewStyles={{ top: Platform.OS === "android" ? 76-dropdownExtraMargin : 68-dropdownExtraMargin , width: SCALED_WIDTH * 0.936, alignSelf: 'center'}}
                options={ENUMS.ESTIMATED_TIME}
                itemUI={(item, index, collapsed) =>
                    <TouchableOpacity key={`estTime-key-${index}`}
                        style={{
                            paddingVertical: 4,
                            borderBottomWidth: index === 4 ? 0 : 1 ,
                            borderTopWidth: 0,
                            borderColor: 'rgba(0,0,0,0.3)',
                            width: SCALED_WIDTH * 0.936,
                            backgroundColor: 'white',
                            borderBottomRightRadius: index === ENUMS.ESTIMATED_TIME.length - 1 ? 12 : 0,
                            borderBottomLeftRadius: index === ENUMS.ESTIMATED_TIME.length - 1 ? 12 : 0,
                            alignSelf: 'center',
                        }}
                        disabled={disabled}
                        onPress={() => props.onEstTimePress(item)}
                    >
                        <Text style={{ textAlign: "center", paddingVertical: 3, color: 'black' }}>{item.text}</Text>
                    </TouchableOpacity>} />
        </View>
    );
}
export default PitStopEstTime;
