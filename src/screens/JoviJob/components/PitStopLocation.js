import React from 'react';
import { Appearance } from 'react-native';
import constants from '../../../res/constants';
import View from '../../../components/atoms/View';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import TextInput from '../../../components/atoms/TextInput';
import Button from '../../../components/molecules/Button';
import FontFamily from '../../../res/FontFamily';
import LocationSearch from '../../../components/atoms/LocationSearch';

const PitStopLocation = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);

    return (
        props.isOpened &&
        <View style={{ marginVertical: 10 }} >
            <LocationSearch
                locationVal={props.locationVal}
                onLocationSelected={props.handleLocationSelected}
                handleOnInputChange={props.onLocationSearchInputChange}
                onNearbyLocationPress={() => props.onLocationSearchInputChange(false)}
                handleInputFocused={(index) => { }}
                onSetFavClicked={props.handleSetFavClicked}
                // isFavourite={state.pitstops[state.focusedFieldIndex].isFavourite}
                locationVal={props.locationVal}
                marginBottom={0}
            />

            <Button
                onPress={props.onLocationPress}
                text="Select location from map"
                textStyle={styles.btnText}
                fontFamily="PoppinsRegular"
                icon={true}
                iconName="pin-outline"
                iconType="MaterialCommunityIcons"
                iconSize={20}
                iconColor={colors.textColor}
                style={styles.locButton} />
            <TextInput
                title="Name (Optional)"
                placeholder="Please Add Your Name"
                containerStyle={{ marginTop: 30, alignSelf: 'center' }}
                titleStyle={{ opacity: 0.8, color: '#000', fontFamily: FontFamily.Poppins.Regular, fontSize: 12 }}
                value={props.nameVal}
                onChangeText={props.onChangeName}
            />
        </View>
    );
}
export default PitStopLocation;




