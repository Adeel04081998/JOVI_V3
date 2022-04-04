import React from 'react';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import GV from '../utils/GV';
let currentNetwork = {
    isConnected: true,
    isInternetReachable: true
};
const sleep = (s = 1) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}
const setInfoHandler = async (delay = 1, callback = () => { }) => {
    Platform.select({
        android: () => {
            callback();
        },
        ios: async () => {
            await sleep(delay);
            callback();
        }
    })
}

NetInfo.fetch()
    .then((state) => {
        setInfoHandler(3, () => {
            GV.NET_INFO_REF.current = state;
            currentNetwork = state;
        })

    })
    .catch(error => console.log("An error accured during fetching network state...", error))
export default () => {
    const [netInfo, setNetInfo] = React.useState(currentNetwork);
    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setInfoHandler(2, () => {
                setNetInfo(state);
                GV.NET_INFO_REF.current = state;
            })
        });
        return () => unsubscribe();
    }, []);
    return netInfo;
};