import React from 'react';
import { Animated, Appearance, FlatList, } from 'react-native';
import FontFamily from '../../../../res/FontFamily';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import TouchableOpacity from '../../TouchableOpacity';
import View from '../../View';
export default ({ data = [], filterType = "", filterTypeStyle, styles, colors, onPress, selectedFilter = {} }) => {
    let tagName = data.tagName ?? ""
    let categoriesData = data.categoriesList ?? []
    const cuisineAnimation = React.useRef(new Animated.Value(0)).current;

    // React.useEffect(() => {
    //     Animated.timing(cuisineAnimation, {
    //         toValue: 1,
    //         duration: 500,
    //         useNativeDriver: true,
    //         easing: Easing.linear
    //     }).start();

    // }, []);

    return (
        <AnimatedView style={{ marginHorizontal: 15, }}>
            <Text style={filterTypeStyle} fontFamily='PoppinsRegular'>{tagName}</Text>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%', }}>
                {
                    categoriesData.map((x, i) => {
                        return <TouchableOpacity style={{
                            justifyContent: 'center', height: 25, paddingHorizontal: 5, borderWidth: 0.8, borderColor: selectedFilter.activeIndex === i ? colors.oldFlame : colors.navTextColor, borderRadius: 5, margin: 7, alignItems: 'center', backgroundColor: '#FFFFFF',
                            // transform: [{
                            //     scale : cuisineAnimation.interpolate({
                            //         inputRange: [0, 1],
                            //         outputRange: [0.6, 1]
                            //     })
                            //     scaleX: cuisineAnimation
                            // }]
                        }} key={i}
                            onPress={() => { onPress(x, i) }}
                        >
                            
                            <Text style={{ fontSize: 12, color: selectedFilter.activeIndex === i ? "#F94E41" : "balck",}} fontFamily='PoppinsMedium'>{x.categoryName}</Text>
                        </TouchableOpacity>
                    })
                }
            </View>
        </AnimatedView>





    )
}