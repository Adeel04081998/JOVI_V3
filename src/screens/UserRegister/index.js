import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing, SafeAreaView, KeyboardAvoidingView, Appearance, TextInput, } from "react-native"
import styles from './style';
import AnimatedTextInput from "../../components/atoms/Textinput";
import SharedActions, { sharedGetDevicInfo } from "../../helpers/SharedActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import TextInputNew from "../../components/atoms/TextInput";
import Button from "../../components/molecules/Button";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import style from "./style";
import Regex from "../../utils/Regex";
import { getRequest } from "../../manager/ApiManager";
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)
export default () => {
    const colors = theme.getTheme(ENUMS.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === 'light');
    const styles = style.styles(colors)
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
        {
            field: "email", title: 'Email Address', placeholder: 'Email', pattern: Regex.email, keyboardType: "email-address", validationerror: "Invalid email address",
            value: email, maxLength: 15,
        },
        { field: "fname", title: 'First name', placeholder: 'First name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid first name", value: fname, maxLength: 15, },
        { field: "lname", title: 'Last name', placeholder: 'Last name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid last name", value: lname, maxLength: 15, },
        { field: "mobile", title: 'Mobile number', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "Invalid mobile number", value: mobile, maxLength: 15, },
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
        if (Regex.Space_Regex.test(value)) return
        let trimValue = value.trim()
        setState((pre) => ({ ...pre, [key]: trimValue }))
    }

    const _signUpHandler = async () => {
        let formData = new FormData()
        formData.append("FirstName", fname),
            formData.append("LastName", lname),
            formData.append("Mobile", mobile),
            formData.append("Email", email),
            formData.append("Gender", 0),
            formData.append("UserType", 1),
            formData.append("Hash", fname),
            formData.append("Imei", SharedActions.sharedGetDevicInfo().deviceImei),
            formData.append("Firmware", SharedActions.sharedGetDevicInfo().deviceFirmware)
        formData.append("SmartPhone", SharedActions.sharedGetDevicInfo().deviceModel)
        formData.append("HardwareID", SharedActions.sharedGetDevicInfo().deviceHardWareId)



    }

    const emailCheckSuccessHandler = (response) => {
        console.log("response=>>", response);


    };
    const emailCheckErrorHandler = () => {


    };
    const checkEmailAlreadyExist = () => {
        console.log("email check", email);
        getRequest(`/api/User/EmailCheck/${email}`, {}, {}, emailCheckSuccessHandler, emailCheckErrorHandler, '', false, false)


    };



    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ color: 'black', fontSize: 20, }}>{'Registration'}</Text>
            </View>
            <KeyboardAwareScrollView style={{}} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, }}>
                    {
                        tempArray.map((x, i) => (
                            <View style={{ marginTop: 25 }} key={`key-${i}`}>
                                <TextInputNew
                                    title={x.title}
                                    titleStyle={{ top: -30 }}
                                    placeholder={x.placeholder}
                                    value={x.value}
                                    onChangeText={(value) => _onChangeHandler(x.field, value)}
                                    pattern={x.pattern}
                                    errorText={x.validationerror}
                                    keyboardType={x.keyboardType}
                                    isValid={(value) => {
                                        console.log("is val=>", value)
                                        if (x.field === "email" && value) {

                                            checkEmailAlreadyExist()

                                        }

                                    }}

                                />

                            </View>
                        ))
                    }


                </View>
                <Button
                    style={{ width: "90%", alignSelf: "center", marginBottom: 20 }}
                    text="Sign Up"
                    disabled={true}
                />
            </KeyboardAwareScrollView >


        </View >

    )
}