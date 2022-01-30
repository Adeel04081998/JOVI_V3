

import { StyleSheet } from "react-native"
export default {
    styles(colors) {
        return StyleSheet.create({
            container: {
                flex: 1,
                marginTop:20
               
            }
            ,
            textInput: {
                width: '100%',
                borderWidth: 1.5,
                borderRadius: 5,
                borderColor: 'rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                opacity: 0.9, 
                height: 50,
                paddingHorizontal: 10,
                marginVertical: 10
            },
            view: {
                marginBottom: 5,
            },
            text :{
            },
            errorText :{
                alignSelf:'center',
                color:"red"
        
            },
            buttonView :{
                marginBottom:14,
                // borderWidth:2
        
            }
        })
    }
} 



