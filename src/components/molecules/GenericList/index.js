import React from 'react';
import { Appearance, StyleSheet, Platform } from 'react-native';
import theme from '../../../res/theme';
import GV from '../../../utils/GV';
import Image from '../../atoms/Image';
import Text from '../../atoms/Text';
import TouchableOpacity from '../../atoms/TouchableOpacity';
import VectorIcon from '../../atoms/VectorIcon';
import View from '../../atoms/View';
import AnimatedFlatlist from '../AnimatedScrolls/AnimatedFlatlist';
import constants from '../../../res/constants';
import { renderFile, sharedExceptionHandler } from '../../../helpers/SharedActions';
import { postRequest } from '../../../manager/ApiManager';
import Endpoints from '../../../manager/Endpoints';
import sharedStyles from '../../../res/sharedStyles';

export default ({ vendorType = 0, imageStyles = {}, showMoreBtnText = "", }) => {
    const SPACING_BOTTOM = 0;
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const fetchData = () => {
        postRequest(Endpoints.GET_VENDORS_GENERIC_LIST,
            {
                "vendorType": vendorType
            },
            res => {
                // console.log("GENERIC_LIST.RESPONSE", res);
                if (res.data.statusCode !== 200) return;
                setData(res.data.vendorCategoriesViewModel.vendorList);
            },
            err => {
                sharedExceptionHandler(err)
            },
            {},
            false,
        );
    };
    React.useEffect(() => {
        fetchData();
    }, [vendorType])
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");

    const SCALE_IMAGE = {
        height: constants.window_dimensions.height / 5,
        width: constants.window_dimensions.width * 0.8
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
                            <VectorIcon name={item.distance ? "map-marker" : "clock-time-four"} type={item.distance ? "FontAwesome" : "MaterialCommunityIcons"} color={colors.theme || "#6D51BB"} size={15} style={{ marginRight: 5 }} />
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
        <View style={{ paddingBottom: SPACING_BOTTOM }}>
            {
                data.map((item, index) => (
                    <React.Fragment key={`generic-item-key-${index}`}>
                        <View style={styles.container} >
                            <Text style={styles.mainText} >{item.header}</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewMoreBtn} >{showMoreBtnText || `View More`}</Text>
                            </TouchableOpacity>
                        </View>

                        <AnimatedFlatlist

                            data={item.vendorList}
                            renderItem={renderItem}
                            itemContainerStyle={{ ...styles.itemContainer }}
                            horizontal={true}
                            flatlistProps={{
                                showsHorizontalScrollIndicator: false,
                                // contentContainerStyle: { paddingBottom: 40 }
                            }}
                        />
                    </React.Fragment>
                ))
            }

        </View>
    );
}


//_styles declararation

const _styles = (colors, width, height) => StyleSheet.create({
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
        justifyContent: 'space-between',
        marginVertical: 10,
        // backgroundColor:'red'
    }
})