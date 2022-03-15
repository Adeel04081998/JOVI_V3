import React from "react";
import { StyleSheet } from "react-native";
import Image from "../../../components/atoms/Image";
import ImageBackground from "../../../components/atoms/ImageBackground";
import Text from "../../../components/atoms/Text";
import TouchableOpacity from "../../../components/atoms/TouchableOpacity";
import VectorIcon from "../../../components/atoms/VectorIcon";
import View from "../../../components/atoms/View";
import { renderFile } from "../../../helpers/SharedActions";
import constants from "../../../res/constants";
import sharedStyles from "../../../res/sharedStyles";

export default ({ colors, data = {}, onPressPitstop = () => { }, containerStyles = {}, containerProps = {}, index, imageStyles = { width: '100%' }, renderWithoutTouchableOpacity = false }) => {
    const { title, description, estTime, distanceFromLocation, image, averagePrice } = data;
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.86
    }
    const { height, width } = SCALE_IMAGE;
    const styles = cardStyles(colors, height, width);
    const renderBody = () => {
        return <>
            <ImageBackground source={{ uri: renderFile(image) }} style={[styles.image, imageStyles]} tapToOpen={false} >
                {(data.isClosed || data.isClose) &&
                    <View style={{
                        ...StyleSheet.absoluteFillObject,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 10,
                    }}>
                        <View style={{
                            backgroundColor: colors.primary,
                            paddingVertical: constants.spacing_vertical,
                            width: constants.window_dimensions.width * 0.3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                        }}>
                            <Text style={{ fontSize: 12, color: colors.white, }}>{`Opens`}</Text>
                            <Text fontFamily="PoppinsMedium" style={{ fontSize: 16, textAlign: "center", color: colors.white, }}>{`${data?.pitstopOpeningTimeStr ?? ''}`}</Text>
                        </View>
                    </View>
                }
            </ImageBackground>
            <View style={styles.subContainer}>
                <Text style={styles.title} numberOfLines={1} >{title}</Text>
                {(distanceFromLocation || estTime) &&
                    <View style={styles.iconContainer} >
                        <VectorIcon name={distanceFromLocation ? "map-marker" : "clock-time-four"} type={distanceFromLocation ? "FontAwesome" : "MaterialCommunityIcons"} color={colors.primary || "#6D51BB"} size={15} style={{ marginRight: 5 }} />
                        <Text style={styles.estTime} >{estTime || distanceFromLocation} m</Text>
                    </View>
                }
            </View>
            <Text style={styles.tagsText} numberOfLines={1} >{description}</Text>
            {averagePrice &&
                <Text style={styles.title} >Rs. {averagePrice}</Text>
            }
        </>
    }
    if (renderWithoutTouchableOpacity === true) {
        return renderBody()
    }
    return (
        <TouchableOpacity onPress={() => onPressPitstop(data, index)} activeOpacity={0.8} style={{ ...styles.itemContainer, height: 270, ...containerStyles }} {...containerProps}>
            {renderBody()}
        </TouchableOpacity>
    );
};

const cardStyles = (colors, height, width) => StyleSheet.create({
    itemContainer: {
        ...sharedStyles._styles(colors).shadow,
        backgroundColor: colors.white || '#fff',
        borderRadius: 10,
        marginHorizontal: 5,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5
    },
    image: {
        height: 200,
        // height: height,
        width: width,
        borderRadius: 10
    },
    iconContainer: {
        borderRadius: 15,
        backgroundColor: colors.iconContainer || '#F6F5FA',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    tagsText: {
        fontSize: 12,
        color: colors.subText || '#212121',
        opacity: 0.6,
        width: width * 0.9,
        // backgroundColor:'blue',
        marginTop: -10
    },
    estTime: {
        fontSize: 12,
        color: colors.primary || '#6D51BB', // colors.theme here should be the theme color of specific category
        marginTop: Platform.OS === "android" ? 3 : 0
    },
    title: {
        fontSize: 14,
        // paddingVertical: 5,
        color: '#000',
        width: width * 0.7
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        // backgroundColor:'red'
    }
});