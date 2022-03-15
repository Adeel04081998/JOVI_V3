import { View, Text, StyleSheet, Modal, Button, Alert } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReduxActions from '../../redux/actions'
import useNetInfo from '../../hooks/useNetInfo'
import Toast from './Toast'
// import { ToastRef } from '../../utils/GV'
const Content = ({ onRetry, isRetrying }) => (
    <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Connection Error</Text>
        <Text style={styles.modalText}>
            Oops! Looks like your device is not connected to the Internet.
        </Text>
        <Button onPress={onRetry} disabled={isRetrying} title="Try Again" />
    </View>
)
export default () => {
    // console.log("ToastRef", ToastRef.current);
    const [isRetrying, setIsRetrying] = React.useState(false)
    const netInfo = useNetInfo();
    const modalReducer = useSelector(state => state.modalReducer);
    const IS_CONNECTED = netInfo.isConnected && netInfo.isInternetReachable;
    const currentModal = React.useRef(null);
    const dispatch = useDispatch();
    const onRetry = () => {
        if (!IS_CONNECTED) Alert.alert("Error!", "Oops! Looks like your device is not connected to the Internet.");
        else dispatch(ReduxActions.closeModalAction())
    }
    React.useEffect(() => {
        if (!IS_CONNECTED) return Toast.info("Oops! Looks like your device is not connected to the Internet.", 3000, "top", false)
        // if (!IS_CONNECTED) {
        //     if (modalReducer?.visible&&currentModal.current===null) {
        //         console.log('modalReducer', modalReducer);
        //         currentModal.current = { ...modalReducer };
        //     }
        //     dispatch(ReduxActions.setModalAction({
        //         visible: true,
        //         ModalContent: <Content onRetry={onRetry} isRetrying={isRetrying} />,
        //         onPress: () => { },
        //         noInternetModal: true,
        //         disabled: true
        //     }))
        // } else {
        //     if (modalReducer?.noInternetModal) {
        //         if (currentModal.current) {
        //             dispatch(ReduxActions.setModalAction({
        //                 ...currentModal.current,
        //                 noInternetModal:false,
        //             }));
        //             currentModal.current = null;
        //         } else {
        //             dispatch(ReduxActions.closeModalAction())
        //         }
        //     }
        // }
    }, [netInfo])
    return null;
}
const styles = StyleSheet.create({
    // ...
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: "#000"
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
    },
    modalText: {
        fontSize: 18,
        color: '#555',
        marginTop: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
});