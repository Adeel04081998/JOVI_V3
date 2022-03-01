import React from 'react';
import { Platform } from 'react-native';
import Text from '../../../components/atoms/Text';
import TextInput from '../../../components/atoms/TextInput';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
let numberOfLines = 2
let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (40 * numberOfLines) : null
export default ({ colors, homeStyles, onSearch = () => { }, placeholder = null, searchProps = {} }) => {
    const [state, setState] = React.useState({
        value: '',
    });
    return (
        <View style={homeStyles.search_container}>
            <TextInput value={state.value} {...searchProps} textAlign="left" onSubmitEditing={() => onSearch(state.value)} placeholder={placeholder ?? 'Search for shops and restaurants or pharmacy'} onChangeText={(val) => setState(pre => ({ ...pre, value: val }))} style={[homeStyles.search_input, { minHeight: minHeight }]}
                maxLength={50}
                numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
            />
            <VectorIcon name='search' style={{ right: 35 }} size={25} color={'#C6C5C8'} onPress={() => onSearch(state.value)} />
        </View>
    );
}
