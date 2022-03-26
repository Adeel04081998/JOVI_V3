import React from 'react';
import { Keyboard, Platform } from 'react-native';
import TextInput from '../../../components/atoms/TextInput';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import constants from '../../../res/constants';
import FontFamily from '../../../res/FontFamily';
let numberOfLines = 2
let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (40 * numberOfLines) : null;
const HEIGHT = 50
export default ({ colors, homeStyles, onSearch = () => { }, placeholder = null, searchProps = {}, fontSize = 12 }) => {
    const [state, setState] = React.useState({
        value: '',
    });
    React.useEffect(() => {
        if (Platform.OS === 'android') {
            const keyboardWillHide = () => {
                Keyboard.dismiss();
            }
            Keyboard.addListener('keyboardDidHide', keyboardWillHide);
        }
    }, []);
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F2F1F6",
            borderRadius: 10,
            height: HEIGHT,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#EBEAEE',
        }}>
            <TextInput
                {...searchProps}
                value={state.value}
                textAlign="left"
                onSubmitEditing={() => onSearch(state.value.trim())}
                placeholder={placeholder ?? 'Search for shops and restaurants or pharmacy'}
                onChangeText={(val) => setState(pre => ({ ...pre, value: val }))}
                style={{ minHeight: HEIGHT, fontSize, fontFamily: FontFamily.Poppins.Regular, backgroundColor: "#F2F1F6", right: 10 }}
                maxLength={50}
                numberOfLines={Platform.OS === "ios" ? null : numberOfLines}

            />
            <VectorIcon name='search' style={{ right: constants.window_dimensions.width * 0.08, paddingRight: 5, backgroundColor: "#F2F1F6", }} size={constants.window_dimensions.height * 0.03} color={'#C6C5C8'} onPress={() => onSearch(state.value.trim())} />
        </View>
    );
}
