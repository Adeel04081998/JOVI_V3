import React from 'react';
import { Appearance, Dimensions, StyleSheet, Platform } from 'react-native';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import Image from '../../atoms/Image';
import Text from '../../atoms/Text';
import TouchableOpacity from '../../atoms/TouchableOpacity';
import VectorIcon from '../../atoms/VectorIcon';
import View from '../../atoms/View';
import AnimatedFlatlist from '../AnimatedScrolls/AnimatedFlatlist';

export const PopularList = (props) => {
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

    const SCALE_IMAGE = {
        height: Dimensions.get('window').height / 5,
        width: Dimensions.get('window').width * 0.8
    }
    const { height, width } = SCALE_IMAGE;
    const popularNearYouStyles = popularNearYouStylesFunc(colors, width, height)



    const renderItem = (item, index) => {
        return (
            <TouchableOpacity activeOpacity={0.8} >
                <Image source={item.image} style={[popularNearYouStyles.image, props.imageStyles]} tapToOpen={false} />
                    <View style={popularNearYouStyles.subContainer}>
                        <Text style={popularNearYouStyles.title} numberOfLines={1} >{item.title}</Text>
                        {(item.distance || item.estTime) &&
                            <View style={popularNearYouStyles.iconContainer} >
                                <VectorIcon name={item.distance ? "map-marker" : "clock-time-four"} type={item.distance ? "FontAwesome" : "MaterialCommunityIcons"} color={colors.theme || "#6D51BB"} size={15} style={{ marginRight: 5 }} />
                                <Text style={popularNearYouStyles.estTime} >{item.estTime || item.distance}</Text>
                            </View>
                        }
                    </View>
                    <Text style={popularNearYouStyles.tagsText} numberOfLines={1} >{item.description}</Text>
                    {item.averagePrice &&
                        <Text style={popularNearYouStyles.title} >Rs. {item.averagePrice}</Text>
                    }
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={popularNearYouStyles.container} >
                <Text style={popularNearYouStyles.mainText} >{props.mainText}</Text>
                <TouchableOpacity>
                    <Text style={popularNearYouStyles.viewMoreBtn} >{props.showMoreBtnText}</Text>
                </TouchableOpacity>
            </View>
            <AnimatedFlatlist
                data={props.data}
                renderItem={renderItem}
                itemContainerStyle={{ ...popularNearYouStyles.itemContainer }}
                horizontal={true}
                flatlistProps={{ ...props, showsHorizontalScrollIndicator: false }}
            />
        </View>
    );
}


//styles declararation

const popularNearYouStylesFunc = (colors, width, height) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    mainText: {
        color: colors.text,
        fontSize: 16
    },
    viewMoreBtn: {
        color: colors.theme || '#6D51BB', // colors.theme here should be the theme color of specific category
        fontSize: 12
    },
    itemContainer: {
        backgroundColor: colors.white || '#fff',
        borderRadius: 10,
        marginHorizontal: 5,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    image: {
        height: height,
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
        marginTop:-10
    },
    estTime: {
        fontSize: 12,
        color: colors.theme || '#6D51BB', // colors.theme here should be the theme color of specific category
        marginTop: Platform.OS === "android" ? 3 : 0
    },
    title: {
        fontSize: 14,
        // paddingVertical: 5,
        color: '#000',
        width: width * 0.7
    },
    bodyContainer: {
        width: width * 0.8
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginVertical: 10,
        // backgroundColor:'red'
    }
})