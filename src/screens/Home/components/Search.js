import React from 'react';
import Text from '../../../components/atoms/Text';
import TextInput from '../../../components/atoms/TextInput';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
export default ({ colors, homeStyles,onSearch=()=>{}, placeholder=null }) => {
    const [state,setState] = React.useState({
        value:'',
    });
    return (
        <View style={homeStyles.search_container}>
            <VectorIcon name='search' style={{ left: 10 }} color={colors.primary} onPress={()=>onSearch(state.value)} />
            <TextInput textAlign="left" placeholder={placeholder??'Search for shops and restaurants or pharmacy'} onChangeText={(val)=>setState(pre=>({...pre,value:val}))} style={homeStyles.search_input} />
        </View>
    );
}
