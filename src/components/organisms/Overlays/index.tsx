import * as React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';

// #region :: INTERFACE & DEFAULT PROPS START's FROM HERE
interface indexProps {
    children?: any;
    width?: string | number;
    onOpen?: () => void;
    onClose?: () => void;
    handleModal?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    innerContainerStyle?: StyleProp<ViewStyle>;
};

const defaultProps = {
    width: '100%',
    handleModal: false,
    onOpen: undefined,
    onClose: undefined,
};
// #endregion :: INTERFACE & DEFAULT PROPS END's FROM HERE 

const modalBackgroundStyle = { backgroundColor: 'rgba(0, 0, 0, 0.5)' };

const index = (props: indexProps) => {
    const [visible, setVisible] = React.useState(true);
    const skipEffect = React.useRef(true);
    // #region :: useEffect - visible dep START's FROM HERE
    React.useEffect(() => {
        if (visible) {
            props.onOpen && props.onOpen();
        } else {
            props.onClose && props.onClose();
        }
        return () => { skipEffect.current = true; };
    }, [visible]);

    // #endregion :: useEffect - visible dep END's FROM HERE 


    // #region :: useEffect - handleModal START's FROM HERE
    React.useEffect(() => {
        if (skipEffect.current) {
            skipEffect.current = false;
            return;
        }
        setVisible(props?.handleModal ?? defaultProps.handleModal);
        return () => { skipEffect.current = true; };
    }, [props.handleModal]);

    // #endregion :: useEffect - handleModal END's FROM HERE 


    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    // #region :: MAIN UI START's FROM HERE 
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={closeModal}
                onPressIn={closeModal}
                onPressOut={closeModal}
                disabled={true}
                style={[styles.container, modalBackgroundStyle, props.containerStyle]}>
                <View style={[styles.innerContainerTransparentStyle, props.innerContainerStyle, { minWidth: props.width, }]}>
                    {props.children}
                </View>
            </TouchableOpacity>
        </Modal>
    );
    // #endregion :: MAIN UI END's FROM HERE 
};

index.defaultProps = defaultProps;
export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        backgroundColor: '#ecf0f1',
        minHeight: 20,
        // paddingBottom: 20,
    },
    innerContainerTransparentStyle: {
        backgroundColor: '#fff',
        marginHorizontal: 0,//AppStyles.HORIZONTAL,
        borderRadius: 18,
        maxHeight: "90%",
        minHeight: 20,
    },
}); //end of StyleSheet STYLES
