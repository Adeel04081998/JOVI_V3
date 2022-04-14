import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated, Dimensions,
    FlatList, ListRenderItem, StyleProp,
    StyleSheet, View,
    ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBottomPadding, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { initColors } from '../../res/colors';
import constants from '../../res/constants';
import Text from '../atoms/Text';

const { width } = Dimensions.get('window');
const SPACING = constants.horizontal_margin;
const ITEM_WIDTH = width;
const BORDER_RADIUS = 8;

interface FlatListCarouselProps {
    data: any[];
    pagination?: boolean;
    showNumber?: boolean;

    width?: number;

    paginationContainerStyle?: StyleProp<ViewStyle>;
    paginationDotStyle?: StyleProp<ViewStyle>;

    onActiveIndexChanged?: (item: any, index: number) => void;
    colors?: typeof initColors;
    renderItem: ListRenderItem<any> | null | undefined;
    contentContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    columnWrapperStyle?: StyleProp<ViewStyle>;
    customFooterContainerStyle?: StyleProp<ViewStyle>;
    customFooter?: (item: any, index: number) => React.ReactNode;

}
const defaultProps = {
    pagination: true,
    showNumber: false,

    width: ITEM_WIDTH,

    paginationContainerStyle: {},
    paginationDotStyle: {},
    onActiveIndexChanged: undefined,
    colors: initColors,
    renderItem: undefined,
    contentContainerStyle: undefined,
    style: undefined,
    columnWrapperStyle: undefined,
    customFooter: undefined,
};


const FlatListCarousel: FC<FlatListCarouselProps> = (props: FlatListCarouselProps) => {
    const theme = props?.colors ?? initColors;


    // #region :: VIEW ABILITY START's FROM HERE 
    const handleOnViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length !== 0) {
            updateCurrentIndex(viewableItems[0].index);
            return;
        }

    }, []);//end of handleOnViewableItemsChanged

    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50,
    };
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged: handleOnViewableItemsChanged }])

    // #endregion :: VIEW ABILITY END's FROM HERE 

    const [dataWithPlaceholders, setDataWithPlaceholders] = useState<any[]>([]);

    const [currentIndex, updateCurrentIndex] = useState<number>(0);
    const [metaData, toggleMetaData] = useState<boolean>(false);
    const flatListRef = useRef<FlatList<any>>(null);

    useEffect(() => {
        setDataWithPlaceholders(props.data);
        updateCurrentIndex(0);
    }, [props.data]);

    // #region :: currentIndex START's FROM HERE 
    React.useEffect(() => {
        if (props.onActiveIndexChanged) {
            const item = dataWithPlaceholders[currentIndex];
            props.onActiveIndexChanged(item, currentIndex);
        }

    }, [currentIndex])//endo of useEffect for currentIndex

    // #endregion :: currentIndex END's FROM HERE 

    const onScrollToIndexFailed = () => { };

    return (
        <View style={styles.primaryContainer}>
            <Animated.FlatList
                ref={flatListRef}
                data={[...dataWithPlaceholders,]}
                // extraData={metaData}
                contentContainerStyle={props.contentContainerStyle}
                style={props.style}
                columnWrapperStyle={props.columnWrapperStyle}
                renderItem={({ item, index, separators }) => {
                    if (props.renderItem) {
                        return props.renderItem({ item, index, separators })
                    } else {
                        return null;
                    }
                }}
                onScrollToIndexFailed={onScrollToIndexFailed}
                getItemLayout={(data, index) => ({
                    length: props.width ?? ITEM_WIDTH,
                    offset: (props.width ?? ITEM_WIDTH) * index,
                    index,
                })}
                onScrollBeginDrag={() => {
                }}
                onScrollEndDrag={() => {
                }}
                automaticallyAdjustContentInsets={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                decelerationRate={0}
                renderToHardwareTextureAndroid
                snapToInterval={props.width ?? ITEM_WIDTH}
                snapToAlignment="start"

                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}

                initialNumToRender={1}
                maxToRenderPerBatch={1}
                removeClippedSubviews={true}

            />
            {VALIDATION_CHECK(props.customFooter) && <View style={[props.customFooterContainerStyle, {
                zIndex: 999,
                position: 'absolute',
                bottom: getBottomPadding(useSafeAreaInsets(), 20, 40),
                left: 0,
                right: 0,
            }]}>
                {props.customFooter && props.customFooter(dataWithPlaceholders[currentIndex], currentIndex)}
            </View>}

            {VALIDATION_CHECK(props.showNumber) &&
                <Text style={{
                    color: "#fff",
                    zIndex: 999,
                    position: 'absolute',
                    bottom: getBottomPadding(useSafeAreaInsets(), 20, 0),
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 20,
                }}>{`${currentIndex + 1} / ${dataWithPlaceholders.length}`}</Text>
            }
            {/* ****************** Start of FOOTER ****************** */}
            {VALIDATION_CHECK(props.pagination) &&
                <View style={[footerStyles.primaryContainer, props.paginationContainerStyle]}>
                    <FlatList
                        data={dataWithPlaceholders}
                        extraData={metaData}
                        horizontal
                        style={{ flexGrow: 0, }}
                        contentContainerStyle={{ alignItems: "center", justifyContent: "center", flexGrow: 0, }}
                        renderItem={({ item: _, index }) => {
                            return (
                                <View style={[footerStyles.dot, {
                                    backgroundColor: theme.primary,
                                    opacity: index === currentIndex ? 1 : 0.5,
                                }, props.paginationDotStyle]} key={index} />
                            )
                        }}
                    />
                </View>
            }

            {/* ****************** End of FOOTER ****************** */}

        </View>
    );
};

FlatListCarousel.defaultProps = defaultProps;
export default FlatListCarousel;

const styles = StyleSheet.create({
    primaryContainer: {
    },
});//end of styles

const DOT_SIZE = 10;

const footerStyles = StyleSheet.create({
    primaryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        height: DOT_SIZE,
        width: DOT_SIZE,
        borderRadius: DOT_SIZE,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginLeft: 8,
    },
});//end of footerStyles

