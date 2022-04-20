import React, { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { SvgXml } from 'react-native-svg'
import svgs from '../../../assets/svgs'
import Text from '../../../components/atoms/Text'
// import TouchableOpacity from '../../../components/atoms/TouchableOpacity'
import View from '../../../components/atoms/View'
import AnimatedModal from '../../../components/organisms/AnimatedModal'
import GoodyBag from '../../GoodyBag'
const TOPSPACING = 8

export default ({ checkOutStyles = {}, onPressClBk = () => { }, state = {},promoList=[] }) => {
    let selectedVoucherLength = Object.keys(state?.selectedVoucher)?.length
    let cuts = [{
        "dashedLine": true,
        "index": 0,
    }, {
        "heading": 'Discount',
        "dashedLine": true,
        "index": 1,
    }, {
        "heading": 'Total',
        "dashedLine": false,
        "index": 2,
    },
    {
        "heading": 'Total',
        "dashedLine": false,
        "index": 3,
    },
    ]
  

    return (
        <>

            <LinearGradient
                colors={['#6D51BB', '#6C50B9', '#6449AE']}
                style={checkOutStyles.voucherMainContainer}
            >
                <View style={checkOutStyles.voucherPerntgeSvg}>
                    <SvgXml xml={svgs.Percentage()} style={{}} ></SvgXml>
                </View>
                <View style={{ width: 70 }} />
                <View style={checkOutStyles.voucherPrimaryContainer}>
                    {
                        selectedVoucherLength > 0 ?
                            <Text style={{fontSize: 12,color: '#fff',  width: '70%', alignSelf: 'center', textAlign: 'center', }} numberOfLines={1}>{`${state.selectedVoucher.title} `}</Text>
                            :
                            <Text style={{  fontSize: 12,color: '#fff', width: '70%',  alignSelf: 'center',textAlign: 'center',  }} numberOfLines={1}>{`You have ${promoList.length > 0 ? promoList.length : 0} vouchers`}</Text>

                    }
                    <TouchableOpacity
                        style={checkOutStyles.voucherSecondaryContainer}
                        onPress={() => {
                            if (selectedVoucherLength > 0) {
                                onPressClBk(false)
                            }
                            else {
                                onPressClBk(true)
                            }
                        }}
                    >
                        <Text style={checkOutStyles.voucherSeeAllTxtstyle} fontFamily='PoppinsMedium'>{`${selectedVoucherLength > 0 ? 'Remove' : 'See All'}`}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, top: -10, backgroundColor: '#F6F5FA', }} ></View>
                <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, bottom: -10, backgroundColor: '#F6F5FA' }} ></View>
                {cuts.map((i) => <View key={`pitstop-arc-${i.index}`} style={{ height: 6, width: 1, position: 'absolute', left: 70, top: i["index"] === 0 ? 16 : i["index"] === 1 ? 28 : 39, backgroundColor: '#fff' }} ></View>)}

            </LinearGradient>

        </>
    )
}