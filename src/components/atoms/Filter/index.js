import React from 'react';
import { Appearance, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AnimatedKeyboardAwareScroll from '../../molecules/AnimatedKeyboardAwareScroll';
import Text from '../Text';
import ENUMS from '../../../utils/ENUMS';



export default () => {
    const tagswithCategory = useSelector(state => state.categoriesTagsReducer);
    console.log("tagswithCategory", tagswithCategory);
    const { tagsList } = tagswithCategory.tagsWithCategories ?? {}
    console.log("tagsList", tagsList)
    console.log("Enums", ENUMS.FILTERS_TYPES)


    return (
     <ScrollView style={{ backgroundColor:'red',}}
     contentContainerStyle={{flex:1, justifyContent:'center'}}
     >
         <View>
             <Text>sdfd</Text>
         </View>

     </ScrollView>
        
        





    )
}