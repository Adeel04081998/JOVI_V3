import React from 'react';
import View from "../../components/atoms/View"
import Text from "../../components/atoms/Text"

export default () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text style={{ color: "white" }}>No internet connection</Text></View>
    );
}
