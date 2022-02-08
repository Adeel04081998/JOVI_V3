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
export default ({ data = {}, filterType = "", filterTypeStyle, styles, colors, onPress = () => { } }) => {
    console.log("filterTypeStyle=>", filterTypeStyle);
    const renderFilterByUi = (x, i) => {
        return (
            <View>
                <TouchableOpacity style={{
                    width: x.icon ? null : 120, height: 29, borderWidth: 0.8, flexDirection: 'row', justifyContent: x.icon ? "flex-start" : "center", marginLeft: i === 0 ? 0 : (x.icon ? 9 : 15), borderRadius: 5, borderColor: colors.navTextColor,
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 5,
                }}
                    onPress={(x) => {
                        console.log("herre");
                        onPress(x)
                    }}
                >

                    {x.icon ?
                        <SvgXml xml={x.icon}
                            style={{ alignSelf: 'center' }}
                        /> : null}
                    <Text style={{ alignSelf: 'center', color: "black", fontSize: 12 }}>{x.text}</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: 'center', fontSize: 10, color: colors.navTextColor }}>{x.price}</Text>
            </View>
        )
    }
    return (
        <AnimatedView style={{
            marginHorizontal: 15,
            borderBottomWidth: 1, borderColor: colors.navTextColor,
            height: 140, justifyContent: 'center',
        }}>
            <View>
                <Text style={filterTypeStyle}>{filterType}</Text>
                <AnimatedView>
                    <AnimatedFlatlist
                        data={[...data]}
                        renderItem={(x, i) => renderFilterByUi(x, i)}
                        horizontal={true}
                        flatlistProps={{
                            showsHorizontalScrollIndicator: false,
                        }}
                    />

                </AnimatedView>
            </View>



        </AnimatedView>











    )
}