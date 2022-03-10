import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native'
import { SvgXml } from 'react-native-svg'
import svgs from '../../src/assets/svgs'
import { initColors } from '../../src/res/colors'
import Color from './Color'
import Composer from './Composer'
import { IMessage } from './Models'
import RecordButton from './RecordButton'
import { StylePropType } from './utils'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  text: {
    marginLeft: 6
  },
})
export const GCSendStyles = styles;

export interface SendProps<TMessage extends IMessage> {
  text?: string
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
  alwaysShowSend?: boolean
  disabled?: boolean
  sendButtonProps?: Partial<TouchableOpacityProps>
  onSend?(
    messages: Partial<TMessage> | Partial<TMessage>[],
    shouldResetInputToolbar: boolean,
  ): void
  renderComposer?(props: Composer['props']): React.ReactNode
}

export default class Send<
  TMessage extends IMessage = IMessage
  > extends Component<SendProps<TMessage>> {
  static defaultProps = {
    text: '',
    onSend: () => { },
    label: 'Send',
    containerStyle: {},
    textStyle: {},
    children: null,
    alwaysShowSend: true,
    disabled: false,
    sendButtonProps: null,
  }

  static propTypes = {
    text: PropTypes.string,
    onSend: PropTypes.func,
    label: PropTypes.string,
    containerStyle: StylePropType,
    textStyle: StylePropType,
    children: PropTypes.element,
    alwaysShowSend: PropTypes.bool,
    disabled: PropTypes.bool,
    sendButtonProps: PropTypes.object,
  }

  handleOnPress = () => {
    const { text, onSend } = this.props
    if (text && onSend) {
      onSend({ text: text.trim() } as Partial<TMessage>, true)
    }
  }

  render() {
    const {
      text,
      containerStyle,
      children,
      textStyle,
      label,
      alwaysShowSend,
      disabled,
      sendButtonProps,
    } = this.props

    if (alwaysShowSend || (text && text.trim().length > 0)) {
      const hasText = (text && text.trim().length > 0);

      return (
        <View style={{
          flexDirection: "row", alignItems: "center",
          marginLeft: 10,
          marginRight: 10,
        }}>
          <TouchableOpacity
            testID='send'
            accessible
            accessibilityLabel='send'
            style={[styles.container, containerStyle]}
            onPress={this.handleOnPress}
            // accessibilityTraits='button'
            disabled={!hasText}
            {...sendButtonProps}
          >
            <View>
              {/* {children || <Text style={[styles.text, textStyle]}>{label}</Text>} */}
              {children || (
                <SvgXml xml={svgs.order_chat_send(hasText ? initColors.primary : "#272727", hasText ? 1 : 0.5)} height={23} width={23} style={[
                  styles.text, textStyle
                ]} />
              )}
            </View>
          </TouchableOpacity>


          {/* ****************** Start of MIC ICON ****************** */}
          <RecordButton {...this.props} />

          {/* ****************** End of MIC ICON ****************** */}



          {/* ****************** Start of ATTACHMENT ICON ****************** */}
          <TouchableOpacity
            accessible
            style={[styles.container, containerStyle]}
            onPress={this.handleOnPress}>
            <View>
              {children || (
                <SvgXml xml={svgs.order_chat_attachment()} height={23} width={23} style={[
                  styles.text, textStyle
                ]} />
              )}
            </View>
          </TouchableOpacity>

          {/* ****************** End of ATTACHMENT ICON ****************** */}



        </View>
      )
    }
    return <View />
  }
}
