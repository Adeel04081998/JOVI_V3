import * as React from "react";
import { View as RNView } from "react-native";

type Props = React.ComponentProps<typeof RNView> & {
  children: any;
};

const View =(props: Props) =>{
  return (
  <RNView {...props}/>
  );
}

export default View;
