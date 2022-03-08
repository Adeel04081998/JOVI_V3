import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps,
} from 'react-native'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';

import Color from './Color'
import { StylePropType, isSameDay } from './utils'
import { DATE_FORMAT } from './Constant'
import { IMessage } from './Models'
import FontFamily from '../../src/res/FontFamily';

dayjs.extend(calendar)
dayjs.extend(updateLocale)

const formats = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MMMM, DD YYYY'
  }
dayjs.updateLocale('en', {
  calendar: formats
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: 'rgba(39, 39, 39,0.5)',
    fontSize: 12,
    fontFamily: FontFamily.Poppins.Regular,
  },
  seperator: {
    backgroundColor: 'rgba(39, 39, 39,0.3)',
    height: 1,
    flex: 1,
  },
})

export interface DayProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  textProps?: TextProps
  dateFormat?: string
  inverted?: boolean
}

export default class Day<
  TMessage extends IMessage = IMessage
  > extends PureComponent<DayProps<TMessage>> {
  static contextTypes = {
    getLocale: PropTypes.func,
  }

  static defaultProps = {
    currentMessage: {
      createdAt: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    textProps: {},
    dateFormat: DATE_FORMAT,
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    textProps: PropTypes.object,
    dateFormat: PropTypes.string,
  }

  render() {
    const {
      dateFormat,
      currentMessage,
      previousMessage,
      containerStyle,
      wrapperStyle,
      textStyle,
      textProps,
    } = this.props

    if (currentMessage && !isSameDay(currentMessage, previousMessage!)) {
      return (
        <View style={[styles.container, containerStyle, {
          flexDirection: "row",
          marginHorizontal: 20,
        }]}>
          <View style={styles.seperator} />
          <View style={[{ marginHorizontal: 20, }, wrapperStyle]}>
            <Text style={[styles.text, textStyle]} {...textProps}>
              {getDate(currentMessage.createdAt)}
              {/* {dayjs(currentMessage.createdAt)
                .locale(this.context.getLocale())
                .format(dateFormat)} */}
            </Text>
          </View>
          <View style={styles.seperator} />
        </View>
      )
    }
    return null
  }
}

const getDate = (date: any) => {
  const output = dayjs(date).calendar();
  return output;
}