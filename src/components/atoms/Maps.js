import React, { useRef, useEffect, useState } from 'react'
import { Alert, Appearance, Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { sharedStartingRegionPK } from '../../helpers/SharedActions';
import VectorIcon from './VectorIcon';
import Geolocation from 'react-native-geolocation-service';
import { addressInfo, hybridLocationPermission } from '../../helpers/Location';
import Button from '../molecules/Button';
import GV from '../../utils/GV';
import theme from '../../res/theme';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default (props) => {
  const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
  const mapView = useRef(null)
  const [placeName, setPlaceName] = useState('')
  const [ready, setMapReady] = useState(true)
  const [currentPos, setCurrentPos] = useState({})


  const setRegion = (region) => {
    if (ready) {
      setTimeout(() => mapView.current.animateToRegion(region), 100);
    }
  }

  const getCurrentPosition = () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('position ==>>>', position);
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          setRegion(region);
          setCurrentPos(region)
        },
        (error) => {
          //TODO: better design
          switch (error.code) {
            case 1:
              if (Platform.OS === "ios") {
                console.log('error1', error);
              } else {
                console.log('error2', error);
              }
              break;
            default:
              console.log('error3', error);
          }
        }
      );
    } catch (e) {
      Alert.alert(e.message || "");
    }
  };

  const onMapReady = (e) => {
    if (!ready) {
      setMapReady(true);
    }
  };

  const onRegionChange = (region) => {
    console.log('onRegionChange', region);
  };


  const onRegionChangeComplete = async (region) => {
    const { latitude, longitude } = region
    let adrInfo = await addressInfo(latitude, longitude)
    setPlaceName(adrInfo)
  };



  useEffect(() => {
    const locationHandler = async () => {
      await hybridLocationPermission();
    }
    locationHandler();
    getCurrentPosition()
  }, []);
  console.log('currentPos', currentPos);
  return (
    <View style={styles.container}>
      <VectorIcon name="map-marker"
        type="FontAwesome"
        style={styles.marker}
        size={40}
        color={colors.primary} />
      <MapView
        ref={mapView}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={sharedStartingRegionPK}
        // region={currentPos}
        onMapReady={onMapReady}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
      </MapView>
      <Button
        onPress={() => props.onConfirmLoc(placeName)}
        text="Confirm Location" style={styles.confirmBtn} />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    zIndex: 3,
    position: 'absolute',
    marginTop: -37,
    marginLeft: -11,
    left: '50%',
    top: '50%'
  },
  confirmBtn: { position: 'absolute', bottom: 0, borderRadius: 0 }
});
