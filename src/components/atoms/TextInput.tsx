import * as React from "react";
import { ColorValue, GestureResponderEvent, StyleProp, StyleSheet, TextInput as RNTextInput, TextStyle, ViewStyle } from "react-native";
import Text from "./Text";
import VectorIcon from "./VectorIcon";
import View from "./View";

type Props = React.ComponentProps<typeof RNTextInput> & React.ComponentProps<typeof VectorIcon> & {
    children?: any;
    pattern?: any;
    forcePattern?: boolean;
    forceError?:boolean;
    isValid?: ((value: boolean) => void) | undefined;
    placeholderTextColor?: ColorValue;
    placeholder?: string;

    titleStyle?:StyleProp<TextStyle>;
    title?:string;
    containerStyle?: StyleProp<ViewStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
    errorText?: string;

    iconType?: 'Ionicons' | 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Fontisto' | 'MaterialCommunityIcons' | 'MaterialIcons' | "Foundation" | "SimpleLineIcons" | 'Zocial' | 'Octicons';
    iconStyle?: StyleProp<ViewStyle>;
    iconName?: any;
    iconSize?: number;
    iconColor?: any;
    iconOnPress?: (event: GestureResponderEvent) => void;
};


let defaultProps = {
    pattern: null,
    forcePattern: false,
    forceError:false,
    placeholderTextColor: "#7F7F7F",
    placeholder: 'Jovi',
    isValid: () => { },

    containerStyle: {},
    title:"",
    titleStyle: {},

    errorTextStyle: {},
    errorText:"",

    iconType: 'Ionicons',
    iconName: '',
    iconColor: '#757575',
    iconSize: 20,
    iconStyle: {
        marginRight: 8,
    },
    iconOnPress: () => { },

};

const ERROR_ICON = 'ios-alert-circle';
const VALID_ICON = 'ios-checkmark-circle';

const VALIDATION_CHECK=(text:any)=>{
    if (text === "" || text === " " || text === "null" || text === null || text === "undefined" || text === undefined || text === false || text === "false") {
        return false;
    }
    else {
        return true;
    }
}

const TextInput = (props: Props) => {

    const [icon, updateIcon] = React.useState('');

    React.useEffect(()=>{
        if(props.forceError){
            updateIcon(ERROR_ICON);
        }
        return()=>{}
    },[props.forceError])

    return (
            <View style={[
                styles.primaryContainer,
                (icon !== '' && icon === ERROR_ICON) && {
                    borderColor: 'red',
                    borderWidth:0.5,
                }, 
                props.containerStyle]}>

{VALIDATION_CHECK(props.title) &&

                    <Text style={[ {
                        color: '#272727',
                        position: 'absolute',
                        top:  -25,
                        left: 0,
                        fontSize:14,
                        marginBottom:50
                    },props.titleStyle,]}>{props.title}</Text>
                }
                <RNTextInput
                    {...props}
                    {...props.pattern && {
                        onChangeText: (text: string) => {
                            const regexp = new RegExp(props.pattern);

                            if (regexp.test(text)) {
                                updateIcon(VALID_ICON);
                                props.onChangeText && props.onChangeText(text);
                                props.isValid && props.isValid(true);
                            } else {
                                if (text){
                                    updateIcon(ERROR_ICON);
                                    !props.forcePattern && props.onChangeText && props.onChangeText(text);
                                }
                                else{
                                    updateIcon('');
                                    props.onChangeText && props.onChangeText(text);
                                }
                                
                                props.isValid && props.isValid(false);
                            }
                        }
                    }}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholderTextColor}

                    style={[{
                        flex: 1,
                        padding: 10,
                    },props.style]}
                />
                {(VALIDATION_CHECK(props.iconName) || VALIDATION_CHECK(icon)) &&
                    <VectorIcon
                        name={icon !== '' ? icon : props.iconName}
                        color={icon !== '' ? icon === VALID_ICON ? "green" : "red" : props.iconColor}
                        onPress={props.iconOnPress} size={props.iconSize} style={props.iconStyle} type={props.iconType} />
                }

                {(icon === ERROR_ICON && VALIDATION_CHECK(props.errorText)) &&
                    <Text style={[{
                        color: 'red',
                        position: 'absolute',
                        bottom:  -20,
                        left: 0,
                    },props.errorTextStyle]}>{props.errorText}</Text>
                }
            </View>

    );
}//end of TextInput component

TextInput.defaultProps = defaultProps;
export default TextInput;

const styles = StyleSheet.create({
    primaryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',


        borderRadius: 7,
        borderColor: '#707070',
        borderWidth: 0,
        margin: 10,
    },
    icon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
})