import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import NavigationService from '../../../navigations/NavigationService';
import { initColors } from '../../../res/colors';
import constants from '../../../res/constants';
import Text from '../../atoms/Text';
import Button from '../../molecules/Button';
import Overlay from "./index";

// #region :: INTERFACE & DEFAULT PROPS START's FROM HERE
interface VendorOpeningProps {
    colors?: typeof initColors;
    containerStyle?: StyleProp<ViewStyle>;
    headingTextStyle?: StyleProp<TextStyle>;
    timeTextStyle?: StyleProp<TextStyle>;

    heading?: string;
    time: string;
    buttonText: string;
    buttonPress?: () => void;
};

const defaultProps = {
    colors: initColors,
    heading: 'Opens',
    time: '00:00 PM',
    buttonText: "Go back",
    buttonPress: undefined,
};
// #endregion :: INTERFACE & DEFAULT PROPS END's FROM HERE 

const VendorOpening = (props: VendorOpeningProps) => {
    const colors = props?.colors ?? defaultProps.colors;
    const styles = StylesFunc(colors);

    const [visible, setVisible] = React.useState(true);

    // #region :: MAIN UI START's FROM HERE 
    return (
        <Overlay
            handleModal={visible}
            width={"80%"}
            innerContainerStyle={[styles.primaryInnerContainer, props.containerStyle]}>
            <Text style={[styles.headingText, props.headingTextStyle]}>{`${props.heading}`}</Text>
            <Text fontFamily="PoppinsBold" style={[styles.timeText, props.timeTextStyle]}>{`${props.time}`}</Text>
            <Button
                style={styles.button}
                text={props.buttonText}
                onPress={() => {
                    if (props.buttonPress) {
                        props.buttonPress();
                    } else {
                        setVisible(false);
                        NavigationService.NavigationActions.common_actions.goBack();
                    }
                }} />
        </Overlay>
    );
    // #endregion :: MAIN UI END's FROM HERE 
};

VendorOpening.defaultProps = defaultProps;
export default VendorOpening;

const StylesFunc = (colors: typeof initColors = initColors,) => StyleSheet.create({
    primaryInnerContainer: {
        backgroundColor: colors.primary,
        minHeight: "15%",
        width: "80%",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    headingText: {
        fontSize: 18,
        color: colors.white,
        textAlign: "center",
        paddingBottom: 4,
        paddingTop: constants.spacing_vertical * 2,
    },
    timeText: {
        fontSize: 22,
        color: colors.white,
        textAlign: "center",
    },
    button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.white,
        width: "90%",
        height: 45,
        borderRadius: 4,
        marginTop: constants.spacing_vertical * 2,
        marginBottom: constants.spacing_vertical,
    },
})
