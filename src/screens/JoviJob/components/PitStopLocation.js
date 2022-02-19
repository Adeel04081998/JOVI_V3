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

const PitStopLocation = (props) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);

    return (
        props.isOpened &&
        <View style={{ marginVertical: 10, flexGrow: 1 }} >
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
                    width: WIDTH - 10,
                    alignSelf: 'center',
                    maxHeight: HEIGHT * 0.18,
                    overflow: 'scroll',
                    numberOfLines: 1,
                    position:'absolute',
                    top:50,
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
                style={[styles.locButton, { width: WIDTH - 30, height: 40, zIndex:-1 }]} />
            <TextInput
                title="Name (Optional)"
                placeholder="Please Add Your Name"
                containerStyle={{ marginTop: 30, alignSelf: 'center', zIndex:-1  }}
                titleStyle={{ opacity: 0.8, color: '#000', fontFamily: FontFamily.Poppins.Regular, fontSize: 12 }}
                value={props.nameVal}
                returnKeyType="done"
                onChangeText={props.onChangeName}
            />
        </View>
    );
}
export default PitStopLocation;




