import React from 'react';
import NetInfo from '@react-native-community/netinfo';
let currentNetwork = {};
NetInfo.fetch()
    .then((state) => {
        currentNetwork = {
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
        }
    })
    .catch(error => "An error accured during fetching network state...")
export default () => {
    const [netInfo, setNetInfo] = React.useState(currentNetwork);
    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setNetInfo({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
            });
        });
        return () => unsubscribe();
    }, []);
    return netInfo;
};