import { View, Text } from 'react-native'
import React from 'react'
import constants from '../../../res/constants'
import { initColors } from '../../../res/colors';
const DATA = [{title: "Browsing"},{title: "Cart"},{title: "Checkout"}];
const CIRCLE_HEIGHT = 20;
export default (props) => {
const {styles} = props;
const {width, height} = constants.screen_dimensions;
const colors = initColors;
return (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      {
          DATA.map((p, i) => (
              <React.Fragment key={`progress-key-${i}`}>                  
              <View style={{width: width /5, backgroundColor: colors.primary, paddingVertical: 2}} />
              <View style={{height: CIRCLE_HEIGHT, width: CIRCLE_HEIGHT, borderRadius: CIRCLE_HEIGHT/ 2, borderWidth: 3, borderColor: colors.primary}}  />
              </React.Fragment>
          ))
      }
              <View style={{width, backgroundColor: colors.primary, paddingVertical: 2}} />
    </View>
  )
}