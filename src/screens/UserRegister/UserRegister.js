import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing, SafeAreaView, KeyboardAvoidingView, } from "react-native"
import { Space_Regex } from "../../utils/Regex";
import styles from './UserRegisterStyles';
import AnimatedTextInput from "../../components/atoms/Textinput";
import { sharedGetDevicInfo } from "../../helpers/SharedActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

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
        { field: "email", title: 'Email Address', pattern: 'alpha', validationerror: "Invalid email address", value: email, maxLength: 15, },
        { field: "fname", title: 'First name', pattern: 'alpha', validationerror: "Invalid first name", value: fname, maxLength: 15, },
        { field: "lname", title: 'Last name', pattern: 'alpha', validationerror: "Invalid last name", value: lname, maxLength: 15, },
        { field: "mobile", title: 'Mobile number', pattern: 'alpha', validationerror: "Invalid mobile number", value: mobile, maxLength: 15, },
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
        <AnimatedSafeAreaView style={[styles.container, { transform: [{ translateX: startValue }] }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ color: 'black', fontSize: 20, }}>{'Registration'}</Text>

            </View>
            <KeyboardAwareScrollView style={{ borderWidth: 1 }}

            >
                {
                    tempArray.map((x, i) => (
                        console.log("x=>>", x),
                        <View style={{}}>

                            <Text>{x.title}</Text>
                            <AnimatedTextInput
                                style={styles.textInput}
                            />
                        </View>
                    ))
                }

                <View style={{ borderWidth: 1, justifyContent: 'center', alignContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ alignSelf: 'center', backgroundColor: '#7359BE', width: '80%', paddingVertical: 20, borderRadius: 10, }}>
                        <Text style={{ alignSelf: 'center' }}>sign Up</Text>
                    </TouchableOpacity>

                </View>

            </KeyboardAwareScrollView>


        </AnimatedSafeAreaView>
    )
}


export default RegisterUser

