import React from 'react';
import { Appearance } from 'react-native';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import sampleStyles from '../sampleStyles';
import images from '../../assets/images';
import { PopularList } from '../../components/molecules/GenericList';

export default ({ navigation }) => {
    let tempData = [
        {
            image: images.fastFood(),
            title: "Mc Donald's - I-8 Markaz,",
            estTime: '27',
            description: 'Western Cuisine, Fast Food, Burger',
            averagePrice: '650'
        },
        {
            image: images.fastFood(),
            title: "Mc Donald's - I-8 Markaz",
            description: 'Western Cuisine, Fast Food, Burger',
            distance: '250m'
        },
        {
            image: images.fastFood(),
            title: "Mc Donald's - I-8 Markaz",
            description: 'Western Cuisine, Fast Food, Burger'
        }
    ]
    const onPress = () => {
        SharedActions.navigation_listener.auth_handler(false);
    }
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = sampleStyles.styles(colors);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PopularList data={tempData} mainText={'Popular Near You'} showMoreBtnText={'View More'} />
        </SafeAreaView>
    );
}



