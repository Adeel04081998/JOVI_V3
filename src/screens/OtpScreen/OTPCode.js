import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Dimensions, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import styles from './styles';
import OTPInputView from '@twotalltotems/react-native-otp-input'

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

    useLayoutEffect(() => {

        if (Platform.OS === "android") {
            setTimeout(() => {
                otpInput.current.focusField(0)
            }, 0)
        }

    }, [])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={keyboardVerticalOffset} >
        <View style={{ flex: 1, backgroundColor: 'white' }} >
            <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                <Text>Verify Phone</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                <Text>Code is sent to 894 534 6789</Text>
            </View>
            <View style={{ alignItems: 'center' }} >
                <OTPInputView
                    ref={otpInput}
                    style={{ width: '80%', height: 200 }}
                    pinCount={4}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    // onCodeChanged = {code => { this.setState({code})}}
                    autoFocusOnLoad={false}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled={(code => {
                        console.log(`Code is ${code}, you are good to go!`)
                    })}
                    keyboardAppearance={"default"}
                    keyboardType="number-pad"
                />
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center',position:'absolute', bottom:10 }} >
                <View style={{alignItems:'center'}} >
            {
                    !intervalStoped &&
                    <View>
                        <Text style={{ color: '#7359BE', fontSize: 16 }}>{mins + ":" + sec}</Text>
                    </View>
                }
                <Text>Didn't receive code</Text>
                <Text>Request again Get Via SMS</Text>
                </View>
                <View style={{ alignItems: 'center' }} >

                <Button
                    onPress={() => { console.log('Hello') }}
                    parentTouchableStyle={{ backgroundColor: '#7359BE', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width - 30, height: 50, borderWidth: 0, borderRadius: 10 }}
                    textStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
                    title={'Verfiy and Create Account'}
                />
                </View>

                <View style={{ alignItems: 'center' }} >
                    <Text style={{ textDecorationLine: 'underline', textDecorationColor: 'purple' }} >Change Number</Text>
                </View>
            </View>
        </View>
        </KeyboardAvoidingView>

    )
}

// {
//     refsArr.includes("") ? null :
//         <View style={{ top: 15, right: 10 }}>
//             <Image source={require('../../assets/correctsign.png')} style={styles.correntSign} />
//         </View>
// }