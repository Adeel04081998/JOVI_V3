import Toast from 'react-native-toast-message';
export default {
    success: (message, position = "top", visibilityTime = 3000, autoHide = true, onShow = () => { }, onHide = () => { }, onPress = () => { }) => {
        Toast.show({
            type: "success",
            text1: 'Success',
            text2: message,
            position,
            visibilityTime,
            autoHide,
            onHide,
            onPress,
            onShow,
        });
    },
    info: (message, position = "top", visibilityTime = 3000, autoHide = true, onShow = () => { }, onHide = () => { }, onPress = () => { }) => {
        Toast.show({
            type: "info",
            text1: 'Info',
            text2: message,
            position,
            visibilityTime,
            autoHide,
            onHide,
            onPress,
            onShow,
        });
    },
    error: (message, position = "top", visibilityTime = 3000, autoHide = true, onShow = () => { }, onHide = () => { }, onPress = () => { }) => {
        Toast.show({
            type: "error",
            text1: 'Error',
            text2: message,
            position,
            visibilityTime,
            autoHide,
            onHide,
            onPress,
            onShow,

        });
    },
}