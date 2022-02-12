

import { Platform, StyleSheet } from "react-native"
import FontFamily from "../../res/FontFamily"
export default {
    styles(colors) {
        return StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
            }
            ,
            errorText: {
                color: "red",
                textAlign: 'center',
                width: '100%',
                bottom:Platform.OS === "android"? -25: -20,
                

            },
            headerPrimarycontainer:{
                flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 15,

            },
            headerCrossiconContainer :{
                flexDirection: 'column', position: 'absolute', left: 7, alignSelf: 'center', justifyContent: 'center',
            },
            headerTittle: {
                color: 'black', fontSize: 18, fontWeight: '700', fontFamily: FontFamily.Poppins.Medium

            },
            
            
        })
    }
}



