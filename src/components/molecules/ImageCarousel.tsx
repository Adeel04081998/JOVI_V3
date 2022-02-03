import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions,
  FlatList, ImageStyle, StyleProp,
  StyleSheet, TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { VALIDATION_CHECK } from '../../helpers/SharedActions';
import constants from '../../res/constants';

const { width } = Dimensions.get('window');

const SPACING = constants.HORIZONTAL_MARGIN;

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

  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;

  paginationContainerStyle?: StyleProp<ViewStyle>;
  paginationDotStyle?: StyleProp<ViewStyle>;

  onActiveIndexChanged?: (index: number) => void;

  aspectRatio?: number | undefined;

}
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
};

let timer: any = null;

const ImageCarousel: FC<ImageCarouselProps> = (props: ImageCarouselProps) => {
  const theme = {
    primary: '#775EC3'
  };

  //  VIEW ABILITY START's FROM HERE 
  const handleOnViewableItemsChanged = useCallback(({ viewableItems }) => {

    const itemsInView = viewableItems.filter(({ item }: { item: any }) => VALIDATION_CHECK(item?.uri ?? ''));
    if (itemsInView.length === 0) {
      return;
    }

    updateCurrentIndex(itemsInView[0].index);
  }, [props.data]);//end of handleOnViewableItemsChanged

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged: handleOnViewableItemsChanged }])

  // VIEW ABILITY END's FROM HERE 

  const [dataWithPlaceholders, setDataWithPlaceholders] = useState<any[]>([]);

  const [currentIndex, updateCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    setDataWithPlaceholders(props.data);

    updateCurrentIndex(0);

  }, [props.data]);


  // AUTOPLAY START's FROM HERE 

  useEffect(() => {
    if (props.autoPlay) {
      setTimeout(() => {
        startAutoplay();
      }, (props.autoPlayInterval ?? 3) * 1000);
    }
    return () => {
      clearInterval(timer);
      timer = null;
    }
  }, [props.autoPlay])//end of effect autoPlay

  const startAutoplay = () => {
    if (!props.autoPlay) return
    if (timer) { clearInterval(timer); timer = null; }
    timer = setInterval(() => {
      if (flatListRef.current) {
        updateCurrentIndex(oldIndex => oldIndex === props.data.length - 1 ? 0 : oldIndex + 1);
      }
    }, (props.autoPlayInterval ?? 3) * 1000)
  };//end of startAutoplay

  React.useEffect(() => {
    props.onActiveIndexChanged && props.onActiveIndexChanged(currentIndex);
    if (timer) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    }
  }, [currentIndex])//endo of useEffect for currentIndex

  // AUTOPLAY END's FROM HERE 

  const onScrollToIndexFailed = () => { }

  return (
    <View style={styles.primaryContainer}>
      <Animated.FlatList
        ref={flatListRef}
        data={[...dataWithPlaceholders,]}


        renderItem={({ item, index }) => {

          if (VALIDATION_CHECK(item?.uri ?? '') === false) {
            return <View />;
          }
          return (
            <TouchableWithoutFeedback onPressIn={() => {
              clearInterval(timer);
              timer = null;
            }}
              onPressOut={() => {
                startAutoplay();
              }}>
              <View style={[{
                width: props.width ?? ITEM_WIDTH,
              }]}>
                <View style={[itemStyles.secondaryContainer, props.containerStyle,]}>
                  <Animated.Image source={{ uri: item.uri }} style={[itemStyles.image, props.imageStyle, {
                    height: props.height ?? ITEM_HEIGHT,
                    width: "100%",
                    ...VALIDATION_CHECK(props.aspectRatio) && {
                      aspectRatio: props.aspectRatio,
                    }

                  }]} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: props.width ?? ITEM_WIDTH,
          offset: (props.width ?? ITEM_WIDTH) * index,
          index,
        })}
        automaticallyAdjustContentInsets={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
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
          {props.data.map((item, index) => {
            return (
              <View style={[footerStyles.dot, {
                backgroundColor: index === currentIndex ? theme.primary : theme.primary,
                opacity: index === currentIndex ? 1 : 0.5,
              }, props.paginationDotStyle]} key={index} />
            )
          })}
        </View>
      }

      {/* ****************** End of FOOTER ****************** */}

    </View>
  );
};

ImageCarousel.defaultProps = defaultProps;
export default ImageCarousel;

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
