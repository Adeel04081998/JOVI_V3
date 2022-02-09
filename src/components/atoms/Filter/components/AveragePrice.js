import React from 'react';
import { Appearance, } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../../assets/svgs';
import ENUMS from '../../../../utils/ENUMS';
import AnimatedFlatlist from '../../../molecules/AnimatedScrolls/AnimatedFlatlist';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import TouchableOpacity from '../../TouchableOpacity';
import View from '../../View';
export default ({ data = {}, filterType = "", filterTypeStyle, colors, onPress, selectedFilter = {}, scrollEnabled = true }) => {

    const renderFilterByUi = (x, i) => {
        return (
            <View>
                <TouchableOpacity style={{ width: x.image ? null : 103, height: 29, borderWidth: 0.8, flexDirection: 'row', justifyContent: x.image ? "flex-start" : "center", alignItems: 'center', alignContent: 'center', marginLeft: i === 0 ? 0 : (x.image ? 9 : 10), borderRadius: 5, borderColor: selectedFilter.activeIndex === i ? colors.oldFlame : colors.navTextColor, backgroundColor: "white", paddingHorizontal: 5, }}
                    onPress={() => { onPress(x, i) }}  >
                    {x.image ? <SvgXml xml={x.image} style={{ alignSelf: 'center' }}
                        height={30} width={20}
                    /> : null}
                    <Text style={{ alignSelf: 'center', color: selectedFilter.activeIndex === i ? "#F94E41" : "balck", fontSize: 12, paddingHorizontal: 4 }} fontFamily='PoppinsMedium'>{x.text || x.name}</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: 'center', fontSize: 10, color: colors.navTextColor }}>{x.price}</Text>
            </View>
        )
    }
    return (
        <AnimatedView style={{  marginHorizontal: 15, borderBottomWidth: 1, borderColor: colors.navTextColor, height: 140, justifyContent: 'center',  }}>
            <Text style={filterTypeStyle} fontFamily='PoppinsRegular'>{filterType}</Text>
            <AnimatedView>
                <AnimatedFlatlist
                    data={data}
                    renderItem={(x, i) => renderFilterByUi(x, i)}
                    horizontal={true}
                    flatlistProps={{ showsHorizontalScrollIndicator: false, scrollEnabled: scrollEnabled
                    }}
                />

            </AnimatedView>

        </AnimatedView>











    )
}