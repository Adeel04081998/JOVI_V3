import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing, SafeAreaView, } from "react-native"
import { Space_Regex } from "../../utils/Regex";
import styles from './UserRegisterStyles';
import AnimatedTextInput from "../../components/atoms/Textinput";
import { sharedGetDevicInfo } from "../../helpers/SharedActions";

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
    const _signUpHandler = () => {
        let formData = new FormData()
        formData.append("FirstName", fname),
            formData.append("LastName", lname),
            formData.append("Mobile", mobile),
            formData.append("Email", email),
            formData.append("Gender", 0),
            formData.append("UserType", 1),
            formData.append("Hash", fname),
            formData.append("Imei",),
            formData.append("Firmware",)
        formData.append("SmartPhone",)
        formData.append("HardwareID",)
    }
    useEffect(() => {
        _onStartAnimation()
        return () => {

        };
    }, []);
    return (
        <AnimatedSafeAreaView style={[styles.container, { transform: [{ translateX: startValue }] }]}>
            <View style={{ flexDirection: 'row', }}>
                <View style={{ justifyContent: 'flex-start', width: '40%', }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>X</Text>
                </View>
                <View style={{ width: '50%', }}>
                    <Text style={{ color: 'black', fontSize: 20, }}>{'Registration'}</Text>
                </View>
            </View>
            <View style={{ marginTop: 10, flex: 1, }}>
                <ScrollView showsVerticalScrollIndicator={false}   >
                    <View style={styles.view}>
                        <Text>Email Address</Text>
                        <AnimatedTextInput
                            placeholder="Email"
                            style={styles.textInput}
                            value={email}
                            onChangeText={(value) => { _onChangeHandler('email', value) }}
                        />
                        {/* <Text style={styles.errorText}> !Email is invalid</Text> */}
                    </View>
                    <View style={styles.view}>
                        <Text>First name</Text>
                        <AnimatedTextInput
                            placeholder="First name"
                            style={styles.textInput}
                            onChangeText={(value) => { _onChangeHandler('fname', value) }}
                        />
                    </View>
                    <View style={styles.view}>
                        <Text>Last name</Text>
                        <AnimatedTextInput
                            placeholder="Last name"
                            style={styles.textInput}
                            onChangeText={(value) => { _onChangeHandler('lname', value) }}
                        />
                    </View>
                    <View style={styles.view}>
                        <Text>Mobile number</Text>
                        <AnimatedTextInput
                            placeholder="Mobile"
                            style={styles.textInput}
                            onChangeText={(value) => { _onChangeHandler('mobile', value) }}
                        />
                    </View>
                </ScrollView>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={{ alignSelf: 'center', backgroundColor: '#7359BE', width: '80%', paddingVertical: 20, borderRadius: 10, }}>
                    <Text style={{ alignSelf: 'center' }}>sign Up</Text>
                </TouchableOpacity>

            </View>
        </AnimatedSafeAreaView>
    )
}


export default RegisterUser

