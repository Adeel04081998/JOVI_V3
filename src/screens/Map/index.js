import { View, Text, Appearance, BackHandler } from 'react-native';
import React, { useState } from 'react';
import Maps from '../../components/atoms/GoogleMaps/Maps';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import { useDispatch, useSelector } from 'react-redux';
import ReduxActions from "../../redux/actions/index";
import SafeAreaView from '../../components/atoms/SafeAreaView';
import theme from '../../res/theme';
import GV from '../../utils/GV';

let isFromEdit = false;
let lastLoc = {};
export default (props) => {
  const colors = props.route?.params?.colors ?? theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
  const dispatch = useDispatch();

  const updateFinalDestination = (fd) => {
    isFromEdit = true;
    lastLoc = fd;
  };//end of updateFinalDestination

  const onConfirmLoc = (finalDestObj) => {
    const applyLocation = props.route?.params?.applyLocation ?? true;

    if (props.route.params.index === 0) {

      props.route.params.onNavigateBack && props.route.params.onNavigateBack(finalDestObj.title);
      if (applyLocation) {
        dispatch(ReduxActions.setUserFinalDestAction({ finalDestObj }))
      }
      NavigationService.NavigationActions.common_actions.goBack();

    } else if (props.route.params.index === 1) {

      props.route.params.onNavigateBack && props.route.params.onNavigateBack(finalDestObj);
      NavigationService.NavigationActions.common_actions.goBack();
    }
    else if (props.route.params.index === 3 || props.route.params.index === 4) {
      NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, {
        finalDestObj: { ...finalDestObj, addressID: props.route?.params?.originalObjBeforeEdit?.addressID ?? finalDestObj?.addressID },
        updateFinalDestination,
        isFromEdit,
        index: props.route.params.index,
        applyLocation: props.route?.params?.applyLocation ?? true,
      })
    }
    else {
      if (applyLocation) {
        dispatch(ReduxActions.setUserFinalDestAction({ finalDestObj }))
      }
      NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, {
        finalDestObj,
        applyLocation: props.route?.params?.applyLocation ?? true,
      })
    }
  }

  React.useEffect(() => {
    const backAction = () => {
      onBackPress()
      return true
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const onBackPress = () => {
    if (isFromEdit) {
      NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, {
        finalDestObj: lastLoc,
        updateFinalDestination,
        isFromEdit,
        applyLocation: props.route?.params?.applyLocation ?? true,
      })
    } else {
      NavigationService.NavigationActions.common_actions.goBack();
    }
    isFromEdit = false;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
      <View style={{ flex: 1 }} >
        <Maps route={props.route} colors={colors} onConfirmLoc={onConfirmLoc} onBackPress={() => {
          onBackPress()
        }} />
      </View>
    </SafeAreaView>
  );
}
