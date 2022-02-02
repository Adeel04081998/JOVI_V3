import * as React from "react";
import { SafeAreaView as RNSafeAreaView, } from "react-native";

type Props = React.ComponentProps<typeof RNSafeAreaView> & {
    children?: any;
};

const SafeAreaView = (props: Props) => {
    return (
        <RNSafeAreaView {...props} />
    );
}

export default SafeAreaView;
