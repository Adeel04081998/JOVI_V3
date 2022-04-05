import React from 'react';
import CategoryCardItem from '../../../components/molecules/CategoryCardItem';
import AnimatedView from '../../../components/atoms/AnimatedView';
import ENUMS from '../../../utils/ENUMS';
import constants from '../../../res/constants';
import Text from '../../../components/atoms/Text';
import { sharedConfirmationAlert, sharedLogoutUser, sharedOnCategoryPress } from '../../../helpers/SharedActions';
import BottomBarComponent from '../../../components/organisms/BottomBarComponent';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../assets/svgs';
import NavigationService from '../../../navigations/NavigationService';
import ROUTES from '../../../navigations/ROUTES';
import preference_manager from '../../../preference_manager';
import { useSelector } from 'react-redux';
import { PITSTOP_TYPES } from '../../../utils/GV';

export default React.memo(({ homeStyles, showCategories = false, bottomBarComponentProps = {}, pitstopType = PITSTOP_TYPES.JOVI, colors = null }) => {
    const userReducer = useSelector(state => state.userReducer);
    const ordersCount = (userReducer?.openOrders ?? []).length;
    const onPressBottomIcon = (screen = '') => {
        if (bottomBarComponentProps?.screenName) {
            if (bottomBarComponentProps.screenName !== screen) {
                NavigationService.NavigationActions.common_actions.navigate(screen);
            }
        } else {
            NavigationService.NavigationActions.common_actions.navigate(screen);
        }
    }
    return (
        <BottomBarComponent
            {...colors && {
                colors: colors,
            }}
            pitstopType={pitstopType}
            showCategories={showCategories}
            leftData={[{
                id: 1, iconName: "home", title: "Home", screen_name: ROUTES.APP_DRAWER_ROUTES.Home.screen_name, onPress: () => onPressBottomIcon(ROUTES.APP_DRAWER_ROUTES.Home.screen_name)
            }, {
                id: 2, iconType: 'MaterialCommunityIcons', iconName: "ticket-percent-outline", title: "Promo", onPress: () => onPressBottomIcon(ROUTES.APP_DRAWER_ROUTES.GoodyBag.screen_name)
            }]}
            rightData={[
                {
                    id: 3, iconName: "wallet", title: "Orders",
                    notification: true,
                    notificationCount: ordersCount,
                    customComponent: (
                        <SvgXml xml={svgs.orderBottomBar()} height={22} width={22} />
                    ),
                    onPress: () => onPressBottomIcon(ROUTES.APP_DRAWER_ROUTES.OrderHistory.screen_name)
                },
                {
                    id: 4, iconType: "Ionicons", iconName: "wallet", title: "Wallet", onPress: () => onPressBottomIcon(ROUTES.APP_DRAWER_ROUTES.Wallet.screen_name)
                }]} {...bottomBarComponentProps} />
    )
}, (prevProps, nextProps) => prevProps !== nextProps)
// }, (prevProps, nextProps) => prevProps !== nextProps)