import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import AnimatedFlatlist from '../../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import ShelveCard from '../../../components/organisms/Card/ShelveCard';
import { renderFile } from '../../../helpers/SharedActions';
import { initColors } from '../../../res/colors';
import FontFamily from '../../../res/FontFamily';
import RestaurantProductMenuHeader, { ProductMenuHeaderItem, ProductMenuHeaderItemDefaultValue } from '../../RestaurantProductMenu/components/RestaurantProductMenuHeader';

// #region :: INTERFACE START's FROM HERE 
interface Props {
    colors: typeof initColors;
    headerItem?: ProductMenuHeaderItem;
    shelveData?: [];

    hideHeader?: boolean;
}

const defaultProps = {
    headerItem: ProductMenuHeaderItemDefaultValue,
    shelveData: [],
    hideHeader: false,
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
                        }}
                        horizontal
                        //@ts-ignore
                        renderItem={(item, index) => {
                            return (
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {/* @ts-ignore */}
                                    <ShelveCard
                                        containerStyle={{
                                            marginLeft: index === 0 ? 10 : 0,
                                            ...styles.shelvePrimaryContainer
                                        }}
                                        color={colors}
                                        item={{
                                            image: { uri: renderFile(item?.tagImage ?? '') },
                                            title: item?.tagName ?? ''
                                        }}
                                    />

                                    {index === (props?.shelveData ?? []).length - 1 &&
                                        // @ts-ignore
                                        <ShelveCard
                                            containerStyle={{
                                                marginLeft: index === 0 ? 10 : 0,
                                                ...styles.shelvePrimaryContainer
                                            }}
                                            color={colors}
                                            seeAll />
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
        marginBottom: 4,
    },
})
