import React from 'react';
import { Animated, Appearance, FlatList, } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../../assets/svgs';
import FontFamily from '../../../../res/FontFamily';
import ENUMS from '../../../../utils/ENUMS';
import AnimatedFlatlist from '../../../molecules/AnimatedScrolls/AnimatedFlatlist';
import Button from '../../../molecules/Button';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import TouchableOpacity from '../../TouchableOpacity';
import View from '../../View';
export default ({ filterReducer = [], filterType = "", filterTypeStyle, styles, colors, }) => {
    console.log("colors=>", colors);

    console.log('filterReducer1233333 ', filterReducer);
    const cuisineAnimation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(cuisineAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.ease
        }).start();
      
    }, []);
   
    return (
        <AnimatedView style={{ marginHorizontal: 15,    }}>
            <Text style={filterTypeStyle}>{filterType}</Text>
           {/* <Button 
           text='click'
           onPress={()=>{ start()}}
           style={{bottom:120}}
           /> */}
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%', 
            
        }}>
                {

                    [...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer,
                    ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer,
                    ].map((x, i) => {
                        return <TouchableOpacity style={{  justifyContent:'center',
                            height:25, paddingHorizontal: 5, borderWidth: 1, borderColor: "#C1C1C1", borderRadius: 5, margin: 7, alignItems: 'center', backgroundColor: '#FFFFFF',
                            opacity:cuisineAnimation,
                            transform : [
                                {
                                    scale : cuisineAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.6, 1]
                                    })
                                    // scale:cuisineAnimation
                                }
                            ] 
                        }}
                            key={i} 
                            
                            >

                            <Text style={{ fontSize: 12, color: 'black', fontFamily: FontFamily.Poppins.Medium }}>
                                {/* {'Fast Food'} */}
                                {x.categoryName}
                            </Text>
                        </TouchableOpacity>
                    })
                }
            </View>






        </AnimatedView>





    )
}