import React from 'react';
import { Appearance, FlatList, } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../../assets/svgs';
import FontFamily from '../../../../res/FontFamily';
import ENUMS from '../../../../utils/ENUMS';
import AnimatedFlatlist from '../../../molecules/AnimatedScrolls/AnimatedFlatlist';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import TouchableOpacity from '../../TouchableOpacity';
import View from '../../View';
export default ({ filterReducer = [], filterType = "", filterTypeStyle, styles, colors, }) => {
    console.log("colors=>", colors);

    console.log('filterReducer1233333 ', filterReducer);
    return (
        <AnimatedView style={{ marginHorizontal: 15, }}>
            <Text style={filterTypeStyle}>{filterType}</Text>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%', }}>
                {

                    [...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer,
                    ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer, ...filterReducer,
                    ].map((x, i) => {
                        return <TouchableOpacity style={{  justifyContent:'center',
                            height:25, paddingHorizontal: 5, borderWidth: 1, borderColor: "#C1C1C1", borderRadius: 5, margin: 7, alignItems: 'center', backgroundColor: '#FFFFFF' }}
                            key={i}  >

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