import React, { useState, useRef } from "react";
import { View, Appearance, Keyboard, Platform, Alert, } from "react-native"
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
import ReduxActions from "../../redux/actions"
import SafeAreaView from "../../components/atoms/SafeAreaView";

export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === 'light')
    const styles = style.styles(colors);
    const userReducer = useSelector(state => state.userReducer);
    const dispatch = useDispatch()
    const { phoneNumber, hash, } = userReducer;
    let initialState = {
        inputsArr: [
            { id: 1, field: "FirstName", title: 'First Name', placeholder: 'First name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid first name", backgroundColor: 'white', value: "", maxLength: 15, isValid: true, showError: false },
            { id: 2, field: "LastName", title: 'Last Name', placeholder: 'Last name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid last name", backgroundColor: 'white', value: "", maxLength: 15, isValid: true, showError: false },
            { id: 3, field: "Email", title: 'Email Address', placeholder: 'Email', pattern: Regex.email, keyboardType: "email-address", validationerror: "Invalid email address", backgroundColor: 'white', value: "", maxLength: 56, isValid: true, showError: false },
            { id: 4, field: "Mobile", title: 'Mobile Number', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "", backgroundColor: '#EFEFEF', value: phoneNumber || '03005069491', maxLength: 15, isValid: true, showError: false },
        ],
        'isChecked': false,
        'emailAlreadyExist': null,
        'isLoading': false,
        allValid: false
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
            if (inputsArr[index].field === "Mobile" && !inputsArr[index].isValid) isValidField = false
        }
        return isValidField;
    }


    const signUpSuccessHandler = (res) => {
        setState((pre) => ({ ...pre, isLoading: false }))
        const { statusCode, loginResult, message, } = res;
        if (statusCode !== 200) {
            inputsArr[2].showError = true,
                inputsArr[2].validationerror = message;
            setState(pre => ({ ...pre, inputsArr }))
        } else { dispatch(ReduxActions.setUserAction({ ...loginResult, isLoggedIn: true, introScreenViewed: true })); }
    }
    const signUpErrorHandler = (err) => {
        sharedExceptionHandler(err)
        setState((pre) => ({ ...pre, isLoading: false }))
    }
    const _showValidations = () => {
        let arr = inputsArr.map(x => {
            let showError = (!String(x.value).length || !x.isValid) ? true : false;
            return { ...x, showError }
        })
        setState(pre => ({ ...pre, inputsArr: arr, }))

    }
    const _signUpHandler = async () => {

        let arr = [];
        for (let index = 0; index < inputsArr.length; index++) {
            let showError = false;
            const x = inputsArr[index];
            showError = (!String(x.value).length || !x.isValid) ? true : false;
            arr.push({ ...x, showError })
        }
        if (arr.find(y => y.showError)) {
            setState(pre => ({ ...pre, inputsArr: arr, }))
        }
        else {
            setState((pre) => ({ ...pre, isLoading: true }))
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
                res => { signUpSuccessHandler(res) },
                err => {
                    signUpErrorHandler(err);
                },
                {})
        }
    }

    const editable = (item) => {
        if (item.id === 3) return true; // email
        if (item.id === 1 || item.id === 2) { ///f name lname
            if (inputsArr[0].isValid) return true;
            else return false;
        }
        if (item.id === 4) return false; // mob
    }
    const onCrossHandler = () => {
        NavigationService.NavigationActions.common_actions.goBack();
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={styles.headerPrimarycontainer}>
                <TouchableOpacity style={styles.headerCrossiconContainer} wait={0} onPress={onCrossHandler} >
                    <VectorIcon
                        name={CROSS_ICON}
                        color={"black"}
                        size={25}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTittle}>{'Registration'}</Text>
            </View>

            <KeyboardAwareScrollView  >
                <View style={{ flex: 1, }}>
                    {[...inputsArr, ...inputsArr].map((x, i) => {
                        const isError = x.id !== 4 && x.showError; // mob no
                        return <View style={{ marginTop: 25 }} key={`key-${i}`}>
                            <TextInput
                                title={x.title}
                                spaceFree
                                placeholder={x.placeholder}
                                value={x.value}
                                onChangeText={(value) => (_onChangeHandler(x.field, value, i))}
                                pattern={x.pattern}
                                errorText={isError ? x.validationerror : ""}
                                keyboardType={x.keyboardType}
                                isValid={(value) => {
                                    inputsArr[i].isValid = value;
                                    setState((pre) => ({ ...pre, inputsArr }))
                                }}
                                forceError={isError}
                                titleStyle={{ top: -30, color: 'black', fontSize: 17 }}
                                containerStyle={{ borderColor: isError ? "red" : "#E2E2E2", backgroundColor: x.backgroundColor, borderWidth: 1 }}
                                editable={x.field === "Mobile" ? false : true}
                                errorTextStyle={[styles.errorText, { fontSize: 12 }]}
                                maxLength={x.maxLength}
                                iconName={VALID_ICON}
                                iconColor={x.id === 4 ? "green" : null} // mob number
                                onFocus={() => {
                                    state.inputsArr[i].showError = false;
                                    setState(pre => ({ ...pre, inputsArr, activeIndex: i }))
                                }}
                                showIcon={false}
                            />
                        </View>
                    })
                    }
                    <View style={{ marginHorizontal: 10, flexDirection: "row", }}>
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
                            style={Platform.OS === 'android' ? { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] } : { height: 20, width: 20, marginRight: 10, left: Platform.OS === 'android' ? 0 : 4 }}
                        //Platform checks are added for checkbox style and the text below, because checkbox height width doesnt work for android, so had to change its style through transform
                        />
                        <Text style={{ color: 'black', fontSize: 14, width: '100%', paddingTop: Platform.OS === 'android' ? 5 : 0, }} numberOfLines={2}>{"Receive news, updates, and offers from JOVI"}</Text>
                    </View>
                </View>
            </KeyboardAwareScrollView >

            <Button
                text="Sign Up"
                onPress={_signUpHandler}
                disabled={isLoading}
                isLoading={isLoading}
                textStyle={{ fontSize: 16, color: '#fff', }}
                style={{
                    width: "90%", alignSelf: "center", marginBottom: 10,
                    backgroundColor: !enableSubmit() ? "#D3D3D3" : "#7359BE",
                    borderRadius: 10, position: 'absolute', bottom: 0
                }}
            />
        </SafeAreaView >

    )
}