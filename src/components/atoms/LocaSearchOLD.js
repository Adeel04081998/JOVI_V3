import React, { useState, useEffect } from "react";
import { View, Platform, Text, Image, StyleSheet, Alert, TouchableOpacity, Dimensions, Appearance, ScrollView } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SvgXml } from "react-native-svg";
import theme from "../../res/theme";
import configs from "../../utils/configs";
import GV from "../../utils/GV";
import svgs from "../../assets/svgs/index";


export default LocationSearch = React.forwardRef(({ dispatch, locationVal, handleOnInputChange, index, mode, previousMode, textToShow, onLocationSelected, handleOnFocus, /* handleAddPitstop, */ handleDeletePitstop, handlePinLocationClicked, isLast, handleInputFocused, reRender, totalPitstops, onSetFavClicked, isFavourite, marginBottom = 5, }, ref) => {
    const locTextRef = React.createRef();
    const [searchFocused, setSearchFocused] = useState(false);
    const [predefinedPlaces, setPredefinedPlaces] = useState([]);
    const [show, setShow] = useState(false);
    const { GOOGLE_API_KEY } = configs;
    const { pinIconDesc, heartIconFilled, heartIconUnfilled, favHomeIcon, favWorkIcon, /* favOtherIcon, */ favFriendsIcon, favFamilyIcon } = svgs;
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    useEffect(() => {

    }, [])
    return (
        <GooglePlacesAutocomplete
            placeholder={"Enter a pitstop location"}
            placeholderTextColor={colors.black}
            onPress={(data, { geometry }) => onLocationSelected(data, geometry, index, null)}
            query={{
                key: GOOGLE_API_KEY,
                language: "en",
                components: "country:pk",
            }}
            GooglePlacesSearchQuery={{
                rankby: "distance", // "prominence" | "distance"
                type: "cafe"
            }}
            textInputProps={{
                onFocus: () => {
                    //  
                },
                onChangeText: (value) => {
                    handleOnInputChange(value);
                },
                onBlur: () => {
                },
                clearButtonMode: "never",
                // onSubmitEditing: () => {
                // },
                // autoFocus: true , 
                // showSoftInputOnFocus: true , d
                editable: true,
                selectTextOnFocus: true,
                // caretHidden: true,
                autoCapitalize: "none",
                autoCorrect: false,
                blurOnSubmit: true,
                value: locationVal,
            }}
            fetchDetails
            enablePoweredByContainer={false}
            styles={{
                container: {
                    position: "relative",
                    top: Platform.select({ ios: -5, android: -5 }),
                    width: "100%",
                    marginBottom: marginBottom,
                    borderWidth: 0,
                },
                textInputContainer: {
                    flex: 1,
                    backgroundColor: "transparent",
                    height: 50,
                    marginHorizontal: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    width: '95%',
                    alignSelf: 'center'
                },
                textInput: {
                    display: 'flex',
                    width: '90%',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: colors.lightGreyBorder,
                    paddingVertical: 0,
                    height: 40,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                    color: "#000",

                },
                description: {
                    fontSize: 16,
                },
                row: {
                    padding: 8,
                    height: 38,
                    flex: 1,
                    width: "100%",
                },

                predefinedPlacesDescription: {
                    color: '#1faadb',
                },
            }}
        />
    );
}
)

const styles = StyleSheet.create({

    iconStyleRight: {
        position: "absolute",
        right: 4,
        top: 18,
        width: 32,
        height: 50,
    },

    iconStyleLeft: {
        position: "absolute",
        right: 30,
        top: 18,
        width: 32,
        height: 50,
    },

    IcoImg: {
        width: 20,
        height: 20,
        zIndex: 8
    },
});