import * as React from "react";
import { Animated, Platform } from "react-native";
import FontFamily from "../../res/FontFamily";
const RNText = Animated.Text;


type Props = React.ComponentProps<typeof RNText> & {
  children: any;
  fontFamily?: "PoppinsBlack" | "PoppinsBlackItalic" | "PoppinsBold"| "PoppinsBoldItalic" | "PoppinsExtraBold"| "PoppinsExtraBoldItalic" | "PoppinsExtraLight"| "PoppinsExtraLightItalic" | "PoppinsItalic"| "PoppinsLight" | "PoppinsLightItalic"| "PoppinsMedium" | "PoppinsMediumItalic"| "PoppinsRegular" | "PoppinsSemiBold"| "PoppinsSemiBoldItalic" | "PoppinsThin"| "PoppinsThinItalic" ;
};

const defaultProps={
  fontFamily:"PoppinsRegular",
}

const Text =(props: Props) =>{
  return (
  <RNText 
  {...props}
   style={[{
    fontFamily: Platform.select({android:props.fontFamily,ios:props.fontFamily?.replace("Poppins","Poppins-")}),
  },props.style]}
  />
  );
}

Text.defaultProps=defaultProps;
export default Text;
