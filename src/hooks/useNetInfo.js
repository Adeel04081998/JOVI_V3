import React from 'react';
import NetInfo from '@react-native-community/netinfo';
let currentNetwork = {};
NetInfo.fetch()
    .then((state) => {
        currentNetwork = state
    })
    .catch(error => console.log("An error accured during fetching network state...", error))
export default () => {
    const [netInfo, setNetInfo] = React.useState(currentNetwork);
    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setNetInfo(state);
        });
        return () => unsubscribe();
    }, []);
    return netInfo;
};