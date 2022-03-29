import React from 'react'
import { Appearance } from 'react-native';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text'
import View from '../../components/atoms/View'
import Button from '../../components/molecules/Button';
import CustomHeader from '../../components/molecules/CustomHeader';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { topUpStyles } from './styles';


export default () => {
  const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
  const styles = topUpStyles(colors);
  const balance = 2500

  const renderHeader = () => {
    return (
      <CustomHeader
        rightIconName={'home'}
        rightContainerStyle={{
          backgroundColor: colors.white,
        }}
        rightIconColor={colors.primary}
        onRightIconPress={() => {
          NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
        }}
        title={`Wallet`}
        titleStyle={{
          fontFamily: FontFamily.Poppins.SemiBold,
          fontSize: 16,
        }}
        defaultColor={colors.primary}
      />
    )
  }

  const renderBalanceContainer = () => {
    return (
        <View style={styles.balanceContainer}>
            <Text style={styles.availableCreditText} fontFamily="PoppinsMedium" >
                Available Credit
            </Text>
            <Text style={styles.availableCreditAmount} fontFamily="PoppinsBold" >
                Rs. {`${balance}`}
            </Text>
        </View>
    )
}

const renderViewAllRow = () => {
  return (
      <View style={styles.viewAllRow} >
          <View style={{ flexDirection: 'row', alignItems: 'center',paddingVertical: 10 }} >
              <Text style={styles.recentActivityText} fontFamily="PoppinsSemiBold" >Top Up</Text>
          </View>
          {/* <TouchableScale>
              <Text style={styles.viewAllText} fontFamily="PoppinsSemiBold" >View All</Text>
          </TouchableScale> */}
      </View>
  )
}

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderBalanceContainer()}
      {renderViewAllRow()}
    </SafeAreaView>
  )
}