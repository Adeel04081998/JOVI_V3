import React from 'react';
import { Appearance, ScrollView } from 'react-native';
import GV from '../../utils/GV';
import theme from '../../res/theme';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import CustomHeader from '../../components/molecules/CustomHeader';
import joviJobStyles from './styles';
import View from '../../components/atoms/View';
import svgs from '../../assets/svgs';
import constants from '../../res/constants';
import CardHeader from './components/CardHeader';
import PitStopLocation from './components/PitStopLocation';
import PitStopDetails from './components/PitStopDetails';
import PitStopEstTime from './components/PitStopEstTime';
import PitStopBuy from './components/PitStopBuy';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Button from '../../components/molecules/Button';
export const PITSTOP_CARD_TYPES = Object.freeze({ "location": 0, "description": 1, "estimated-time": 2, "buy-for-me": 3 });

export default ({ navigation }) => {
    // colors.primary will recieve value from colors.js file's colors
    const WIDTH = constants.window_dimensions.width
    const HEIGHT = constants.window_dimensions.height
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = joviJobStyles(colors, WIDTH, HEIGHT);
    let cardData = [
        {
            "idx": 1,
            "title": "Pitstop",
            "desc": "Please Add Your Pitstop Location",
            "svg": svgs.pitstopPin(),
            "isOpened": true
        },
        {
            "idx": 2,
            "title": "Pitstop Details",
            "desc": "What Would You Like Your Jovi To Do ?",
            "svg": svgs.pitstopPin(),
            "isOpened": false
        },
        {
            "idx": 3,
            "title": "Estimated Waiting Time",
            "desc": "What Is The Estimated Time Of The Job ?",
            "svg": svgs.pitStopBuy(),
            "isOpened": false
        },
        {
            "idx": 4,
            "title": "Buy For Me ?",
            "desc": "Do You Want Us To Buy For You ?",
            "svg": svgs.pitStopEstTime(),
            "isOpened": false
        },
    ]


    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader leftIconName="keyboard-backspace" leftIconType="MaterialIcons" />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 15 }} >
                {cardData.map((item, index) => {
                    return (
                        <View key={`jovijob card Data ${index}`} style={styles.cardView} >
                            <CardHeader title={item.title} description={item.desc} xmlSrc={item.svg} />
                            {item.idx === 1 ?
                                <PitStopLocation /> :
                                item.idx === 2 ?
                                    <PitStopDetails />
                                    : item.idx === 3 ?
                                        <PitStopEstTime /> :
                                        <PitStopBuy />}
                        </View>
                    )
                })}
                <Button
                    text="Save and Continue"
                    onPress={() => { }}
                    style={styles.locButton}
                    textStyle={styles.btnText}
                    fontFamily="PoppinsRegular"
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}


