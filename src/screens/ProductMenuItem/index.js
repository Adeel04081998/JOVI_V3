import lodash from 'lodash'; // 4.0.8
import React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import CustomHeader from '../../components/molecules/CustomHeader';
import { getKeyByValue } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';
import { stylesFunc } from './styles';

const WINDOW_WIDTH = constants.screen_dimensions.width;

export default ({ navigation, route }) => {
    // #region :: ROUTE PARAM's START's FROM HERE 
    const pitstopType = route?.params?.pitstopType??PITSTOP_TYPES.JOVI;
  
    // #endregion :: ROUTE PARAM's END's FROM HERE 

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[getKeyByValue(PITSTOP_TYPES,pitstopType)], Appearance.getColorScheme() === "dark");
    console.log('colorscolorscolorscolors ,  ',colors);
    console.log('getKeyByValue(PITSTOP_TYPES,pitstopType) ',getKeyByValue(PITSTOP_TYPES,pitstopType));
    const styles = stylesFunc(colors);

    // #endregion :: STYLES & THEME END's FROM HERE 


   

    return (
        <SafeAreaView style={styles.primaryContainer}>

            {/* ****************** Start of HEADER ****************** */}
            <CustomHeader
                hideFinalDestination
                rightIconName={null}
                leftIconName="chevron-back"
                onLeftIconPress={()=>{
                    NavigationService.NavigationActions.common_actions.goBack();
                }}
                leftIconColor={colors.primary}
                leftContainerStyle={{ backgroundColor: colors.white, }}
                containerStyle={{
                    backgroundColor: colors.white,
                    borderBottomColor:colors.primary,
                }}
                title={headerTitle}
                titleStyle={{
                    color: colors.primary,
                }}
            />

            {/* ****************** End of HEADER ****************** */}

        </SafeAreaView>
    )
};//end of EXPORT DEFAULT

