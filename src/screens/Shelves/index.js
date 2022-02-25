import React from 'react';
import { Appearance, FlatList, SafeAreaView } from 'react-native';
import View from '../../components/atoms/View';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';
import { stylesFunc } from './styles';
import lodash from 'lodash'; // 4.0.8
import CustomHeader from '../../components/molecules/CustomHeader';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import { ProductDummyData1 } from '../RestaurantProductMenu/components/ProductDummyData';
import ShelveCard from '../../components/organisms/Card/ShelveCard';
import { array_move, renderFile } from '../../helpers/SharedActions';
import constants from '../../res/constants';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';

const WINDOW_WIDTH = constants.screen_dimensions.width;
const SHELVE_CARD_SIZE = {
    width: WINDOW_WIDTH * 0.35,
    height: WINDOW_WIDTH * 0.18,
};

// const DATA = new Array(10).fill(ProductDummyData1.pitstopStockViewModel.shelves).flat();

export default ({ navigation, route }) => {
    // #region :: ROUTE PARAM's START's FROM HERE 
    const DATA = route?.params?.shelveData ?? [];
    const marketID = route?.params?.marketID ?? 0;
    const pitstopType = route?.params?.pitstopType ?? PITSTOP_TYPES.JOVI;
    const pitstopName = route?.params?.categoryName ?? '';
    const headerTitle = 'Shelves';
    // #endregion :: ROUTE PARAM's END's FROM HERE 

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)[pitstopType]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);

    // #endregion :: STYLES & THEME END's FROM HERE 


    const _renderItem = (item, index) => {
        const shouldEmpty = "shouldEmpty" in item ? item.shouldEmpty : false;
        return (
            <View style={{
                paddingTop: (index === 0 || index === 1) ? 20 : 10,
                paddingBottom: 10,
                opacity: shouldEmpty ? 0 : 1
            }}>
                <ShelveCard color={colors}
                    item={{
                        image: { uri: renderFile(item?.tagImage ?? '') },//renderFile(item?.tagImage ?? '') },
                        title: item?.tagName ?? ''
                    }}
                    cardWidth={SHELVE_CARD_SIZE.width}
                    cardHeight={SHELVE_CARD_SIZE.height}
                    itemDisabled={shouldEmpty}
                    onItemPress={() => {
                        let selectedShelvesData = DATA;
                        for (let i = 0; i < selectedShelvesData.length; i++) {
                            selectedShelvesData[i].isSelected = index === i;
                        }
                        selectedShelvesData = array_move(selectedShelvesData, index, 0);

                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ShelvesDetail.screen_name, {
                            shelveData: selectedShelvesData,
                            pitstopType: pitstopType,
                            categoryName: pitstopName,//item?.tagName ?? '',
                            marketID: marketID,
                            shelveID: item.tagID,
                        })
                    }}
                />
            </View>
        )
    };//end of _renderItem

    return (
        <SafeAreaView style={styles.primaryContainer}>

            {/* ****************** Start of HEADER ****************** */}
            <CustomHeader
                hideFinalDestination
                rightIconName={null}
                leftIconName="chevron-back"
                onLeftIconPress={() => {
                    NavigationService.NavigationActions.common_actions.goBack();
                }}
                leftIconColor={colors.primary}
                leftContainerStyle={{ backgroundColor: colors.white, }}
                containerStyle={{
                    backgroundColor: colors.white,
                    borderBottomColor: colors.primary,
                }}
                title={headerTitle}
                titleStyle={{
                    color: colors.primary,
                }}
            />

            {/* ****************** End of HEADER ****************** */}

            <AnimatedFlatlist
                data={DATA}
                renderItem={_renderItem}
                flatlistProps={{
                    numColumns: 2,
                    contentContainerStyle: {

                    },
                    columnWrapperStyle: {
                        alignItems: "center",
                        justifyContent: 'space-evenly',
                        marginHorizontal: 0
                    },
                    style: {
                    }
                }} />

        </SafeAreaView>
    )
};//end of EXPORT DEFAULT

