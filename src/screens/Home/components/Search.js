import React from 'react';
import { Keyboard, Platform } from 'react-native';
import TextInput from '../../../components/atoms/TextInput';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import constants from '../../../res/constants';
import FontFamily from '../../../res/FontFamily';
let numberOfLines = 2
let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (40 * numberOfLines) : null;
const HEIGHT = 50
export default ({ colors, homeStyles, onSearch = () => { }, placeholder = null, searchProps = {}, fontSize = 12, containerStyle = {}, textInputStyle = {}, onChangeText = (text) => { }, text = '', editable = true, onPress = undefined,autoFocus=false }) => {
    const [state, setState] = React.useState({
        value: '',
    });
    React.useEffect(() => {
        if (`${text}`.toLowerCase().trim() !== `${state.value}`.toLowerCase().trim()) {
            setState(pre => ({
                ...pre,
                value: text
            }))
        }
    }, [text])
    React.useEffect(() => {
        if (Platform.OS === 'android') {
            const keyboardWillHide = () => {
                Keyboard.dismiss();
            }
            Keyboard.addListener('keyboardDidHide', keyboardWillHide);
        }
    }, []);
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
        <Wrapper {...!editable && {
            onPress: () => {
                onPress();
            }
        }}>
            <View
                {...onPress && {
                    pointerEvents: 'none',
                }} style={[{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F2F1F6",
                    borderRadius: 10,
                    height: HEIGHT,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: '#EBEAEE',
                }, containerStyle]}>
                <TextInput
                    {...searchProps}
                    autoFocus={autoFocus}
                    editable={editable}
                    value={state.value}
                    textAlign="left"
                    onSubmitEditing={() => onSearch(state.value)}
                    placeholder={placeholder ?? 'Search for shops and restaurants or pharmacy'}
                    onChangeText={(val) => {
                        onChangeText(val);
                        setState(pre => ({ ...pre, value: val }))
                    }}
                    style={[{ minHeight: HEIGHT, fontSize, fontFamily: FontFamily.Poppins.Regular, backgroundColor: "#F2F1F6", right: 10 }, textInputStyle]}
                    maxLength={50}
                    numberOfLines={Platform.OS === "ios" ? null : numberOfLines}

                />
                <VectorIcon name='search' style={{ right: constants.window_dimensions.width * 0.08, paddingRight: 5, backgroundColor: "#F2F1F6", }} size={constants.window_dimensions.height * 0.03} color={'#C6C5C8'} onPress={() => onSearch(state.value)} />
            </View>
        </Wrapper>
    );
}
