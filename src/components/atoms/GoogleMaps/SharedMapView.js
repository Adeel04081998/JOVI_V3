import React, { useRef, useEffect, useState } from 'react'
import { Appearance, Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
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
import LocationSearch from '../LocationSearch';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import CustomHeader from '../../molecules/CustomHeader';


const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default (props) => {

    /******************************************* START OF VARIABLE INITIALIZATION **********************************/

    console.log('props ==>>>', props);

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
    }, [ready]);



    /******************************************* END OF FUNCTIONS **********************************/




    /******************************************* START OF MARKER UI **********************************/



    const rendermarkers = () => {
        return (
            <VectorIcon name="map-marker"
                type="FontAwesome"
                style={styles.marker}
                size={40}
                color={colors.primary} />
        )
    }



    /******************************************* END OF MARKER UI **********************************/





    /******************************************* START OF MAP UI **********************************/




    const renderMap = () => {
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
                scrollEnabled={false}
                pitchEnabled={false}
                zoomEnabled={false}
            />
        )
    }



    /******************************************* END OF MAP UI **********************************/





    /******************************************* START OF CurrentLocation BUTTON UI **********************************/




    const renderCurrentLocationButton = () => {
        return (
            <TouchableOpacity onPress={getCurrentPosition} style={{ bottom: HEIGHT * 0.1, position: "absolute", right: 10, zIndex: 6 }} >
                <View style={styles.headerLeftIconView} >
                    <SvgXml style={{ alignSelf: 'center', marginTop: 1.5 }} xml={svgs.locateMeIcon()} height={18} width={18} />
                </View>
            </TouchableOpacity>
        )
    }



    /******************************************* END OF CurrentLocationButton BUTTON UI **********************************/






    /******************************************* START OF CONTINUE BUTTON UI **********************************/


    const renderContinueButton = () => {
        return (
            <Button
                onPress={() => props.onConfirmLoc(placeNameRef.current)}
                text="Confirm Location" style={styles.confirmBtn} />
        )
    }



    /******************************************* END OF CONTINUE BUTTON UI **********************************/


    const renderBackBtn = () => {
        return (
            <TouchableOpacity style={styles.backBtn} onPress={() => NavigationService.NavigationActions.common_actions.goBack()} >
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
        <View style={styles.container}>
            {rendermarkers()}
            {renderMap()}
            {props.showCurrentLocationBtn && renderCurrentLocationButton()}
            {props.showContinueBtn && renderContinueButton()}
            {renderBackBtn()}
        </View>
    )




    /******************************************* END OF MAIN UI **********************************/

}


/******************************************* START OF STYLES **********************************/



const mapStyles = (colors, height, width, props) => StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
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
        top: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40 / 2,
        left: 20
    }
});



/******************************************* END OF STYLES **********************************/
