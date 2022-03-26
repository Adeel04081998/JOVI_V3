import React from 'react';
import { SvgXml } from 'react-native-svg';
import AnimatedFlatlist from '../../../molecules/AnimatedScrolls/AnimatedFlatlist';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import TouchableOpacity from '../../TouchableOpacity';
import TouchableScale from '../../TouchableScale';
import View from '../../View';
export default ({ data = {}, filterType = "", idKey = null, filterTypeStyle, colors, onPress, selectedFilter = {}, scrollEnabled = true, activeFilterBy = null }) => {
    console.log("if data average=>>", data);
    // console.log("if selectedFilte  avergr", selectedFilter);

    const renderFilterByUi = (x, i) => {
        const isActive = activeFilterBy === x[idKey ?? 'id'];
        let borderColor = isActive ? colors.primary : "#C1C1C1"
        let color = isActive ? colors.primary : "black"
        return (
            <View>
                <TouchableScale style={{ width: x.image ? null : 103, height: 29, borderWidth: 0.8, flexDirection: 'row', justifyContent: x.image ? "flex-start" : "center", alignItems: 'center', alignContent: 'center', marginLeft: i === 0 ? 0 : (x.image ? 9 : 10), borderRadius: 5, borderColor: borderColor, backgroundColor: "white", paddingHorizontal: 5, }}
                    onPress={() => { onPress(x, i) }}  >
                    {x.image ? <SvgXml xml={x.image} style={{ alignSelf: 'center', }}
                        height={30} width={20}
                        fill={colors.primary}
                        color={colors.primary}
                    /> : null}
                    <Text style={{ alignSelf: 'center', color: color, fontSize: 12, paddingHorizontal: 4 }} fontFamily='PoppinsMedium'>{x.text || x.name}</Text>
                </TouchableScale>
                <Text style={{ alignSelf: 'center', fontSize: 10, color: colors.navTextColor }}>{x.price}</Text>
            </View>
        )
    }
    return (
        <AnimatedView style={{ marginHorizontal: 15, borderBottomWidth: 1, borderColor: colors.navTextColor, height: 140, justifyContent: 'center', }}>
            <Text style={filterTypeStyle} fontFamily='PoppinsRegular'>{filterType}</Text>
            <AnimatedView>
                <AnimatedFlatlist
                    data={data}
                    renderItem={(x, i) => renderFilterByUi(x, i)}
                    horizontal={true}
                    flatlistProps={{
                        showsHorizontalScrollIndicator: false, scrollEnabled: scrollEnabled
                    }}
                />
            </AnimatedView>

        </AnimatedView>

    )
}