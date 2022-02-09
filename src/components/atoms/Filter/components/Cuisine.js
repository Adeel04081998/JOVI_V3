import React from 'react';
import { Animated, Appearance, Easing, FlatList, } from 'react-native';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import TouchableOpacity from '../../TouchableOpacity';
import View from '../../View';
export default ({ data = {}, filterType = "", filterTypeStyle, styles, colors, onPress, selectedFilter = {}, activeCusine = null }) => {
    let tagName = data.tagName ?? ""
    let categoriesData = data.categoriesList ?? []
    const cuisineAnimation = React.useRef(new Animated.Value(0)).current;
    React.useLayoutEffect(() => {
        console.log('Categories',categoriesData)
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
                        const isActive = activeCusine === x.categoryID;
                        let borderColor = isActive ? "#F3B8B4" : "#C1C1C1"
                        let color = isActive ? "#F94E41" : "black"
                        return <TouchableOpacity style={{
                            justifyContent: 'center', height: 25, paddingHorizontal: 5, borderWidth: 0.8, borderColor, borderRadius: 5,marginRight:10,marginBottom:10, alignItems: 'center', backgroundColor: '#FFFFFF',
                            transform: [{
                                scale: cuisineAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.6, 1]
                                })
                                // scaleX: cuisineAnimation
                            }]
                        }}
                            key={i}
                            onPress={() => { onPress(x,i) }}
                        >

                            <Text style={{ fontSize: 12, color, }} fontFamily='PoppinsMedium'>{x.categoryName}</Text>
                        </TouchableOpacity>
                    })
                }
            </View>
        </AnimatedView>





    )
}