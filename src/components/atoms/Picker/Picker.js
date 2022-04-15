import { Picker } from '@react-native-picker/picker';
import React from 'react';


export default ({ data, style, setSelectedValue, selectedValue, enabled, prompt, mode }) => {
    return (
        <Picker
            onValueChange={itemValue => setSelectedValue(itemValue)}
            selectedValue={selectedValue}
            enabled={enabled}
            style={{ ...style }}
            itemStyle={{ fontSize: 19 }}
            prompt={prompt}
            accessible={enabled}
        >
            {
                data.map((item, i) => (
                    <Picker.Item key={i} label={item} value={item}
                    />
                ))
            }
        </Picker>
    )
}
