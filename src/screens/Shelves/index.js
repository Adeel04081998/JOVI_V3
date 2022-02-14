import React from 'react';
import { Appearance, FlatList } from 'react-native';
import View from '../../components/atoms/View';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';
import { stylesFunc } from './styles';
import lodash from 'lodash'; // 4.0.8
import CustomHeader from '../../components/molecules/CustomHeader';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import { ProductDummyData1 } from '../RestaurantProductMenu/components/ProductDummyData';
import ShelveCard from '../../components/organisms/Card/ShelveCard';
import { renderFile } from '../../helpers/SharedActions';
import constants from '../../res/constants';

const WINDOW_WIDTH = constants.screen_dimensions.width;
const CARD_WIDTH = WINDOW_WIDTH * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 0.4;

// const DATA = new Array(10).fill(ProductDummyData1.pitstopStockViewModel.shelves).flat();

export default ({ navigation, route }) => {
    // #region :: ROUTE PARAM's START's FROM HERE 
    const DATA = route?.params?.shelveData??[];
    const pitstopType = 2;
    const headerTitle = 'Shelves';
    // #endregion :: ROUTE PARAM's END's FROM HERE 

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[lodash.invert(PITSTOP_TYPES)[pitstopType]], Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);

    // #endregion :: STYLES & THEME END's FROM HERE 


    const _renderItem = (item, index) => {
        return (
            <View style={{
                paddingTop: 20,
                paddingBottom: 3,
            }}>
                <ShelveCard color={colors}
                    item={{
                        image: { uri: 'https://picsum.photos/200' },//renderFile(item?.tagImage ?? '') },
                        title: item?.tagName ?? ''
                    }}
                    cardWidth={CARD_WIDTH}
                    cardHeight={CARD_HEIGHT}
                />
            </View>
        )
    };//end of _renderItem

    console.log(ProductDummyData1.pitstopStockViewModel.shelves);
    return (
        <View style={styles.primaryContainer}>

            {/* ****************** Start of HEADER ****************** */}
            <CustomHeader
                hideFinalDestination
                rightIconName={null}
                leftIconName="chevron-back"
                leftContainerStyle={{ backgroundColor: colors.white, }}
                containerStyle={{
                    backgroundColor: colors.white,
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
                        justifyContent: 'space-between',
                        marginHorizontal: CARD_WIDTH * 0.2,
                    },
                    style: {
                    }
                }} />

        </View>
    )
};//end of EXPORT DEFAULT

