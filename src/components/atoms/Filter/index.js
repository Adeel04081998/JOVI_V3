import React from 'react';
import { Appearance, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AnimatedKeyboardAwareScroll from '../../molecules/AnimatedKeyboardAwareScroll';
import Text from '../Text';
import ENUMS from '../../../utils/ENUMS';
import svgs from '../../../assets/svgs';
import { SvgXml } from 'react-native-svg';
import AnimatedView from '../AnimatedView';
import TouchableOpacity from '../TouchableOpacity';
import colors from '../../../res/colors';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import SafeAreaView from "../../atoms/SafeAreaView";
import AveragePice from './components/AveragePice';





export default () => {
    const tagswithCategory = useSelector(state => state.categoriesTagsReducer);
    console.log("tagswithCategory", tagswithCategory);
    const { tagsList } = tagswithCategory.tagsWithCategories ?? {}
    console.log("tagsList", tagsList)
    console.log("Enums", ENUMS.FILTER_BY)
    // const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark");
    // const homeStyles = stylesheet.styles(colors);
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark")
    const renderFilterByUi = () => {
        return (
            ENUMS.FILTER_BY.map((x, i) => {
                console.log("x==>", x);
                return <AnimatedView style={{ backgroundColor: 'red' }}>
                    <Text>{x.filterTitle}</Text>
                </AnimatedView>
            })

        )
    }
    const renderAveragePriceFilterByUi = () => {
        return (
            ENUMS.AVERAGE_PRICE_FILTERS.map((x, i) => {
                console.log("x==>", x);
                return <AnimatedView style={{ backgroundColor: 'green', top: 20 }}>
                    <Text>{x.filterTitle}</Text>
                </AnimatedView>
            })

        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ borderWidth: 1 }} contentContainerStyle={{ flex: 1, }} >
                <AnimatedView style={{
                    flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',
                    borderBottomWidth: 1, borderBottomColor: colors.navTextColor,
                    marginHorizontal: 15,
                    paddingVertical: 15

                }}>
                    <TouchableOpacity style={{}}  >
                        <SvgXml xml={svgs.cross()} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{}}  >
                        <Text style={{ color: colors.navTextColor }}>Clear</Text>
                    </TouchableOpacity>

                </AnimatedView>
                <AveragePice
                    data={ENUMS.FILTER_BY}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType='Salary Dy Do'
                />
                <AveragePice
                    data={ENUMS.AVERAGE_PRICE_FILTERS}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType='Average price'
                />

            </ScrollView>


        </SafeAreaView>








    )
}