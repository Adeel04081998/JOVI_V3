import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {SafeAreaView, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import Button from '../../components/molecules/Button';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import styles from './styles';
import TextInput from '../../components/atoms/TextInput';

export default OtpCode = () => {
    const [refsArr, setRefsArr] = useState(['', '', '', ''])
    // const [appHash, setAppHash] = useState(user.appHash)
    // const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
    const [otpVerified, setOtpVerified] = useState(false)
    const [mins, setMins] = useState('00')
    const [sec, setSec] = useState('00')
    const [intervalStoped, setIntervalStoped] = useState(false)
    const [intervalId, setIntervalId] = useState(null)
    const [typedCode, setTypedCode] = useState('')
    const [focusedIndex, setFocusedIndex] = useState(0)
    const [zero, setZero] = useState('')
    const [one, setOne] = useState('')
    const [two, setTwo] = useState('')
    const [three, setThree] = useState('')
    const [disableOnchange, setDisableOnchange] = useState(false)
    const otpInput = useRef(null)
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    // const animation = new Animated.Value(0);

    useLayoutEffect(() => {

        if (Platform.OS === "android") {
            setTimeout(() => {
                otpInput.current.focusField(0)
            }, 1000)
        }

    }, [])

    const otpInputUI = () => {
        return (
            <View style={styles.androidOtpWrap}>
                {
                    (refsArr || []).map((val, i) => {
                        if (i < 4) return <View key={i}>
                            <TextInput
                                autoCorrect={false}
                                autoCapitalize="none"
                                placeholder=""
                                // ref={elRefs.current[i]}
                                // value={val}
                                // value={state[i]}
                                style={[styles.otpCode]}
                                // style={{
                                //     width: 65, elevation: 2,
                                //     shadowColor: '#000000',
                                //     shadowRadius: 4,
                                //     shadowOffset: { height: 4, width: 0 },
                                //     shadowOpacity: 0.5,
                                // }}
                                keyboardType="numeric"
                                maxLength={1}
                                autoFocus={i === 0 ? true : false}
                                underlineColorAndroid="transparent"
                                autoCompleteType="tel"
                                returnKeyType="next"
                                textContentType="oneTimeCode"
                            // onFocus={() => setState(pre => ({ ...pre, focusedIndex: i }))}
                            // onChangeText={val => onChangeHanlder(val, i)}
                            // onKeyPress={e => _focusNextField(e, i + 1, i)}
                            // onChange={(e) => _onChange(e, i + 1, i)}
                            />
                        </View>
                    })
                }
                {
                    refsArr.includes("") ? null :
                        <View style={{ top: 15, right: 10 }}>
                            {/* <Image source={require('../../assets/correctsign.png')} style={styles.correntSign} /> */}
                        </View>
                }
            </View>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }} >
            <KeyboardAvoidingView style={{ flex: 1,marginVertical:10 }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={keyboardVerticalOffset} >
                <View style={{ flex: 1, backgroundColor: 'white' }} >
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }} >
                        <Text style={{ paddingVertical: 10 }} >Verify Phone</Text>
                        <Text style={{ paddingVertical: 10 }}>Code is sent to 894 534 6789</Text>
                    </View>
                    {otpInputUI()}
                    <View style={{ justifyContent: 'center', alignSelf: 'center', position: 'absolute', bottom: 10 }} >
                        <View style={{ alignItems: 'center' }} >
                            <View style={{ alignItems: 'center', marginVertical: 10 }} >
                                {
                                    !intervalStoped &&
                                    <View>
                                        <Text style={{ color: '#7359BE', fontSize: 16, paddingBottom: 10 }}>{mins + ":" + sec}</Text>
                                    </View>
                                }
                                <Text>Didn't receive code</Text>
                                <Text style={{ textDecorationLine: 'underline', textDecorationColor: '#7359BE', color: '#7359BE' }} >Request again Get Via SMS</Text>
                            </View>
                            <Button
                                onPress={() => { console.log('Hello') }}
                                style={{ backgroundColor: '#7359BE', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 30, height: 50, borderWidth: 0, borderRadius: 10 }}
                                textStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
                                text={'Verfiy and Create Account'}
                                wait={0}
                            />

                            <View style={{ alignItems: 'center' }} >
                                <Text style={{ textDecorationLine: 'underline', textDecorationColor: '#7359BE', color: '#7359BE' }} >Change Number</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

