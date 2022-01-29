import React from "react";
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
       
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

