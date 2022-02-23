import Slider from '@react-native-community/slider';
import React from 'react';
import { Appearance, Platform } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from 'react-redux';
import Text from '../../../components/atoms/Text';
import TextInput from '../../../components/atoms/TextInput';
import View from '../../../components/atoms/View';
import constants from '../../../res/constants';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import joviJobStyles from '../styles';


const PitStopEstPrice = (props) => {
    const [icon, setIcon] = React.useState();
    const isSliderUse = React.useRef(true);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    React.useEffect(() => {
        Icon.getImageSource('checkbox-blank-circle', 25, colors.primary)
            .then(setIcon);
    }, []);


    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    const cartReducer = useSelector((store) => {
        return store.cartReducer;
    });
    const remainingAmount = cartReducer.joviRemainingAmount;



    const getSliderStep = () => {
        let step = Math.ceil(parseInt(remainingAmount) / 4);
        // let step = Math.ceil((parseInt(remainingAmount) / 4) / 100) * 100;
        if (step < 1) {
            step = 1;
        }
        return step
    }

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
                    style={{
                        width: Platform.OS === "ios" ? constants.window_dimensions.width - 45 : constants.window_dimensions.width - 15,
                        height: Platform.OS === "ios" ? 35 : 20,
                        marginLeft: Platform.OS === "ios" ? 7 : -5,
                    }}
                    tapToSeek
                    thumbImage={icon}
                    thumbTintColor={Platform.OS === "ios" ? null : activeTheme.default}

                    value={typeof props.estVal === "number" ? props.estVal : 0}

                    minimumValue={0}
                    maximumValue={remainingAmount}
                    step={isSliderUse.current ? getSliderStep() : 1}
                    onResponderStart={() => {
                        if (!isSliderUse.current) {
                            isSliderUse.current = true;
                            forceUpdate();
                        }
                    }}
                    onSlidingComplete={(val) => {
                        isSliderUse.current = true;
                        props.onSliderChange(val);
                    }}
                    onValueChange={(val) => {
                        isSliderUse.current = true;
                        props.onSliderChange(val);

                    }}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.trackClr || '#00000029'}
                />


                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 20 }}>
                        <Text fontFamily="PoppinsRegular" style={{ fontSize: 14, color: colors.black }}>Remaining Amount</Text>
                        <Text fontFamily="PoppinsBold" style={{ fontSize: 14, color: colors.primary }} >Rs {`${props.getRemainingAmount()}`}</Text>
                    </View>
                    <TextInput
                        maxLength={5}
                        placeholder={"Type your amount"}
                        containerStyle={{ width: WIDTH * 0.4, alignSelf: 'flex-end' }}
                        value={`${props.textinputVal}`}
                        onChangeText={(text) => {
                            isSliderUse.current = false;
                            props.onChangeSliderText(text);
                        }}
                        keyboardType="number-pad" />
                </View>
            </View>
        </View>
        //     }
        // </View>
    );
}
export default PitStopEstPrice;




