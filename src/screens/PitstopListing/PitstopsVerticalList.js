import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Image from '../../components/atoms/Image';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import { renderFile } from '../../helpers/SharedActions';
import constants from '../../res/constants';
import sharedStyles from '../../res/sharedStyles';
const data = [{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},{
    "vendorID": 1,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera",
    "description": "Western Cuisine",
    "distance": "20m"
}, {
    "vendorID": 2,
    "image": "staging/Supermarket/2021/4/2/Thumbnail_food_14754.jpg",
    "title": "Jazeera 2",
    "description": "Western Cuisine",
    "distance": "20m"
},];
const PitstopsVerticalList = ({ colors, imageStyles = {}, }) => {
    const [state, setState] = useState({});
    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.86
    }
    const { height, width } = SCALE_IMAGE;
    const styles = _styles(colors, width, height)
    const renderItem = (item, index) => {
        const { title, description, estTime, distance, image, averagePrice } = item;
        return (
            <TouchableOpacity activeOpacity={0.8} >
                <Image source={{ uri: renderFile(image) }} style={[styles.image, imageStyles]} tapToOpen={false} />
                <View style={styles.subContainer}>
                    <Text style={styles.title} numberOfLines={1} >{title}</Text>
                    {(distance || estTime) &&
                        <View style={styles.iconContainer} >
                            <VectorIcon name={item.distance ? "map-marker" : "clock-time-four"} type={item.distance ? "FontAwesome" : "MaterialCommunityIcons"} color={colors.primary || "#6D51BB"} size={15} style={{ marginRight: 5 }} />
                            <Text style={styles.estTime} >{estTime || distance}</Text>
                        </View>
                    }
                </View>
                <Text style={styles.tagsText} numberOfLines={1} >{description}</Text>
                {averagePrice &&
                    <Text style={styles.title} >Rs. {averagePrice}</Text>
                }
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container} >
                <Text style={styles.mainText} >All Restaurant</Text>
            </View>
            <AnimatedFlatlist
                data={data}
                renderItem={renderItem}
                itemContainerStyle={{ ...styles.itemContainer }}
                flatlistProps={{
                    showsHorizontalScrollIndicator: false,
                    // contentContainerStyle: { paddingBottom: 40 }
                }}
            />
        </View>
    );
}
export default PitstopsVerticalList;

const _styles = (colors, width, height) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
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
    mainText: {
        color: colors.text,
        fontSize: 18,
        fontWeight:'bold'
    },
    viewMoreBtn: {
        color: colors.primary || '#6D51BB', // colors.theme here should be the theme color of specific category
        fontSize: 12
    },
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
    bodyContainer: {
        width: width * 0.8
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        // backgroundColor:'red'
    }
})