import React, { useRef, useEffect, useState } from 'react'
import { Appearance, Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { confirmServiceAvailabilityForLocation, sharedStartingRegionPK } from '../../../helpers/SharedActions';
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
import SafeAreaView from '../SafeAreaView';
import { postRequest } from '../../../manager/ApiManager';


const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default (props) => {

  /******************************************* START OF VARIABLE INITIALIZATION **********************************/



  const HEIGHT = constants.window_dimensions.height;
  const WIDTH = constants.window_dimensions.width;
  const ICON_BORDER = {
    color: "#E5E2F5",
    width: 0.5,
    size: 40,
    borderRadius: 6,
  };

  const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
  const [placeName, setPlaceName] = useState('')
  const mapView = useRef(null)
  const placeNameRef = useRef(null)
  const coordinatesRef = useRef(null)
  const [ready, setMapReady] = useState(false)
  const [region, setRegion] = useState(sharedStartingRegionPK)
  const disabledRef = useRef(false)



  /******************************************* END OF VARIABLE INITIALIZATION **********************************/






  /******************************************* START OF FUNCTIONS **********************************/


  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      mapView?.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
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
    // setPlaceName('')
  };


  const onRegionChangeComplete = async (region) => {
    const { latitude, longitude } = region
    coordinatesRef.current = {
      latitude,
      longitude
    }

  };

  useEffect(() => {
    const locationHandler = async () => {
      await hybridLocationPermission();
    }
    locationHandler();
    getCurrentPosition()
  }, [ready]);



  /******************************************* END OF FUNCTIONS **********************************/





  /******************************************* START OF LOCATION SEARCH UI **********************************/


  const renderLocationSearchUI = () => {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        height: HEIGHT * 0.08,
        width: WIDTH,
        backgroundColor: colors.white,
        flexDirection: 'row',
        zIndex: 10,
        borderBottomWidth: 3,
        borderBottomColor: colors.primary,
        justifyContent: 'center',
        paddingTop: WIDTH * 0.0085,
        paddingLeft: 5
      }}>
        <TouchableOpacity
          onPress={() => NavigationService.NavigationActions.common_actions.goBack()}
          style={{
            height: ICON_BORDER.size,
            width: ICON_BORDER.size,
            borderColor: ICON_BORDER.color,
            borderWidth: ICON_BORDER.width,
            borderRadius: ICON_BORDER.borderRadius,
            // alignSelf: Platform.OS === "android" ? "center" : 'flex-end',
            alignItems: "center",
            justifyContent: "center",
            // marginVertical: Platform.OS === "android" ? 0 : 11,
            // marginLeft: 10,
          }}>
          <VectorIcon
            name={"chevron-back"}
            type={"Ionicons"}
            color={colors.primary}
            size={30} />
        </TouchableOpacity>
        <LocationSearch
          index={0}
          onLocationSelected={(data, geometry) => {
            const { lat, lng } = geometry.location
            mapView.current.animateToCoordinate({
              latitude: lat,
              longitude: lng
            }, 300);
            setPlaceName(data.name ? data.name : data.description)
          }}
          handleOnInputChange={(text) => {
          }}
          onNearbyLocationPress={() => { }}
          handleInputFocused={(index, isFocus) => { }}
          onSetFavClicked={() => { }}
          textToShow={placeName}
          isFavourite={''}
          marginBottom={0}
          clearInputField={() => { setPlaceName('') }}
        />
      </View>
    )
  }


  /******************************************* END OF LOCATION SEARCH UI **********************************/





  /******************************************* START OF MARKER UI **********************************/



  const rendermarkers = () => {
    return (
      <SvgXml xml={svgs.pinMap()}
        style={styles.marker}
      />
    )
  }



  /******************************************* END OF MARKER UI **********************************/





  /******************************************* START OF MAP UI **********************************/




  const renderMap = () => {
    return (
      <MapView
        ref={mapView}
        // region={region}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={sharedStartingRegionPK}
        onMapReady={onMapReady}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={false}
        // followsUserLocation={true}
        zoomControlEnabled={false}
        zoomEnabled={true}
        showsCompass={false}
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
        onPress={async () => {
          const { latitude, longitude } = coordinatesRef.current
          disabledRef.current = true
          confirmServiceAvailabilityForLocation(postRequest, latitude, longitude,
            async (resp) => {
              disabledRef.current = false
              let adrInfo = await addressInfo(latitude, longitude)
              placeNameRef.current = adrInfo.address
              setPlaceName(adrInfo.address)
              let placeObj = {
                title: placeNameRef.current,
                latitude,
                longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                city: adrInfo.city
              }
              props.onConfirmLoc(placeObj)

            }, (error) => {
              console.log(((error?.response) ? error.response : {}), error);
              if (error?.data?.statusCode === 417) {
                if (error.areaLock) { } else {
                  disabledRef.current = false
                  error?.data?.message && Toast.error(error?.data?.message);
                }
              }
              else {
                disabledRef.current = false
                Toast.error('An Error Occurred!');
              }
            })

        }
        }
        disabled={disabledRef.current}
        text="Confirm Location" style={styles.confirmBtn} />
    )
  }



  /******************************************* END OF CONTINUE BUTTON UI **********************************/





  /******************************************* START OF MAIN UI **********************************/




  return (
    <View style={styles.container}>
      {renderLocationSearchUI()}
      {rendermarkers()}
      {renderMap()}
      {renderCurrentLocationButton()}
      {renderContinueButton()}
    </View>
  )




  /******************************************* END OF MAIN UI **********************************/

}


/******************************************* START OF STYLES **********************************/



const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1
  },
  marker: {
    zIndex: 3,
    position: 'absolute',
    marginTop: -37,
    marginLeft: -11,
    left: '50%',
    top: '50%'
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
});



/******************************************* END OF STYLES **********************************/
