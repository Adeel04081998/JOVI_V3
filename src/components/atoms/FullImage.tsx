import React from 'react';
import { Animated, BackHandler, Dimensions, ImageSourcePropType, Modal } from 'react-native';
import ImageZoom from '../../../libs/Image-Viewer';
import View from './View';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

type Props = React.ComponentProps<typeof ImageZoom> & {
  children?: any;
  source: ImageSourcePropType;
  toggleFullImage: (val: boolean) => void;
};

const FullImage = (props: Props) => {
  const animationRef = React.useRef(new Animated.Value(0)).current;
  const [visible, toggleVisible] = React.useState(true);

  const startAnimate = (value = 1) => {
    return Animated.timing(animationRef, {
      duration: 500,
      toValue: value,
      useNativeDriver: true,
    }).start()
  };

  const backAction = () => {
    toggleVisible(false);
    startAnimate(0);
    props.toggleFullImage && props.toggleFullImage(false);
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    startAnimate();
    return () => backHandler.remove();
  }, [])

  return (
    <Modal visible={visible} onRequestClose={backAction}>
      <View style={{ flex: 1, backgroundColor: '#000', }}>
        <ImageZoom
          {...props}
          cropWidth={WINDOW_WIDTH}
          cropHeight={WINDOW_HEIGHT}
          imageWidth={WINDOW_WIDTH}
          imageHeight={WINDOW_WIDTH}
          enableSwipeDown={false}
          enableDoubleClickZoom
          enableCenterFocus
          useNativeDriver>

          <Animated.Image
            style={{
              width: WINDOW_WIDTH, height: WINDOW_WIDTH,
              opacity: animationRef,
            }}
            source={props.source}
          />

        </ImageZoom>
      </View>
    </Modal>
  )
}
export default FullImage