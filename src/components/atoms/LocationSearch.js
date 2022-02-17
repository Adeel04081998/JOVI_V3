import React, { useState, useEffect } from "react";
import { View, Platform, Text, Image, StyleSheet, Alert, TouchableOpacity, Dimensions, Appearance } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SvgXml } from "react-native-svg";
import images from "../../assets/images";
import svgs from "../../assets/svgs";
import constants from "../../res/constants";
import theme from "../../res/theme";
import configs, { env } from "../../utils/configs";
import GV from "../../utils/GV";
import VectorIcon from "./VectorIcon";

export default LocationSearch = ({ handleOnInputChange, locationVal, index, clearInputField, textToShow, onLocationSelected, /* handleAddPitstop, */ handleDeletePitstop, isLast, handleInputFocused, totalPitstops, onSetFavClicked, isFavourite, marginBottom = 5, }) => {

    const HEIGHT = constants.window_dimensions.height;
    const WIDTH = constants.window_dimensions.width;
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

    const [state, setState] = useState({ searchFocused: false });
    const { searchFocused } = state;

    const [placesState, setPlacesState] = useState({ show: true, predefinedPlaces: [] });
    const { show, predefinedPlaces } = placesState;


    useEffect(() => {
        const loadPredefinedPlaces = async () => {
            // if (true) {
            //     // const predefinedPlaces = await AsyncStorage.getItem("customerOrder_predefinedPlaces");
            //     if (predefinedPlaces) {
            //         setPlacesState({ show: true, predefinedPlaces: JSON.parse(predefinedPlaces) });
            //     }
            //     else {
            //         setPlacesState({ show: true, predefinedPlaces: [] });
            //     }
            // }
        }
        // loadPredefinedPlaces();
    }, []);
    const clearField = () => {
        clearInputField()
        handleInputFocused(null, true);
    }
    return (
        show &&

        // <GooglePlacesAutocomplete
        //     c       
        // />
        <GooglePlacesAutocomplete
            disableScroll={false}
            placeholder={"Enter a pitstop location"}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            autoFocus
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
            currentLocation={true}
            predefinedPlacesAlwaysVisible={false}
            currentLocationLabel="Nearby Locations..."
            nearbyPlacesAPI="GooglePlacesSearch"
            GooglePlacesSearchQuery={{
                rankby: "distance", // "prominence" | "distance"
                type: "cafe"
            }}
            renderRow={(data) => {
                return (
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <SvgXml style={{ marginRight: 4 }} xml={data.isFavourite ? svgs.heartIconFilled() : svgs.pinIconDesc()} height={21} width={21} />
                        {(data.isPredefinedPlace && data.description !== "Nearby Locations...") ?
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
                        <Text numberOfLines={1} style={{ color: "#000", fontSize: 16 }}>{(data.description || data.name)?.trim()?.replace(/\r|\n/gi, "")?.replace(/،/gi, ",")}</Text>
                    </View>
                );
            }}
            renderRightButton={
                () => {
                    return (
                        <View>
                            <TouchableOpacity style={styles.iconStyleRight} onPress={clearField}>
                                <Image style={{ ...styles.IcoImg, transform: [{ rotate: '45deg' }] }} source={images.addIcon()} />
                            </TouchableOpacity>
                        </View>
                    )
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
                    handleOnInputChange(value);
                },
                onBlur: () => {
                    handleInputFocused(index, true);
                },
                clearButtonMode: "never",
                autoFocus: false,
                showSoftInputOnFocus: true,
                editable: true,
                selectTextOnFocus: true,
                caretHidden: false,
                autoCapitalize: "none",
                autoCorrect: false,
                blurOnSubmit: true,
                selection: null,
                value: locationVal
            }}
            listViewDisplayed={searchFocused}
            fetchDetails
            enableHighAccuracyLocation
            enablePoweredByContainer={false}
            styles={{
                container: {
                    alignSelf: 'flex-end',
                    width: "100%",
                    marginBottom: marginBottom,
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
                textInput: {
                    borderWidth: 1,
                    borderColor: "#E6EAFA",
                    borderRadius: 5,
                    paddingVertical: 0,
                    height: 40,
                    marginBottom: 10,
                    paddingHorizontal: 40,
                    color: "#000",
                    zIndex: -1,
                    backgroundColor: "#F8F9FD",
                },

                listView: {
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
                    width: WIDTH,
                    maxHeight: HEIGHT * 0.4,
                    zIndex: 999,
                    position: 'absolute',
                    top: 50,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    left: -48,
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


const styles = StyleSheet.create({

    iconStyleRight: {
        position: "absolute",
        right: 4,
        top: 10,
        width: 32,
        height: 50,
    },

    iconStyleLeft: {
        position: "absolute",
        left: 0,
        top: -5,
        width: 32,
        height: 50,
    },

    IcoImg: {
        width: 20,
        height: 20,
        zIndex: 8
    },
});