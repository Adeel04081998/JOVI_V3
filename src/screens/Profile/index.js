import React, { useCallback } from 'react';
import { Appearance, BackHandler, Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Image from '../../components/atoms/Image';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import CustomHeader, { CustomHeaderIconBorder } from '../../components/molecules/CustomHeader';
import { sharedLaunchCameraorGallery } from '../../helpers/Camera';
import { renderFile, sharedConfirmationAlert, sharedGetDeviceInfo, sharedGetUserDetailsApi, VALIDATION_CHECK } from '../../helpers/SharedActions';
import { multipartPostRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { isIOS, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import Regex from '../../utils/Regex';
import { KeyboardAwareScrollView } from '../../../libs/react-native-keyboard-aware-scroll-view';
import DatePicker from './component/DatePicker';
import AnimatedModal from '../../components/organisms/AnimatedModal';
import Toast from '../../components/atoms/Toast';
import constants from '../../res/constants';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const ICON_CONTAINER_SIZE = 40;
const RADIO_BUTTON_SIZE = 20;
const RADIO_BUTTON_INNER_SIZE = 12;
const PROFILE_CIRCLE = 100;
const SPACING = 10;
const options = {
    selectionLimit: 1,
    quality: 0.5,
    maxWidth: 1000,
    storageOptions: Platform.select({
        ios: {
            skipBackup: true,
            path: 'images',
        }
    }),
    mediaType: "photo",
};
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const userReducer = useSelector(state => state.userReducer);
    const CROSS_ICON = "ios-close"
    const VALID_ICON = 'ios-checkmark-circle'
    const styles = _styles(colors);
    const [state, setState] = React.useState({
        genderEnum: userReducer.genderEnum,
        inputsArr: [
            { id: 1, field: "FirstName", title: 'First Name', placeholder: 'First name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid first name", backgroundColor: 'white', value: userReducer.firstName ?? '', maxLength: 15, isValid: true, showError: false, customStyle: { width: '50%' } },
            { id: 2, field: "LastName", title: 'Last Name', placeholder: 'Last name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid last name", backgroundColor: 'white', value: userReducer.lastName ?? '', maxLength: 15, isValid: true, showError: false, customStyle: { width: '50%' } },
            { id: 3, field: "Email", title: 'Email Address', placeholder: 'Email', pattern: Regex.email, keyboardType: "email-address", validationerror: "Invalid email address", backgroundColor: 'white', value: userReducer.email ?? '', maxLength: 56, isValid: true, showError: false },
            { id: 4, field: "Mobile", title: 'Contact', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "", backgroundColor: '#EFEFEF', value: userReducer.phoneNumber ?? '', maxLength: 15, isValid: true, showError: false },
            { id: 5, field: "DateOfBirth", title: 'Date of Birth', placeholder: 'Date Of Birth', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "", backgroundColor: 'white', value: userReducer.dob ?? '', maxLength: 15, isValid: true, showError: false },
        ],
        isLocalChange: false,
        picture: '',
        pictureObj: {},
        picturePicked: false,
        'yearsArr': [],
        'monthsArr': [],
        'daysArr': [],
        isModalVisible: false,
        loading: false,
        updateArray: [],
        dob: userReducer.dob



    });
    let { inputsArr, picture, pictureObj, isModalVisible, isLocalChange } = state;
    let updatedPic = isLocalChange ? state.picture : renderFile(userReducer.picture)
    React.useEffect(useCallback(() => {

        let now = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() - 15)).getUTCFullYear(),
            years = Array(now - (now - 70)).fill('').map((v, idx) => (now - idx).toString()),
            months = Array.from(Array(12), (item, i) => ((i + 1) < 10 ? 0 + (i + 1).toString() : (i + 1).toString())),
            days = Array.from(Array(31), (item, i) => ((i + 1) < 10 ? 0 + (i + 1).toString() : (i + 1).toString()));
        setState(prevState => ({ ...prevState, yearsArr: years, monthsArr: months, daysArr: days }));
        return () => {


        }
    }, []), []);
    const handleOnGenderPress = (currentKey) => {
        setState(pre => ({ ...pre, genderEnum: currentKey }));
    }
    const _onChangeHandler = (key, value, i) => {
        if (Regex.Space_Regex.test(value)) return
        let trimValue = value.trim()
        if (key === "Email") {
            inputsArr[i].validationerror = 'Invalid email address';
        }
        inputsArr[i].value = trimValue;
        inputsArr[i].showError = false;
        let selectedDob = i === 4 ? value : ''
        // if (!VALIDATION_CHECK(trimValue)) {
        //     inputsArr[i].showError = true;
        //     inputsArr[i].validationerror = 'Required';
        // }
        setState(pre => ({
            ...pre,
            emailAlreadyExist: false,
            dob: selectedDob,
        }));
    }
    const _renderHeader = () => (<CustomHeader
        renderLeftIconAsDrawer
        renderRightIconForHome
        rightIconName={null}
        title={`Profile`}
        titleStyle={{
            fontFamily: FontFamily.Poppins.SemiBold,
            fontSize: 16,
        }}
        defaultColor={colors.primary}
    />)
    const RadioButton = ({ selected = false, onPress = () => { } }) => {
        return <TouchableOpacity onPress={() => onPress(!selected)} style={{ height: RADIO_BUTTON_SIZE, width: RADIO_BUTTON_SIZE, borderRadius: RADIO_BUTTON_SIZE / 2, borderWidth: 0.5, borderColor: colors.black, justifyContent: 'center', alignItems: 'center' }}>
            {selected && <View style={{ height: RADIO_BUTTON_INNER_SIZE, width: RADIO_BUTTON_INNER_SIZE, borderRadius: RADIO_BUTTON_INNER_SIZE / 2, backgroundColor: colors.black }}></View>}
        </TouchableOpacity>
    }
    const renderGenderUI = () => {
        return (<View style={{ height: 100, paddingHorizontal: SPACING }}>
            <Text style={{ fontSize: 16, }} fontFamily={'PoppinsMedium'}>Gender</Text>
            <View style={{ width: '100%', flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colors.black, padding: SPACING * 2 }}>
                <View style={{ flexDirection: 'row', marginRight: SPACING * 3 }}>
                    <RadioButton selected={state.genderEnum === 1} onPress={() => handleOnGenderPress(1)} />
                    <View style={{ marginLeft: SPACING, flexDirection: 'row' }}>
                        <VectorIcon type={'Fontisto'} name={'male'} color={colors.black} style={{ marginRight: 5 }} />
                        <Text style={{ fontSize: 15, color: colors.black }}>Male</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <RadioButton selected={state.genderEnum === 2} onPress={() => handleOnGenderPress(2)} />
                    <View style={{ marginLeft: SPACING, flexDirection: 'row' }}>
                        <VectorIcon type={'Fontisto'} name={'female'} color={colors.black} style={{ marginRight: 5 }} />
                        <Text style={{ fontSize: 15, color: colors.black }}>Female</Text>
                    </View>
                </View>
            </View>
        </View>);
    }
    const openDatePickerModal = () => {
        return (
            <AnimatedModal
                visible={isModalVisible}
                position={'bottom'}
                useKeyboardAvoidingView={true}
            >

                <DatePicker
                    parentState={state}
                    onSave={(key, value, index) => {
                        _onChangeHandler(key, value, index)
                    }}
                    onClose={() => { setState((pre) => ({ ...pre, isModalVisible: false })) }}
                    colors={colors}
                />


            </AnimatedModal>
        )
    }
    const getPicture = picData => {

        let pictureUri = picData.assets[0].uri
        let tempObj = {
            uri: !isIOS ? picData.assets[0].uri : picData.assets[0].uri.replace("file://", ""),
            name: picData.assets[0].uri.split('/').pop(),
            type: picData.assets[0].type
        }

        setState((pre) => ({
            ...pre,
            isLocalChange: true,
            picture: pictureUri,
            pictureObj: tempObj,
            picturePicked: true,
        }))


    };
    const onSuccesHandler = (res) => {
        Toast.info(res.message)
        setState((pre) => ({ ...pre, loading: false, }))
        sharedGetUserDetailsApi();

    }

    const onErrorHandler = (err) => { sharedExceptionHandler(err) }
    const _profileUpdateHandler = async () => {

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


        // let updateArray = [...state.inputsArr]
        // setState((pre) => ({ ...pre, updateArray: updateArray }))
        // let Newfound = state?.inputsArr.some((el, i) => el[i]?.value === state?.updateArray[i]?.value);


        else {
            setState((pre) => ({ ...pre, loading: true }))
            let deviceInformation = await sharedGetDeviceInfo()
            let formData = new FormData();
            for (let index = 0; index < inputsArr.length; index++) {
                formData.append(inputsArr[index].field, inputsArr[index].value)
            }
            formData.append("UserID", userReducer.id);
            formData.append("Gender", state.genderEnum),
                formData.append("UserType", 1),
                formData.append("Imei", deviceInformation.deviceID),
                formData.append("Firmware", deviceInformation.systemVersion)
            formData.append("SmartPhone", deviceInformation.model)
            formData.append("HardwareID", deviceInformation.deviceID)
            isLocalChange && formData.append("Picture", pictureObj);
            // console.log("formData", formData);
            multipartPostRequest(
                Endpoints.CREATE_UPDATE,
                formData,
                res => {
                    onSuccesHandler(res)
                },
                err => { onErrorHandler(err) },
                {})
        }

    }
    return (
        <SafeAreaView style={styles.primaryContainer}>
            {_renderHeader()}
            <View style={{ flex: 1 }}>
                <View style={{ height: 100, margin: SPACING * 3, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: PROFILE_CIRCLE, width: PROFILE_CIRCLE, borderRadius: PROFILE_CIRCLE / 2, backgroundColor: colors.primary }}>
                        <Image tapToOpen={false}
                            source={VALIDATION_CHECK(userReducer.picture) ? { uri: updatedPic } : require('../../assets/images/user.png')}
                            // source={{ uri: state.picture }}
                            style={{ height: PROFILE_CIRCLE, width: PROFILE_CIRCLE, borderRadius: PROFILE_CIRCLE / 2 }}
                            height={PROFILE_CIRCLE} width={PROFILE_CIRCLE}
                        />
                        <TouchableOpacity style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 0.5, borderColor: colors.white, backgroundColor: '#6B6B6B', position: 'absolute', bottom: 5, right: 5 }} onPress={() => {

                            sharedConfirmationAlert("Alert", "Pick Option!",
                                [
                                    {
                                        text: "Choose from Gallery", onPress: () => {
                                            sharedLaunchCameraorGallery(0, (error) => {
                                            }, picData => { getPicture(picData); }, options);
                                        }
                                    },
                                    {
                                        text: "Open Camera", onPress: () => {
                                            sharedLaunchCameraorGallery(1, (error) => {
                                            }, picData => { getPicture(picData); }, options);
                                        }
                                    },
                                    {
                                        text: "Cancel", onPress: () => {
                                        }
                                    }
                                ],
                                { cancelable: false }
                            )
                        }}>
                            <VectorIcon color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    {renderGenderUI()}
                    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', }}>

                        {[...inputsArr].map((x, i) => {
                            const isError = x.id !== 5 && x.showError; // mob no
                            return <View style={{ marginTop: 25, width: '100%', ...x.customStyle ?? {} }} key={`key-${i}`}>
                                {

                                    x.id !== 5 ?
                                        <TextInput
                                            title={x.title}
                                            spaceFree
                                            placeholder={x.placeholder}
                                            value={x.value}
                                            onChangeText={(value) => {
                                                _onChangeHandler(x.field, value, i)
                                            }}
                                            pattern={x.pattern}
                                            errorText={isError ? x.validationerror : ""}
                                            keyboardType={x.keyboardType}
                                            isValid={(value) => {
                                                inputsArr[i].isValid = value;
                                                // setState((pre) => ({ ...pre, inputsArr }))
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
                                        :
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 7, borderColor: '#707070', borderWidth: 0, margin: 10, }}>
                                            <Text style={[{ color: 'black', position: 'absolute', top: -30, left: 0, fontSize: 17, marginBottom: 50, justifyContent: 'center' }]}>{x.title}</Text>
                                            <TouchableOpacity style={{ width: '100%', borderWidth: 1, borderRadius: 5, padding: 10, borderColor: isError ? "red" : "#E2E2E2", backgroundColor: x.backgroundColor, borderWidth: 1 }}
                                                onPress={() => { setState((pre) => ({ ...pre, isModalVisible: true })) }} >
                                                <Text style={{ alignItems: 'center', }}>{userReducer.dob || inputsArr[4].value ? x.value : "dd/mm/yyyy"}</Text>

                                            </TouchableOpacity>
                                        </View>


                                }

                            </View>
                        })
                        }
                    </View>
                </KeyboardAwareScrollView>

                <Button
                    onPress={_profileUpdateHandler}
                    text={"Save"}
                    style={{ width: '90%', alignSelf: 'center', }}
                    isLoading={state.loading}
                />

            </View>
            {isModalVisible && openDatePickerModal()}

        </SafeAreaView>
    );
};

const _styles = (colors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.screen_background,
    },
    errorText: {
        color: "red",
        textAlign: 'center',
        width: '100%',
        bottom: isIOS ? -20 : -25,


    },
});
