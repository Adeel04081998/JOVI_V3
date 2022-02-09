import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import AnimatedView from "../../../components/atoms/AnimatedView";
import Text from "../../../components/atoms/Text";
import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
import View from "../../../components/atoms/View";

export default () => {
    // let inputsArr = [
    //     { id: 1, field: "Email", title: 'Email address', },
    //     { id: 2, field: "FirstName", title: 'First name', },
    //     { id: 3, field: "LastName", title: 'Last name', },
    //     { id: 4, field: "Mobile", title: 'Mobile number', },
    //     { id: 4, field: "Mobile", title: 'Mobile number', },
    //     { id: 4, field: "Mobile", title: 'Mobile number', },

    // ]
    let initialState = {
        inputsArr: [
            { id: 1, field: "Email", title: 'Email address', },
            { id: 2, field: "FirstName", title: 'First name', },
            { id: 3, field: "LastName", title: 'Last name', },
            { id: 4, field: "Mobile", title: 'Mobile number', },
            { id: 4, field: "Mobile", title: 'Mobile number', },
            { id: 4, field: "Mobile", title: 'Mobile number', },

        ],
        'isSelected': false,

    }
    const [state, setState] = useState(initialState)
    console.log("state=>>", state);
    return (
        <View>
            <Text style={{ fontSize: 14, color: '#F94E41' }}>Choose addition</Text>
            <Text>Required</Text>
            <AnimatedView style={styles.primaryContainer}>
                {
                    state.inputsArr.map((x, i) => {
                        return <AnimatedView style={styles.container}>

                            <TouchableOpacity style={styles.radioCircle}
                                onPress={(x) => {
                                    setState(pre => ({
                                        ...pre,
                                        isSelected: true
                                    }));


                                }}
                            >
                                <View style={styles.filledCircle(state.isSelected)}>
                                </View>
                            </TouchableOpacity>
                            <Text style={{}}>{x.field}</Text>


                        </AnimatedView>

                    })

                }


            </AnimatedView>

        </View>



    )

}
const styles = StyleSheet.create({
    primaryContainer: {
        backgroundColor: 'white',
        // flex:1
        padding: 10,
        borderWidth: 1,
        marginVertical: 5,
        // paddingVertical:10,
        // paddingHorizontal:8,
        borderRadius: 10


    },
    container: {
        flexDirection: 'row', width: "100%", alignItems: 'center', paddingVertical: 3

    },
    radioCircle: {
        height: 25, width: 25,
        borderRadius: 90,
        marginRight: 12,
        borderWidth: 3,
        // borderColor: '#D3D3D3',
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filledCircle: (val) => ({
        width: 10, height: 10, borderRadius: 30, backgroundColor: val ? "red" : "blue"
    }
    )
})