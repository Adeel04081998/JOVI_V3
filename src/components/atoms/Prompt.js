import React from "react";
import {
    View,
    Text,
    TextInput,
    Dimensions,
    Modal,
    TouchableOpacity,
    StyleSheet, Platform
} from "react-native";

export default ({ visible = false, title = "", onChangeText, onSubmit, onCancel, cancelText = "Cancel", submitText = "Done", titleStyle = {}, cancelButtonStyle = {}, cancelButtonTextStyle = {}, submitButtonStyle = {}, submitButtonTextStyle = {}, placeholder = "" }) => {
    const [value, setValue] = React.useState("");

    const _onChangeText = (value) => {
        setValue(value)
        onChangeText && onChangeText(value);
    }

    const _onSubmit = () => {
        onSubmit && onSubmit(value);
        setValue("");
    }

    const _onCancel = () => {
        setValue("")
        onCancel && onCancel();
    }
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={_onCancel}>
            <View style={styles.screenOverlay}>
                <View style={styles.dialogPrompt}>
                    <Text style={[styles.title, titleStyle]}>
                        {title}
                    </Text>
                    <TextInput
                        placeholder={placeholder}
                        style={styles.textInput}
                        onChangeText={_onChangeText}
                        onSubmitEditing={_onSubmit}
                        autoFocus={true}
                    />
                    <View style={styles.buttonsOuterView}>
                        <View style={styles.buttonsInnerView}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    cancelButtonStyle
                                ]}
                                onPress={_onCancel}>
                                <Text
                                    style={[
                                        styles.cancelButtonText,
                                        cancelButtonTextStyle
                                    ]}>
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.buttonsDivider} />
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    submitButtonStyle
                                ]}
                                onPress={_onSubmit}>
                                <Text
                                    style={[
                                        styles.submitButtonText,
                                        submitButtonTextStyle
                                    ]}>
                                    {submitText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}




const styles = StyleSheet.create({
    screenOverlay: {
        height: Dimensions.get("window").height,
        backgroundColor: "black",
        opacity: 0.8
    },
    dialogPrompt: {
        ...Platform.select({
            ios: {
                opacity: 0.9,
                backgroundColor: "rgb(222,222,222)",
                borderRadius: 15
            },
            android: {
                borderRadius: 5,
                backgroundColor: "white"
            }
        }),
        marginHorizontal: 20,
        marginTop: 150,
        padding: 10,

        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        color: "black"
    },
    textInput: {
        height: 40,
        width: "100%",
        paddingHorizontal: 10,
        textAlignVertical: "bottom",
        margin: 20,
        ...Platform.select({
            ios: {
                borderRadius: 15,
                backgroundColor: "rgba(166, 170, 172, 0.9)"
            },
            android: {}
        })
    },
    buttonsOuterView: {
        flexDirection: "row",
        ...Platform.select({
            ios: {},
            android: {
                justifyContent: "flex-end"
            }
        }),
        width: "100%"
    },
    buttonsDivider: {
        ...Platform.select({
            ios: {
                width: 1,
                backgroundColor: "rgba(0,0,0,0.5)"
            },
            android: {
                width: 20
            }
        })
    },
    buttonsInnerView: {
        flexDirection: "row",
        ...Platform.select({
            ios: {
                borderTopWidth: 0.5,
                flex: 1
            },
            android: {}
        })
    },
    button: {
        flexDirection: "column",
        justifyContent: "center",

        alignItems: "center",
        ...Platform.select({
            ios: { flex: 1 },
            android: {}
        }),
        marginTop: 5,
        padding: 10
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "black"
    },
    submitButtonText: {
        color: "rgb(0, 129, 251)",
        fontWeight: "600",
        fontSize: 16
    }
});

