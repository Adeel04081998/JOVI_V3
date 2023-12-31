import React, { useState, useEffect } from "react";
import { View, Platform, Text, Image, StyleSheet, Alert, TouchableOpacity, Dimensions, Appearance } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SvgXml } from "react-native-svg";
import images from "../../assets/images";
import svgs from "../../assets/svgs";
import constants from "../../res/constants";
import FontFamily from "../../res/FontFamily";
import theme from "../../res/theme";
import configs, { env } from "../../utils/configs";
import GV from "../../utils/GV";
import VectorIcon from "./VectorIcon";

export default LocationSearch = ({ handleOnInputChange, parentColors = null, index, clearInputField, textToShow, onLocationSelected, /* handleAddPitstop, */ handleDeletePitstop, isLast, handleInputFocused, totalPitstops, onSetFavClicked, isFavourite, marginBottom = 5, listViewStyles, inputStyles, placeholder = "Enter your location" }) => {

    const HEIGHT = constants.window_dimensions.height;
    const WIDTH = constants.window_dimensions.width;
    const colors = parentColors ?? theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = locationSearchStyles(colors, WIDTH, HEIGHT)
    const locTextRef = React.useRef(null);
    const textValRef = React.useRef(null);
    const [state, setState] = useState({ searchFocused: false });
    const { searchFocused } = state;

    const [placesState, setPlacesState] = useState({ show: true, predefinedPlaces: [] });
    const { show, predefinedPlaces } = placesState;

    useEffect(() => {
        locTextRef.current && locTextRef.current.setAddressText(textToShow ?? '');
    });

    const clearField = () => {
        locTextRef.current && locTextRef.current.clear();
        locTextRef.current && locTextRef.current.blur();
        handleInputFocused(null, true);
        if (clearInputField) {
            clearInputField()
        }
    }

    return (
        show &&
        <GooglePlacesAutocomplete
            ref={locTextRef}
            disableScroll={false}
            placeholder={placeholder}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            onPress={(data, { geometry }) => onLocationSelected(data, geometry, index, null)}
            query={{
                key: env.GOOGLE_API_KEY,
                language: "en",
                components: "country:pk",
                location: {
                    latitude: "",
                    longitude: ""
                }
            }}
            predefinedPlaces={predefinedPlaces.map((place, i) => ({ ...place, description: (place.description + Array(i).join(" ")) }))}
            predefinedPlacesAlwaysVisible={false}
            currentLocation={true}
            currentLocationLabel={"Nearby location..."}
            nearbyPlacesAPI="GooglePlacesSearch"
            GooglePlacesSearchQuery={{
                rankby: "distance", // "prominence" | "distance"
                type: "cafe"
            }}
            renderRow={(data) => {
                return (
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <SvgXml style={{ marginRight: 4 }} xml={data.isFavourite ? svgs.heartIconFilled() : svgs.pinIconDesc()} height={21} width={21} />
                        {(data.isPredefinedPlace && data.description !== "Nearby location...") ?
                            (data.isFavourite) ?
                                <SvgXml style={{ marginRight: 4 }} height={21} width={21} xml={
                                    data.addressType === 1 ?
                                        svgs.favHomeIcon("#7359be")
                                        :
                                        data.addressType === 2 ?
                                            svgs.favWorkIcon("#7359be")
                                            :
                                            data.addressType === 3 ?
                                                svgs.favFriendsIcon("#7359be")
                                                :
                                                data.addressType === 4 ?
                                                    svgs.favFamilyIcon("#7359be")
                                                    :
                                                    null
                                } />
                                :
                                null
                            :
                            null
                        }
                        <Text numberOfLines={1} style={{ color: "#000", fontSize: 16, fontFamily: FontFamily.Poppins.Regular }}>{(data.description || data.name)?.trim()?.replace(/\r|\n/gi, "")?.replace(/،/gi, ",")}</Text>
                    </View>
                );
            }}
            renderRightButton={
                () => {
                    if (locTextRef?.current?.isFocused() && locTextRef?.current?.getAddressText().length) {
                        return (
                            <View>
                                <TouchableOpacity style={styles.iconStyleRight} onPress={clearField}>
                                    <Image style={{ ...styles.IcoImg, transform: [{ rotate: '45deg' }] }} source={images.addIcon()} />
                                </TouchableOpacity>
                            </View>
                        )
                    } else return null
                }

            }
            renderLeftButton={
                () => {
                    return (
                        <TouchableOpacity style={{ ...styles.iconStyleLeft, alignItems: 'center', justifyContent: 'center' }} onPress={clearField}>
                            <VectorIcon name="search" type="Fontisto" style={{ ...styles.IcoImg, height: 21, width: 25, marginLeft: 15, zIndex: 9 }} size={20} color={colors.primary} />
                        </TouchableOpacity>
                    )
                }

            }
            textInputProps={{
                onFocus: () => {
                    handleInputFocused(index, false);
                },
                onChangeText: (value) => {
                    textValRef.current = value
                    locTextRef?.current?.setAddressText(value)
                    handleOnInputChange(value);

                },
                onBlur: () => {
                    handleInputFocused(index, true);
                },
                clearButtonMode: "never",
                autoFocus: false,
                editable: true,
                selectTextOnFocus: true,
                caretHidden: false,
                autoCapitalize: "none",
                autoCorrect: false,
                blurOnSubmit: true,
                selection: null,
                // value: locationVal
            }}
            listViewDisplayed={searchFocused}
            fetchDetails
            enableHighAccuracyLocation
            enablePoweredByContainer={false}
            styles={{
                container: {
                    width: "100%",
                    borderWidth: 0,
                },
                textInputContainer: {
                    backgroundColor: "transparent",
                    height: 50,
                    marginHorizontal: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    width: '95%',
                    alignSelf: 'center',
                },
                textInput: [inputStyles || {
                    borderWidth: 1,
                    borderColor: "#E6EAFA",
                    borderRadius: 6,
                    paddingVertical: 0,
                    height: 40,
                    marginBottom: 10,
                    paddingHorizontal: 40,
                    color: "#000",
                    zIndex: -1,
                    backgroundColor: "#F8F9FD",
                    fontFamily: FontFamily.Poppins.Regular
                }],

                listView: [listViewStyles || {
                    borderWidth: 1,
                    borderColor: "#BBBB",
                    backgroundColor: "#FFF",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,

                    elevation: 10,
                    width: WIDTH + 5,
                    maxHeight: HEIGHT * 0.4,
                    zIndex: 999,
                    position: 'absolute',
                    top: HEIGHT * 0.075,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    left: -WIDTH * 0.12,
                    numberOfLines: 1,
                }],
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


const locationSearchStyles = (color, width, height) => StyleSheet.create({

    iconStyleRight: {
        position: "absolute",
        right: 4,
        top: 20 / 2,
        width: 32,
        height: 50,
    },

    iconStyleLeft: {
        position: "absolute",
        left: 0,
        top: -3,
        width: 32,
        height: 50,
    },

    IcoImg: {
        width: 20,
        height: 20,
        zIndex: 8
    },
});