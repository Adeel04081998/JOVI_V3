import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions,
  FlatList, ImageStyle, ListRenderItem, StyleProp,
  StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { uniqueKeyExtractor, VALIDATION_CHECK } from '../../helpers/SharedActions';
import constants from '../../res/constants';
import { renderFile } from "../../helpers/SharedActions";
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SPACING = constants.horizontal_margin;

const ITEM_WIDTH = width;
const ITEM_HEIGHT = 150;
const BORDER_RADIUS = 8;

interface ImageCarouselProps {
  data: any[];
  autoPlay?: boolean;
  pagination?: boolean;
  autoPlayInterval?: number;

  width?: number;
  height?: number;

  uriKey?: String;

  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;

  paginationContainerStyle?: StyleProp<ViewStyle>;
  paginationDotStyle?: StyleProp<ViewStyle>;

  onActiveIndexChanged?: (item: any, index: number) => void;
  aspectRatio?: number | undefined;
  theme: Object;
  onPress?: (item: any, index: any) => void;
  onLoadEnd?: (item: any, index: any) => void;
  renderItem: ListRenderItem<any> | null | undefined;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  columnWrapperStyle?: StyleProp<ViewStyle>;
};

const defaultProps = {
  autoPlay: false,
  autoPlayInterval: 3,
  pagination: true,

  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,

  containerStyle: {},
  imageStyle: {},
  paginationContainerStyle: {},
  paginationDotStyle: {},

  onActiveIndexChanged: undefined,

  aspectRatio: undefined,
  uriKey: "",
  theme: {},
  onPress: undefined,
  onLoadEnd: undefined,
  renderItem: undefined,
  contentContainerStyle: undefined,
  style: undefined,
  columnWrapperStyle: undefined,
};

let timer: any = null;

