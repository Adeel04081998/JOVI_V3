import { StyleSheet } from 'react-native';
import constants from '../../res/constants';
export default StyleSheet.create({
    topView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    buttonTopView: { backgroundColor: '#7359BE', position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 70, width: 220, height: 70, borderRadius: 100 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    lottieView: { aspectRatio: (constants.SCREEN_DIMENSIONS.width*0.9) / (constants.SCREEN_DIMENSIONS.width*1.9), flexGrow: 1, alignSelf: 'center' }
});