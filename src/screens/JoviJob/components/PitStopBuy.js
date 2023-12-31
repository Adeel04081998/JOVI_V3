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
import Switch from '../../../components/atoms/Switch';

export default React.memo((props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    return (
            props.isOpened &&
                <>
                    <Text style={[styles.attachment,{paddingVertical:0}]} >
                        Buy For Me
                    </Text>
                    <View style={styles.buyForMeContainer}>
                        <Text style={[styles.pitstopText, { fontWeight: '600', fontSize: 16 }]} >{props.switchVal ? 'Yes' : 'No' }</Text>
                        <View>
                            <Switch switchVal={props.switchVal} onToggleSwitch={(bool) => {props.onToggleSwitch(bool)}} type={1} />
                        </View>
                    </View>
                    <Text style={[styles.pitstopText, {paddingHorizontal:15,paddingBottom:5, fontWeight: '600', fontSize: 12, color:colors.redColor }]} fontFamily={'PoppinsMedium'} >There is no liability on JOVI, if the value of goods exceeds PKR 50,000</Text>
                </>

    );
},((n,p)=>{
    return (n.isOpened===p.isOpened && n.switchVal===p.switchVal)
}));





