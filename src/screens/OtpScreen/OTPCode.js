import React, { useState } from 'react';
import { Dimensions, TextInput } from 'react-native';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import styles from './styles';

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

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }} >
            <View>
                <Text>Verify Phone</Text>
            </View>
            <View>
                <Text>Code is sent to 894 534 6789</Text>
            </View>
            <View style={styles.androidOtpWrap}>
                {
                    (refsArr || []).map((val, i) => {
                        if (i < 4) return <View key={i} style={{ alignItems: 'center' }} >
                            <TextInput
                                autoCorrect={false}
                                autoCapitalize="none"
                                // ref={elRefs.current[i]}
                                // value={val}
                                // value={state[i]}
                                style={styles.otpCode}
                                keyboardType="numeric"
                                maxLength={1}
                                autoFocus={i === 0 ? true : false}
                                underlineColorAndroid="transparent"
                                autoCompleteType="tel"
                                returnKeyType="next"
                                onFocus={() => setFocusedIndex(i)}
                            // onChangeText={val => onChangeHanlder(val, i)}
                            // onKeyPress={e => _focusNextField(e, i + 1, i)}
                            // onChange={(e) => _onChange(e, i + 1, i)}
                            />
                        </View>
                    })
                }

            </View>
            <View>
                <Text>Didn't receive code</Text>
            </View>
            <View>
                <Text>Request again Get Via SMS</Text>
            </View>
            <View>
            <Button
                onPress={() => { console.log('Hello') }}
                parentTouchableStyle={{ backgroundColor: '#7359BE', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width - 30, height: 50, borderWidth: 0, borderRadius: 10 }}
                textStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
                title={'Verfiy and Create Account'}
            />
            <View style={{ alignItems: 'center' }} >
                <Text>Change Number</Text>
            </View>
            </View>
        </View>
    )
}

// {
//     refsArr.includes("") ? null :
//         <View style={{ top: 15, right: 10 }}>
//             <Image source={require('../../assets/correctsign.png')} style={styles.correntSign} />
//         </View>
// }