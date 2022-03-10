import React, { useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import GV from '../utils/GV';
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
            GV.NET_INFO_REF.current = state;
            setNetInfo(state);
        });
        return () => unsubscribe();
    }, []);
    return netInfo;
};