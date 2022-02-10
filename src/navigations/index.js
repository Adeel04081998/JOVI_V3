import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
// Auth imports
import Introduction from '../screens/IntroScreen';
import EnterOTP from '../screens/OTP/Enter';
import VerifyOTP from '../screens/OTP/Verify';
import SignUp from '../screens/SignUp/index';

import Home from '../screens/Home';
import PitstopListing from '../screens/PitstopListing';
import ROUTES from './ROUTES';
import SharedActions, { sharedGetEnumsApi, sharedGetHomeMsgsApi, sharedGetPromotions, sharedGetUserAddressesApi, sharedGetUserDetailsApi, sharedLogoutUser } from '../helpers/SharedActions';
import { store } from '../redux/store';
import Filter from '../components/atoms/Filter';
import { useSelector } from 'react-redux';
import PitstopsVerticalList from '../screens/PitstopListing/PitstopsVerticalList';
import RestaurantProductMenu from '../screens/RestaurantProductMenu';
const { AUTH_STACKS, INIT_ROUTES, AUTH_ROUTES, APP_STACKS, APP_ROUTES,APP_DRAWER_ROUTES,APP_DRAWER_STACK } = ROUTES;
const AppDrawerStack = (props) => {
    return <Stack.Navigator screenOptions={stackOpts} initialRouteName={APP_DRAWER_ROUTES.Home.screen_name}>
        {(APP_DRAWER_STACK || []).map((routeInfo, index) => (
            <Stack.Screen
                key={`AppDrawerss-Screen-key-${index}-${routeInfo.id}`}
                name={routeInfo.screen_name}
                component={AppDrawerComponents[routeInfo.componenet]}
                options={routeInfo.options ? routeInfo.options : options}

            />
        ))}
    </Stack.Navigator >
}
const AuthComponents = {
    Introduction,
    EnterOTP,
    VerifyOTP,
    SignUp

}//will open with Slide Animation
const AppComponents = {
    AppDrawerStack,
   
};//will open without Slide Animation
const AppDrawerComponents = {
    Home,
    PitstopListing,
    Filter,
    PitstopsVerticalList,
    RestaurantProductMenu,
}//will open with Slide Animation
const ContainerStack = createStackNavigator();
const Stack = createSharedElementStackNavigator();
const Drawer = createDrawerNavigator();

const options = () => ({
    gestureEnabled: false,
    transitionSpec: {
        open: { animation: "timing", config: { duration: 400 } },
        close: { animation: "timing", config: { duration: 400 } }
    },
    cardStyleInterpolator: forSlide
})
const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
    //current targets the current active screen, next is the screen which will be rendered after transition
    const progress = Animated.add(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        }),
        next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            })
            : 0
    );
    return {
        cardStyle: {
            transform: [
                {
                    translateX: Animated.multiply(
                        progress.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [
                                screen.width, // Focused, but offscreen in the beginning
                                0, // Fully focused
                                screen.width * -0.3, // Fully unfocused
                            ],
                            extrapolate: 'clamp',
                        }),
                        inverted
                    ),
                },
            ],
        },
    };
};
const stackOpts = () => ({
    headerShown: false,
    unmountOnBlur:true,
    swipeEnabled: false
});
const AuthStacks = (props) => {
    // const { setIsLoggedIn } = props;
    const isIntroViewed = React.useRef(false);
    useSelector(state => {
        isIntroViewed.current = state.userReducer.introScreenViewed
    });
    return <Stack.Navigator screenOptions={stackOpts} initialRouteName={isIntroViewed.current ? AUTH_ROUTES.EnterOTP.screen_name : AUTH_ROUTES.Introduction.screen_name}>
        {(AUTH_STACKS || []).map((routeInfo, index) => (
            <Stack.Screen
                key={`AuthStack-Screen-key-${index}-${routeInfo.id}`}
                name={routeInfo.screen_name}
                component={AuthComponents[routeInfo.componenet]}
                options={routeInfo.options ? routeInfo.options : options}

            />
        ))}
    </Stack.Navigator >
}

const AppDrawers = (props) => {
        // console.log("[AppDrawers].props", props)
    return <Drawer.Navigator screenOptions={stackOpts} initialRouteName={APP_ROUTES.AppDrawerStack.screen_name}>
        {(APP_STACKS || []).map((routeInfo, index) => {
            console.log('routeInfo',AppComponents);
            return <Drawer.Screen
                key={`AppDrawers-Screen-key-${index}-${routeInfo.id}`}
                name={routeInfo.screen_name}
                component={AppComponents[routeInfo.componenet]}
                options={{
                }}
            />
            })}
    </Drawer.Navigator >
}

export default (props) => {
    const { isLoggedIn, refreshToken } = useSelector(state => state.userReducer);
    // React.useEffect(() => {
    //     sharedGetEnumsApi();
    //     // sharedLogoutUser();
    // }, [])
    // React.useEffect(() => {
    //     if (isLoggedIn) {
    //         sharedGetUserDetailsApi();
    //         sharedGetHomeMsgsApi();
    //         sharedGetUserAddressesApi();
    //         sharedGetPromotions();
    //     }
    // }, [isLoggedIn])
    return <ContainerStack.Navigator screenOptions={stackOpts} initialRouteName={INIT_ROUTES.INIT_APP}>
        <ContainerStack.Screen
            name={INIT_ROUTES.INIT_APP}
            component={isLoggedIn ? AppDrawers : AuthStacks}
        />
    </ContainerStack.Navigator >
}