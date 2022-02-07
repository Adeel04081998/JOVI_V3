import React from 'react';
import Text from '../../../components/atoms/Text';
import TextInput from '../../../components/atoms/TextInput';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
export default ({ colors, homeStyles, placeholder=null }) => {
    return (
        <View style={homeStyles.search_container}>
            <VectorIcon name='search' style={{ left: 10 }} color={colors.primary} />
            <TextInput textAlign="left" placeholder={placeholder??'Search for shops and restaurants or pharmacy'} style={homeStyles.search_input} />
        </View>
    );
}
