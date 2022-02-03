import React, { useState, useRef } from "react";
import { View, Appearance, Keyboard, Alert, Platform, } from "react-native"
import { sharedGetDeviceInfo, sharedExceptionHandler } from "../../helpers/SharedActions"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import TextInput from "../../components/atoms/TextInput";
import Regex from "../../utils/Regex";
import style from "./style";
import theme from "../../res/theme";
import GV from "../../utils/GV";
import Button from "../../components/molecules/Button";
import CheckBox from "@react-native-community/checkbox";
import { getRequest, multipartPostRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import debounce from 'lodash.debounce'; // 4.0.8
import Text from "../../components/atoms/Text";
import VectorIcon from "../../components/atoms/VectorIcon";
import TouchableOpacity from "../../components/atoms/TouchableOpacity";
import { useSelector, useDispatch } from "react-redux";
import NavigationService from "../../navigations/NavigationService";
import Toast from "../../components/atoms/Toast";
import ReduxActions from "../../redux/actions"
import SafeAreaView from "../../components/atoms/SafeAreaView";

export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === 'light')
    const styles = style.styles(colors);
    const userReducer = useSelector(state => state.userReducer);
    console.log("userReducer", userReducer);
    const dispatch = useDispatch()
    const { phoneNumber, hash, } = userReducer;
    let initialState = {
        inputsArr: [
            { id: 1, field: "Email", title: 'Email Address', placeholder: 'Email', pattern: Regex.email, keyboardType: "email-address", validationerror: "Invalid email address", backgroundColor: 'white', value: '', maxLength: 56, isValid: false },
            { id: 2, field: "FirstName", title: 'First name', placeholder: 'First name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid first name", backgroundColor: 'white', value: '', maxLength: 15, isValid: false },
            { id: 3, field: "LastName", title: 'Last name', placeholder: 'Last name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid last name", backgroundColor: 'white', value: '', maxLength: 15, isValid: false },
            { id: 4, field: "Mobile", title: 'Mobile number', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "Invalid mobile number", backgroundColor: '#EFEFEF', value: phoneNumber, maxLength: 15, isValid: true, },
        ],
        'isChecked': false,
        'emailAlreadyExist': null,
        'isLoading': false
    }
    const CROSS_ICON = "ios-close"
    const VALID_ICON = 'ios-checkmark-circle'
    const [state, setState] = useState(initialState)
    const { isChecked, emailAlreadyExist, inputsArr, isLoading } = state;
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
                sharedExceptionHandler(err)
            },
            {})

    }, 200);

    const signUpSuccessHandler = (res) => {
        const { statusCode, loginResult, message } = res;
        if (statusCode !== 200) {
            sharedExceptionHandler(res);
        } else {
            dispatch(ReduxActions.setUserAction({ ...loginResult, isLoggedIn: true, introScreenViewed:true }));
        }

    }
    const signUpErrorHandler = (err) => {
        sharedExceptionHandler(err)

    }
    const _signUpHandler = async () => {
        setState((pre) => ({
            ...pre,
            isLoading: true

        }))
        let deviceInformation = await sharedGetDeviceInfo()
        let formData = new FormData();
        for (let index = 0; index < inputsArr.length; index++) {
            formData.append(inputsArr[index].field, inputsArr[index].value)
        }
        formData.append("Gender", 0),
            formData.append("UserType", 1),
            formData.append("Hash", hash),
            formData.append("Imei", deviceInformation.deviceID),
            formData.append("Firmware", deviceInformation.systemVersion)
        formData.append("SmartPhone", deviceInformation.model)
        formData.append("HardwareID", deviceInformation.deviceID)
        formData.append("isChecked", isChecked);

        multipartPostRequest(
            Endpoints.CREATE_UPDATE,
            formData,
            res => {
                setState((pre) => ({
                    ...pre,
                    isLoading: false

                }))
                signUpSuccessHandler(res)

            },
            err => {
                signUpErrorHandler(err);
                setState((pre) => ({
                    ...pre,
                    isLoading: false

                }))

            },
            {})
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
        NavigationService.NavigationActions.common_actions.goBack();
    }
    return (



        <SafeAreaView style={[styles.container]}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', paddingVertical: 5, }}>
                <TouchableOpacity style={{ flexDirection: 'column', position: 'absolute', left: 10, alignSelf: 'center', justifyContent: 'center', }} wait={0} onPress={onCrossHandler} >
                    <VectorIcon
                        name={CROSS_ICON}
                        color={"black"}
                        size={30}
                    />
                </TouchableOpacity>
                <Text style={{ color: 'black', fontSize: 20 }}>{'Registration'}</Text>

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
                                titleStyle={{ top: -30, color: 'black', fontSize: 15 }}
                                containerStyle={{ borderColor: x.isValid === false && x.value.length > 0 ? "red" : "#707070", backgroundColor: x.backgroundColor, borderWidth: 0.6 }}
                                editable={editable(x)}
                                errorTextStyle={styles.errorText}
                                maxLength={x.maxLength}
                                iconName={x.id === 4 ? VALID_ICON : null}
                                iconColor={x.id === 4 ? "green" : null}
                            />
                        </View>
                    })
                    }
                    <View style={{ margin: 9, flexDirection: "row", width: '100%', }}>
                        <CheckBox
                            boxType="square"
                            value={isChecked}
                            tintColors={{ false: "#767577", true: "#7359BE" }}

                            onValueChange={(value) => {
                                setState((pre) => ({
                                    ...pre,
                                    isChecked: value
                                }))
                            }}

                            onFillColor="#7359BE"
                            onTintColor="#7359BE"
                            onCheckColor="white"
                            // style={{height:20,width:20,marginRight:10,
                            // }}
                            style={Platform.OS === 'android' ? { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] } : { height: 20, width: 20, marginRight: 10 }}
                        //Platform checks are added for checkbox style and the text below, because checkbox height width doesnt work for android, so had to change its style through transform
                        />
                        <Text style={{ color: 'black', fontSize: 14, width: '90%', paddingTop: Platform.OS === 'android' ? 5 : 0, }}>{"Receive news, updates, and offers from JOVI"}</Text>
                    </View>
                </View>
                <Button
                    text="Sign Up"
                    onPress={_signUpHandler}
                    disabled={!enableSubmit()}
                    isLoading={isLoading}


                    style={{ width: "90%", alignSelf: "center", marginBottom: 20, backgroundColor: !enableSubmit() ? "#D3D3D3" : "#7359BE" }}
                />
            </KeyboardAwareScrollView >


        </SafeAreaView >

    )
}