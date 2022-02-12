import React, { useState, useEffect } from "react";
import { View, Platform, Text, Image, StyleSheet, Alert, TouchableOpacity, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SvgXml } from "react-native-svg";
import images from "../../assets/images";
import svgs from "../../assets/svgs";
import configs, { env } from "../../utils/configs";

export default LocationSearch = ({ handleOnInputChange, locationVal, index, clearInputField, textToShow, onLocationSelected, /* handleAddPitstop, */ handleDeletePitstop, isLast, handleInputFocused, totalPitstops, onSetFavClicked, isFavourite, marginBottom = 5, }) => {

    const locTextRef = React.createRef();

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
            // isRowScrollable

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
                // radius: 100
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
            textInputProps={{
                onFocus: () => {
                    handleInputFocused(index, false);
                },
                onChangeText: (value) => {
                    handleOnInputChange(value);
                    console.log('locTextRef.current', locTextRef.current);
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
                    width: '50%',
                    borderWidth: 1,
                    borderColor: "#BBBB",
                    borderRadius: 5,
                    paddingVertical: 0,
                    height: 40,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                    color: "#000",
                },
                listView: {
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
                    width: '90%',
                    alignSelf: 'center',
                    maxHeight: Dimensions.get("window").height * 0.2,
                    overflow: 'scroll'

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