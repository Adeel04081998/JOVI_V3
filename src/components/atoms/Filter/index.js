import React, { useState } from 'react';
import { Alert, Appearance, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Text from '../Text';
import ENUMS from '../../../utils/ENUMS';
import TouchableOpacity from '../TouchableOpacity';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import SafeAreaView from "../../atoms/SafeAreaView";
import AveragePrice from './components/AveragePrice';
import CustomHeader from '../../molecules/CustomHeader';
import Cuisine from './components/Cuisine';
import Button from '../../molecules/Button';

export default (props) => {
    const { vendorFilterViewModel } = useSelector(state => state.categoriesTagsReducer);
    const cuisineList = vendorFilterViewModel?.cuisine ?? {}
    const filterList = vendorFilterViewModel?.filtersList ?? {}
    const averagePriceList = ENUMS.AVERAGE_PRICE_FILTERS ?? {}
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark")
    const filterType = null
    const initState = {
        averagePrice: {},
        filterBy: {},
        cuisine: {},

    }
    const [state, setState] = useState(initState)
    const CUSINE_ACTIVE_INDEX = "activeCusine";
    const Filter_ACTIVE_INDEX = "activeFilterBy";
    const AV_PRICE_ACTIVE_INDEX = "activeAvergePrice";
    const enableDisableButton = (state[CUSINE_ACTIVE_INDEX] != null || state[Filter_ACTIVE_INDEX] != null || state[AV_PRICE_ACTIVE_INDEX] != null) ? false : true
    const _renderHeaderRightButton = () => {
        return (
            <TouchableOpacity onPress={() => { Alert.alert("ClearButton") }} >
                <Text style={{ color: "#C1C1C1" }} fontFamily='PoppinsRegular' >Clear</Text>
            </TouchableOpacity>
        )
    }

    const handleOnPress = (index, key) => {
        if (index === state[key]) {
            setState((pre) => ({ ...pre, [key]: null, }))
        } else {
            setState((pre) => ({ ...pre, [key]: index, loading: true }))
        }
    }

    const onPress = () => {
        const dataToSend = {
            filterBy: filterList[state[Filter_ACTIVE_INDEX]],
            averagePrice: averagePriceList[state[AV_PRICE_ACTIVE_INDEX]],
            cuisineInfo: cuisineList.categoriesList[state[CUSINE_ACTIVE_INDEX]],

        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.drWhite }}>
            <CustomHeader
                leftIconName='ios-close'
                leftContainerStyle={{ height: 30, width: 30, borderRadius: 20, backgroundColor: colors.navTextColor, right: 9, }}
                leftIconSize={20}
                onLeftIconPress={() => { Alert.alert("Left crosss") }}
                rightCustom={_renderHeaderRightButton()}
                hideFinalDestination={true}
                containerStyle={{ borderBottomWidth: 1, borderBottomColor: colors.navTextColor, marginHorizontal: 15, backgroundColor: "#FAFAFA", }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <AveragePrice
                    data={filterList}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType={'Filter by' || filterType}
                    colors={colors}
                    filterTypeStyle={{ paddingBottom: 10, color: 'black', fontSize: 17, }}
                    onPress={(index) => { handleOnPress(index, Filter_ACTIVE_INDEX) }}
                    scrollEnabled={true}
                    activeFilterBy={state.activeFilterBy}
                />
                <AveragePrice
                    data={averagePriceList}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType={'Average Price' || filterType}
                    colors={colors}
                    filterTypeStyle={{ paddingBottom: 10, color: "black", fontSize: 17, }}
                    onPress={(index) => { handleOnPress(index, AV_PRICE_ACTIVE_INDEX) }}
                    scrollEnabled={false}
                    activeFilterBy={state.activeAvergePrice}
                />
                <Cuisine
                    data={cuisineList}
                    filterTypeStyle={{ paddingVertical: 10, color: 'black', fontSize: 17, }}
                    colors={colors}
                    onPress={(index) => { handleOnPress(index, CUSINE_ACTIVE_INDEX) }}
                    activeCusine={state.activeCusine}
                />
            </ScrollView>
            <Button
                onPress={onPress}
                disabled={enableDisableButton}
                text='Apply'
                style={{ width: "90%", alignSelf: "center", marginBottom: 10, backgroundColor: "#F94E41", borderRadius: 10 }}

            />
        </SafeAreaView>
    )
}