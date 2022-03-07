
/** https://reactnavigation.org/docs/navigation-actions **/
import React from "react";
import { CommonActions, StackActions, DrawerActions, TabActions } from '@react-navigation/native';
export const _NavgationRef = React.createRef({});
const NavigationActions = {
    common_actions: {
        navigate: (name = "", params = {}, navigation = _NavgationRef.current) => {
            navigation.dispatch(
                CommonActions.navigate({
                    name,
                    params,
                })
            )
        },
        goBack: (route = null, navigation = _NavgationRef.current) => {
            if (route) {
                // Need to test before use
                navigation.dispatch({
                    ...CommonActions.goBack(),
                    source: route.key,
                    target: route?.params?.key
                });
            } else navigation.dispatch(CommonActions.goBack());

        },
        setParams: (params = {}, route = null, navigation = _NavgationRef.current) => {
            if (route) {
                navigation.dispatch({
                    ...CommonActions.setParams(params),
                    source: route.key,

                });
            } else navigation.dispatch(CommonActions.setParams(params));

        },
        reset: (index, routes = [{ name: "", }, { name: "", params: {} }], navigation = _NavgationRef.current) => {
            navigation.dispatch(
                CommonActions.reset({
                    index,
                    routes,
                })
            )
        },
        reset_with_filter: (routesToRemove = [""], navigation = _NavgationRef.current) => {
            navigation.dispatch(state => {
                const routes = state.routes.filter(r => r.name !== routesToRemove.includes(r.name));
                return CommonActions.reset({
                    ...state,
                    index: routes.length - 1,
                    routes,
                });
            })
        },
        reset_with_filter_invert: (routesToSave = [""],newRoute = null, navigation = _NavgationRef.current) => {
            navigation.dispatch(state => {
                const routes = state.routes.filter(r => routesToSave.includes(r.name));
                console.log('state',state);
                if(newRoute){
                    routes.push({
                        ...newRoute
                    })
                }
                return CommonActions.reset({
                    ...state,
                    index: routes.length - 1,
                    routes,
                });
            })
        },
    },
    stack_actions: {
        replace: (destRouteName = "", destParams = {}, route = null, navigation = _NavgationRef.current) => {
            if (route) {
                // Need to test before use
                navigation.dispatch({
                    ...StackActions.replace(destRouteName, { ...destParams }),
                    source: route.key,
                    target: route?.params?.key,
                });
            } else navigation.dispatch(StackActions.replace(destRouteName, { ...destParams }))
        },
        push: (routeName = "", routeParams = {}, navigation = _NavgationRef.current) => {
            navigation.dispatch(StackActions.push(routeName, { ...routeParams }))
        },
        pop: (count = 0, navigation = _NavgationRef.current) => {
            if (count > 0) navigation.dispatch(StackActions.pop(count))
            else navigation.dispatch(StackActions.popToTop())
        },
        popToTop: (navigation = _NavgationRef.current) => {
            navigation.dispatch(StackActions.popToTop())
        },
    },
    drawer_actions: {
        openDrawer: (navigation = _NavgationRef.current) => {
            navigation.dispatch(DrawerActions.openDrawer())
        },
        closeDrawer: (navigation = _NavgationRef.current) => {
            navigation.dispatch(DrawerActions.openDrawer())
        },
        toggleDrawer: (navigation = _NavgationRef.current) => {
            navigation.dispatch(DrawerActions.toggleDrawer())
        },
        jumpTo: ( routeName = "", routeParams,navigation = _NavgationRef.current,) => {
            navigation.dispatch(DrawerActions.jumpTo(routeName, { ...routeParams }))
        },
    },
    tab_actions: {
        jumpTo: (navigation = _NavgationRef.current, routeName = "", routeParams) => {
            navigation.dispatch(TabActions.jumpTo(routeName, { ...routeParams }))
        },
    }
}
export const goBack = NavigationActions.common_actions.goBack; // Example to import as an individual;
export default {
    NavigationActions
}
