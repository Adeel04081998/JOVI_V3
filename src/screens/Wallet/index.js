import { Appearance, FlatList } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '../../components/atoms/SafeAreaView'
import { walletStyles } from './styles';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import svgs from '../../assets/svgs';
import TouchableScale from '../../components/atoms/TouchableScale';
import NavigationService from '../../navigations/NavigationService';
import FontFamily from '../../res/FontFamily';
import { SvgXml } from 'react-native-svg';
import ROUTES from '../../navigations/ROUTES';
import View from '../../components/atoms/View';
import Text from '../../components/atoms/Text';
import Button from '../../components/molecules/Button';
import { ScrollView } from 'react-native-gesture-handler';


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = walletStyles(colors);
    const balance = 2500

    let initData = {
        "filters": [
            {
                filterName: 'All',
                isActive: true,
                filterData: [
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                    {
                        type: "Refund",
                        createdDate: '27/02/2021',
                        vendor: '14th street pizza Co. - G 11',
                        amount: '250'
                    },
                    {
                        type: "Top Up",
                        createdDate: '27/02/2021',
                        account: 'Easypaisa',
                        amount: '250'
                    },
                    {
                        type: "Rewards",
                        createdDate: '27/02/2021',
                        rewardType: 'Jovi app',
                        amount: '250'
                    },
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                    {
                        type: "Refund",
                        createdDate: '27/02/2021',
                        vendor: '14th street pizza Co. - G 11',
                        amount: '250'
                    },
                    {
                        type: "Top Up",
                        createdDate: '27/02/2021',
                        account: 'Easypaisa',
                        amount: '250'
                    },
                    {
                        type: "Rewards",
                        createdDate: '27/02/2021',
                        rewardType: 'Jovi app',
                        amount: '250'
                    },
                ]
            },
            {
                filterName: 'Refund',
                isActive: false,
                filterData: [
                    {
                        type: "Refund",
                        createdDate: '27/02/2021',
                        vendor: '14th street pizza Co. - G 11',
                        amount: '250'
                    },
                    {
                        type: "Refund",
                        createdDate: '27/02/2021',
                        vendor: '14th street pizza Co. - G 11',
                        amount: '250'
                    },
                    {
                        type: "Refund",
                        createdDate: '27/02/2021',
                        vendor: '14th street pizza Co. - G 11',
                        amount: '250'
                    },
                    {
                        type: "Refund",
                        createdDate: '27/02/2021',
                        vendor: '14th street pizza Co. - G 11',
                        amount: '250'
                    },
                    {
                        type: "Refund",
                        createdDate: '27/02/2021',
                        vendor: '14th street pizza Co. - G 11',
                        amount: '250'
                    },
                ]
            },
            {
                filterName: 'Order',
                isActive: false,
                filterData: [
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                    {
                        type: "Order",
                        createdDate: '27/02/2021',
                        transactionID: '4684765',
                        amount: '250'
                    },
                ]
            },
            {
                filterName: 'Topup',
                isActive: false,
                filterData: [
                    {
                        type: "Top Up",
                        createdDate: '27/02/2021',
                        account: 'Easypaisa',
                        amount: '250'
                    },
                    {
                        type: "Top Up",
                        createdDate: '27/02/2021',
                        account: 'Easypaisa',
                        amount: '250'
                    },
                    {
                        type: "Top Up",
                        createdDate: '27/02/2021',
                        account: 'Easypaisa',
                        amount: '250'
                    },
                    {
                        type: "Top Up",
                        createdDate: '27/02/2021',
                        account: 'Easypaisa',
                        amount: '250'
                    },
                    {
                        type: "Top Up",
                        createdDate: '27/02/2021',
                        account: 'Easypaisa',
                        amount: '250'
                    },
                ]
            },
            {
                filterName: 'Reward',
                isActive: false,
                filterData: [
                    {
                        type: "Rewards",
                        createdDate: '27/02/2021',
                        rewardType: 'Jovi app',
                        amount: '250'
                    },
                    {
                        type: "Rewards",
                        createdDate: '27/02/2021',
                        rewardType: 'Jovi app',
                        amount: '250'
                    },
                    {
                        type: "Rewards",
                        createdDate: '27/02/2021',
                        rewardType: 'Jovi app',
                        amount: '250'
                    },
                    {
                        type: "Rewards",
                        createdDate: '27/02/2021',
                        rewardType: 'Jovi app',
                        amount: '250'
                    },
                    {
                        type: "Rewards",
                        createdDate: '27/02/2021',
                        rewardType: 'Jovi app',
                        amount: '250'
                    },
                ]
            },
        ]
    }

    const [state, setState] = useState(initData)


    const renderHeader = () => {
        return (
            <CustomHeader
                rightIconName={'home'}
                rightContainerStyle={{
                    backgroundColor: colors.white,
                }}
                rightIconColor={colors.primary}
                onRightIconPress={() => {
                    NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
                }}
                title={`Wallet`}
                titleStyle={{
                    fontFamily: FontFamily.Poppins.SemiBold,
                    fontSize: 16,
                }}
                defaultColor={colors.primary}
            />
        )
    }
    const renderBalanceContainer = () => {
        return (
            <View style={styles.balanceContainer}>
                <Text style={styles.availableCreditText} fontFamily="PoppinsMedium" >
                    Available Credit
                </Text>
                <Text style={styles.availableCreditAmount} fontFamily="PoppinsBold" >
                    Rs. {`${balance}`}
                </Text>
                <Button text="Top up"
                    textStyle={styles.topupTitleText}
                    style={styles.topupButton}
                    onPress={() => {NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.TopUp.screen_name) }} />
            </View>
        )
    }


    const renderViewAllRow = () => {
        return (
            <View style={styles.viewAllRow} >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 10 }} >
                    <SvgXml xml={svgs.recent()} />
                    <Text style={styles.recentActivityText} fontFamily="PoppinsSemiBold" >Recent Activities</Text>
                </View>
                {/* <TouchableScale>
                    <Text style={styles.viewAllText} fontFamily="PoppinsSemiBold" >View All</Text>
                </TouchableScale> */}
            </View>
        )
    }
    const onFilterPress = (item, index) => {
        let modifiedArray = state.filters.map((object, idx) => {
            if (idx === index) {
                return { ...object, isActive: true }
            } else return { ...object, isActive: false }

        })
        setState(pre => ({
            ...pre,
            filters: modifiedArray,
        }))
    }
    const _renderItem = (item, index) => {
        return (
            <Button text={item.filterName}
                onPress={() => onFilterPress(item, index)}
                style={[styles.filterButton, {
                    backgroundColor: item.isActive ? colors.primary : colors.white,
                    borderWidth: item.isActive ? 0 : 0.5,
                    borderColor: '#C2C2C2'
                }]}
                textStyle={[styles.filterButtonText, { color: item.isActive ? colors.white : colors.primary }]} />
        )
    }
    const renderFilters = () => {
        return (
            <ScrollView
                horizontal
                style={{ paddingHorizontal: 15, height: 60, flexGrow: 0 }}>
                {
                    state.filters.map((item, index) => _renderItem(item, index))
                }
            </ScrollView>
        )
    }
    const getSvgXML = (item) => {
        let svgXml = svgs.order();
        if (item.type === "Order") {
            svgXml = svgs.order();
        }
        else if (item.type === "Refund") {
            svgXml = svgs.refund();
        }
        else if (item.type === "Top Up") {
            svgXml = svgs.topup();
        }
        else if (item.type === "Rewards") {
            svgXml = svgs.rewards();
        }
        return svgXml;
    }
    const getSubText = (item) => {
        let text = ""
        if (item.transactionID) {
            text = `ID# ${item.transactionID}`
        }
        else if (item.vendor) {
            text = item.vendor
        }
        else if (item.account) {
            text = item.account
        }
        else if (item.rewardType) {
            text = item.rewardType
        }
        return text
    }
    const renderFilterData = () => {
        const index = state.filters.findIndex(i => i.isActive === true);
        return (
            <ScrollView>
                {state.filters[index].filterData.map((item, index) => {
                    return (
                        <View style={styles.dataContainerStyle} >
                            <View style={{ flexDirection: 'column', width: '10%' }} >
                                <View style={styles.svgCircle}>
                                    <SvgXml xml={getSvgXML(item)} />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column', width: '70%' }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                    <Text fontFamily="PoppinsMedium" style={styles.filterTypeStyle} >{item.type}</Text>
                                    <Text fontFamily="PoppinsLight" style={[styles.filterDateStyle, { paddingLeft: 5 }]} >{item.createdDate}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <Text numberOfLines={1} fontFamily="PoppinsLight" style={styles.filterDateStyle} >{getSubText(item)}</Text>
                                </View>
                            </View>
                            <View style={{  width: '25%' }} >
                                <SvgXml xml={item.type === "Order" ? svgs.redArrow() : svgs.greenArrow()} />
                                <Text numberOfLines={1} fontFamily="PoppinsMedium" style={styles.filterTypeStyle} >Rs. {item.type === "Order" && '-'}{item.amount}</Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderBalanceContainer()}
            {renderViewAllRow()}
            {renderFilters()}
            {renderFilterData()}
        </SafeAreaView>
    )
}