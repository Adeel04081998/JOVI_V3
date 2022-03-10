import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Image as RNImage,
  StyleSheet,
  View,
  ImageProps,
  ViewStyle,
  StyleProp,
  ImageStyle,
  SafeAreaView,
} from 'react-native'
// TODO: support web
// @ts-ignore
import Lightbox from 'react-native-lightbox'
import Image from '../../src/components/atoms/Image'
import { renderFile } from '../../src/helpers/SharedActions'
import constants from '../../src/res/constants'
import { IMessage } from './Models'
import { StylePropType } from './utils'

const styles = StyleSheet.create({
  container: {},
  image: {
    minWidth: constants.window_dimensions.width * 0.7,
    // width: "99%",
    // height: 100,
    minHeight: constants.window_dimensions.width * 0.5,
    borderRadius: 13,
    margin: 8,
    marginBottom: 4,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
})

export interface MessageImageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  imageProps?: Partial<ImageProps>
  lightboxProps?: object
}

export default class MessageImage<
  TMessage extends IMessage = IMessage
  > extends Component<MessageImageProps<TMessage>> {
  static defaultProps = {
    currentMessage: {
      image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: StylePropType,
    imageStyle: StylePropType,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
  }
  render() {
    const {
      containerStyle,
      lightboxProps,
      imageProps,
      imageStyle,
      currentMessage,
    } = this.props
    if (!!currentMessage) {
      const imageMessage = renderFile(currentMessage.image);
      return (
        <View style={[styles.container, containerStyle]}>
          <Image
            {...imageProps}
            useLoader={false}
            style={[styles.image, imageStyle]}
            source={{ uri: imageMessage }}
          />
          {/* <Lightbox
            activeProps={{
              style: styles.imageActive,

            }}
            {...lightboxProps}
          >
            <Image
              {...imageProps}
              style={[styles.image, imageStyle]}
              source={{ uri: currentMessage.image }}
            />
          </Lightbox> */}
        </View>
      )
    }
    return null
  }
}
