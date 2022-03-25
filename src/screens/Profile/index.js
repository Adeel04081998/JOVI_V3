import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ImageBackground, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Dimensions, ActivityIndicator, BackHandler, Alert } from 'react-native';
import CustomHeader from '../../components/header/CustomHeader';
// import commonIcons from '../../assets/svgIcons/common/common';
// import editIcon from '../../assets/profile/edit_profile.svg';
// import pswIcon from '../../assets/profile/edit_psw.svg';

import svgs from '../../assets/svgs/index';
// import plateformSpecific from '../../utils/plateformSpecific';
// import CustomInput from '../../components/input/Input';
import { SvgXml } from 'react-native-svg';
// import { getRequest, postRequest } from '../../services/api';
import errorsUI from '../../components/validations';
import correctIcon from '../../assets/svgIcons/common/correct_icon.svg';
import ChangePassword from './ChangePassword';
import CustomToast from '../../components/toast/CustomToast';
import { sharedImagePickerHandler, renderPicture, sharedlogoutUser, navigateWithResetScreen, sharedObjectComparison, sharedOpenModal, sharedLounchCameraOrGallary, sharedServerErrorToast, sharedRenderEmptyProfilePicture, sharedConfirmationAlert } from '../../utils/sharedActions';
import Spinner from 'react-native-spinkit';
import { connect } from 'react-redux';
// import { userAction } from '../../redux/actions/user';
import { openModalAction, closeModalAction } from '../../redux/actions/modal';
// import Picker from '../../components/dropdowns/picker';
import { isJoviCustomerApp } from '../../config/config';
import waitIcon from '../../assets/svgIcons/rider/waitIcon.svg';
import errorIcon from '../../assets/svgIcons/rider/errorIcon.svg';
import CustomImageView from '../../components/imageView';
import JoviImage from '../../components/image/JoviImage';
import { TouchableOpacity as GTouchableOpacity } from 'react-native-gesture-handler';
import { DEVICE_WIN_HEIGHT, EMAIL_REGEX } from '../../config/config';
import { debounce } from 'debounce';
import TextInput from '../../components/atoms/TextInput';
import { getRequest, postRequest } from '../../manager/ApiManager';
import constants from '../../res/constants';

const commonStyles = {
    "fontStyles": (fontSize = 12, color = undefined, fontIndex = 1, fontWeight = undefined, textTransform = "capitalize") => ({
        fontSize,
        color,
        fontWeight,
        textTransform,
    }),
}

const maleIcon = svgs.Percentage();
const femalIcon = svgs.Percentage();
const unselIcon = svgs.Percentage();
const selIcon = svgs.Percentage();
const nextIcon = svgs.Percentage();
const cameraIcon = svgs.Percentage();
const doodleImg = svgs.Percentage();
const modalCam = svgs.Percentage();

