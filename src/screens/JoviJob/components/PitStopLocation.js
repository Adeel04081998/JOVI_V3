import React from 'react';
import { Appearance, Dimensions } from 'react-native';
import constants from '../../../res/constants';
import View from '../../../components/atoms/View';
import joviJobStyles from '../styles';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import TextInput from '../../../components/atoms/TextInput';
import Button from '../../../components/molecules/Button';
import FontFamily from '../../../res/FontFamily';
import LocationSearch from '../../../components/atoms/LocationSearch';
import VectorIcon from '../../../components/atoms/VectorIcon';
import Text from '../../../components/atoms/Text';

const PitStopLocation = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);

    return (
        props.isOpened &&
        <View style={{ marginVertical: 10, flexGrow: 1 }} >
            <Text fontFamily="PoppinsRegular" style={{ fontSize: 12, color: colors.black, paddingLeft: 10,paddingBottom:5, opacity: 0.8 }}>Location</Text>
            <LocationSearch
                index={0}
                onLocationSelected={props.handleLocationSelected}
                handleOnInputChange={props.onLocationSearchInputChange}
                onNearbyLocationPress={() => props.onNearbyLocationPress}
                handleInputFocused={(index, isFocus) => props.handleInputFocused(index, isFocus)}
                onSetFavClicked={props.handleSetFavClicked}
                isFavourite={''}
                marginBottom={0}
                locationVal={props.locationVal}
                clearInputField={props.clearInputField}
                inputStyles={{
                    borderWidth: 1,
                    borderColor: colors.light_input_border,
                    borderRadius: 10,
                    paddingVertical: 0,
                    height: 45,
                    marginBottom: 10,
                    paddingHorizontal: 40,
                    color: "#000",
                    zIndex: -1,
                    backgroundColor: colors.white,
                }}
                listViewStyles={{
                    borderWidth: 1,
                    borderColor: "#BBBB",
                    backgroundColor: "#FFF",
                    marginHorizontal: 10,
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: { x: 0, y: 0 },
                    shadowRadius: 15,
                    marginTop: -10,
                    width: WIDTH - 20.5,
                    alignSelf: 'center',
                    maxHeight: HEIGHT * 0.21,
                    overflow: 'scroll',
                    numberOfLines: 1,
                    position: 'absolute',
                    top: 50,
                    zIndex: 999
                }}
            />
            <Button
                onPress={props.onLocationPress}
                text="Select location from map"
                textStyle={styles.btnText}
                fontFamily="PoppinsRegular"
                leftComponent={() => {
                    return (
                        <VectorIcon name="pin-outline" type="MaterialCommunityIcons" size={20} color={colors.white} />
                    )
                }}
                style={[styles.locButton, { width: WIDTH - 50, height: 35, zIndex: -1 }]} />
            <TextInput
                title="Name (Optional)"
                placeholder="Please Add Your Pitstop Location"
                containerStyle={{ marginTop: 30, alignSelf: 'center', zIndex: -1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.light_input_border, borderRadius: 10 }}
                titleStyle={{ opacity: 0.8, color: '#000', fontFamily: FontFamily.Poppins.Regular, fontSize: 12 }}
                value={props.nameVal}
                returnKeyType="done"
                onChangeText={props.onChangeName}
            />
        </View>
    );
}
export default PitStopLocation;




