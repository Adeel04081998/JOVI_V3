import React, { useRef, useEffect, useState } from 'react'
import { ActivityIndicator, Appearance, Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { confirmServiceAvailabilityForLocation, sharedExceptionHandler, sharedStartingRegionPK } from '../../../helpers/SharedActions';
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
import Text from '../Text';
import TouchableScale from '../TouchableScale';


const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default (props) => {

  /******************************************* START OF VARIABLE INITIALIZATION **********************************/


  const FETCH_ADDRESS_TYPE = Object.freeze({ 0: "pin", 1: "selectedLocation" })

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
  const [loader, setLoader] = useState(false)
  const [region, setRegion] = useState(sharedStartingRegionPK)
  const disabledRef = useRef(false)



  /******************************************* END OF VARIABLE INITIALIZATION **********************************/






  /******************************************* START OF FUNCTIONS **********************************/


  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      if (props.route?.params?.latitude !== undefined && props.route?.params?.latitude !== null) {
        mapView?.current?.animateToRegion({
          latitude: props.route.params.latitude,
          longitude: props.route.params.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
        setPlaceName(props.route.params.title)
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
      // Toast.error("Location is either turned off or unresponsive!");
    }, {
      timeout: 3000,
    });
  };

  const onMapReady = (e) => {
    if (!ready) {
      setMapReady(true);
    }
  };

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const onRegionChange = (region) => {
    // setPlaceName('')
    if (!disabledRef.current) {
      disabledRef.current = false;
      forceUpdate();
    }
  };


  const onRegionChangeComplete = async (region) => {
    const { latitude, longitude } = region
    coordinatesRef.current = {
      latitude,
      longitude,
      type: FETCH_ADDRESS_TYPE[0]
    }
    disabledRef.current = false
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
console.log('placeName ==>>>>',placeName);

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
          onPress={() => props.onBackPress()}
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
            coordinatesRef.current = {
              latitude: lat,
              longitude: lng,
              type: FETCH_ADDRESS_TYPE[1]
            }
            mapView.current.animateToCoordinate({
              latitude: lat,
              longitude: lng
            }, 300);
            console.log('data',data);
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
  const disabledCheck = () => {
    if (disabledRef.current) return true
    else false
  }


  const cb = (loaderBool) => {
    disabledRef.current = false
    setLoader(loaderBool)
  }

  const FETCH_ADDRESSTYPE = () => {
    console.log('coordinatesRef.current?.type',coordinatesRef.current?.type);
    return coordinatesRef.current?.type === FETCH_ADDRESS_TYPE[1] ? true : false
  }
  console.log('FETCH_ADDRESSTYPE() ==>>>', FETCH_ADDRESSTYPE());
  const renderContinueButton = () => {
    return (
      <Button
        onPress={async () => {
          setLoader(true)
          if (disabledRef.current) {
            return;
          }
          disabledRef.current = true
          const { latitude, longitude, type } = coordinatesRef.current
          confirmServiceAvailabilityForLocation(postRequest, latitude || props.route?.params?.latitude, longitude || props.route?.params?.longitude,
            async (resp) => {
              console.log('resp ==>>>>', resp);
              const { data } = resp
              // let adrInfo = await addressInfo(latitude || props.route?.params?.latitude, longitude || props.route?.params?.longitude, cb)
              placeNameRef.current = data.googleAddressViewModel.title
              let placeObj = {
                title: FETCH_ADDRESSTYPE() ? placeName : placeNameRef.current,
                latitude: latitude || props.route?.params?.latitude,
                longitude: longitude || props.route?.params?.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                city: FETCH_ADDRESSTYPE() ? '' : data.googleAddressViewModel.city
              }
              cb(false)
              setPlaceName(FETCH_ADDRESSTYPE() ? placeName : placeNameRef.current)
              console.log('placeObj ==>>>>',placeObj);
              props.onConfirmLoc(placeObj)

            }, (error) => {
              setLoader(false)
              disabledRef.current = false
              sharedExceptionHandler(error)
            })

        }
        }
        wait={0}
        disabled={disabledCheck()}
        isLoading={loader}
        text="Confirm Location" style={{ ...styles.confirmBtn, width: '95%' }} />

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
  confirmBtn: { position: 'absolute', bottom: 15, borderRadius: 10 },
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
