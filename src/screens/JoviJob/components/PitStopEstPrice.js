import React from 'react';
import { Appearance, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';
import constants from '../../../res/constants';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import images from '../../../assets/images';
import View from '../../../components/atoms/View';
import Slider from '@react-native-community/slider';
import Text from '../../../components/atoms/Text';
import TextInput from '../../../components/atoms/TextInput';

const PitStopEstPrice = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);

    return (
        // <View style={styles.pitStopLocationContainer} >
        //     {
        props.isOpened &&
        <View>
            <Text style={[styles.attachment, { paddingVertical: 0 }]} >
                Estimated Price
            </Text>
            <View style={styles.estPriceContainer}>
                <Slider
                    style={{ width: constants.window_dimensions.width - 25, height: Platform.OS === "ios" ? 35 : 20, marginLeft: 10 }}
                    thumbImage={images.circle()}
                    value={Number(props.estVal)}
                    minimumValue={0}
                    onValueChange={props.onSliderChange}
                    maximumValue={10000}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.trackClr || '#00000029'}
                />
                <View style={{ flexDirection:'row', justifyContent:'space-between' }} >
                    <View style={{flexDirection: 'column', justifyContent:'center', marginLeft:20}}>
                        <Text fontFamily="PoppinsRegular" style={{fontSize:14, color: colors.black}}>Remaining Amount</Text>
                        <Text fontFamily="PoppinsBold" style={{fontSize:14, color: colors.primary}} >Rs {`${props.getRemainingAmount()}`}</Text>
                    </View>
                    <TextInput 
                    maxLength={4} 
                    placeholder={"Type your amount"} 
                    containerStyle={{width: WIDTH * 0.4, alignSelf:'flex-end' }} value={`${props.estVal}`} onChangeText={props.onChangeSliderText} keyboardType="number-pad" />
                </View>
            </View>
        </View>
        //     }
        // </View>
    );
}
export default PitStopEstPrice;




