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
import NavigationService from '../../../navigations/NavigationService';
const CUSINE_ACTIVE_INDEX = "activeCusine";
const Filter_ACTIVE_INDEX = "activeFilterBy";
const AV_PRICE_ACTIVE_INDEX = "activeAvergePrice";
export default (props) => {
    const { route } = props;
    console.log('route', route.params);
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
        activeCusine: route.params.activeCusine ?? null,
        activeAvergePrice: route.params.activeAvergePrice ?? null,
        activeFilterBy: route.params.activeFilterBy ?? null
    }
    const [state, setState] = useState(initState)
    const enableDisableButton = (state[CUSINE_ACTIVE_INDEX] != null || state[Filter_ACTIVE_INDEX] != null || state[AV_PRICE_ACTIVE_INDEX] != null) ? false : true
    const _renderHeaderRightButton = () => {
        return (
            <TouchableOpacity onPress={handleclearAllPress} >
                <Text style={{ color: "#C1C1C1" }} fontFamily='PoppinsRegular'>{`Clear`}</Text>
            </TouchableOpacity>
        )
    }

    const handleCrossPress = () => {
        NavigationService.NavigationActions.common_actions.goBack();
        if (route.params.backCB) {
            route.params.backCB({});
        }
    }
    const handleclearAllPress = () => {
        setState((pre) => ({ ...pre, [Filter_ACTIVE_INDEX]: null, [AV_PRICE_ACTIVE_INDEX]: null, [CUSINE_ACTIVE_INDEX]: null }))
    }
    const handleOnPress = (index, key) => {
        // if (index === state[key]) {
        //     setState((pre) => ({ ...pre, [key]: null, }))
        // } else {
        //     setState((pre) => ({ ...pre, [key]: index }))
        // }
        setState((pre) => ({ ...pre, [key]: pre[key] === index ? null : index, }))
    }
    const onApplyPress = () => {
        const dataToSend = {
            [Filter_ACTIVE_INDEX]: state[Filter_ACTIVE_INDEX],
            [AV_PRICE_ACTIVE_INDEX]: state[AV_PRICE_ACTIVE_INDEX],
            [CUSINE_ACTIVE_INDEX]: state[CUSINE_ACTIVE_INDEX],

        }

        NavigationService.NavigationActions.common_actions.goBack();
        if (route.params.backCB) {
            route.params.backCB(dataToSend);
        }
        // console.log(dataToSend)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.drWhite }}>
            <CustomHeader
                leftIconName='ios-close'
                leftContainerStyle={{ height: 30, width: 30, borderRadius: 20, backgroundColor: colors.navTextColor, right: 9, }}
                leftIconSize={20}
                // onLeftIconPress={() => { NavigationService.NavigationActions.common_actions.goBack(); }}
                onLeftIconPress={() => { handleCrossPress() }}

                rightCustom={_renderHeaderRightButton()}
                hideFinalDestination={true}
                containerStyle={{ borderBottomWidth: 1, borderBottomColor: colors.navTextColor, marginHorizontal: 15, backgroundColor: "#FAFAFA", }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <AveragePrice
                    data={filterList}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType={'Filter by' || filterType}
                    idKey={'vendorDashboardCatID'}
                    colors={colors}
                    filterTypeStyle={{ paddingBottom: 10, color: 'black', fontSize: 17, }}
                    onPress={(index) => { handleOnPress(index.vendorDashboardCatID, Filter_ACTIVE_INDEX) }}
                    scrollEnabled={true}
                    activeFilterBy={state.activeFilterBy}
                />
                <AveragePrice
                    data={averagePriceList}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType={'Average price' || filterType}
                    colors={colors}
                    filterTypeStyle={{ paddingBottom: 10, color: "black", fontSize: 17, }}
                    onPress={(item, index) => { handleOnPress(item.id, AV_PRICE_ACTIVE_INDEX) }}
                    scrollEnabled={false}
                    activeFilterBy={state.activeAvergePrice}
                />
                <Cuisine
                    data={cuisineList}
                    filterTypeStyle={{ paddingVertical: 10, color: 'black', fontSize: 17, }}
                    colors={colors}
                    onPress={(item, index) => { handleOnPress(item.categoryID, CUSINE_ACTIVE_INDEX) }}
                    activeCusine={state.activeCusine}
                />
            </ScrollView>
            <Button
                onPress={onApplyPress}
                // disabled={enableDisableButton}
                text='Apply'
                style={{ width: "90%", alignSelf: "center", marginBottom: 10, backgroundColor: "#F94E41", borderRadius: 10 }}

            />
        </SafeAreaView>
    )
}