const DatePicker = props => {
    const [dateState, setDateState] = useState({
        "D": props.parentState.dob.split("/")[0] || props.parentState.daysArr[0],
        "M": props.parentState.dob.split("/")[1] || props.parentState.monthsArr[0],
        "Y": props.parentState.dob.split("/")[2] || props.parentState.yearsArr[0],
        // "dateString": props.parentState.dob || ""
    });

    return (
        <View style={{ width: "100%", padding: 30 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', }}>
                <TouchableOpacity onPress={() => props.dispatch(closeModalAction())}>
                    <Text style={{ color: props.activeTheme.default, }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    props.onSave('dob', `${dateState.D}/${dateState.M}/${dateState.Y}`);
                    props.dispatch(closeModalAction());
                }}>
                    <Text style={{ color: props.activeTheme.default }}>Save </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Platform.select({ android: 20, ios: 0 }) }}>
                {
                    [{ key: "D", selectedValue: dateState.D, prompt: "Date", data: props.parentState.daysArr }, { key: "M", selectedValue: dateState.M, prompt: "Month", data: props.parentState.monthsArr }, { key: "Y", selectedValue: dateState.Y, prompt: "Year", data: props.parentState.yearsArr }].map((X, i) => (
                        <View key={i} style={{ top: Platform.select({ android: 0, ios: 20 }) }} >
                            <Text style={[commonStyles.fontStyles(16, props.activeTheme.black, 4), { left: 5, textAlign: Platform.select({ ios: 'center', android: "left" }) }]}>
                                {X.prompt}
                            </Text>
                            {/* <Picker
                                data={X.data}
                                style={{ width: i > 1 ? 110 : 85, bottom: Platform.select({ ios: 10, android: 0 }) }}
                                setSelectedValue={v => setDateState({ ...dateState, [X.key]: v })}
                                mode={"dialog"}
                                prompt={`Select ${X.prompt}`}
                                selectedValue={X.selectedValue}
                                enabled={true}
                            /> */}
                        </View>

                    ))
                }
            </View>
        </View >
    )
};
const chooseFromGallery = debounce((uiType, parentState, parentProps, handlers, setSmLoader) => {
    const removePicture = () => {
        if (parentState.picturePicked) {

            parentProps.dispatch(closeModalAction());
            parentProps.dispatch(userAction({ ...parentProps.U, picture: sharedRenderEmptyProfilePicture(), isLocalChange: true, }));
            handlers.setState(pre => ({
                ...pre, picture: sharedRenderEmptyProfilePicture(), pictureObj: {}, picturePicked: false,

            }));

        }
        else {



            setSmLoader(true);
            // postRequest(
            //     `/api/User/RemovePicture`,
            //     {
            //         'removePic': true,
            //     },
            //     {},
            //     parentProps.dispatch,
            //     success => {
            //         if (success.data.statusCode === 200) {
            //             setSmLoader(false);
            //             parentProps.dispatch(closeModalAction());
            //             parentProps.dispatch(userAction({ ...parentProps.U, picture: sharedRenderEmptyProfilePicture(), isLocalChange: true, isProfilePicAttached: false }));
            //             handlers.setState(pre => ({
            //                 ...pre, picture: sharedRenderEmptyProfilePicture()

            //             }));
            //             CustomToast.success("Profile picture removed")
            //         }
            //     },
            //     error => {
            //         console.log("[Error ] : ", error);
            //         if (error) CustomToast.error("Something went wrong");
            //         setSmLoader(false);
            //     },
            //     '',
            //     false)
        }
    }

    if (uiType === 1) {
        // sharedConfirmationAlert("Alert", "Are you sure you want to remove profile picture?", removePicture, () => { }, "No", "Yes")

    } else {
        sharedLounchCameraOrGallary(2, () => { }, picData => {

            handlers.getPicture(picData);
            // parentProps.dispatch(userAction({ ...parentProps.U, isProfilePicAttached: true }));
            // parentProps.dispatch(closeModalAction());


        })
    }

}, 200);
const ModalView = ({ parentProps, parentState, uiType, handlers }) => {

    const [smLoader, setSmLoader] = useState(false);
    return <View style={{ flex: 1, width: DEVICE_WIN_WIDTH, padding: 30, justifyContent: 'space-between' }}>
        <SvgXml xml={modalCam} height={40} width={40} style={{ alignSelf: 'center' }} />
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: parentProps.activeTheme.default, paddingVertical: 15, borderRadius: 5 }}
            onPress={() => {
                if (uiType === 1) {

                    parentProps.dispatch(closeModalAction());
                    if (Platform.OS === "ios") {
                        setTimeout(() => {
                            handlers.takePictureHandler(false);
                        }, 0);
                    } else {
                        handlers.takePictureHandler(false);
                    }
                } else {

                    sharedLounchCameraOrGallary(1, () => { }, picData => {
                        handlers.getPicture(picData);
                        // parentProps.dispatch(closeModalAction());
                        parentProps.dispatch(userAction({ ...parentProps.U, isProfilePicAttached: true }))
                        parentProps.dispatch(closeModalAction());



                        // parentProps.dispatch(userAction({ ...parentProps.U, isProfilePicAttached:true}));


                    })
                }
            }}
        >
            <Text style={commonStyles.fontStyles(14, parentProps.activeTheme.white, 4)}>{uiType ? "View Picture" : "Take photo"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: parentProps.activeTheme.validationRed, paddingVertical: 15, borderRadius: 5 }}
            onPress={() => chooseFromGallery(uiType, parentState, parentProps, handlers, setSmLoader)}
        >
            {
                smLoader ?
                    <ActivityIndicator style={{ paddingHorizontal: 10 }} size="small" color={parentProps.activeTheme.white} />
                    :
                    <Text style={commonStyles.fontStyles(14, parentProps.activeTheme.white, 4)}>{uiType ? "Remove Picture" : "Choose from gallery"}</Text>
            }
        </TouchableOpacity>


    </View>
};

