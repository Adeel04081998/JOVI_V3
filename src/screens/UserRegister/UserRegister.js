import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing, SafeAreaView, KeyboardAvoidingView, } from "react-native"
import { Space_Regex } from "../../utils/Regex";
import styles from './UserRegisterStyles';
import AnimatedTextInput from "../../components/atoms/Textinput";
import { sharedGetDevicInfo } from "../../helpers/SharedActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import TextInput from "../../components/atoms/TextInput";
import Button from "../../components/molecules/Button";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)


const RegisterUser = () => {
    let initialState = {
        'fname': "",
        'lname': "",
        'mobile': '',
        'email': "",
        'password': "",
    }

    const [state, setState] = useState(initialState)
    const { email, mobile, fname, lname, password, } = state;

    const startValue = new Animated.Value(1000);
    const endValue = 0;
    let tempArray = [
        { field: "email", title: 'Email Address', placeholder: 'Email', pattern: 'alpha', validationerror: "Invalid email address", value: email, maxLength: 15, },
        { field: "fname", title: 'First name', placeholder: 'First name', pattern: 'alpha', validationerror: "Invalid first name", value: fname, maxLength: 15, },
        { field: "lname", title: 'Last name', placeholder: 'Last name', pattern: 'alpha', validationerror: "Invalid last name", value: lname, maxLength: 15, },
        { field: "mobile", title: 'Mobile number', placeholder: 'Mobile', pattern: 'alpha', validationerror: "Invalid mobile number", value: mobile, maxLength: 15, },
    ]
    const _onStartAnimation = () => {
        Animated.spring(startValue, {
            toValue: endValue,
            // duration: duration,
            friction: 20,
            tension: 20,
            useNativeDriver: true,
            easing: Easing.ease

        }).start()
    }
    const _onChangeHandler = (key, value) => {
        if (Space_Regex.test(value)) return
        let trimValue = value.trim()
        setState((pre) => ({ ...pre, [key]: trimValue }))
    }

    const _signUpHandler = async () => {
        // let formData = new FormData()
        // formData.append("FirstName", fname),
        //     formData.append("LastName", lname),
        //     formData.append("Mobile", mobile),
        //     formData.append("Email", email),
        //     formData.append("Gender", 0),
        //     formData.append("UserType", 1),
        //     formData.append("Hash", fname),
        //     formData.append("Imei",SharedActions.sharedGetDevicInfo().deviceImei),
        //     formData.append("Firmware",SharedActions.sharedGetDevicInfo().deviceFirmware)
        // formData.append("SmartPhone",SharedActions.sharedGetDevicInfo().deviceModel)
        // formData.append("HardwareID",)



    }



    useEffect(() => {
        _onStartAnimation()
        return () => {

        };
    }, []);
    console.log("state=>>", state);
    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ color: 'black', fontSize: 20, }}>{'Registration'}</Text>
            </View>
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'blue' }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'red' }}>
                    {
                        tempArray.map((x, i) => (
                            console.log("x=>>", x),


                            <View style={{ marginTop: 20 }} key={`key-${i}`}>
                                <TextInput
                                    containerStyle={{}}
                                    title={x.title}
                                    placeholder={x.placeholder}



                                />

                            </View>






                        ))
                    }

                </View>

                <Button/>

            </KeyboardAwareScrollView >


        </View >
    )
}


export default RegisterUser

