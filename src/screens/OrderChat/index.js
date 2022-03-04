import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Appearance, SafeAreaView, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../assets/svgs';
import Image from '../../components/atoms/Image';
import Text from '../../components/atoms/Text';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { headerStyles, stylesFunc } from './styles';

const HEADER_ICON_SIZE_LEFT = CustomHeaderIconBorder.size * 0.7;
const HEADER_ICON_SIZE_RIGHT = CustomHeaderIconBorder.size * 0.6;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);
    const customheaderStyles = { ...CustomHeaderStyles(colors.primary), ...headerStyles };
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView style={customheaderStyles.primaryContainer}>
                <CustomHeader
                    containerStyle={customheaderStyles.containerStyle}
                    leftCustom={(
                        <TouchableScale wait={0}
                            style={customheaderStyles.iconContainer}>
                            <SvgXml xml={svgs.order_chat_header_location(colors.primary)} height={HEADER_ICON_SIZE_LEFT} width={HEADER_ICON_SIZE_LEFT} />
                        </TouchableScale>
                    )}
                    rightCustom={(
                        <TouchableScale wait={0} style={customheaderStyles.iconContainer}>
                            <SvgXml xml={svgs.order_chat_header_receipt(colors.primary)} height={HEADER_ICON_SIZE_RIGHT} width={HEADER_ICON_SIZE_RIGHT} />
                        </TouchableScale>
                    )}
                    centerCustom={() => (
                        <View style={customheaderStyles.imageNameContainer}>
                            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }} style={customheaderStyles.image} tapToOpen={false} />
                            <Text fontFamily='PoppinsSemiBold' style={customheaderStyles.name} numberOfLines={1}>{`Hassan Raza`}</Text>
                        </View>
                    )}
                    defaultColor={colors.primary}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: STATE's & REF's START's FROM HERE 
    const [query, updateQuery] = React.useState({
        data: [],
        isLoading: false,
        error: false,
        errorText: '',
        refreshing: false,
    });

    // #endregion :: STATE's & REF's END's FROM HERE 

    // #region :: LOADING AND ERROR UI START's FROM HERE 
    if (query.isLoading) {
        return <View style={styles.primaryContainer}>
            {_renderHeader()}
            <AnimatedLottieView
                source={require('../../assets/gifs/Processingloading.json')}
                autoPlay
                loop
                style={{
                    height: '100%',
                    width: "100%",
                    alignSelf: "center",
                    marginTop: 10,
                    marginBottom: 15,
                }}
            />
        </View>
    }

    // #endregion :: LOADING AND ERROR UI END's FROM HERE 

    return (
        <View style={styles.primaryContainer}>
            {_renderHeader()}

        </View>
    )
};//end of EXPORT DEFAULT
