import React, { useState } from 'react';
import { Alert, Appearance, ScrollView, StyleSheet, View } from 'react-native';
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
import AveragePrice from './components/AveragePrice';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../../molecules/CustomHeader';
import Cuisine from './components/Cuisine';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Button from '../../molecules/Button';
import FontFamily from '../../../res/FontFamily';
import NavigationService from '../../../navigations/NavigationService';
export default (props) => {
    const { vendorFilterViewModel } = useSelector(state => state.categoriesTagsReducer);
    const cuisine = vendorFilterViewModel?.cuisine ?? {}
    const filterList = vendorFilterViewModel?.filtersList ?? {}
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark")
    const filterType = null
    const initState = {
        averagePrice: {},
        filterBy: {} ,
        cuisine: {}
    }
    const [state, setState] = useState(initState)

    const _renderHeaderRightButton = () => {
        return (
            <TouchableOpacity onPress={() => { Alert.alert("ClearButton") }} >
                <Text style={{ color: colors.navTextColor }} fontFamily='PoppinsRegular' >Clear</Text>
            </TouchableOpacity>
        )
    }
    const applyFilterHandler = () => {
        // NavigationService.NavigationActions.common_actions.goBack()
        Alert.alert("Apply")
    }


    const handleOnPress = (item, index, key) => {
        const activeIndex = "activeIndex" in state[key] ? state[key].activeIndex : -1;
        if (activeIndex === index) {
            setState((pre) => ({ ...pre, [key]: {} }))
        } else {
            setState((pre) => ({ ...pre, [key]: { ...item, activeIndex: index } }))
        }

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.DrWhite }}>
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
                    filterTypeStyle={{ paddingBottom: 10, color: 'black', fontSize: 17,  }}
                    onPress={(value, index) => { handleOnPress(value, index, "filterBy") }}
                    selectedFilter={state.filterBy}
                    scrollEnabled={true}

                />
                <AveragePrice
                    data={ENUMS.AVERAGE_PRICE_FILTERS}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType={'Average Price' || filterType}
                    colors={colors}
                    filterTypeStyle={{ paddingBottom: 10, color: "black", fontSize: 17, }}
                    onPress={(value, index) => { handleOnPress(value, index, "averagePrice") }}
                    selectedFilter={state.averagePrice}
                    scrollEnabled={false}
                />
                <Cuisine
                    data={cuisine}
                    filterTypeStyle={{ paddingVertical: 10, color: 'black', fontSize: 17,  }}
                    colors={colors}
                    onPress={(value, index) => { handleOnPress(value, index, "cuisine") }}
                    selectedFilter={state.cuisine}

                />
            </ScrollView>
            <Button
                onPress={applyFilterHandler}
                text='Apply'
                style={{ width: "90%", alignSelf: "center", marginBottom: 10, backgroundColor: "#F94E41", borderRadius: 10 }}

            />
        </SafeAreaView>
    )
}