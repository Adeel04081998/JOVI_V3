import React from 'react';
import { Animated, Appearance, StyleSheet } from 'react-native';
import View from '../../components/atoms/View';
import { renderFile } from '../../helpers/SharedActions';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import GotoCartButton from '../RestaurantProductMenu/components/GotoCartButton';
import { ProductDummyData2 } from '../RestaurantProductMenu/components/ProductDummyData';
import RestaurantProductMenuHeader from '../RestaurantProductMenu/components/RestaurantProductMenuHeader';

import { itemStylesFunc, sectionHeaderStylesFunc, stylesFunc } from './styles';

const WINDOW_HEIGHT = constants.window_dimensions.height;

export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.RESTAURANT, Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);

    const sectionHeaderStyles = sectionHeaderStylesFunc(colors);
    const itemStyles = itemStylesFunc(colors);

    // #region :: ANIMATION START's FROM HERE 
    const animScroll = React.useRef(new Animated.Value(0)).current
    const [headerHeight, setHeaderHeight] = React.useState(WINDOW_HEIGHT * 0.7);

    const headerTop = animScroll.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight + 20)],
        extrapolate: "clamp",
        useNativeDriver: true
    });

    const tabTop = animScroll.interpolate({
        inputRange: [0, headerHeight + 20],
        outputRange: [headerHeight + 20, 0],
        extrapolate: "clamp",
        useNativeDriver: true
    });

    // #endregion :: ANIMATION END's FROM HERE 


    return (
        <View style={styles.primaryContainer}>

            {/* ****************** Start of UPPER HEADER TILL RECENT ORDER ****************** */}
            <Animated.View style={{
                ...StyleSheet.absoluteFill,
                transform: [{
                    translateY: headerTop
                }],
            }}>
                {/* RECENT ORDER IS ALSO IN PRODUCT MENU HEADER */}
                <RestaurantProductMenuHeader colors={colors}
                    onLayout={(e) => {
                        setHeaderHeight(e.nativeEvent.layout.height);
                    }}
                    item={{
                        image: { uri: renderFile(ProductDummyData2.productsAndDealsV2.pitstopImage) },
                        distance: ProductDummyData2.productsAndDealsV2.distance,
                        time: ProductDummyData2.productsAndDealsV2.time,
                        title: ProductDummyData2.productsAndDealsV2.pitstopName,
                        description: ProductDummyData2.productsAndDealsV2.pitstopTag,
                    }}
                />
            </Animated.View>

            {/* ****************** End of UPPER HEADER TILL RECENT ORDER ****************** */}



            <GotoCartButton colors={colors}/>

        </View>
    )
};//end of EXPORT DEFAULT

