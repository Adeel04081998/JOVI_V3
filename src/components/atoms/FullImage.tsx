import React from 'react';
import { Animated, BackHandler, Dimensions, Image, ImageSourcePropType, Modal } from 'react-native';
import ImageZoom from '../../../libs/Image-Viewer';
import { initColors } from '../../res/colors';
import FlatListCarousel from '../molecules/FlatListCarousel';
import Text from './Text';
import VectorIcon from './VectorIcon';
import View from './View';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = (Dimensions.get('window').height);

interface DataItem {
  source: ImageSourcePropType;
  
}
type Props = React.ComponentProps<typeof ImageZoom> & {
  children?: any;
  source: ImageSourcePropType | undefined;
  data?: Array<DataItem | any>;
  toggleFullImage: (val: boolean) => void;
  customFooter: (item: any, index: number) => React.ReactNode;
};

const defaultProps = {
  customFooter: undefined,
}

const FullImage = (props: Props) => {
  const animationRef = React.useRef(new Animated.Value(0)).current;
  const [visible, toggleVisible] = React.useState(true);
  const imageSize = { height: WINDOW_HEIGHT, width: WINDOW_WIDTH };



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

  const _renderItem = (source: ImageSourcePropType | undefined) => {
    if (source)
      return (
        <ImageZoom
          {...props}
          cropWidth={imageSize.width}
          cropHeight={imageSize.height}
          imageWidth={imageSize.width}
          imageHeight={imageSize.height}
          enableSwipeDown={false}
          enableDoubleClickZoom
          enableCenterFocus
          useNativeDriver>

          <Animated.Image
            style={{
              width: imageSize.width,
              height: imageSize.height,

              opacity: animationRef,
            }}
            source={source}
            resizeMode={"contain"}
          />

        </ImageZoom>
      )
    else null
  }

  return (
    <Modal visible={visible} onRequestClose={backAction}>
      <View style={{ flex: 0, backgroundColor: '#000', }}>
        {(props?.data ?? []).length > 0 ?
          <View>
            <FlatListCarousel
              colors={{ ...initColors, }}
              customFooter={props.customFooter}
              pagination={false}
              showNumber
              data={props?.data ?? []}
              renderItem={({ item }) => {
                return (
                  <>
                    {_renderItem(item.source)}
                  </>
                )
              }}
            />

          </View>
          :
          _renderItem(props?.source ?? undefined)
        }
        <VectorIcon name="close" type="AntDesign" color={'#fff'} size={30} style={{
          position: 'absolute', top: 30, right: 10
        }} onPress={backAction} />
      </View>
    </Modal>
  )
};

FullImage.defaultProps = defaultProps;
export default FullImage