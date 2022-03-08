import React from 'react';
import { Platform } from 'react-native';
import TextInput from '../../../components/atoms/TextInput';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import constants from '../../../res/constants';
import FontFamily from '../../../res/FontFamily';
let numberOfLines = 2
let minHeight = (Platform.OS === 'ios' && numberOfLines) ? (40 * numberOfLines) : null;
const HEIGHT = 50
export default ({ colors, homeStyles, onSearch = () => { }, placeholder = null, searchProps = {} }) => {
    const [state, setState] = React.useState({
        value: '',
    });
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
                onSubmitEditing={() => onSearch(state.value)}
                placeholder={placeholder ?? 'Search for shops and restaurants or pharmacy'}
                onChangeText={(val) => setState(pre => ({ ...pre, value: val }))}
                // style={{ minHeight: minHeight, alignSelf: 'center', height: constants.window_dimensions.height * .06, backgroundColor: "#F2F1F6", fontFamily: FontFamily.Poppins.Regular }}
                style={{ minHeight: HEIGHT, fontSize: 12, fontFamily: FontFamily.Poppins.Regular, backgroundColor: "#F2F1F6", left: -9, fontFamily: FontFamily.Poppins.Regular }}
                maxLength={50}
                numberOfLines={Platform.OS === "ios" ? null : numberOfLines}

            />
            <VectorIcon name='search' style={{ right: constants.window_dimensions.width * 0.09, paddingRight: 5, backgroundColor: "#F2F1F6", }} size={constants.window_dimensions.height * 0.03} color={'#C6C5C8'} onPress={() => onSearch(state.value)} />
        </View>
    );
}
