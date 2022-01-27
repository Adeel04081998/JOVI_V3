import * as React from "react";
import { Image as RNImage, StyleSheet } from "react-native";

type Props = React.ComponentProps<typeof RNImage> & {
  children: any;
  parentRef?:any;
};

const defaultProps={
  parentRef:null,
}

const DEFAULT_IMAGE = require('../../assets/Logo/image_default.png');

const Image = (props: Props) => {
  const [loading, toggleLoading] = React.useState(true);
  const [error, toggleError] = React.useState(false);

  
  // if(error){
  //   return (
  //     <RNImage style={[{
  //       width: 100,
  //       height: 100,
  //       backgroundColor: 'rgba(0,0,0,0.05)',
  //     }, props.style]}
  //       {...props}
  //       source={DEFAULT_IMAGE}
  //     />
  //   )
  // }

  //WHEN NO ERROR
   return (
    <RNImage style={[{
      // width: 100,
      // height: 100,
      flex:1,
      backgroundColor: 'rgba(0,0,0,0.05)',
      ...StyleSheet.absoluteFillObject,
      resizeMode:"contain",
    }, props.style]}

    

      // onLoadEnd={() => toggleLoading(false)}
      // onError={() => {
      //   toggleError(true);
      // }}
      // {...(loading || !props.source) && {
      //   source: DEFAULT_IMAGE
      // }}
      // defaultSource={DEFAULT_IMAGE}

      {...props}
    />
  );
}
Image.defaultProps=defaultProps;
export default Image;
