import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    topView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    buttonTopView: { backgroundColor: '#7359BE', position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 70, width: 220, height: 70, borderRadius: 100 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    lottieView: { aspectRatio: 300 / 585, flexGrow: 1, alignSelf: 'center' }
});