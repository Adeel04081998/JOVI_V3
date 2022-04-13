import React, { useState, useRef } from "react";
import { Appearance, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Advertisment from "../../components/atoms/Advertisment";
import SafeAreaView from "../../components/atoms/SafeAreaView";
import VectorIcon from "../../components/atoms/VectorIcon";
import View from "../../components/atoms/View";
import ImageCarousel from "../../components/molecules/ImageCarousel";
import AnimatedModal from "../../components/organisms/AnimatedModal";
import { makeArrayRepeated } from "../../helpers/SharedActions";
import { postRequest } from "../../manager/ApiManager";
import Endpoints from "../../manager/Endpoints";
import constants from "../../res/constants";
import theme from "../../res/theme";
import ENUMS from "../../utils/ENUMS";
import GV from "../../utils/GV";


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.DEFAULT, Appearance.getColorScheme() === 'light')
    
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    const adTypes = [ENUMS.ADVERTISMENT_TYPE.POPUP_AD]
    const [data, setData] = useState([])
    const [showCross, setShowCross] = useState(true)

    const getAdvertisements = () => {
        postRequest(Endpoints.GET_ADVERTISEMENTS, {
            "adTypes": adTypes
        }, res => {
            // console.log('res --- GET_ADVERTISEMENTS', res);
            const { statusCode = 200 } = res.data;
            if (statusCode === 200) {
                const { popupAds } = res.data.adListViewModel;
                setData(popupAds)
            }
        }, err => {
            sharedExceptionHandler(err);
        });
    }
    React.useEffect(() => {
        getAdvertisements();
    }, [])

    if (data.length) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", ...StyleSheet.absoluteFillObject, justifyContent: 'center', }}>



                <View style={{ height: constants.screen_dimensions.height / 1.4, width: constants.window_dimensions.width * 0.99, alignSelf: 'center', }}>
                    <TouchableOpacity style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', zIndex: 1, position: 'absolute' }} onPress={() => { setData([]) }}  >

                        <VectorIcon
                            name="cross"
                            type="Entypo"
                            size={40}
                            color={"black"}
                            style={{ right: 8, }}

                        />

                    </TouchableOpacity>
                    <Advertisment
                        propsData={makeArrayRepeated(data, 10)}
                        height={'100%'}
                        width={constants.window_dimensions.width * 0.99}
                        uriKey={"advertisementFile"}
                        paginationDotStyle={{ borderColor: colors.white, backgroundColor: colors.primary, borderWidth: 5 }}
                        onVendorMove={(move) => {
                            setData([])
                        }}
                    />


                </View>

            </SafeAreaView>

        )
    } else return <></>

}