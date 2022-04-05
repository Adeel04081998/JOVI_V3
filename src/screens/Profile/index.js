import React from 'react';
import { Appearance, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Image from '../../components/atoms/Image';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader, { CustomHeaderIconBorder } from '../../components/molecules/CustomHeader';
import { renderFile, VALIDATION_CHECK } from '../../helpers/SharedActions';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { isIOS, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import Regex from '../../utils/Regex';
const HEADER_ICON_SIZE = CustomHeaderIconBorder.size * 0.6;
const ICON_CONTAINER_SIZE = 40;
const RADIO_BUTTON_SIZE = 20;
const RADIO_BUTTON_INNER_SIZE = 12;
const PROFILE_CIRCLE = 100;
const SPACING = 10;
export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const userReducer = useSelector(state => state.userReducer);
    console.log('userReducer', userReducer);
    const CROSS_ICON = "ios-close"
    const VALID_ICON = 'ios-checkmark-circle'
    const styles = _styles(colors);
    // const inputsArr = [
    //     { id: 1, field: "FirstName", title: 'First Name', placeholder: 'First name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid first name", backgroundColor: 'white', value: userReducer.firstName ?? '', maxLength: 15, isValid: true, showError: false ,customStyle:{width: '50%'}},
    //     { id: 2, field: "LastName", title: 'Last Name', placeholder: 'Last name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid last name", backgroundColor: 'white', value: userReducer.lastName ?? '', maxLength: 15, isValid: true, showError: false,customStyle:{width: '50%'} },
    //     { id: 3, field: "Email", title: 'Email Address', placeholder: 'Email', pattern: Regex.email, keyboardType: "email-address", validationerror: "Invalid email address", backgroundColor: 'white', value: userReducer.email ?? '', maxLength: 56, isValid: true, showError: false },
    //     { id: 4, field: "Contact", title: 'Contact', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "", backgroundColor: '#EFEFEF', value: userReducer.phoneNumber || '03005069491', maxLength: 15, isValid: true, showError: false },
    //     { id: 4, field: "Date of Birth", title: 'Date of Birth', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "", backgroundColor: '#EFEFEF', value: userReducer.phoneNumber || '03005069491', maxLength: 15, isValid: true, showError: false },
    // ]
    const [state, setState] = React.useState({
        genderEnum: userReducer.genderEnum,
        inputsArr : [
            { id: 1, field: "FirstName", title: 'First Name', placeholder: 'First name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid first name", backgroundColor: 'white', value: userReducer.firstName ?? '', maxLength: 15, isValid: true, showError: false ,customStyle:{width: '50%'}},
            { id: 2, field: "LastName", title: 'Last Name', placeholder: 'Last name', pattern: Regex.name, keyboardType: "default", validationerror: "Invalid last name", backgroundColor: 'white', value: userReducer.lastName ?? '', maxLength: 15, isValid: true, showError: false,customStyle:{width: '50%'} },
            { id: 3, field: "Email", title: 'Email Address', placeholder: 'Email', pattern: Regex.email, keyboardType: "email-address", validationerror: "Invalid email address", backgroundColor: 'white', value: userReducer.email ?? '', maxLength: 56, isValid: true, showError: false },
            { id: 4, field: "Contact", title: 'Contact', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "", backgroundColor: '#EFEFEF', value: userReducer.phoneNumber || '03005069491', maxLength: 15, isValid: true, showError: false },
            { id: 4, field: "DateOfBirth", title: 'Date of Birth', placeholder: 'Mobile', pattern: Regex.numberOnly, keyboardType: "number-pad", validationerror: "", backgroundColor: '#EFEFEF', value: userReducer.phoneNumber || '03005069491', maxLength: 15, isValid: true, showError: false },
        ],
    });
    let {inputsArr} = state;
    const handleOnGenderPress = (currentKey) => {
        setState(pre => ({ ...pre, genderEnum: currentKey }));
    }
    const _onChangeHandler = (key, value, i) => {
        if (Regex.Space_Regex.test(value)) return
        let trimValue = value.trim()
        if (key === "Email") {
            // emailRef.current = value;
            inputsArr[i].validationerror = 'Invalid email address';
        }
        inputsArr[i].value = trimValue;
        if(!VALIDATION_CHECK(trimValue))
        {
            inputsArr[i].showError = true;
            inputsArr[i].validationerror = 'Required';
        }
        setState(pre => ({
            ...pre,
            emailAlreadyExist: false
        }));
    }
    const _renderHeader = () => (<CustomHeader
        renderLeftIconAsDrawer
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

    return (
        <SafeAreaView style={styles.primaryContainer}>
            {_renderHeader()}
            <View style={{ height: '95%' }}>
                <View style={{ height: 100, margin: SPACING * 3, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: PROFILE_CIRCLE, width: PROFILE_CIRCLE, borderRadius: PROFILE_CIRCLE / 2, backgroundColor: colors.primary }}>
                        <Image tapToOpen={false} source={VALIDATION_CHECK(userReducer.picture) ? { uri: renderFile(userReducer.picture) } : require('../../assets/images/user.png')}
                            style={{ height: PROFILE_CIRCLE, width: PROFILE_CIRCLE, borderRadius: PROFILE_CIRCLE / 2 }}
                            height={PROFILE_CIRCLE} width={PROFILE_CIRCLE}
                        />
                        <TouchableOpacity style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 0.5, borderColor: colors.white, backgroundColor: '#6B6B6B', position: 'absolute', bottom: 5, right: 5 }}>
                            <VectorIcon color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView >
                    {renderGenderUI()}
                    <View style={{display:'flex',flexDirection:'row',flexWrap:'wrap',width:'100%',}}>

                        {[...inputsArr].map((x, i) => {
                            const isError = x.id !== 4 && x.showError; // mob no
                            return <View style={{ marginTop: 25,width:'100%',...x.customStyle??{} }} key={`key-${i}`}>
                                <TextInput
                                    title={x.title}
                                    spaceFree
                                    placeholder={x.placeholder}
                                    value={x.value}
                                    onChangeText={(value) => {
                                        _onChangeHandler(x.field,value,i)
                                    }}
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
                    </View>
                </ScrollView>
                <View style={{ height: 30, width: '100%' }}>
                    <Text>Hello</Text>
                </View>
            </View>
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