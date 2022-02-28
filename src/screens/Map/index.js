import { View, Text, Appearance } from 'react-native';
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
  const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

  const dispatch = useDispatch();

  const updateFinalDestination = (fd) => {
    isFromEdit = true;
    lastLoc = fd;
  };//end of updateFinalDestination

  const onConfirmLoc = (finalDestObj) => {
    if (props.route.params.index === 0) {
      props.route.params.onNavigateBack && props.route.params.onNavigateBack(finalDestObj.title);
      dispatch(ReduxActions.setUserFinalDestAction({ finalDestObj }))
      NavigationService.NavigationActions.common_actions.goBack();
    } else if (props.route.params.index === 1) {
      props.route.params.onNavigateBack && props.route.params.onNavigateBack(finalDestObj);
      NavigationService.NavigationActions.common_actions.goBack();
    }
    else if (props.route.params.index === 3) {

      NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, {
        finalDestObj,
        updateFinalDestination,
      })
    } else {
      dispatch(ReduxActions.setUserFinalDestAction({ finalDestObj }))
      NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, {
        finalDestObj
      })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
      <View style={{ flex: 1 }} >
        <Maps route={props.route} onConfirmLoc={onConfirmLoc} onBackPress={() => {
          if (isFromEdit) {
            NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, {
              finalDestObj: lastLoc,
              updateFinalDestination,
            })
          } else {
            NavigationService.NavigationActions.common_actions.goBack();
          }
          isFromEdit = false;
        }} />
      </View>
    </SafeAreaView>
  );
}
