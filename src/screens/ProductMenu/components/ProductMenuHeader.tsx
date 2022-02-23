import React from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import AnimatedFlatlist from '../../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import ShelveCard from '../../../components/organisms/Card/ShelveCard';
import { array_move, renderFile } from '../../../helpers/SharedActions';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import { initColors } from '../../../res/colors';
import constants from '../../../res/constants';
import FontFamily from '../../../res/FontFamily';
import RestaurantProductMenuHeader, { ProductMenuHeaderItem, ProductMenuHeaderItemDefaultValue } from '../../RestaurantProductMenu/components/RestaurantProductMenuHeader';

const WINDOW_WIDTH = constants.window_dimensions.width;

const SHELVE_CARD_SIZE = {
    width: WINDOW_WIDTH * 0.25,
    height: WINDOW_WIDTH * 0.13,
};

// #region :: INTERFACE START's FROM HERE 
interface Props {
    colors: typeof initColors;
    headerItem?: ProductMenuHeaderItem;
    shelveData?: [];
    data?: [];

    hideHeader?: boolean;

    pitstopType?: any;
    marketID?: any;

    onHeaderLayout?: (event: LayoutChangeEvent) => void;

}

const defaultProps = {
    headerItem: ProductMenuHeaderItemDefaultValue,
    shelveData: [],
    hideHeader: false,
    data: [],
    pitstopType: 1,
};

// #endregion :: INTERFACE END's FROM HERE 

const ProductMenuHeader = (props: Props) => {
    const colors = props.colors;
    const styles = stylesFunc(colors);

    return (
        <React.Fragment>
            {/* ****************** Start of UPPER HEADER TILL RECENT ORDER ****************** */}

            {/* RECENT ORDER IS ALSO IN PRODUCT MENU HEADER */}
            <RestaurantProductMenuHeader
                colors={colors}
                item={props.headerItem}
                hideHeader={props.hideHeader}
                onLayout={(e) => { props.onHeaderLayout && props.onHeaderLayout(e) }}
            />


            {/* ****************** End of UPPER HEADER TILL RECENT ORDER ****************** */}


            {/* ****************** Start of SHELVES ****************** */}
            {(props?.shelveData ?? []).length > 0 &&
                <>
                    <Text style={styles.shelvesTitle}>{`Shelves`}</Text>
                    <AnimatedFlatlist
                        data={props?.shelveData ?? []}
                        flatlistProps={{
                            nestedScrollEnabled: true,
                            showsHorizontalScrollIndicator: false,
                            contentContainerStyle: {
                                paddingBottom: 10,
                            }
                        }}
                        horizontal
                        nestedScrollEnabled={true}
                        showsHorizontalScrollIndicator={false}

                        //@ts-ignore
                        renderItem={(item, index) => {
                            return (
                                <View style={{ flexDirection: "row", alignItems: "center", }}>
                                    <ShelveCard
                                        cardWidth={SHELVE_CARD_SIZE.width}
                                        cardHeight={SHELVE_CARD_SIZE.height}
                                        containerStyle={{
                                            ...styles.shelvePrimaryContainer,
                                            marginLeft: index === 0 ? 10 : 0,
                                        }}
                                        color={colors}
                                        item={{
                                            image: { uri: renderFile(item?.tagImage ?? '') },
                                            title: item?.tagName ?? ''
                                        }}
                                        onItemPress={() => {
                                            let selectedShelvesData: any = props.data;
                                            for (let i = 0; i < selectedShelvesData.length; i++) {
                                                selectedShelvesData[i].isSelected = index === i;
                                            }
                                            selectedShelvesData = array_move(selectedShelvesData, index, 0);

                                            NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ShelvesDetail.screen_name, {
                                                shelveData: selectedShelvesData,
                                                pitstopType: props.pitstopType,
                                                categoryName: props.headerItem?.title ?? '',
                                                marketID: props.marketID ?? 0,
                                                shelveID: item.tagID,
                                            })
                                        }}
                                    />

                                    {(index === (props?.shelveData ?? []).length - 1) &&
                                        <ShelveCard
                                            cardWidth={SHELVE_CARD_SIZE.width}
                                            cardHeight={SHELVE_CARD_SIZE.height}
                                            containerStyle={{
                                                ...styles.shelvePrimaryContainer
                                            }}
                                            color={colors}
                                            seeAll
                                            onItemPress={() => {
                                                const allData: any = props?.data ?? [];
                                                if (Math.abs(allData.length % 2) === 1) {
                                                    //WHEN ODD
                                                    allData.push({
                                                        id: allData.length + 1,
                                                        shouldEmpty: true,
                                                    })
                                                }

                                                NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Shelves.screen_name, { shelveData: allData, pitstopType: props.pitstopType, marketID: props.marketID })
                                            }}
                                        />
                                    }

                                </View>
                            )
                        }} />
                </>
            }

            {/* ****************** End of SHELVES ****************** */}

        </React.Fragment>
    )
};//end of ProductMenuHeader

ProductMenuHeader.defaultProps = defaultProps;
export default React.memo(ProductMenuHeader);

export const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
    },

    shelvesTitle: {
        color: "#1D1D1D",
        fontSize: 18,
        fontFamily: FontFamily.Poppins.Medium,
        paddingBottom: 10,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    shelvePrimaryContainer: {
        marginRight: 10,
    },
})
