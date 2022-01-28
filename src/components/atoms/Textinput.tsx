import * as React from "react";
import { TextInput as RNTextInput} from "react-native";

type Props = React.ComponentProps<typeof RNTextInput> & {
  children: any;
};

const TextInput = (props: Props) =>{
  return (
  <RNTextInput {...props}/>
  );
}

export default TextInput;
