import React from 'react';
import { Animated, Appearance, Image as RNImage, Platform, StatusBar, StyleSheet } from 'react-native';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import ProductCard from '../../components/molecules/GenericList/ProductCard';
import { renderFile, VALIDATION_CHECK } from '../../helpers/SharedActions';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import { ProductDummyData2 } from './components/ProductDummyData';
import ProductMenuHeader from './components/ProductMenuHeader';
import ProductMenuScrollable from './components/ProductMenuScrollable';
import { itemStylesFunc, sectionHeaderStylesFunc, stylesFunc } from './styles';

const WINDOW_HEIGHT = constants.window_dimensions.height;

export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.RESTAURANT, Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);

    const sectionHeaderStyles = sectionHeaderStylesFunc(colors);
    const itemStyles = itemStylesFunc(colors);

    // #region :: ANIMATION START's FROM HERE 
    const animScroll = React.useRef(new Animated.Value(0)).current
    const [headerHeight, setHeaderHeight] = React.useState(WINDOW_HEIGHT * 0.7);

    const headerTop = animScroll.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight + 20)],
        extrapolate: "clamp",
        useNativeDriver: true
    });

    const tabTop = animScroll.interpolate({
        inputRange: [0, headerHeight + 20],
        outputRange: [headerHeight + 20, 0],
        extrapolate: "clamp",
        useNativeDriver: true
    });

    // #endregion :: ANIMATION END's FROM HERE 


    return (
        <View style={styles.primaryContainer}>

            {/* ****************** Start of UPPER HEADER TILL RECENT ORDER ****************** */}
            <Animated.View style={{
                ...StyleSheet.absoluteFill,
                transform: [{
                    translateY: headerTop
                }],
            }}>
                {/* RECENT ORDER IS ALSO IN PRODUCT MENU HEADER */}
                <ProductMenuHeader colors={colors}
                    onLayout={(e) => {
                        setHeaderHeight(e.nativeEvent.layout.height);
                    }}
                    item={{
                        image: { uri: renderFile(ProductDummyData2.productsAndDealsV2.pitstopImage) },
                        distance: ProductDummyData2.productsAndDealsV2.distance,
                        time: ProductDummyData2.productsAndDealsV2.time,
                        title: ProductDummyData2.productsAndDealsV2.pitstopName,
                        description: ProductDummyData2.productsAndDealsV2.pitstopTag,
                    }}
                />
            </Animated.View>

            {/* ****************** End of UPPER HEADER TILL RECENT ORDER ****************** */}

            <ProductMenuScrollable
                colors={colors}
                data={ProductDummyData2.productsAndDealsV2.productsDealsCategories}
                animatedScrollValue={animScroll}
                headerHeight={headerHeight}
                topHeaderStyle={{
                    height: 50,
                    transform: [{
                        translateY: tabTop
                    }],
                }}
                itemsScrollViewStyle={{
                }}
                itemListPropertyName="restaurantItems"
                renderSectionHeader={(item, index) => {
                    if (index === 0) return null;
                    return (
                        <View style={sectionHeaderStyles.primaryContainer}>
                            <Text
                                fontFamily='PoppinsMedium'
                                style={sectionHeaderStyles.text}>{item.categoryName}</Text>
                            <View style={sectionHeaderStyles.borderLine} />
                        </View>
                    )
                }}
                renderItem={(parentItem, item, parentIndex, index) => {
                    if (parentIndex === 0) {
                        return (
                            <ProductCard color={colors}
                                containerStyle={{
                                    ...itemStyles.primaryContainer,
                                    marginLeft: index === 0 ? 10 : 0,
                                }}
                                item={{
                                    image: { uri: renderFile(item.image) },
                                    description: item.description,
                                    title: item.name,
                                    price: `Rs. ${item.price}`
                                }} />
                        )
                    }
                    return (
                        <View style={itemStyles.primaryContainer2}>
                            {index !== 0 &&
                                <View style={itemStyles.seperator} />
                            }

                            <View style={itemStyles.bodyContainer}>

                                <View style={itemStyles.detailContainer}>
                                    {VALIDATION_CHECK(item.name) &&
                                        <Text fontFamily='PoppinsBold' style={itemStyles.name}>{`${item.name}`}</Text>
                                    }

                                    {VALIDATION_CHECK(item.description) &&
                                        <Text style={itemStyles.description}>{`${item.description}`}</Text>
                                    }

                                    {VALIDATION_CHECK(item.price) &&
                                        <Text fontFamily='PoppinsMedium' style={itemStyles.price}>{`from Rs. ${item.price}`}</Text>
                                    }
                                </View>

                                <RNImage
                                    source={{ uri: renderFile(item.image) }}
                                    style={itemStyles.image}
                                />

                            </View>



                        </View>
                    )
                }}
                renderAboveItems={() => (
                    <View style={{ marginTop: headerHeight + 40, paddingHorizontal: 15, backgroundColor: "pink", elevation: 2, paddingTop: 0 }} />
                )}
            />


            <Button
                style={{
                    flex: 1,
                    position: 'absolute',
                    bottom: 10,
                    width: "90%",
                    alignSelf: "center",
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    alignItems: "flex-start",
                }}
                textStyle={{
                    color: colors.white,
                    fontSize: 16,
                    fontFamily: FontFamily.Poppins.Medium,
                    textAlign: "center",
                    flex: 1,
                }}
                text="Go to cart"
                leftComponent={() => (
                    <View style={{
                        paddingHorizontal: 14,
                        paddingVertical: 4,
                        backgroundColor: "#fff",
                        borderRadius: 6,
                        marginLeft: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        alignSelf: "center",
                    }}>
                        <Text style={{
                            color: colors.primary,
                            fontSize: 16,
                            textAlign: 'center',
                        }}>{'1'}</Text>
                    </View>
                )}

                rightComponent={() => (
                    <View style={{
                        padding: 10,
                        paddingRight: 0,
                        marginRight: 16,
                    }}>
                        <Text style={{
                            color: colors.white,
                            fontSize: 16,
                            textAlign: 'center',
                        }}>{'Rs. 500'}</Text>
                    </View>
                )}
            />

        </View>
    )
};//end of EXPORT DEFAULT

