import React, { useEffect } from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Introduction from '../screens/IntroScreen';
import Home from '../screens/Home';

import NAVIGATIONS from './NAVIGATIONS';
import GV from '../utils/GV';

const { AUTH_STACKS, INIT_ROUTES, AUTH_ROUTES, APP_STACKS, APP_ROUTES } = NAVIGATIONS;

const AuthComponents = {
    Introduction
}
const AppComponents = {
    Home
}
const ContainerStack = createStackNavigator();
const Stack = createSharedElementStackNavigator();
const Drawer = createDrawerNavigator();

const options = () => ({
    gestureEnabled: false,
    transitionSpec: {
        open: { animation: "timing", config: { duration: 600 } },
        close: { animation: "timing", config: { duration: 600 } }
    },
    cardStyleInterpolator: ({ current: { progress } }) => {
        return {
            cardStyle: {
                opacity: progress
            },
        }
    }
})
const stackOpts = () => ({
    headerShown: false,
});
const AuthStacks = (props) => {
    // const { setIsLoggedIn } = props;
    // console.log("[AuthStacks].props", props)
    return <Stack.Navigator screenOptions={stackOpts} initialRouteName={AUTH_ROUTES.Introduction.screen_name}>
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
    return <Drawer.Navigator screenOptions={stackOpts} initialRouteName={APP_ROUTES.Home.screen_name}>
        {(APP_STACKS || []).map((routeInfo, index) => (
            <Drawer.Screen
                key={`AppDrawers-Screen-key-${index}-${routeInfo.id}`}
                name={routeInfo.screen_name}
                component={AppComponents[routeInfo.componenet]}
                options={routeInfo.options ? routeInfo.options : options}
            />
        ))}
    </Drawer.Navigator >
}

export default (props) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    GV.NAVIGATION_LISTENER = {
        ...props,
        auth_handler: setIsLoggedIn,
    }
    return <ContainerStack.Navigator screenOptions={stackOpts} initialRouteName={INIT_ROUTES.INIT_APP}>
        <ContainerStack.Screen
            name={INIT_ROUTES.INIT_APP}
            component={isLoggedIn ? AppDrawers : AuthStacks}
        />
    </ContainerStack.Navigator >
}