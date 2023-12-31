import React from 'react';
import { Animated, Appearance, Easing, FlatList, } from 'react-native';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import TouchableOpacity from '../../TouchableOpacity';
import TouchableScale from '../../TouchableScale';
import View from '../../View';
export default ({ data = {}, filterType = "", filterTypeStyle, styles, colors, onPress, selectedFilter = {}, activeCusine = null, itemKeys = { id: 'categoryID', name: 'categoryName', }, }) => {
    let tagName = data.tagName ?? ""
    let categoriesData = data.categoriesList ?? []
    const cuisineAnimation = React.useRef(new Animated.Value(0)).current;
    React.useLayoutEffect(() => {
        if (categoriesData.length > 0) {
            setTimeout(() => {
                Animated.timing(cuisineAnimation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.ease
                }).start();
            }, 500);
        }

    }, [categoriesData]);

    return (
        <AnimatedView style={{ marginHorizontal: 15, }}>
            <Text style={filterTypeStyle} fontFamily='PoppinsRegular'>{tagName}</Text>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%', }}>
                {
                    categoriesData.map((x, i) => {
                        const isActive = activeCusine === x[itemKeys.id];
                        let borderColor = isActive ? colors.primary : "#C1C1C1"
                        let color = isActive ? colors.primary : "black"  
                        return <TouchableScale style={{
                            justifyContent: 'center', height: 25, borderWidth: 0.8, borderColor, borderRadius: 5, marginRight: 10, marginBottom: 10, alignItems: 'center', backgroundColor: '#FFFFFF',
                            transform: [{
                                scale: cuisineAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.6, 1]
                                })
                                // scaleX: cuisineAnimation
                            }]
                        }}
                            key={i}
                            onPress={() => { onPress(x, i) }}
                        >

                            <Text style={{ fontSize: 12, color, textAlign: 'center', paddingHorizontal: 10 }} fontFamily='PoppinsMedium'>{x[itemKeys.name]}</Text>
                        </TouchableScale>
                    })
                }
            </View>
        </AnimatedView>





    )
}