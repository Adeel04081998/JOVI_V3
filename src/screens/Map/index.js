import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Maps from '../../components/atoms/Maps';
import { addressInfo } from '../../helpers/Location';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';

export default () => {

  const { common_actions } = NavigationService.NavigationActions

  const onConfirmLoc = (placeName) => {
    console.log('placename',placeName);
    common_actions.navigate(ROUTES.APP_ROUTES.JoviJob.screen_name, placeName)
  }

  return (
    <View style={{ flex: 1 }} >
      <Maps
        onConfirmLoc={onConfirmLoc}
      />
    </View>
  );
}
