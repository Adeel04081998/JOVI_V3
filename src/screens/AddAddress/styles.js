import { StyleSheet, Appearance } from "react-native";
import { initColors } from "../../res/colors";
import FontFamily from "../../res/FontFamily";

const SPACING_VERTICAL = 10;

export default (colors = initColors, width, height) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 1.4,
        width: '100%',
        zIndex:9
    },
    mainText: {
        fontSize: 18,
        color: colors.black,
        paddingLeft: 20,
        paddingTop:20
    },
    inputContainer: {
        backgroundColor: colors.light_grey,
        borderRadius: 15,
        width: '90%',
        // height: height - (height / 3),
        marginLeft: 20,
        marginVertical: 5
    },
    touchableField: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 20,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: colors.white,
        // backgroundColor:'blue'
    },
    touchableFieldTextContainer: {
        flexDirection: 'column',
        marginLeft: 5,
        // justifyContent:'center'
        // backgroundColor:'red',
        height: 20
    },
    addressText: {
        fontSize: 14,
        color: colors.black, width: width * 0.25
    },
    subAddressText: {
        color: colors.grey,
        fontSize: 12,
    },
    labelTitle: {
        color: colors.primary,
        fontSize: 14,
        textAlign: 'center',
        paddingVertical:5
    },
    addressList: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        backgroundColor : colors.light_grey,
        justifyContent:'center',
        alignItems:'center'
    }

})