const ImageCarousel: FC<ImageCarouselProps> = (props: ImageCarouselProps) => {
  const isFocused = useIsFocused();
  const skipHandleView = React.useRef(false);
  const theme = {
    primary: '#775EC3',
    ...props.theme
  };
  const interval = props?.autoPlayInterval ?? defaultProps.autoPlayInterval;

  // #region :: STATE's & REF's START's FROM HERE 
  const [dataWithPlaceholders, setDataWithPlaceholders] = useState<any[]>([]);

  const [currentIndex, updateCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const isFirstEffect = useRef<boolean>(true);

  // #endregion :: STATE's & REF's END's FROM HERE 

  // #region :: PROPS DATA SETTING  START's FROM HERE 
  useEffect(() => {
    setDataWithPlaceholders(props.data);
    updateCurrentIndex(0);
  }, [props.data]);

  useEffect(() => {
    if (props.autoPlay && timer === null) {
      startAutoplay();
    }
    return () => stopAutoPlay();
  }, [dataWithPlaceholders]);

  useEffect(() => {
    if (isFocused && !timer && props.autoPlay) {
      startAutoplay();
      return;
    }
    if (!isFocused && timer) {
      stopAutoPlay();
      return;
    }
    return () => { };
  }, [isFocused])

  // #endregion :: PROPS DATA SETTING  END's FROM HERE 

  // #region :: VIEW ABILITY START's FROM HERE 
  const handleOnViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (skipHandleView.current) {
      setTimeout(() => {
        skipHandleView.current = false;
      }, 500);
      return
    };


    const itemsInView = viewableItems.filter(({ item }: { item: any }) => VALIDATION_CHECK(item?.uri ?? props?.uriKey ?? ''));
    if (itemsInView.length !== 0) {
      updateCurrentIndex(itemsInView[0].index);
      return;
    }
  }, []);//end of handleOnViewableItemsChanged

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged: handleOnViewableItemsChanged }])


  // #endregion :: VIEW ABILITY END's FROM HERE 


  // #region :: AUTOPLAY START's FROM HERE 

  // useEffect(() => {
  //   if (props.autoPlay) {
  //     setTimeout(() => {
  //       startAutoplay();
  //     }, interval * 1000);
  //   } else {
  //     clearInterval(timer);
  //     timer = null;
  //   }
  //   return () => {
  //     clearInterval(timer);
  //     timer = null;
  //   }
  // }, [props.autoPlay])//end of effect autoPlay


  const stopAutoPlay = () => {
    clearInterval(timer);
    timer = null;
  }

  const startAutoplay = () => {
    if (!props.autoPlay) return
    if (timer) { stopAutoPlay(); }
    timer = setInterval(() => {
      if (flatListRef.current && props.data.length > 0) {
        updateCurrentIndex((oldIndex: number) => {
          if (oldIndex >= (props.data.length - 1)) {
            return oldIndex - oldIndex;
          } else {
            return oldIndex + 1;
          }
        });
      } else {
        stopAutoPlay();
        setTimeout(() => {
          startAutoplay();
        }, 500);

      }
    }, interval * 1000)
  };//end of startAutoplay

  React.useEffect(() => {
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
      return
    }
    if (!timer) {
      return;
    }
    skipHandleView.current = true;
    if (props.onActiveIndexChanged) {
      const item = dataWithPlaceholders[currentIndex];
      props.onActiveIndexChanged(item, currentIndex);

    }

    if (timer && flatListRef.current && dataWithPlaceholders.length > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex])//endo of useEffect for currentIndex


  // #endregion :: AUTOPLAY END's FROM HERE 

  const onScrollToIndexFailed = () => { };
  return (
    <View style={styles.primaryContainer}  >
      <Animated.FlatList
        ref={flatListRef}
        data={dataWithPlaceholders}
        contentContainerStyle={props.contentContainerStyle}
        style={props.style}
        columnWrapperStyle={props.columnWrapperStyle}
        renderItem={({ item, index, separators }) => {
          if (props.renderItem) {
            return props.renderItem({ item, index, separators })
          }
          if (VALIDATION_CHECK(item?.uri ?? props?.uriKey ?? '') === false) {
            return <View />;
          }
          return (
            <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => { props.onPress && props.onPress(item, index); }}

              disabled={!(props?.onPress ?? false) ? true : false}>
              <View style={[{
                width: props.width ?? ITEM_WIDTH,
              }]}>
                {/* aspectRatio={16 / 7} */}
                <View style={[itemStyles.secondaryContainer, props.containerStyle]}>
                  <Animated.Image source={{ uri: props.uriKey ? renderFile(item[`${props.uriKey}`]) : renderFile(item.uri) }} style={[itemStyles.image, props.imageStyle, {
                    height: props.height ?? ITEM_HEIGHT,
                    width: "100%",
                    ...VALIDATION_CHECK(props.aspectRatio) && {
                      aspectRatio: props.aspectRatio,
                    }
                  }]}
                    onLoadEnd={() => { props.onLoadEnd && props.onLoadEnd(item, index) }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: props.width ?? ITEM_WIDTH,
          offset: (props.width ?? ITEM_WIDTH) * index,
          index,
        })}


        {...props.autoPlay && {
          onScrollBeginDrag: () => {
            skipHandleView.current = false;
            clearInterval(timer);
            timer = null;
          },
          onScrollEndDrag: () => {
            startAutoplay();
          },
        }
        }
        automaticallyAdjustContentInsets={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        // keyExtractor={(_, index) => `Image-Carousal-key-${index}-${new Date().getTime()}`}
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


      {/* ****************** Start of FOOTER ****************** */}
      {VALIDATION_CHECK(props.pagination) &&
        <View style={[footerStyles.primaryContainer, props.paginationContainerStyle]}>
          <FlatList
            data={dataWithPlaceholders}
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

ImageCarousel.defaultProps = defaultProps;
export default React.memo(ImageCarousel);

const styles = StyleSheet.create({
  primaryContainer: {
  },
});//end of styles

const itemStyles = StyleSheet.create({
  primaryContainer: {
  },
  secondaryContainer: {
    marginHorizontal: SPACING,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS,
  },
  image: {
    width: '100%',

    borderRadius: BORDER_RADIUS,
    resizeMode: 'cover',
  },

});//end of itemStyles

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

