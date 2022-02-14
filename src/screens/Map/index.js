import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Maps from '../../components/atoms/Maps';
import { addressInfo } from '../../helpers/Location';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';

export default (props) => {

  const { common_actions } = NavigationService.NavigationActions
  const onConfirmLoc = (placeName) => {
    props.route.params.onNavigateBack(placeName)
    common_actions.goBack()
  }

  return (
    <View style={{ flex: 1 }} >
      <Maps onConfirmLoc={onConfirmLoc} />
    </View>
  );
}
