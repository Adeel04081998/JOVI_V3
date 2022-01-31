import * as React from "react";
import { View as RNView,Animated, } from "react-native";

type Props = React.ComponentProps<typeof RNView> & {
  children?: any;
};

const AnimatedView =(props: Props) =>{
  
  return (
  <Animated.View {...props}/>
  );
}

export default AnimatedView;
