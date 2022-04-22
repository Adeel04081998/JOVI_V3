import React from 'react';
import { Appearance, Platform, ScrollView, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import svgs from '../../../assets/svgs';
import { renderFile, sharedConfirmationAlert, sharedLogoutUser, uniqueKeyExtractor, VALIDATION_CHECK } from '../../../helpers/SharedActions';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import preference_manager from '../../../preference_manager';
import constants from '../../../res/constants';
import sharedStyles from '../../../res/sharedStyles';
import theme from '../../../res/theme';
import GV, { isIOS, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../../utils/GV';
import Image from '../../atoms/Image';
import Text from '../../atoms/Text';
import TouchableOpacity from '../../atoms/TouchableOpacity';
import VectorIcon from '../../atoms/VectorIcon';
import deviceInfoModule from 'react-native-device-info';
import View from '../../atoms/View';
const SPACING = 10;
const PROFILE_PICTURE_SECTION = 100;
const PROFILE_PICTURE_INNER_SECTION = 85;
const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
const drawerRoutes = [
    {
        screenName: 'Home',
        icon: svgs.drawerHome(),
        route: ROUTES.APP_DRAWER_ROUTES.Home.screen_name
    },
    {
        screenName: 'Delivery Addresses',
        icon: svgs.drawerDeliveryAddr(),
        route: ROUTES.APP_DRAWER_ROUTES.FavAddresses.screen_name
    },
    {
        screenName: 'Support',
        icon: svgs.drawerSupport(),
        route: ROUTES.APP_DRAWER_ROUTES.Support.screen_name
    },
    {
        screenName: 'Contact Us',
        icon: svgs.drawerContactUs(),
        route: ROUTES.APP_DRAWER_ROUTES.ContactUs.screen_name
    },
];
const drawerInfoRoutes = [
    {
        screenName: 'Help & FAQs',
        icon: svgs.drawerHelp(),
        route: ROUTES.APP_DRAWER_ROUTES.FAQ.screen_name
    },
    {
        screenName: 'Legal',
        icon: svgs.drawerLegal(),
        route: ROUTES.APP_DRAWER_ROUTES.Legal.screen_name
    },
];
export default () => {
    const userReducer = useSelector(store => store.userReducer);
    const styles = drawerStyles(colors);
    const onNavigationItemPress = (item) => {
        NavigationService.NavigationActions.drawer_actions.toggleDrawer();
        NavigationService.NavigationActions.common_actions.navigate(item.route)
    }
    const renderNavigationItem = (item, i, containerStyles = {}, customStyles = null) => {
        return <TouchableOpacity style={{ ...customStyles ? customStyles : styles.navigationItem, ...containerStyles }} onPress={() => onNavigationItemPress(item)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgXml xml={item.icon} height={20} width={20} style={{ marginBottom: 4 }} />
                <Text style={{ marginLeft: 10, fontSize: 16,color:colors.black }}>{item.screenName}</Text>
            </View>
            <View>
                <VectorIcon name={'arrow-forward-ios'} type={'MaterialIcons'} size={15} color={colors.primary} />
            </View>
        </TouchableOpacity>
    }
    return <View style={styles.container}>
        <View style={styles.profileContainer}>
            <TouchableOpacity style={styles.crossIcon} onPress={() => {
                NavigationService.NavigationActions.drawer_actions.toggleDrawer();
            }}>
                <VectorIcon type="Entypo" name="cross" color={colors.black} size={30} />
            </TouchableOpacity>
            <View style={{ width: '50%', }}>
                <Text style={styles.greetingText}>Hi</Text>
                <Text style={styles.userName} fontFamily={'PoppinsBold'} numberOfLines={1}>{userReducer.firstName ?? ''}</Text>
                {/* <TouchableOpacity style={{ height: 40, width: 140, borderRadius: 50, ...sharedStyles._styles(colors).placefor_specific_shadow, backgroundColor: colors.white, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <VectorIcon name={'feed-star'} type={'Octicons'} color={'#FFC43B'} />
                    <Text style={{ fontSize: 15, color: colors.black,marginLeft:3 }}>Goody Bag</Text>
                    <VectorIcon name={'arrow-forward-ios'} type={'MaterialIcons'} color={colors.black} />
                </TouchableOpacity> */}
            </View>
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
                <TouchableOpacity style={styles.profilePicContainer} onPress={() => onNavigationItemPress({ route: ROUTES.APP_DRAWER_ROUTES.Profile.screen_name })}>
                    <View style={styles.profilePicInnerContainer}>
                        <Image tapToOpen={false} source={VALIDATION_CHECK(userReducer.picture) ? { uri: renderFile(userReducer.picture) } : require('../../../assets/images/user.png')}
                            style={{ height: PROFILE_PICTURE_INNER_SECTION, width: PROFILE_PICTURE_INNER_SECTION, borderRadius: PROFILE_PICTURE_INNER_SECTION / 2 }}
                            height={PROFILE_PICTURE_INNER_SECTION} width={PROFILE_PICTURE_INNER_SECTION}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.navigationContainer}>
            <ScrollView style={{ flex: 1 }}>
                {
                    drawerRoutes.map((item, i) => {
                        return (
                            <View key={uniqueKeyExtractor()}>
                                {renderNavigationItem(item, i, i === 0 ? { borderTopColor: colors.grey, borderTopWidth: 0.4 } : {})}
                            </View>
                        )

                    })
                }
                <Text style={{ fontSize: 20, margin: SPACING, color: colors.black }} fontFamily={'PoppinsRegular'}>Information</Text>
                {
                    drawerInfoRoutes.map((item, i) => {
                        return (
                            <View key={uniqueKeyExtractor()}>
                                {renderNavigationItem(item, i, {}, styles.informationNavigationItem)}
                            </View>
                        )

                    })
                }
            </ScrollView>
        </View>
        <TouchableOpacity style={styles.logoutContainer} onPress={() => sharedConfirmationAlert("Alert", "Log me out and remove all the cache?",
            [
                { text: "No", onPress: () => { } },
                {
                    text: "Yes", onPress: () => {
                        NavigationService.NavigationActions.drawer_actions.toggleDrawer();
                        preference_manager.clearAllCacheAsync().then(() => sharedLogoutUser());
                    }
                },
            ]
        )}>
            <View style={{ flexDirection: 'row' }}>
                <VectorIcon type="AntDesign" name="logout" color={colors.black} style={{ marginTop: 2 }} />
                <Text style={{ marginLeft: 5, fontSize: 16 }}>Log Out</Text>
            </View>
            <View>
                <Text style={{ fontSize: 16, }} fontFamily={'PoppinsLight'}>Jovi, v.{constants.app_version}</Text>
            </View>
        </TouchableOpacity>
    </View>
}

const drawerStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8', paddingTop: isIOS ? (deviceInfoModule.hasNotch ? 40 : 0) : 0 },
    profileContainer: { height: '25%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: SPACING },
    crossIcon: { height: 30, width: 30, position: 'absolute', top: 5, right: -5 },
    greetingText: { fontSize: 25, color: colors.black, paddingVertical: Platform.OS === "ios" ? 8 :  0 },
    userName: { fontSize: 25, color: colors.black, marginTop: -13 },
    profilePicContainer: { height: PROFILE_PICTURE_SECTION, width: PROFILE_PICTURE_SECTION, borderRadius: PROFILE_PICTURE_SECTION / 2, borderWidth: 3, borderColor: colors.black, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
    profilePicInnerContainer: { height: PROFILE_PICTURE_INNER_SECTION, width: PROFILE_PICTURE_INNER_SECTION, borderRadius: PROFILE_PICTURE_INNER_SECTION / 2, backgroundColor: colors.primary },
    navigationContainer: { height: '68 %', marginBottom: 60 },
    navigationItem: { height: 60, flexDirection: 'row', borderBottomWidth: 0.4, borderBottomColor: colors.grey, backgroundColor: colors.white, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING, width: '100%' },
    informationNavigationItem: { height: 60, flexDirection: 'row', backgroundColor: colors.white, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING, width: '100%', },
    logoutContainer: { height: 60, width: '100%', position: "absolute", bottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING, backgroundColor: colors.white },
});