import React, { useState, useRef } from "react";
import { View, Appearance, Keyboard, Alert, } from "react-native"
import { sharedGetDeviceInfo } from "../../helpers/SharedActions"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import TextInput from "../../components/atoms/TextInput";
import Regex from "../../utils/Regex";
import style from "./style";
import theme from "../../res/theme";
import GV from "../../utils/GV";
import Button from "../../components/molecules/Button";
import CheckBox from "@react-native-community/checkbox";
import { getRequest, postRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import debounce from 'lodash.debounce'; // 4.0.8
import Text from "../../components/atoms/Text";
import VectorIcon from "../../components/atoms/VectorIcon";
import TouchableOpacity from "../../components/atoms/TouchableOpacity";


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === 'light')
    const styles = style.styles(colors);
    const tempData = {
        hash: "as1234",
        mobileNumber: '03005069491' || "Props.user"
    }
    let initialState = {
        inputsArr: [
            { id: 1, field: "Email", title: 'Email Address', placeholder: 'Email', pattern: Regex.email, keyboardType: "email-address", validationerror: "Invalid email address", value: '', maxLength: 18, isValid: false },
            { id: 2, field: "FirstName", title: 'First name', placeholder: 'First name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid first name", value: '', maxLength: 15, isValid: false },
            { id: 3, field: "LastName", title: 'Last name', placeholder: 'Last name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid last name", value: '', maxLength: 15, isValid: false },
            { id: 4, field: "Mobile", title: 'Mobile number', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "Invalid mobile number", value: tempData.mobileNumber, maxLength: 15, isValid: true },
        ],
        'isChecked': false,
        'emailAlreadyExist': null,
        'changeColor': false,
    }
    const CROSS_ICON = "ios-close"
    const [state, setState] = useState(initialState)
    const { isChecked, emailAlreadyExist, inputsArr } = state;
    const emailRef = useRef("")
    const _onChangeHandler = (key, value, i) => {
        if (Regex.Space_Regex.test(value)) return
        let trimValue = value.trim()
        if (key === "Email") {
            emailRef.current = value;
            inputsArr[i].validationerror = 'Invalid email address';
        }
        inputsArr[i].value = trimValue;
        setState(pre => ({
            ...pre,
            emailAlreadyExist: false
        }));
    }
    const enableSubmit = () => {
        let isValidField = true;
        for (let index = 0; index < inputsArr.length; index++) {
            if (inputsArr[index].field !== "Mobile" && !inputsArr[index].isValid) isValidField = false
        }
        return isValidField;
    }
    const checkEmailAlreadyExist = debounce((index) => {
        getRequest(
            `${Endpoints.EMAIL_CHECK}${emailRef.current}`,
            res => {
                Keyboard.dismiss();
                const { statusCode, message } = res.data;
                if (res.data.isEmailFound) {
                    inputsArr[0].isValid = false;
                    inputsArr[0].validationerror = message;
                    setState(pre => ({
                        ...pre,
                        inputsArr,
                        emailAlreadyExist: true
                    }))
                }
                else {
                    // inputsArr[0].isValid = true;
                    // // inputsArr[0].validationerror = "Message Here";
                    // setState(pre => ({
                    //     ...pre,
                    //     inputsArr,
                    //     emailAlreadyExist: true
                    // }))
                }
            },
            err => {
                console.log("err...", err);
            },
            {})

    }, 200);

    const _signUpHandler = async () => {
        let formData = new FormData()
        for (let index = 0; index < inputsArr.length; index++) {
            formData.append(inputsArr[index].field, inputsArr[index].value)
        }
        formData.append("Gender", 0),
            formData.append("UserType", 1),
            formData.append("Hash", tempData.hash),
            formData.append("Imei", await sharedGetDeviceInfo().deviceID),
            formData.append("Firmware", sharedGetDeviceInfo().systemVersion)
        formData.append("SmartPhone", sharedGetDeviceInfo().model)
        formData.append("HardwareID", await sharedGetDeviceInfo().deviceID)
        postRequest(
            Endpoints.CREATE_UPDATE,
            formData,
            res => {
                console.log("res...", res);
                const { statusCode, message } = res.data;
            },
            err => {
                console.log("err...", err);
            },
            { headers: { 'content-type': 'multipart/form-data' } })

    }

    const editable = (item) => {
        if (item.id === 1) return true;
        if (item.id === 2 || item.id === 3) {
            if (inputsArr[0].isValid) return true;
            else return false;
        }
        if (item.id === 4) return false;
    }
    const onCrossHandler = () => {
        console.log("Hy");

    }
    return (
        <View style={[styles.container]}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 9, }} wait={0} onPress={onCrossHandler} >
                    <VectorIcon
                        name={CROSS_ICON}
                        color={"black"}
                        size={30}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', width: '90%', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 20, paddingVertical: 10, }}>{'Registration'}</Text>
                </View>

            </View>

            <KeyboardAwareScrollView style={{}} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, }}>
                    {inputsArr.map((x, i) => {
                        return <View style={{ marginTop: 25 }} key={`key-${i}`}>
                            <TextInput
                                title={x.title}
                                placeholder={x.placeholder}
                                value={x.value}
                                onChangeText={(value) => (_onChangeHandler(x.field, value, i))}
                                pattern={x.pattern}
                                errorText={x.validationerror}
                                keyboardType={x.keyboardType}
                                isValid={(value) => {
                                    inputsArr[i].isValid = value;
                                    setState((pre) => ({ ...pre, inputsArr }))
                                    if (x.field === "Email" && value === true) {
                                        checkEmailAlreadyExist(i)
                                    }
                                }}
                                forceError={x.id === 1 ? emailAlreadyExist : false}
                                titleStyle={{ top: -30, fontSize: 14, fontStyle: 'normal', fontWeight: '600' }}
                                containerStyle={{ borderColor: x.isValid === false && x.value.length > 0 ? "red" : "#707070", borderWidth: 0.6 }}
                                editable={editable(x)}
                                errorTextStyle={styles.errorText}
                                maxLength={x.maxLength}
                            />
                        </View>
                    })
                    }
                    <View style={{ margin: 8, flexDirection: "row", alignItems: "center", }}>
                        <CheckBox
                            boxType="square"
                            value={isChecked}
                            tintColors={{ false: "#767577", true: "#7359BE" }}
                            onValueChange={() => {
                                setState((pre) => ({
                                    ...pre,
                                    isChecked: true
                                }))
                            }}
                        />
                        <Text style={{ color: 'black', fontSize: 14 }}>{"Receive news, updates, and offers from JOVI"}</Text>
                    </View>
                </View>
                <Button
                    text="Sign Up"
                    onPress={_signUpHandler}
                    disabled={!enableSubmit()}
                    style={{ width: "90%", alignSelf: "center", marginBottom: 20, backgroundColor: !enableSubmit() ? "#D3D3D3" : "#7359BE" }}
                />
            </KeyboardAwareScrollView >


        </View >

    )
}