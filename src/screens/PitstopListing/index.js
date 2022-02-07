import React from 'react';
import { Animated, Appearance, SafeAreaView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import GenericList from '../../components/molecules/GenericList';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import Search from '../Home/components/Search';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import stylesheet from './styles';
import AnimatedFlatlist from '../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import Text from '../../components/atoms/Text';
import VectorIcon from '../../components/atoms/VectorIcon';
import ENUMS from '../../utils/ENUMS';
import BottomBarComponent from '../../components/organisms/BottomBarComponent';
import TouchableScale from '../../components/atoms/TouchableScale';
import ImageCarousel from '../../components/molecules/ImageCarousel';
import { useSelector } from 'react-redux';
import constants from '../../res/constants';
import CategoryCardItem from '../../components/molecules/CategoryCardItem';
import sharedStyles from '../../res/sharedStyles';
import PitstopsVerticalList from './PitstopsVerticalList';
const PITSTOPS = {
    SUPER_MARKET: 1,
    JOVI: 2,
    PHARMACY: 3,
    RESTAURANT: 4,
}
const SPACING_VERTICAL = 10;
const FILTER_ICON_HEIGHT = 35;
const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.3;
const PistopListing = ({ pitstopType = 4 }) => {
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const pitstopSpecific = {
        [PITSTOPS.RESTAURANT]: {
            filterTitleShown: true,
            filterScreenIcon: true,
            searchPlaceHolder: 'What do you want to eat?',
            categorySection: true,
        },
        [PITSTOPS.SUPER_MARKET]: {
            filterTitleShown: true,
            filterScreenIcon: true,
            searchPlaceHolder: 'What do you want to eat?',
            categorySection: true,
        },
    }
    const currentPitstopType = pitstopSpecific[pitstopType];
    const [state, setState] = React.useState({});
    const colors = theme.getTheme(GV.THEME_VALUES.RESTAURANT, Appearance.getColorScheme() === "dark");
    const listingStyles = stylesheet.styles(colors);
    return (
        <View style={listingStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader defaultColor={colors.primary} leftIconType={'AntDesign'} leftIconName={'arrowleft'} />
                <KeyboardAwareScrollView >
                    <View style={{ ...listingStyles.wrapper, paddingBottom: 10 }}>
                        <Search placeholder={'What do you want to eat?'} colors={colors} homeStyles={listingStyles} />
                        <Filters filterConfig={currentPitstopType} />
                        <CategoriesTab listingStyles={listingStyles} />
                    </View>
                    <ImageCarousel
                        // aspectRatio={16 / 7}
                        data={promotionsReducer?.dashboardContentListViewModel?.dashboardPromoListVM ??
                            [{
                                promoImg: promotionsReducer?.dashboardContentListViewModel?.dashboardBannerImg ??
                                    `Dev/DashboardBanner/2021/5/20/Jov_banner_350x220 (1)_12173.jpg`
                            }]} // Hardcoded url added for QA testing only if there is no data in db => Mudassir
                        uriKey="promoImg"
                        containerStyle={{ ...listingStyles.imageCarousal }}
                        height={128}
                        theme={colors}
                    />
                    <View style={listingStyles.wrapper}>
                        <GenericList themeColors={colors} />
                        <PitstopsVerticalList colors={colors} />
                    </View>
                </KeyboardAwareScrollView>
                <BottomBarComponent leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]} rightData={[{ id: 3, iconName: "wallet", title: "Wallet" }, { id: 4, iconName: "pin", title: "Location" }]} />
            </SafeAreaView>
        </View>
    );
}
export default PistopListing;

const CategoriesTab = ({ filterConfig, listingStyles }) => {
    return (<View style={{ marginTop: 10, overflow: 'visible' }}>
        {<Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={{ fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL }}>
            Cuisine
        </Text>}
        <AnimatedFlatlist
            data={
                [
                    {
                        text: 'Pizza',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Burger',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Pizza',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Calzone',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Discounts',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Discounts',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Discounts',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Discounts',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Discounts',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    }, {
                        text: 'Distance',
                        icon: ENUMS.PITSTOP_TYPES[1].icon,
                    },
                ]
            }
            renderItem={(x, i) => {
                return <CategoryCardItem
                    key={`category card item${i}`}
                    xml={x.icon}
                    title={x.text}
                    // containerStyle={listingStyles.cat_item_container}
                    containerStyleOverride={true}
                    // height={CONTAINER_HEIGHT}
                    // width={CONTAINER_WIDTH}
                    textStyle={{ fontSize: 12, padding: 2 }}
                    imageContainerStyle={[{ height: CONTAINER_HEIGHT * 0.6 }, listingStyles.cat_img_container]}
                    onPress={() => { }}
                />
            }}
            horizontal={true}
            itemContainerStyle={{
                height: CONTAINER_HEIGHT + 5,
                width: CONTAINER_WIDTH,
                marginBottom: 5,
                justifyContent: 'center',
                backgroundColor: '#fff',
                // borderWidth: 0.2,
                // borderColor: 'rgba(0,0,0,0.4)',
                // borderRadius: 4,
                // justifyContent: 'center',
                // paddingHorizontal: 5,
                // backgroundColor: 'white',
                // // width:80,
                // marginHorizontal: 5,
                ...sharedStyles._styles().shadow,
                ...listingStyles.cat_item_container,
            }}
        />
    </View>)
}
const Filters = ({ filterConfig }) => {
    return (<View style={{ width: '100%',paddingTop:10, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        {/* {filterConfig.filterTitleShown && <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={{ fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL }}>
            Filters
        </Text>} */}
        <View style={{
            display: 'flex',
            flexDirection: 'row'
        }}>
            <TouchableScale style={{
                height: FILTER_ICON_HEIGHT,
                // borderWidth: 0.2,
                // borderColor: 'rgba(0,0,0,0.4)',
                borderRadius: 4,
                justifyContent: 'center',
                paddingHorizontal: 5,
                backgroundColor: 'white',
                // width:80,Î
                marginHorizontal: 5,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,

                elevation: 6,
            }}>
                <VectorIcon name={'filter'} type={'AntDesign'} size={17} color={'black'} style={{ marginRight: 2 }} />
            </TouchableScale>
            <AnimatedFlatlist
                data={[{
                    title: 'Discounts',
                    iconName: 'ticket',
                    type: 'Entypo'
                }, {
                    title: 'Distance',
                    iconName: 'direction',
                    type: 'Entypo'
                },{
                    title: 'Discounts',
                    iconName: 'ticket',
                    type: 'Entypo'
                }, {
                    title: 'Distance',
                    iconName: 'direction',
                    type: 'Entypo'
                },{
                    title: 'Discounts',
                    iconName: 'ticket',
                    type: 'Entypo'
                }, {
                    title: 'Distance',
                    iconName: 'direction',
                    type: 'Entypo'
                },]}
                renderItem={(item, i) => {
                    return <TouchableScale style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <VectorIcon name={item.iconName} type={item.type} size={17} color={'black'} style={{ marginRight: 2 }} />
                        <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }} fontFamily={'PoppinsBold'} >{item.title}</Text>
                    </TouchableScale>
                }}
                horizontal={true}
                itemContainerStyle={{
                    height: FILTER_ICON_HEIGHT,
                    borderWidth: 0.2,
                    borderColor: 'rgba(0,0,0,0.4)',
                    borderRadius: 4,
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    backgroundColor: 'white',
                    // width:80,
                    marginHorizontal: 5,
                }}
            />
        </View>
    </View>)
}