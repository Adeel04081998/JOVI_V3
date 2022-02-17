import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Maps from '../../components/atoms/GoogleMaps/Maps';
import { addressInfo } from '../../helpers/Location';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import { useDispatch, useSelector } from 'react-redux';
import ReduxActions from "../../redux/actions/index";

export default (props) => {

  const dispatch = useDispatch();

  const onConfirmLoc = (finalDestObj) => {
    if (props.route.params.index === 3) {
      dispatch(ReduxActions.setUserFinalDestAction({ finalDestObj }))
      NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.AddAddress.screen_name, {
        finalDestObj
      })
    } else {
      props.route.params.onNavigateBack && props.route.params.onNavigateBack(finalDestObj.placeName);
      dispatch(ReduxActions.setUserFinalDestAction({ finalDestObj }))
      NavigationService.NavigationActions.common_actions.goBack();
    }
  }

  return (
    <View style={{ flex: 1 }} >
      <Maps onConfirmLoc={onConfirmLoc} />
    </View>
  );
}