function Profile(props) {
    console.log("Profile.props :", props);
    const { screen_dimensions } = constants;
    const DEVICE_WIN_WIDTH = screen_dimensions.width;
    let initState = {
        'emailAlreadyExist': false,
        'activeTab': 0,
        'isValid': true,
        'focusedField': '',
        'gender': props.U.genderEnum || 1,
        'fname': props.U.firstName || "",
        'lname': props.U.lastName || "",
        'mobile': props.U.mobile || "",
        'email': props.U.email || "",
        'dob': props.U.dob || "",
        'picture': props.U.picture && props.U.isLocalChange ? props.U.picture : props.U.picture ? renderPicture(props.U.picture, props.U.tokenObj.token.authToken) : sharedRenderEmptyProfilePicture(),
        'pictureObj': {},
        'pictureSentObj': {},
        'oldPassword': "",
        'newPassword': "",
        'confirmPassword': "",
        'validationsArr': [],
        'isLoading': false,
        'yearsArr': [],
        'monthsArr': [],
        'daysArr': [],
        'isImageViewOpen': false,
        'picturePicked': false,
        'riderHrs': "",
        'riderMins': "",
        "emailCheckLoader": false,



    };
    const [state, setState] = useState(initState);

    const APPROVED_RIDER_VALIDATION = false,
        ONLINE_RIDER_VALIDATION = false,
        IS_KEYBOARD_OPENED = false,
        editProfileBool = state.mobile.length >= 9 ? false : true,
        editPasswordeBool = state.isValid && state.oldPassword.length > 0 && state.newPassword.length > 0 && state.confirmPassword.length > 0 ? false : true;
    console.log('APPROVED_RIDER_VALIDATION :', APPROVED_RIDER_VALIDATION);
    console.log('ONLINE_RIDER_VALIDATION :', ONLINE_RIDER_VALIDATION);
    console.log('state :', state);
    console.log(" state.activetab", state.activeTab)
    // console.log("sharedObjectComparison(state.pictureObj, state.pictureSentObj) :", sharedObjectComparison(state.pictureObj, state.pictureSentObj, []));
    const toggleHandler = (type, idx) => {
        setState(prevState => {
            if (type === 1) return { ...prevState, ...initState, yearsArr: prevState.yearsArr, monthsArr: prevState.monthsArr, daysArr: prevState.daysArr, activeTab: idx, picture: prevState.picture, pictureObj: prevState.pictureObj }
            else return { ...prevState, gender: idx }
        })
    };
    const onChangeHandler = (key, value) => {
        // debugger;
        if (key === 'mobile') {
            // console.log(value)
            if (!state.mobile.length && value == '0') value = '';
            else if (value[0] == '0') {
                value = value.slice(1, value.length);
            }
            else if (value.slice(0, 3) === "920") {
                // value = value.slice(0, 2) + value.slice(2, value.length);
                value = value.slice(0, 2);
            }
            else {
                value = value;
            }
        } else if (key === 'email') {
            // console.log('email changing :', value);
            // if (value.split('.')[1] === 'com' && value === props.user.email) return setState(prevState => ({ ...prevState, [key]: value, focusedField: key }));
            // else if (value.split('.')[1] === 'com') {
            if (Array.isArray(value.match(EMAIL_REGEX)) && value === props.user.email) return setState(prevState => ({ ...prevState, [key]: value, focusedField: key }));
            else if (Array.isArray(value.match(EMAIL_REGEX))) {
                setState(prevState => ({ ...prevState, emailCheckLoader: true }))
                getRequest(`/api/User/EmailCheck/${value}`, {}, props.dispatch, res => {
                    if (res.data.statusCode === 200) setState(prevState => ({ ...prevState, emailAlreadyExist: true, isValid: false, emailCheckLoader: false }));
                    else if (res.data.statusCode === 404) setState(prevState => ({ ...prevState, emailAlreadyExist: false, isValid: true, emailCheckLoader: false }));
                },
                    err => {
                        console.log("onChangeHandler.getRequest.err :", err)
                    },
                    '',
                    true,
                    false)
            }
            else {
                setState(prevState => ({ ...prevState, emailAlreadyExist: false, isValid: prevState.isValid }));
            }
        }
        setState(prevState => ({ ...prevState, [key]: value, focusedField: key }));
    }
    const onValidation = (isValidBool, key, value) => {
        // debugger;
        if (state.focusedField === 'newPassword') {
            state.validationsArr[0] = value.length >= 8 && value.length <= 32 ? true : false
            state.validationsArr[1] = value.match(/[A-Z]/g) ? true : false
            state.validationsArr[2] = value.match(/[a-z]/g) ? true : false
            state.validationsArr[3] = value.match(/[0-9]/g) ? true : false
        }
        else if (state.focusedField === 'confirmPassword' && value !== state.newPassword) {
            isValidBool = false;
        }
        console.log("isValidBool", isValidBool)
        setState(prevState => ({ ...prevState, isValid: isValidBool, validationsArr: state.validationsArr }));
    };
    // const toggleModal = () => setState(prevState => ({ ...prevState, calanderOpened: !prevState.calanderOpened }));
    const profileUpdateHandler = () => {
        let formData = new FormData();
        formData.append("UserID", props.U.userID);
        formData.append("FirstName", state.fname);
        formData.append("LastName", state.lname);
        formData.append("Email", state.email);
        formData.append("Mobile", state.mobile);
        formData.append("DateOfBirth", state.dob);
        formData.append("Gender", state.gender);
        // formData.append("Picture", Object.keys(state.pictureObj).length ? state.pictureObj : "");
        formData.append("Picture", sharedObjectComparison(state.pictureObj, state.pictureSentObj, []) ? "" : Object.keys(state.pictureObj).length ? state.pictureObj : "");
        formData.append("OldPassword", state.oldPassword);
        formData.append("Password", state.newPassword);
        formData.append("ConfirmPassword", state.confirmPassword);
        formData.append("UserType", isJoviCustomerApp ? 1 : 2);
        formData.append("IsDuplicate", false);
        postRequest(
            '/api/User/CreateUpdate',
            formData,
            { headers: { 'content-type': 'multipart/form-data' } },
            props.dispatch,
            res => {
                if (state.activeTab > 0) {
                    sharedlogoutUser(props.navigation, postRequest, props.dispatch, props?.U, false);
                    CustomToast.success(res.data.message);
                }
                else {
                    setState(pre => ({ ...pre, pictureSentObj: state.pictureObj, picturePicked: false }));
                    props.dispatch(userAction({ ...props.U, dob: state.dob || props.U.dob, gender: (state.gender === 1 || props.U.genderEnum === 1) ? "Male" : "Female", genderEnum: state.gender || props.U.genderEnum, email: state.email || props.U.email, firstName: state.fname, lastName: state.lname, isLocalChange: Object.keys(state.pictureObj).length ? true : false, picture: Object.keys(state.pictureObj).length ? state.picture : props.U.picture, picStatus: Object.keys(state.pictureObj).length ? 1 : props.U.picStatus, picStatusStr: Object.keys(state.pictureObj).length ? props.U.picStatusStr : "Pending" }));
                    CustomToast.success(res.data.message);
                }
            },
            err => {
                if (err.statusCode === 651) {
                    CustomToast.error(err.response)
                } else {
                    sharedServerErrorToast(err)

                }

                // console.log(err)
            },
            '')
    };
    const onSavePress = (clickType) => {
        Keyboard.dismiss();
        if (clickType === 'changeNumber') {
            navigateWithResetScreen(0, [{
                name: "OTP",
                backScreenObj: {
                    container: "Dashboard",
                    screen: "profile_container"
                }
            }])
        }
        // if ((state.mobile !== props.U.mobile) || props.user.changeMobileNumber) {
        //     sendOtpHandler();
        // }
        else {
            profileUpdateHandler();
        }

    };
    const getPicture = picData => setState(prevState => ({
        ...prevState,
        isLoading: false,
        picturePicked: true,
        picture: picData.uri,
        pictureObj: {
            uri: Platform.OS === 'android' ? picData.uri : picData.uri.replace("file://", ""),
            name: picData.uri.split('/').pop(),
            type: picData.type
            // type: 'image/jpg'
        }
    }));
    const takePictureHandler = async (takePick) => {

        if (!takePick) return setState(pre => ({ ...pre, isImageViewOpen: true }));
        else {
            try {
                await sharedImagePickerHandler(() => setState(prevState => ({ ...prevState, isLoading: false })), picData => getPicture(picData))
            } catch (error) {
                setState(prevState => ({ ...prevState, isLoading: false }));
            }
        }
    };

    const openDatePicker = () => {
        // let ModalComponent = {
        //     visible: true,
        //     transparent: true,
        //     okHandler: () => { },
        //     onRequestCloseHandler: null,
        //     ModalContent: (<DatePicker activeTheme={props.activeTheme} parentState={state} onSave={(key, value) => onChangeHandler(key, value)} {...props} />),
        //     modalFlex: Platform.select({ ios: 1, android: 2 }),
        //     modelViewPadding: 0
        // };
        // props.dispatch(openModalAction(ModalComponent));
    };
    const renderProfileUI = () => {
        if (!isJoviCustomerApp) {
            if (parseInt(props.U.picStatus) === 3 || parseInt(props.U.picStatus) === 0) {
                return <Fragment>
                    <ImageBackground source={{ uri: state.picture }} resizeMode="cover" style={{ height: 90, width: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', }} onLoadStart={() => setState(prevState => ({ ...prevState, isLoading: true }))} onLoadEnd={() => setState(prevState => ({ ...prevState, isLoading: false }))}>
                        <Spinner isVisible={state.isLoading} size={30} type="Circle" color={props.activeTheme.default} />
                    </ImageBackground>
                    {
                        state.activeTab === 0 ?
                            <TouchableOpacity
                                disabled={!ONLINE_RIDER_VALIDATION}
                                // onPress={() => takePictureHandler(true)}
                                onPress={() => sharedOpenModal({ dispatch: props.dispatch, visible: true, transparent: true, modalHeight: 220, modelViewPadding: 0, ModalContent: <ModalView parentState={state} parentProps={{ ...props }} uiType={0} handlers={{ getPicture }} />, okHandler: () => { }, onRequestCloseHandler: null, androidKeyboardExtraOffset: 0 })}
                                style={{ backgroundColor: props.activeTheme.grey, position: 'absolute', zIndex: 1, left: 55, top: 60, borderRadius: 17, borderColor: props.activeTheme.white, borderWidth: 1, height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <SvgXml xml={cameraIcon} height={20} width={20} />
                            </TouchableOpacity>
                            : null
                    }
                </Fragment>
            } else {
                return <Fragment>
                    <ImageBackground
                        source={{ uri: state.picture }}
                        resizeMode="cover" style={{ height: 90, width: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onLoadStart={() => setState(prevState => ({ ...prevState, isLoading: true }))}
                        onLoadEnd={() => setState(prevState => ({ ...prevState, isLoading: false }))}
                    />
                    {
                        state.activeTab === 0 ?
                            <TouchableOpacity
                                disabled={parseInt(props.U.picStatus) === 2 ? false : true}
                                onPress={parseInt(props.U.picStatus) === 2 ? () => takePictureHandler(false) : () => { }}
                                // onPress={parseInt(props.U.picStatus) === 2 ? () => sharedOpenModal({ dispatch: props.dispatch, visible: true, transparent: true, modalHeight: 220, modelViewPadding: 0, ModalContent: <ModalView parentState={state} parentProps={{ ...props }} uiType={0} handlers={{ getPicture }} />, okHandler: () => { }, onRequestCloseHandler: null, androidKeyboardExtraOffset: 0 }) : () => { }}
                                style={{ backgroundColor: props.activeTheme.white, position: 'absolute', zIndex: 1, left: 55, top: 60, borderRadius: 20, borderColor: props.activeTheme.white, borderWidth: 1, height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }
                                }>
                                <SvgXml xml={parseInt(props.U.picStatus) === 1 ? waitIcon : errorIcon} height={20} width={20} />
                            </TouchableOpacity >
                            : null
                    }
                </Fragment>

            }
        } else {
            return <Fragment>
                <ImageBackground source={{ uri: state.picture }} resizeMode="cover" style={{ height: 90, width: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                    onLoadStart={() => setState(prevState => ({ ...prevState, isLoading: true }))}
                    onLoadEnd={() => setState(prevState => ({ ...prevState, isLoading: false }))}>
                    <Spinner isVisible={state.isLoading} size={30} type="Circle" color={props.activeTheme.default} />
                </ImageBackground>
                {
                    state.activeTab === 0 ?
                        <TouchableOpacity
                            onPress={() => sharedOpenModal({ dispatch: props.dispatch, visible: true, transparent: true, modalHeight: 220, modelViewPadding: 0, ModalContent: <ModalView parentState={state} parentProps={{ ...props }} uiType={0} handlers={{ getPicture }} />, okHandler: () => { }, onRequestCloseHandler: null, androidKeyboardExtraOffset: 0 })}
                            style={{ backgroundColor: props.activeTheme.grey, position: 'absolute', zIndex: 1, left: 55, top: 60, borderRadius: 20, borderColor: props.activeTheme.white, borderWidth: 2, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                            <SvgXml xml={cameraIcon} height={25} width={25} />
                        </TouchableOpacity>
                        : null
                }
            </Fragment>
        }

    };
    const onPictureClicked = () => {

        if (props.U.isProfilePicAttached === false) {
            console.log("Picture should not attach")
            takePictureHandler(false)
        }
        else if (state.activeTab > 0) takePictureHandler(false);
        else if (isJoviCustomerApp) {

            console.log("Picture should attach")

            // sharedOpenModal({ dispatch: props.dispatch, visible: true, transparent: true, modalHeight: 220, modelViewPadding: 0, ModalContent: <ModalView parentState={state} parentProps={{ ...props }} uiType={1} handlers={{ takePictureHandler, setState }} />, okHandler: () => { }, onRequestCloseHandler: null, androidKeyboardExtraOffset: 0 });
        }
        else takePictureHandler(false);
    }
    const handleIsValidFromChangePsw = bool => setState(pre => ({ ...pre, isValid: bool }));

    const handleHardwareBackButtonPressed = () => {
        navigateWithResetScreen(null, [{ name: isJoviCustomerApp ? "home" : "rider_order_stack" }]);
        return true;
    };
    useEffect(useCallback(() => {
        // console.log("profile mounted----");
        const backHandler = BackHandler.addEventListener("hardwareBackPress", handleHardwareBackButtonPressed);
        let now = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() - 15)).getUTCFullYear(),
            years = Array(now - (now - 70)).fill('').map((v, idx) => (now - idx).toString()),
            months = Array.from(Array(12), (item, i) => ((i + 1) < 10 ? 0 + (i + 1).toString() : (i + 1).toString())),
            days = Array.from(Array(31), (item, i) => ((i + 1) < 10 ? 0 + (i + 1).toString() : (i + 1).toString()));
        setState(prevState => ({ ...prevState, yearsArr: years, monthsArr: months, daysArr: days }));
        return () => {
            // console.log("Profile Unmounted and State cleared----");
            backHandler.remove()
            setState(initState);
        }
    }, []), []);


    // this
    // its commented for client demo test

    // useEffect(() => {
    //     if (props.user.getProfileCall) {
    //         console.log("profile mounted with update call----", props.user.getProfileCall);
    //         props.dispatch(userAction({ ...props.U, getProfileCall: false }));
    //         profileUpdateHandler();
    //     }
    // }, [props.user.getProfileCall]);  

    // console.log("profile mounted with update call----", props.user.getProfileCall);
    // console.log("profile state----", state);
    // console.log(APPROVED_RIDER_VALIDATION)
    // console.log(ONLINE_RIDER_VALIDATION)
    console.log(props)
    return (
        <ImageBackground source={doodleImg} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <CustomHeader

                />
                {/* <CustomHeader
                    leftIconHandler={'toggle'}
                    navigation={props.drawerProps.navigation}
                    leftIcon={commonIcons.menueIcon(props.activeTheme)}
                    bodyContent={'Edit Profile'}
                    rightIcon={(!isJoviCustomerApp && !APPROVED_RIDER_VALIDATION) ? commonIcons.refreshScreenIcon() : null}
                    activeTheme={props.activeTheme}
                /> */}
                {
                    (!isJoviCustomerApp && !APPROVED_RIDER_VALIDATION && props.U.isPoliceRider && props.user.shiftStartTime && props.user.shiftEndTime) ?

                        // <View style={{ flex: 1, alignSelf: "flex-end", left: 110, position: "absolute", bottom: DEVICE_WIN_HEIGHT < 700 ? 7 : 0, top: DEVICE_WIN_HEIGHT >= 720 ? 50 : 0 }}>
                        <View style={{ justifyContent: "flex-start", alignItems: "flex-start", left: 5, top: 55 }}>

                            {
                                ONLINE_RIDER_VALIDATION ?
                                    <Text style={{ fontSize: 13, left: 25, color: props.activeTheme.default }}>Duty Hours</Text>
                                    :
                                    <View style={{ flexDirection: "row", alignItems: "flex-start", left: DEVICE_WIN_HEIGHT >= 720 ? 10 : 0 }}>
                                        {/* <View style={{ height: 10, width: 10, borderRadius: 5,marginVertical:3, borderColor: props.activeTheme.default, backgroundColor: props.activeTheme.default }} /> */}
                                        <Text style={{ fontSize: 13, left: 5, color: props.activeTheme.default }}>{"Duty Hours"} </Text>
                                    </View>
                            }
                            <Text style={{ fontSize: DEVICE_WIN_HEIGHT >= 720 ? 11 : 13, textAlign: "center", marginHorizontal: 10 }}>{props.user.shiftStartTime}-{props.user.shiftEndTime}</Text>
                        </View>
                        : null
                }

                {
                    (!isJoviCustomerApp && !APPROVED_RIDER_VALIDATION) ?

                        // <View style={{ flex: 1, alignSelf: "flex-end", left: 110, position: "absolute", bottom: DEVICE_WIN_HEIGHT < 700 ? 7 : 0, top: DEVICE_WIN_HEIGHT >= 720 ? 50 : 0 }}>
                        <View style={{ alignSelf: "flex-end", justifyContent: "center", alignItems: "center", right: 25, top: 20 }}>

                            {
                                ONLINE_RIDER_VALIDATION ?
                                    <Text style={{ fontSize: 13, left: 5, color: props.activeTheme.default }}>Online Today</Text>
                                    :
                                    <View style={{ flexDirection: "row", alignItems: "center", left: DEVICE_WIN_HEIGHT >= 720 ? 10 : 0 }}>
                                        <View style={{ height: 10, width: 10, borderRadius: 5, borderColor: props.activeTheme.default, backgroundColor: props.activeTheme.default }} />
                                        <Text style={{ fontSize: 13, left: 5, color: props.activeTheme.default }}>{"Online Today"} </Text>
                                    </View>
                            }
                            <Text style={{ fontSize: DEVICE_WIN_HEIGHT >= 720 ? 11 : 13, textAlign: "center" }}>{state.riderHrs} {state.riderMins}</Text>
                        </View>
                        : null
                }
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: null })} onTouchEnd={() => {
                    if (props.stackState.keypaidOpen) Keyboard.dismiss();
                }}>
                    <View style={{ flex: 1, backgroundColor: props.activeTheme.white, marginTop: Platform.select({ android: 40, ios: 25 }), borderRadius: 20 }}>
                        {
                            !IS_KEYBOARD_OPENED ?
                                <TouchableWithoutFeedback
                                    onPress={onPictureClicked}
                                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} >
                                    <View style={{ height: 90, width: 90, borderRadius: 45, position: 'absolute', alignSelf: 'center', top: -40, zIndex: 1, backgroundColor: props.activeTheme.lightGrey, justifyContent: 'center', alignItems: 'center' }}>
                                        {renderProfileUI()}
                                    </View>
                                </TouchableWithoutFeedback>
                                : null
                        }
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'center', zIndex: 1, top: 65, marginBottom: 20 }}>
                            {
                                [editIcon, pswIcon].map((icon, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => toggleHandler(1, i)}>
                                            <View style={{ backgroundColor: props.activeTheme.default, borderRadius: 15, top: i !== state.activeTab ? 7 : 0, height: state.activeTab === i ? 60 : 45, width: state.activeTab === i ? 60 : 45, justifyContent: 'center', alignItems: 'center', marginLeft: i > 0 ? 20 : 0, }}>
                                                <SvgXml xml={icon} height={30} width={30} />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })                            
                            }
                        </View> */}
                        <ScrollView style={{ paddingHorizontal: 20, paddingBottom: 20, marginTop: !IS_KEYBOARD_OPENED ? 30 : 0 }} keyboardShouldPersistTaps="always">
                            <View style={{ paddingVertical: 20 }}>
                                {(state.activeTab === 0 && !IS_KEYBOARD_OPENED) ?
                                    <View>
                                        <Text style={commonStyles.fontStyles(16, "#000", 3)}>Gender</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            {
                                                [maleIcon, femalIcon].map((g, i) => (
                                                    <TouchableOpacity style={{ paddingHorizontal: 30 }} key={i} onPress={() => toggleHandler(2, i + 1)} disabled={!APPROVED_RIDER_VALIDATION}>
                                                        <SvgXml xml={g} height={50} width={50} />
                                                        <View style={{ position: 'absolute', alignSelf: 'center', zIndex: 1, top: 30 }}>
                                                            <SvgXml xml={i + 1 === state.gender ? selIcon : unselIcon} height={40} width={40} />
                                                        </View>
                                                    </TouchableOpacity>

                                                ))
                                            }
                                        </View>
                                    </View>
                                    : null
                                }
                                <View style={{ marginTop: 15 }}>
                                    {
                                        [
                                            { field: "fname", title: 'First name', pattern: 'alpha', validationerror: "Invalid first name", value: state.fname, maxLength: 15, editable: APPROVED_RIDER_VALIDATION },
                                            { field: "lname", title: 'Last name', pattern: 'alpha', validationerror: "Invalid last name", value: state.lname, maxLength: 15, editable: APPROVED_RIDER_VALIDATION },
                                            { field: "email", title: 'Email', pattern: 'email', validationerror: state?.emailAlreadyExist ? "This email is already exist" : "Invalid email", value: state.email, maxLength: 50, editable: ONLINE_RIDER_VALIDATION },
                                            { field: "mobile", title: 'Mobile', pattern: 'mobile', validationerror: "Invalid mobile number", value: state.mobile, maxLength: 12, editable: ONLINE_RIDER_VALIDATION },
                                            { field: "dob", title: 'Date of birth', pattern: 'date', validationerror: "Invalid date", value: state.dob, editable: APPROVED_RIDER_VALIDATION },

                                        ].map((x, i) => (
                                            <View key={i}>
                                                <View style={{ paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={commonStyles.fontStyles(14, props.activeTheme.black, 1, "100")}>
                                                        {x.title}
                                                    </Text>
                                                    {/* {
                                                            x.field === "mobile" ?
                                                                <TouchableOpacity disabled={!ONLINE_RIDER_VALIDATION} onPress={() => onSavePress("changeNumber")}>
                                                                    <Text style={{ color: !ONLINE_RIDER_VALIDATION ? props.activeTheme.grey : props.activeTheme.default }}>Change</Text>
                                                                </TouchableOpacity>
                                                                : null
                                                        } */}
                                                </View>
                                                {
                                                    x.field === 'dob' ?
                                                        <TouchableOpacity style={[profileStyles.defaultInputArea(props.activeTheme, x.field, state, !x.editable), { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}
                                                            disabled={!state.isValid ? true : !x.editable}
                                                            onPress={openDatePicker}
                                                        >
                                                            <Text>{state.dob.length ? state.dob : "dd/mm/yyyy"}</Text>
                                                            {
                                                                state.dob.length ?
                                                                    <SvgXml xml={correctIcon} height={18} width={18} />
                                                                    : null
                                                            }
                                                        </TouchableOpacity>
                                                        :
                                                        <TextInput
                                                            placeholder={x.title}
                                                            style={[profileStyles.defaultInputArea(props.activeTheme, x.field, state, !x.editable)]}
                                                            value={x.value}
                                                            onChangeText={(value) => onChangeHandler(x.field, value)}
                                                            pattern={x.pattern}
                                                            name={x.field}
                                                            // allFieldsValid={state.email.length > 0 && state.fname.length > 0 && state.lname.length > 0 && state.mobile.length > 0 && state.dob.length > 0 && state.isValid ? true : false}
                                                            onFocus={() => setState({ ...state, focusedField: x.field })}
                                                            editable={x.field === "mobile" ? false : (!state.isValid && state.focusedField !== x.field) ? false : x.editable}
                                                            maxLength={x.maxLength}
                                                        // rightLoader={(x.field === "email" && state.emailCheckLoader) ? true : false}
                                                        />
                                                }
                                                {errorsUI.errorMessageUi(x.value, state.focusedField, x.field, x.validationerror, state.isValid)}
                                            </View>
                                        ))

                                    }
                                </View>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={{
                                backgroundColor: state.activeTab === 0 ? (state.emailCheckLoader) ? props.activeTheme.lightGrey : (state.isValid && !editProfileBool) ? props.activeTheme.default : props.activeTheme.lightGrey
                                    : (state.isValid && !editPasswordeBool) ? props.activeTheme.default : props.activeTheme.lightGrey,
                                justifyContent: "flex-end",
                                alignItems: 'center',
                                paddingVertical: 20
                            }}
                            onPress={onSavePress}
                            disabled={(state.emailCheckLoader) ? true : state.isValid && state.activeTab === 0 ? editProfileBool : editPasswordeBool}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#fff' }}>
                                    Save
                                </Text>
                                <View style={{ paddingLeft: 20 }} >
                                    <SvgXml xml={nextIcon} height={20} width={20} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        {/* {
                            state.calanderOpened &&
                            <View style={{ flex: 1 }}>
                                <CustomCalendar
                                    activeTheme={props.activeTheme}
                                    onSelectDateHandler={date => {
                                        toggleModal();
                                        date.dateString = moment(date.dateString).format("DD/MM/YYYY");
                                        onChangeHandler('dob', date.dateString);
                                    }}
                                    toggleModal={toggleModal}
                                    visible={state.calanderOpened}

                                />
                            </View>

                        } */}
                    </View>
                    {/* <CustomImageView
                        key={0}
                        imageIndex={0}
                        imagesArr={[{
                            uri: state.picture
                        }]}
                        visible={state.isImageViewOpen}
                        onRequestClose={() => setState(pre => ({ ...pre, isImageViewOpen: !pre.isImageViewOpen }))}
                        swipeToCloseEnabled={true}
                    /> */}
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    )
};

const profileStyles = StyleSheet.create({
    defaultInputArea: (activeTheme, currentField, state, riderValidator = false) => ({
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: (state.focusedField === currentField && !state.isValid) ? activeTheme.redColor : state.focusedField === currentField ? activeTheme.primary : 'rgba(0,0,0,0.1)',
        paddingVertical: 0,
        height: 50,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: currentField === "mobile" ? activeTheme.disabled_button : riderValidator ? activeTheme.disabled_button : (!state.isValid && state.focusedField !== currentField) ? activeTheme.disabled_button : "#fff"

    }),
});
const mapStateToProps = (store) => {
    return {
        U: store.userReducer,
    }
};
export default connect(mapStateToProps)(Profile);