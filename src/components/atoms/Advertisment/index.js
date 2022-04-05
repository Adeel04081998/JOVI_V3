import React, { useState } from 'react';
import { Appearance, StyleSheet, Platform, Alert, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { sharedAddUpdateFirestoreRecord, sharedExceptionHandler, sharedOnVendorPress } from '../../../helpers/SharedActions';
import { postRequest } from '../../../manager/ApiManager';
import Endpoints from '../../../manager/Endpoints';
import theme from '../../../res/theme';
import GV, { PITSTOP_TYPES } from '../../../utils/GV';
import ImageCarousel from '../../molecules/ImageCarousel';
import lodash from 'lodash'; // 4.0.8
export default ({ adTypes = [], colors = {}, onAdPressCb = null }) => {
    const [data, setData] = useState([])
    // console.log("data", data);
    const [isFirestoreHit, setisFirestoreHit] = useState(true)
    const onPressHandler = (item, index) => {
        sharedOnVendorPress(item, index)
    }
    const getAdvertisements = () => {
        postRequest(Endpoints.GET_ADVERTISEMENTS, {
            "adTypes": adTypes
        }, res => {
            console.log('res --- GET_ADVERTISEMENTS', res);
            const { statusCode = 200 } = res.data;
            if (statusCode === 200) {
                const { bannerAds } = res.data.adListViewModel;
                setData(bannerAds)
            }
        }, err => {
            sharedExceptionHandler(err);
        });
    }
    React.useEffect(() => {
        getAdvertisements();
    }, [])

    return (
        <ImageCarousel
            data={data ?? []}
            uriKey="advertisementFile"
            containerStyle={{ borderRadius: 12, }}
            height={138}
            paginationDotStyle={{ borderColor: 'red', backgroundColor: colors.primary, }}
            onPress={onPressHandler}
            onActiveIndexChanged={(item, index) => {
                if (isFirestoreHit) return
                sharedAddUpdateFirestoreRecord(item)
            }}
            onLoadEnd={(item, index) => {
                if (index === 0 && isFirestoreHit) {
                    // console.log("if here isFirestoreHit", isFirestoreHit);
                    sharedAddUpdateFirestoreRecord(item)
                    setisFirestoreHit(false)

                }
            }}



        />
    )

}