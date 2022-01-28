import * as React from "react";
import { Animated } from "react-native";
const RNText = Animated.Text;
type Props = React.ComponentProps<typeof RNText> & {
  children: any;
};

const Text =(props: Props) =>{
  return (
  <RNText {...props}/>
  );
}

export default Text;
