import * as React from "react";
import { Animated } from "react-native";

type Props = React.ComponentProps<typeof Animated.View> & {
  children?: any;
};

const AnimatedView =(props: Props) =>{
  
  return (
  <Animated.View {...props}/>
  );
}

export default AnimatedView;
