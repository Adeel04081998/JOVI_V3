import * as React from "react";
import { Animated, Image as RNImage, ImageStyle, Modal, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import AnimatedView from "./AnimatedView";
import FullImage from "./FullImage";
import TouchableScale from "./TouchableScale";

type Props = React.ComponentProps<typeof RNImage> & {
  children?: any;
  parentRef?: any;
  defaultIconSize?: number,
  containerStyle?: StyleProp<ViewStyle>;
  loadingImageStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;

  tapToOpen?: boolean;
};

const defaultProps = {
  parentRef: null,
  defaultIconSize: 100,
  onPress: undefined,
  containerStyle: {},

  tapToOpen: true,
}

const DEFAULT_IMAGE = require('../../assets/Logo/image_default.png');

const Image = (props: Props) => {
  const [loading, toggleLoading] = React.useState(false);
  const [error, toggleError] = React.useState(false);
  const [fullImage, toggleFullImage] = React.useState(false);
  const animationRef = React.useRef(new Animated.Value(0)).current;
  const fullAnimationRef = React.useRef(new Animated.Value(0)).current;

  const loader = error || loading || !props.source;

  React.useEffect(() => {
    startAnimate();
  }, [loader])

  const startAnimate = () => {
    return Animated.timing(animationRef, {
      duration: 1000,
      toValue: loader ? 0 : 1,
      useNativeDriver: true,
    }).start()
  };

  const startFullAnimate = (val: number) => {
    return Animated.timing(fullAnimationRef, {
      duration: 800,
      toValue: val,
      useNativeDriver: true,
    }).start(() => {
      if (val === 0)
        toggleFullImage(false);
    })
  };//end of startFullAnimate

  return (
    <>
      <TouchableScale onPress={() => {
        if (props.onPress) {
          props.onPress();
          return
        }
        if (!fullImage) {
          startFullAnimate(1);
          toggleFullImage(true);
        }

      }}
        // wait={0}
        style={[props.containerStyle]}
        disabled={loader || !props.tapToOpen}>

        <Animated.Image
          style={[
            {
              opacity: animationRef,
            },
            styles.image,
            props.style]}

          onLoadStart={() => toggleLoading(true)}
          onLoadEnd={() => { toggleLoading(false); toggleError(false) }}
          onError={() => toggleError(true)}

          defaultSource={DEFAULT_IMAGE}

          {...props}
        />
      </TouchableScale>



      {/* //WHEN ERROR OR LOADING */}
      {loader &&
        <RNImage
          {...props}
          style={[
            loader ? {
              ...styles.defaultImage,
              height: props.defaultIconSize,
              width: props.defaultIconSize,
              position: 'absolute',

              borderColor: '#140c0c19',
              borderWidth: 0.5,
              borderRadius: 6,
            } : {
              opacity: 0,
              overflow: 'hidden',
            }, props.style, props.loadingImageStyle]}
          source={DEFAULT_IMAGE}
        />
      }

      {fullImage &&
        <FullImage
          source={props.source}
          toggleFullImage={() => {
            startFullAnimate(0);
          }} />
      }
    </>

  );
}
Image.defaultProps = defaultProps;
export default Image;

const styles = StyleSheet.create({
  image: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  defaultImage: {
    // flex: 1,
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "contain",
  },
})