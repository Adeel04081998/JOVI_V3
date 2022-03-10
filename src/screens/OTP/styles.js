import { StyleSheet, Dimensions, Platform } from 'react-native';
import FontFamily from '../../res/FontFamily';

export default {
    styles(colors, SPACING_VERTICAL) {
        return StyleSheet.create({
            // otpSafeArea: { flex: 1, backgroundColor: "#F6F5FA" },
            otpSafeArea: {
                flex: 1,
                // alignItems: 'center',
                // justifyContent: 'center',
                backgroundColor: 'white',
                paddingTop: 50,
                // paddingTop: Platform.OS === 'android'?50:0,
            },
            textAlignCenter: { textAlign: "center", fontWeight: '600' },
            otpDropdownParentView: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                marginHorizontal: 20,
                marginTop: 10,
                position: 'relative',
                borderRadius: 12,
                zIndex: 999,
                backgroundColor: "#fff"
            },
            otpDropdownView: { backgroundColor: "#000", alignItems: "center", flexDirection: "row", justifyContent: "center", borderTopEndRadius: 12, borderTopLeftRadius: 12, paddingVertical: SPACING_VERTICAL },
            inputView: {
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 0,
                justifyContent: 'center',
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                width: '100%'
            },
            continueButton: { backgroundColor: "#7359BE", borderRadius: 10 },
            buttonView: { paddingHorizontal: 20, paddingVertical: 15, zIndex: 0 },
            termsAndConditionView: { marginVertical: 5, alignSelf: "center" },
            topView: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor:'red',
            },
            androidOtpWrap: {
                // flex: 1,
                // paddingHorizontal: 20,
                backgroundColor: 'white',
                // top: 20,
                flexDirection: 'row',
                paddingVertical: 5,
                alignItems: 'center',
                justifyContent: 'center'
            },
            otpCode: {
                flex: 0,
                borderRadius: 5,
                paddingVertical: 0,
                height: 50,
                width: 50,
                marginRight: 10,
                fontSize: 12,
                textAlign: 'center',
                paddingLeft: 10,
                color: '#000',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 2,
                backgroundColor: 'white',
                fontFamily: FontFamily.Poppins.Medium
            },
            borderStyleBase: {
                width: 30,
                height: 45
            },

            borderStyleHighLighted: {
                borderColor: "#03DAC6",
            },

            underlineStyleBase: {
                height: 50,
                width: 50,
                borderWidth: 0,
                shadowColor: '#000000',
                shadowRadius: 4,
                shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0.2,
                elevation: 2,
                backgroundColor: 'white',
                borderRadius: 10
            },

            underlineStyleHighLighted: {
                borderColor: "#03DAC6",
            },
            box: {
                marginTop: 32,
                borderRadius: 4,
                backgroundColor: "#61dafb"
            },
            container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
            btn: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            },
            btnText: {
                color: '#fff',
                fontSize: 25,
            },
            dropdown: {
                shadowColor: '#000000',
                shadowRadius: 4,
                shadowOffset: { height: 4, width: 0 },
                shadowOpacity: 0.2,
                elevation: 2,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: 'white'
            },
            overlay: {
                marginHorizontal: 0,
                zIndex: 999,
                position: 'absolute',
                width: Dimensions.get('window').width - 30,
                top: 65
            },
            item: (index) => {
                return {
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderBottomWidth: index == 4 ? 0 : 1,
                    borderBottomColor: 'lightgrey'
                }
            },
            button: {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#efefef',
                height: 50,
                zIndex: 1,
                width: '100%'
            },
            countryCode: {
                paddingVertical: 0,
                height: 50,
                width: 50,
                fontSize: 12,
                flexDirection: 'row',
                alignItems: 'center',
            },
            box: {
                marginTop: 32,
                borderRadius: 4,
                backgroundColor: "red",
            },
        });
    }
}
