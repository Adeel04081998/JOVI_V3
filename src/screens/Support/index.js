import * as React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { stylesFunc } from './styles';

const WINDOW_WIDTH = constants.window_dimensions.width;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = { ...stylesFunc(colors), };
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE & REF's START's FROM HERE 
    // #endregion :: STATE & REF's END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView>
                <CustomHeader
                    renderLeftIconAsDrawer
                    title={`Support`}
                    rightIconName={null}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: UI START's FROM HERE 
    return (
        <View style={{ ...styles.primaryContainer, }}>
            {_renderHeader()}

        </View>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT
