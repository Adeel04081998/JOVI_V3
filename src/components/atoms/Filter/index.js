import React, { useState } from 'react';
import { Appearance, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import NavigationService from '../../../navigations/NavigationService';
import constants from '../../../res/constants';
import theme from '../../../res/theme';
import ENUMS from '../../../utils/ENUMS';
import GV, { FILTER_TAGS_PITSTOP_LISTING, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../../utils/GV';
import SafeAreaView from "../../atoms/SafeAreaView";
import Button from '../../molecules/Button';
import CustomHeader from '../../molecules/CustomHeader';
import Text from '../Text';
import TouchableOpacity from '../TouchableOpacity';
import AveragePrice from './components/AveragePrice';
import Cuisine from './components/Cuisine';
const CUSINE_ACTIVE_INDEX = "activeCusine";
const Filter_ACTIVE_INDEX = "activeFilterBy";
const AV_PRICE_ACTIVE_INDEX = "activeAvergePrice";
export default (props) => {
    const { route } = props;
    const pitstopType = route.params?.pitstopType ?? 0;
    const itemKeys = React.useRef(pitstopType === PITSTOP_TYPES.SUPER_MARKET ? {
        id: "tagID",
        name: "tagName",
    } : {
        id: "categoryID",
        name: "categoryName",
    });
    const { vendorFilterViewModel } = useSelector(state => state.categoriesTagsReducer);
    const cuisineList = pitstopType === PITSTOP_TYPES.SUPER_MARKET ? { tagName: 'Categories', categoriesList: vendorFilterViewModel?.tagsList ?? [], } : vendorFilterViewModel?.cuisine ?? {}
    const filterList = FILTER_TAGS_PITSTOP_LISTING;//vendorFilterViewModel?.filtersList ?? {}
    const averagePriceList = ENUMS.AVERAGE_PRICE_FILTERS ?? {}
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[pitstopType]], Appearance.getColorScheme() === "dark");
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
            <TouchableOpacity onPress={handleclearAllPress} style={{}} >
                <Text style={{ color: "#C1C1C1", fontSize: 14, }} fontFamily='PoppinsRegular'>{`Clear`}</Text>
            </TouchableOpacity>
        )
    }

    const handleCrossPress = () => {
        NavigationService.NavigationActions.common_actions.goBack();
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
        // if (state[Filter_ACTIVE_INDEX]) {
        //     const listing = (vendorFilterViewModel?.filtersList ?? []).filter(item => item.vendorDashboardCatID === state[Filter_ACTIVE_INDEX])[0];
        //     NavigationService.NavigationActions.stack_actions.replace(ROUTES.APP_DRAWER_ROUTES.PitstopsVerticalList.screen_name, { pitstopType: route.params.pitstopType ?? 4, updatedFilters: { cuisines: state[CUSINE_ACTIVE_INDEX] }, listingObj: { ...listing } }, ROUTES.APP_DRAWER_ROUTES.Filter.screen_name);
        //     return;
        // }
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
                    onPress={(item, index) => { handleOnPress(item[itemKeys.current.id], CUSINE_ACTIVE_INDEX) }}
                    activeCusine={state.activeCusine}
                    {...pitstopType === PITSTOP_TYPES.SUPER_MARKET && {
                        itemKeys: {
                            id: "tagID",
                            name: "tagName",
                            image: "tagImage",
                        }
                    }}

                />
            </ScrollView>
            <View style={{ width: '100%', justifyContent: 'center', alignSelf: 'center', }}>

                <Button
                    onPress={onApplyPress}
                    // disabled={enableDisableButton}
                    text='Apply'
                    textStyle={{ fontSize: 14, color: colors.white }}
                    wait={2}
                    style={{ width: WIDTH * 0.75, height: HEIGHT * 0.065, alignSelf: "center", marginBottom: 10, backgroundColor: colors.primary, borderRadius: 25 }}

                />
            </View>
        </SafeAreaView>
    )
}