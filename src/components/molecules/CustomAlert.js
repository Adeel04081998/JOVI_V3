import React from "react";
import { Animated, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import svgs from "../../assets/svgs";
import actions from "../../redux/actions";
import constants from "../../res/constants";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import Text from "../atoms/Text";
import TouchableOpacity from "../atoms/TouchableOpacity";
import VectorIcon from "../atoms/VectorIcon";
import View from "../atoms/View";

const width = constants.screen_dimensions.width;
export default ({ customAlertDetails = {} }) => {
    const { title = '', message = '', okButton, cancelButton,showBubbleImage=true, customOkButtonStyle={},closePopupOnSuccess = true, cancelable = true, hideCrossIcon = false, customColors = null, CustomComponent = null } = customAlertDetails;
    const alertAnimation = React.useRef(new Animated.Value(0)).current;
    const colors = customColors ?? theme.getTheme(ENUMS.PITSTOP_TYPES[0].value);
    const dispatch = useDispatch();
    const isCancelable = cancelable || (!okButton && !cancelButton);
    const styles = _styles(colors);
    const closeCustomAlert = () => {
        handleAnimation(0);
    }
    const handleAnimation = (toValue = 1) => {
        Animated.timing(alertAnimation, {
            toValue: toValue,
            duration: 300,
            useNativeDriver: true,
        }).start(finished => {
            if (finished && toValue === 0) {
                dispatch(actions.closeCustomAlertAction());
            }
        });
    }
    React.useEffect(() => {
        handleAnimation();
    }, []);
    return (
        <Animated.View
            style={{ opacity: alertAnimation, ...styles.container, backgroundColor: 'transparent' }}>
            <TouchableOpacity
                disabled={!isCancelable}
                activeOpacity={1}
                style={{ opacity: alertAnimation, ...styles.touchableContainer, }}
                onPress={() => {
                    if (isCancelable) {
                        closeCustomAlert();
                    }
                }}></TouchableOpacity>
            <View style={styles.parentView}>
                <View style={styles.headerContainer}>
                    <Text style={{ color: colors.white }}>{title}</Text>
                    {!hideCrossIcon && <TouchableOpacity onPress={closeCustomAlert}>
                        <VectorIcon color={colors.white} name={'cross'} type={'Entypo'} />
                    </TouchableOpacity>}
                </View>
                <View style={{...styles.bodyContainer,paddingBottom:showBubbleImage?40:15}}>
                    {
                        CustomComponent ?
                            (CustomComponent)
                            : <>
                                <Text style={styles.message}>{message}</Text>
                                <View style={styles.buttonsContainer}>
                                    {cancelButton && <TouchableOpacity
                                        onPress={() => {
                                            if (cancelButton.onPress) {
                                                cancelButton.onPress();
                                            }
                                            closeCustomAlert();
                                        }}
                                        style={styles.cancelButton}
                                    >
                                        <Text style={{ color: colors.primary }}>{cancelButton.text}</Text>
                                    </TouchableOpacity>}
                                    {okButton && <TouchableOpacity
                                        onPress={() => {
                                            if (closePopupOnSuccess) {
                                                closeCustomAlert();
                                            }
                                            if (okButton.onPress) {
                                                okButton.onPress();
                                            }
                                        }}
                                        style={[styles.okButton,customOkButtonStyle]}
                                    >
                                        <Text style={{ color: colors.white }}>{okButton.text}</Text>
                                    </TouchableOpacity>}
                                </View>
                            </>
                    }
                </View>
                {showBubbleImage&&<SvgXml style={styles.bubbleSvg} xml={svgs.BubblesToastIcon(colors.primary)} />}
            </View>
        </Animated.View>
    );
};

const _styles = (colors = {}) => StyleSheet.create({
    container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    parentView: {
        width: width * 0.9,
        backgroundColor: colors.white,
        borderRadius: 15,
        overflow: 'hidden',
    },
    touchableContainer: {
        position: 'absolute', top: 0, right: 0, height: '100%', width: '100%', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
    },
    headerContainer: { width: '100%', height: 40, justifyContent: 'space-between', paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary },
    bodyContainer: { flexDirection: 'column', paddingHorizontal: 10, justifyContent: 'center', paddingTop: 10, alignItems: 'center', paddingBottom: 40 },
    message: { fontSize: 14, alignSelf: 'center', textAlign: 'center', color: colors.black, marginVertical: 10 },
    buttonsContainer: { marginTop: 10, height: 50, flexDirection: 'row', overflow: 'hidden', justifyContent: 'space-between' },
    cancelButton: { borderRadius: 80, width: 112, marginRight: 10, color: colors.white, borderWidth: 1, backgroundColor: colors.white, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', height: 44, textAlign: 'center', alignContent: 'center' },
    okButton: { borderRadius: 80, width: 112, color: colors.white, justifyContent: 'center', backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.white, alignItems: 'center', height: 44, textAlign: 'center', alignContent: 'center' },
    bubbleSvg: { position: 'absolute', bottom: 0, left: -4 },
});