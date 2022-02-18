import * as React from "react";
import { TouchableOpacity as RNTC, Animated, GestureResponderEvent, } from "react-native";
import debounce from 'lodash.debounce'; // 4.0.8
const RNTouchableOpacity = Animated.createAnimatedComponent(RNTC);
type Props = React.ComponentProps<typeof RNTouchableOpacity> & {
  children?: any;
  wait?: number,
};

//Using Class base component because Animated.createAnimatedComponent expect Class Not Function
export default class TouchableOpacity extends React.PureComponent<Props>{
  public static defaultProps = {
    wait: 0.3,
  };//end of DEFAULT PROPS DECLARATION

  mycallback = (event: GestureResponderEvent) => {
    this.props.onPress && this.props.onPress(event);
  };

  //@ts-ignore
  onPressHandling = debounce(this.mycallback, this.props.wait * 1000, { leading: true, trailing: false, });

  render = () => {
    return (
      <RNTouchableOpacity {...this.props} onPress={this.onPressHandling} />
    )
  }
}//end of class


