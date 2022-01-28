import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    topView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        // backgroundColor:'red',
    },
    androidOtpWrap: {
        // flex: 1,
        // paddingHorizontal: 20,
        backgroundColor: 'white',
        // top: 20,
        flexDirection: 'row',
        paddingVertical: 5,
        alignItems:'center'
    },
    otpCode: {
        borderRadius: 5,
        paddingVertical: 0,
        height: 50,
        width: 50,
        marginRight: 10,
        fontSize: 12,
        // textAlign: 'center',
        color: '#000',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 2,
        backgroundColor:'white',
    },

});