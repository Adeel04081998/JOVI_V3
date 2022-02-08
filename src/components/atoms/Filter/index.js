import React from 'react';
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
export default () => {
    const { vendorFilterViewModel } = useSelector(state => state.categoriesTagsReducer);
    console.log("vendorFilterViewModel", vendorFilterViewModel);
    const categoriesList = vendorFilterViewModel?.cuisine?.categoriesList ?? []
    console.log("categoriesList===>>>", categoriesList);
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === "dark")
    // const [isLoading, setIsLoading] = React.useState(false);

    const [filterBy, SetFilterBy] = React.useState([]);

    const _renderHeaderRightButton = () => {
        return (
            <TouchableOpacity style={{}}
                onPress={() => {
                    Alert.alert("ClearButton")
                }}
            >
                <Text style={{ color: colors.STOONE }}>Clear</Text>
            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.DrWhite }}>
            <CustomHeader
                leftIconName='ios-close'
                leftContainerStyle={{
                    height: 30,
                    width: 30,
                    borderRadius: 20,
                    backgroundColor: colors.navTextColor,
                    right: 9,

                }}
                leftIconSize={20}
                onLeftIconPress={() => { Alert.alert("Left crosss") }}
                rightCustom={_renderHeaderRightButton()}
                hideFinalDestination={true}
                containerStyle={{ borderBottomWidth: 1, borderBottomColor: colors.navTextColor, marginHorizontal: 15, backgroundColor: colors.DrWhite, }}

            />
            <ScrollView >
                <AveragePrice
                    data={ENUMS.FILTER_BY}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType='Filter by'
                    colors={colors}
                    filterTypeStyle={{ paddingBottom: 10, color: 'black', fontSize: 16, FontFamily: FontFamily.Poppins.Regular }}
                    onPress={(x) => {
                        console.log("value=>>", x)

                    }}
                />
                <AveragePrice
                    data={ENUMS.AVERAGE_PRICE_FILTERS}
                    styles={{ borderWidth: 2, top: 20 }}
                    filterType='Average Price'
                    colors={colors}
                    filterTypeStyle={{ paddingBottom: 10, color: 'black', fontSize: 16, FontFamily: FontFamily.Poppins.Regular }}
                />
                <Cuisine
                    filterReducer={categoriesList}
                    filterType='Crusine'
                    filterTypeStyle={{ paddingVertical: 10, color: 'black', fontSize: 16, FontFamily: FontFamily.Poppins.Regular }}
                    colors={colors}

                />
            </ScrollView>
            <Button
                onPress={() => {

                }}
                text='Apply'
                style={{ width: "90%", alignSelf: "center", marginBottom: 10, backgroundColor: "#F94E41", borderRadius: 10 }}

            />


        </SafeAreaView>








    )
}