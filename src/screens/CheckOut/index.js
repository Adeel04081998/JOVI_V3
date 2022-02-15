import React from 'react'
import { Appearance, ScrollView, } from 'react-native'
import AnimatedView from '../../components/atoms/AnimatedView'
import SafeAreaView from '../../components/atoms/SafeAreaView'
import Text from '../../components/atoms/Text'
import View from '../../components/atoms/View'
import CustomHeader from '../../components/molecules/CustomHeader'
import FontFamily from '../../res/FontFamily'
import constants from '../../res/constants'
import theme from '../../res/theme'
import GV, { PITSTOP_TYPES } from '../../utils/GV'
import lodash from 'lodash'; // 4.0.8
import StyleSheet from "./styles"
import { SvgXml } from 'react-native-svg'
import svgs from '../../assets/svgs'


const WINDOW_WIDTH = constants.screen_dimensions.width;
const CARD_WIDTH = WINDOW_WIDTH * 0.3;
const CARD_HEIGHT = CARD_WIDTH * 0.4;


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)], Appearance.getColorScheme() === "dark");
    const productDetailsStyles = StyleSheet.styles(colors)
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
            <CustomHeader
                title='Checkout'
                titleStyle={{ fontSize: 16, fontFamily: FontFamily.Poppins.SemiBold }}
                onLeftIconPress={() => {

                }}
            />
            <ScrollView style={{ flex: 1, marginHorizontal: constants.horizontal_margin, }}>
                {/* <AnimatedView style={{ height: 90, width: '100%', backgroundColor: "white", marginVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, }}>
                    <View style={{ borderRightWidth: 1, }}>
                        <SvgXml xml={svgs.cat()} height={80} width={70} style={{ paddingRight: 5 }} />
                    </View>
                    <View style={{ borderRightWidth: 1, }}>
                        <Text style={{ fontSize: 12 }}>Estimated Delivery Time</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 18 }}>Now 30 - 45 min</Text>
                    </View>
                    <View style={{ width: CARD_WIDTH }}>
                        <Text style={{}}>Total Pitstop</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>04</Text>

                    </View>



                </AnimatedView> */}
                <AnimatedView style={{
                    flexDirection: "row",
                    backgroundColor: 'white', borderRadius: 10, paddingVertical: 10,
                    marginVertical: 10
                }}>
                    <View style={{ flex: 1, borderRightWidth: 1, alignItems: "center", justifyContent: "center", }}>
                        <SvgXml xml={svgs.cat()} height={80} width={70} style={{ paddingRight: 5 }} />
                    </View>
                    <View style={{ flex: 2, alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ fontSize: 12, color: '#272727' }} fontFamily='PoppinsRegular'>Estimated Delivery Time</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 18 }}>Now 30 - 45 min</Text>
                    </View>
                    <View style={{ flex: 1, borderLeftWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 }}>
                        <Text style={{ fontSize: 12, color: '#272727' }}>Total Pitstops</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 18 }}>04</Text>
                    </View>

                </AnimatedView>

            </ScrollView>

        </SafeAreaView>
    )
}

