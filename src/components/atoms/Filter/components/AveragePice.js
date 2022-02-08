import React from 'react';
import { Appearance, } from 'react-native';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../../assets/svgs';
import ENUMS from '../../../../utils/ENUMS';
import AnimatedFlatlist from '../../../molecules/AnimatedScrolls/AnimatedFlatlist';
import AnimatedView from '../../AnimatedView';
import Text from '../../Text';
import View from '../../View';
export default ({ data = {}, filterType = "", styles, colors }) => {
    console.log("data", data);
    const renderFilterByUi = (x) => {
        console.log("x=>", x);
        return (
            <AnimatedView style={{ marginLeft: 5, borderWidth: 2, flexDirection: 'row' }}>
                <SvgXml xml={svgs.cross()}
                    height={20}
                />
                <Text>{x.text}</Text>
            </AnimatedView>
        )


    }


    return (
        <AnimatedView style={{ marginHorizontal: 15, borderTopWidth: 0.5, borderBottomWidth: 0.5, height: 140, justifyContent: 'center', }}>
            <View>
                <Text style={{ paddingBottom: 10 }}>{filterType}</Text>
                <AnimatedView>
                    <AnimatedFlatlist
                        data={data}
                        renderItem={(x) => renderFilterByUi(x)}
                        horizontal={true}
                    />

                </AnimatedView>
            </View>

        </AnimatedView>











    )
}