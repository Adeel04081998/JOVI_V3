import React, { useState } from 'react';
import { sharedAddUpdateFirestoreRecord, sharedExceptionHandler, sharedOnVendorPress } from '../../../helpers/SharedActions';
import { postRequest } from '../../../manager/ApiManager';
import Endpoints from '../../../manager/Endpoints';
import ImageCarousel from '../../molecules/ImageCarousel';

export default ({ adTypes = [], colors = {}, onAdPressCb = null, containerStyle = {}, propsData = [], uriKey = "advertisementFile", height, width, paginationContainerStyle = {}, paginationDotStyle = {}, onVendorMove= ()=>{} }) => {
    const [data, setData] = useState(propsData)
    const [isFirestoreHit, setisFirestoreHit] = useState(true)
    const onPressHandler = (item, index) => {
        onVendorMove()
        sharedOnVendorPress(item, index)

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
        if (!data.length) {
            getAdvertisements();
        }

    }, [])

    return (
        <ImageCarousel
            data={data ?? []}
            uriKey={uriKey}
            containerStyle={[{ borderRadius: 12, marginHorizontal:0 ,marginLeft:6, marginRight:7 }]}
            height={height}
            width={width}
            paginationDotStyle={[{ borderColor: colors.primary, backgroundColor: colors.primary}, paginationDotStyle,]}
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
            autoPlay={true}
            autoPlayInterval={3}
            style={{ borderRadius: 10, }}
            pagination={data.length > 1 ? true : false}

        



        />
    )

}