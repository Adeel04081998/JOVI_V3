import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { SvgXml } from 'react-native-svg'
import svgs from '../../../assets/svgs'
import Text from '../../../components/atoms/Text'
import TouchableOpacity from '../../../components/atoms/TouchableOpacity'
import View from '../../../components/atoms/View'
const TOPSPACING = 8

export default ({ }) => {

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
        <LinearGradient
            colors={['#6D51BB', '#6C50B9', '#6449AE']}
            style={{
                // flex: 1,
                paddingVertical: 15,
                borderRadius: 10,
                flexDirection: 'row',
                margin: TOPSPACING,
                // marginBottom:0,
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <View style={{ position: 'absolute', left: 20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', }}>
                <SvgXml xml={svgs.Percentage()} style={{}} ></SvgXml>
            </View>
            <View style={{ width: 70 }} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                <Text style={{ color: '#fff', textAlign: 'left', paddingLeft: 20, flex: 1 }} numberOfLines={1}>You have 3 vouchers</Text>
                <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 2, marginRight: 15, paddingHorizontal: 5 }} >
                    <Text style={{ color: "#6D51BB", marginHorizontal: 10, marginVertical: 5, fontSize: 14 }} fontFamily='PoppinsMedium'>{"See All"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, top: -10, backgroundColor: '#F6F5FA', }} ></View>
            <View style={{ borderRadius: 20, height: 20, width: 20, position: 'absolute', left: 60, bottom: -10, backgroundColor: '#F6F5FA' }} ></View>
            {cuts.map((i) => <View key={`pitstop-arc-${i.index}`} style={{ height: 6, width: 1, position: 'absolute', left: 70, top: i["index"] === 0 ? 16 : i["index"] === 1 ? 28 : 39, backgroundColor: '#fff' }} ></View>)}
        </LinearGradient>
    )
}