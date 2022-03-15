import React, { useState } from 'react';
import { Appearance, StyleSheet, Platform, Alert, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { sharedExceptionHandler } from '../../../helpers/SharedActions';
import { postRequest } from '../../../manager/ApiManager';
import Endpoints from '../../../manager/Endpoints';
import theme from '../../../res/theme';
import GV, { PITSTOP_TYPES } from '../../../utils/GV';
import ImageCarousel from '../../molecules/ImageCarousel';
import lodash from 'lodash'; // 4.0.8


import View from '../View';

export default ({ adTypes = [], colors = {}, onAdPressCb = null }) => {
    const [data, setData] = useState([])
    console.log("data=>", data);
    const onPressHandler = () => {
        Alert.alert("dshhd")
    }
    const getAdvertisements = () => {
        postRequest(Endpoints.GET_ADVERTISEMENTS, {
            "adTypes": adTypes
        }, res => {
            const { bannerAds } = res.data.adListViewModel;
            console.log('res --- GET_ADVERTISEMENTS', res);
            setData(bannerAds)
        }, err => { sharedExceptionHandler(err); });
    }
    React.useEffect(() => {
        getAdvertisements();
    }, [])
    return (


        <ImageCarousel
            data={data ?? []}
            uriKey="advertisementFile"
            containerStyle={{


                borderRadius: 12,
                // backgroundColor: "red",

            }}
            height={138}
            paginationDotStyle={{ borderColor: 'red', backgroundColor: colors.primary, }}
        //    onPress={onPressHandler}



        />

    )
}