import React, { useRef, useEffect, useState } from 'react'
import { Appearance, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { sharedStartingRegionPK } from '../../../helpers/SharedActions';
import VectorIcon from '../VectorIcon';
import { addressInfo, hybridLocationPermission } from '../../../helpers/Location';
import Button from '../../molecules/Button';
import GV from '../../../utils/GV';
import theme from '../../../res/theme';
import svgs from '../../../assets/svgs';
import TouchableOpacity from '../TouchableOpacity';
import { SvgXml } from 'react-native-svg';
import constants from '../../../res/constants';
import Toast from '../Toast';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import CustomHeader from '../../molecules/CustomHeader';
import SafeAreaView from '../SafeAreaView';
import Directions from "react-native-maps-directions";
import { env } from "../../..//utils/configs/index";
import { useSelector } from "react-redux";
import { initColors } from '../../../res/colors';
import View from '../View';
import Text from '../Text';


const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const FINAL_DESTINATION_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="25.952" height="24.261" viewBox="0 0 25.952 24.261">
<g id="Group_7929" data-name="Group 7929" transform="translate(0.183)">
  <ellipse id="Ellipse_483" data-name="Ellipse 483" cx="6" cy="1.5" rx="6" ry="1.5" transform="translate(-0.183 21.261)" fill="#0d0d0d" opacity="0.38"/>
  <path id="Icon_awesome-flag-checkered" data-name="Icon awesome-flag-checkered" d="M11.046,8.463V11.5c1.163.263,2.2.7,3.281.994V9.453c-1.159-.259-2.2-.691-3.281-.99ZM21,2.981A13.016,13.016,0,0,1,15.784,4.4c-2.385,0-4.359-1.551-7.364-1.551a8.666,8.666,0,0,0-3.031.535A2.5,2.5,0,1,0,1.632,4.541v17.21a1.067,1.067,0,0,0,1.07,1.07h.713a1.067,1.067,0,0,0,1.07-1.07V17.543a12.428,12.428,0,0,1,5.1-.985c2.389,0,4.359,1.551,7.364,1.551a9.314,9.314,0,0,0,5.46-1.823,1.422,1.422,0,0,0,.615-1.177V4.273A1.424,1.424,0,0,0,21,2.981ZM7.766,14.508a14.043,14.043,0,0,0-3.281.74V12.105a12.752,12.752,0,0,1,3.281-.776Zm13.123-6a14.218,14.218,0,0,1-3.281,1.065v3.169a8.285,8.285,0,0,0,3.281-1.159V14.73a7.2,7.2,0,0,1-3.281,1.208V12.747a7.54,7.54,0,0,1-3.281-.25v3a26.007,26.007,0,0,0-3.281-.949V11.5a9.908,9.908,0,0,0-3.281-.169V8.209a15.73,15.73,0,0,0-3.281.932V6a12.765,12.765,0,0,1,3.281-.981V8.209a7.582,7.582,0,0,1,3.281.254v-3a25.376,25.376,0,0,0,3.281.949V9.457a8.491,8.491,0,0,0,3.281.12v-3.2a15.771,15.771,0,0,0,3.281-1Z" transform="translate(2.746 0.003)" fill="#272727"/>
</g>
</svg>`

export default (props) => {

    /******************************************* START OF VARIABLE INITIALIZATION **********************************/

    console.log('props ==>>>', props);
    const { showContinueBtn = false, selectFinalDestination = false,newFinalDestination=null, showCurrentLocationBtn = true, showMarker = false, showDirections = true } = props;

    const HEIGHT = constants.window_dimensions.height;
    const WIDTH = constants.window_dimensions.width;
    const ICON_BORDER = {
        color: "#E5E2F5",
        width: 0.5,
        size: 38,
        borderRadius: 6,
    };

    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const [placeName, setPlaceName] = useState('')
    const mapView = useRef(null)
    const placeNameRef = useRef(null)
    const [ready, setMapReady] = useState(false)
    const [region, setRegion] = useState(sharedStartingRegionPK)

    const styles = mapStyles(colors, HEIGHT, WIDTH, props)


    /******************************************* END OF VARIABLE INITIALIZATION **********************************/


    /******************************************* START OF FUNCTIONS **********************************/


    const getCurrentPosition = () => {

        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            if (props.latitude !== undefined && props.latitude !== null) {
                mapView?.current?.animateToRegion({
                    latitude: props.latitude,
                    longitude: props.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                });

            } else {
                mapView?.current?.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                });
            }

        }, (error) => {
            mapView.current && mapView.current.animateToRegion(sharedStartingRegionPK);
            Toast.error("Location is either turned off or unresponsive!");
        }, {
            timeout: 3000,
        });

    };

    const onMapReady = (e) => {
        if (!ready) {
            setMapReady(true);
        }
    };


    const onRegionChange = (region) => {
    };


    const onRegionChangeComplete = async (region) => {
        const { latitude, longitude } = region
        // let adrInfo = await addressInfo(latitude, longitude)
        // placeNameRef.current = adrInfo
        // setPlaceName(adrInfo)
    };

    useEffect(() => {
        const locationHandler = async () => {
            await hybridLocationPermission();
        }
        locationHandler();
        getCurrentPosition()
    }, [ready, props.latitude]);


    /******************************************* END OF FUNCTIONS **********************************/




    /******************************************* START OF MARKER UI **********************************/



    const rendermarkers = () => {
        if (showMarker) {
            return (
                <SvgXml xml={svgs.pinMap()}
                    style={styles.marker}
                />

            )
        } else return null;
    }



    /******************************************* END OF MARKER UI **********************************/





    /******************************************* START OF MAP UI **********************************/




    const renderMap = () => {
        const { cartReducer, userReducer } = useSelector(store => store);
        console.log("[renderMap].cartReducer", cartReducer);
        console.log("[renderMap].userReducer", userReducer);
        const pitstops = [...cartReducer.pitstops, { ...userReducer.finalDestObj, isFinalDestination: true }];
        const origin = { latitude: 33.6685534, longitude: 73.0727673 };
        const destination = { latitude: 33.64770, longitude: 73.03891 };
        return (

            <MapView
                ref={mapView}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                initialRegion={sharedStartingRegionPK}
                onMapReady={onMapReady}
                onMapLoaded={() => {
                    setMapReady(true)
                }}
                onRegionChange={onRegionChange}
                onRegionChangeComplete={onRegionChangeComplete}
                onPress={props.onMapPress}
                showsUserLocation={true}
                showsMyLocationButton={false}
                zoomControlEnabled={false}
                showsCompass={false}
                scrollEnabled={true}
                pitchEnabled={true}
                zoomEnabled={true}
                {...props}
                onLayout={(layout) => {
                    console.log("mapView.current", mapView.current.fitToCoordinates);
                    if(!selectFinalDestination){
                        mapView?.current?.fitToCoordinates(pitstops.map((_p, i) => ({ latitude: _p.latitude, longitude: _p.longitude })))
                    }
                }}

            >
                {
                    selectFinalDestination ? <View>
                        <Marker identifier={`marker `} key={`marker-key`} coordinate={{ ...(newFinalDestination ?? userReducer.finalDestObj) }} anchor={{ x: 0.20, y: 0.9 }}>
                            <View>
                                <SvgXml xml={FINAL_DESTINATION_SVG} height={35} width={35} />
                            </View>
                        </Marker>
                    </View>
                        : null
                }
                {!selectFinalDestination ?
                    (pitstops || []).map((pitstop, index) => {
                        return <View>
                            <Marker identifier={`marker ${index + 1}`} key={`marker-key${index + 1}`} coordinate={pitstop} anchor={{ x: 0.46, y: 0.7 }}>
                                {
                                    pitstop.isFinalDestination ? <View>
                                        <SvgXml xml={FINAL_DESTINATION_SVG} height={35} width={35} />
                                    </View>
                                        :
                                        <View style={{
                                            backgroundColor: "#fff",
                                            borderRadius: 10,
                                            width: 30,
                                            height: 30,
                                            shadowColor: '#7359BE',
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            borderWidth: 2,
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5,
                                            borderColor: initColors.primary
                                        }}>
                                            <Text style={{
                                                paddingVertical: 2.5,
                                                fontWeight: "bold",
                                                alignSelf: "center",
                                                fontSize: 16,
                                                color: initColors.primary
                                            }}>{index + 1}</Text>
                                        </View>
                                }
                            </Marker>
                            <Directions
                                key={index}
                                {
                                ...pitstop.isFinalDestination ? {
                                    origin: pitstops[index - 1],
                                    destination: { ...userReducer.finalDestObj }
                                } : {
                                    origin: pitstops[index],
                                    destination: pitstops[index + 1]
                                }
                                }
                                apikey={env.GOOGLE_API_KEY}
                                strokeWidth={3.5}
                                strokeColor={initColors.primary}
                                optimizeWaypoints={false}
                                mode="DRIVING"
                                // strokeColors={["#000"]}
                                // origin={origin}
                                // destination={destination}
                                // waypoints={[origin, destination]}
                                onStart={(param) => console.log("param", param)}
                                onReady={(param) => console.log("param", param)}
                                onError={(error) => console.log("[Directions].error", error)}
                            />
                        </View>
                    })
                    :
                    null
                }
            </MapView>
        )
    }



    /******************************************* END OF MAP UI **********************************/





    /******************************************* START OF CurrentLocation BUTTON UI **********************************/




    const renderCurrentLocationButton = () => {
        if (showCurrentLocationBtn) {
            return (
                <TouchableOpacity onPress={getCurrentPosition} style={{ bottom: HEIGHT * 0.03, position: "absolute", right: 20, zIndex: 6 }} >
                    <View style={styles.headerLeftIconView} >
                        <SvgXml style={{ alignSelf: 'center', marginTop: 1.5 }} xml={svgs.locateMeIcon()} height={18} width={18} />
                    </View>
                </TouchableOpacity>
            )
        } else return null;
    }



    /******************************************* END OF CurrentLocationButton BUTTON UI **********************************/






    /******************************************* START OF CONTINUE BUTTON UI **********************************/


    const renderContinueButton = () => {
        if (showContinueBtn) {
            return (
                <Button
                    onPress={() => props.onConfirmLoc(placeNameRef.current)}
                    text="Confirm Location" style={styles.confirmBtn} />
            )
        } else return null;
    }



    /******************************************* END OF CONTINUE BUTTON UI **********************************/


    const renderBackBtn = () => {
        return (
            <TouchableOpacity style={styles.backBtn} onPress={() => {
                if (props.onBackPress) {
                    props.onBackPress();
                } else {
                    NavigationService.NavigationActions.common_actions.goBack()
                }
            }} >
                <VectorIcon
                    name={"keyboard-backspace"}
                    type={"MaterialIcons"}
                    color={colors.black}
                    size={30} />
            </TouchableOpacity>
        )
    }


    /******************************************* START OF MAIN UI **********************************/




    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* {rendermarkers()} */}
                {renderMap()}
                {renderCurrentLocationButton()}
                {renderContinueButton()}
                {renderBackBtn()}
            </View>
        </SafeAreaView>
    )




    /******************************************* END OF MAIN UI **********************************/

}


/******************************************* START OF STYLES **********************************/



const mapStyles = (colors, height, width, props) => StyleSheet.create({
    container: {
        // ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        height: props.mapHeight || null,
    },
    marker: {
        zIndex: 3,
        position: 'absolute',
        marginTop: -37,
        marginLeft: -11,
        left: '50%',
        top: '50%',
        ...props.markerStyle

    },
    confirmBtn: { position: 'absolute', bottom: 0, borderRadius: 0 },
    headerLeftIconView: {
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        width: 38,
        height: 38,
        borderRadius: 10,
        elevation: 4
    },
    backBtn: {
        backgroundColor: '#fff',
        height: 40,
        width: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        position: 'absolute',
        top: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40 / 2,
        left: 10
    }
});



/******************************************* END OF STYLES **********************************/
