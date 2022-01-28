import * as React from "react";
import { Animated, Image as RNImage, StyleSheet } from "react-native";

type Props = React.ComponentProps<typeof RNImage> & {
  children: any;
  parentRef?: any;
  defaultIconSize?: number,
};

const defaultProps = {
  parentRef: null,
  defaultIconSize: 100,
}

const DEFAULT_IMAGE = require('../../assets/Logo/image_default.png');

const Image = (props: Props) => {
  const [loading, toggleLoading] = React.useState(false);
  const [error, toggleError] = React.useState(false);
  const animationRef = React.useRef(new Animated.Value(0)).current;

  const loader = error || loading || !props.source;

  React.useEffect(()=>{
    startAnimate();
  },[loader])

  const startAnimate = () => {
    return  Animated.timing(animationRef, {
        duration: 1000,
        toValue: loader ? 0 :1,
        useNativeDriver: true,
      }).start()
  };

  return (
    <>
    
      <Animated.Image
        style={[
          {
            opacity: animationRef,
          },
           styles.image,
          props.style]}

        onLoadStart={() => toggleLoading(true)}
        onLoadEnd={() => toggleLoading(false)}
        onError={() => toggleError(true)}

        defaultSource={DEFAULT_IMAGE}

        {...props}
      />


      {/* //WHEN ERROR OR LOADING */}
      <RNImage
        {...props}
        style={[
          loader ? {
            ...styles.defaultImage,
            height: props.defaultIconSize,
            width: props.defaultIconSize,
          } : {
            opacity:0,
          }, props.style]}
        source={DEFAULT_IMAGE}
      />

    </>

  );
}
Image.defaultProps = defaultProps;
export default Image;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  defaultImage: {
    flex: 1,
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "contain",
  },
})