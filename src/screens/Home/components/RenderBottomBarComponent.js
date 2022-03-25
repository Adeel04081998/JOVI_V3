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

export default React.memo(({ homeStyles }) => {
    const userReducer = useSelector(state => state.userReducer);
    const ordersCount = userReducer?.openOrders?.length;
    return (
        <BottomBarComponent
            leftData={[{ id: 1, iconName: "home", title: "Home" }, { id: 2, iconName: "person", title: "Profile" }]}
            rightData={[
                {
                    id: 3, iconName: "wallet", title: "Orders",
                    notification: true,
                    notificationCount: ordersCount,
                    customComponent: (
                        <SvgXml xml={svgs.orderBottomBar()} height={22} width={22} />
                    ),
                    onPress: () => {
                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.OrderHistory.screen_name);
                    }
                },
                {
                    id: 4, iconType: "AntDesign", iconName: "logout", title: "Logout", onPress: () => {
                        sharedConfirmationAlert("Alert", "Log me out and remove all the cache?",
                            [
                                { text: "No", onPress: () => { } },
                                {
                                    text: "Yes", onPress: () => preference_manager.clearAllCacheAsync().then(() => sharedLogoutUser())
                                },
                            ]
                        )
                    }
                }]} />
    )
}, (prevProps, nextProps) => prevProps !== nextProps)
// }, (prevProps, nextProps) => prevProps !== nextProps)