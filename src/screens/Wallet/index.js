import { ActivityIndicator, Appearance, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SafeAreaView from '../../components/atoms/SafeAreaView'
import { walletStyles } from './styles';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import CustomHeader, { CustomHeaderIconBorder, CustomHeaderStyles } from '../../components/molecules/CustomHeader';
import svgs from '../../assets/svgs';
import NavigationService from '../../navigations/NavigationService';
import FontFamily from '../../res/FontFamily';
import { SvgXml } from 'react-native-svg';
import ROUTES from '../../navigations/ROUTES';
import View from '../../components/atoms/View';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import { useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import { isNextPage, sharedExceptionHandler } from '../../helpers/SharedActions';
import NoRecord from '../../components/organisms/NoRecord';

const DEFAULT_PAGINATION_INFO = { totalItem: 0, itemPerRequest: 20, currentRequestNumber: 1 };


export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = walletStyles(colors);
    const { balance } = useSelector(state => state.userReducer)
    const { CustomerTransactionTypeEnum } = useSelector(state => state.enumsReducer)
    const [filters, setFilters] = useState([])
    const [paginationInfo, updatePaginationInfo] = React.useState(DEFAULT_PAGINATION_INFO);
    const [metaData, toggleMetaData] = React.useState(false);
    const [pressedValue, setPressedValue] = React.useState(1);
    const [query, updateQuery] = React.useState({
        isLoading: true,
        error: false,
        errorText: '',
        refreshing: false,
    });

    React.useEffect(() => {
        loadTransactionList();
        return () => { };
    }, []);


    const loadTransactionList = (transactionType = 1, currentRequestNumber = 1, append = false) => {
        updateQuery({
            errorText: '',
            isLoading: !append,
            error: false,
            refreshing: append,
        });
        const params = {
            "transactionType": transactionType,
            "pageNumber": currentRequestNumber,
            "itemsPerPage": paginationInfo.itemPerRequest,
            "isAscending": false,
            "userID": null
        };
        postRequest(Endpoints.GET_TRANSACTIONLIST, params, (res) => {
            const statusCode = res.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const resData = res.data?.customerWalletTransactionsList?.data ?? [];
                let newData = []
                if (transactionType === pressedValue) newData = [...filters, ...resData]
                else newData = resData
                setFilters(newData);
                toggleMetaData(!metaData);


                if (!append) {
                    const totalItem = res.data?.customerWalletTransactionsList?.paginationInfo?.totalItems ?? DEFAULT_PAGINATION_INFO.totalItem;
                    updatePaginationInfo(pre => ({
                        ...pre,
                        totalItem,
                    }))
                }

                updateQuery({
                    errorText: '',
                    isLoading: false,
                    error: false,
                    refreshing: false,
                });
            } else {
                updateQuery({
                    errorText: sharedExceptionHandler(res),
                    error: true,
                    isLoading: false,
                    refreshing: false,
                });
                setFilters([]);
            }
        }, (err) => {
            sharedExceptionHandler(err);
            updateQuery({
                errorText: sharedExceptionHandler(err),
                isLoading: false,
                error: true,
                refreshing: false,
            });
            setFilters([]);
        })

    };//end of loadOnGoingData


    const onEndReached = () => {
        if (isNextPage(paginationInfo.totalItem, paginationInfo.itemPerRequest, paginationInfo.currentRequestNumber)) {
            updateQuery(pre => ({
                ...pre,
                refreshing: true
            }))

            updatePaginationInfo(pre => ({
                ...pre,
                currentRequestNumber: pre.currentRequestNumber + 1,
            }))
            loadTransactionList(pressedValue, paginationInfo.currentRequestNumber + 1, true);
            return
        }
    };//end of onEndReached


    const renderHeader = () => {
        return (
            <CustomHeader
                renderRightIconForHome
                renderLeftIconAsDrawer
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
                <TouchableOpacity
                    style={styles.topupButton}
                    onPress={() => { NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.TopUp.screen_name) }}>
                    <Text style={styles.topupTitleText} >{"Top up"}</Text>
                </TouchableOpacity>
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
        setPressedValue(parseInt(item.value))

        loadTransactionList(parseInt(item.value))
    }
    const _renderItem = (item, index) => {
        const isSelected = pressedValue === parseInt(item.value);
        return (
            <TouchableOpacity
                style={[styles.filterButton, {
                    backgroundColor: isSelected ? colors.primary : colors.white,
                    borderWidth: isSelected ? 0 : 0.5,
                    borderColor: '#C2C2C2'
                }]}
                onPress={() => onFilterPress(item, index)}>
                <Text style={[styles.filterButtonText, { color: isSelected ? colors.white : colors.primary }]}>
                    {item.text}
                </Text>
            </TouchableOpacity>
        )
    }
    const renderFilters = () => {
        return (
            <ScrollView
                horizontal
                style={{ height: 75, flexGrow: 0, paddingHorizontal: 15 }}>
                {
                    (CustomerTransactionTypeEnum ?? []).map((item, index) => _renderItem(item, index))
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


    const _renderFlatListItem = ({ item, index }) => {
        const isOrder = item.type === "Order"
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
                        <Text fontFamily="PoppinsLight" style={[styles.filterDateStyle, { paddingLeft: 5 }]} >{item.date}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text numberOfLines={1} fontFamily="PoppinsLight" style={styles.filterDateStyle} >{item.details}</Text>
                    </View>
                </View>
                <View style={{ width: '20%' }} >
                    <SvgXml xml={isOrder ? svgs.redArrow() : svgs.greenArrow()} style={{ alignSelf: 'center' }} />
                    <Text numberOfLines={1} fontFamily="PoppinsMedium" style={styles.filterTypeStyle} >Rs. {item.amount}</Text>
                </View>
            </View>
        )
    }

    const renderFilterData = () => {
        return (
            <FlatList
                data={filters}
                extraData={metaData}
                renderItem={_renderFlatListItem}
                onEndReachedThreshold={0.8}
                onEndReached={onEndReached}
                initialNumToRender={3}
                maxToRenderPerBatch={paginationInfo.itemPerRequest}
                ListFooterComponent={
                    <ActivityIndicator size="large" color={colors.primary}
                        style={{
                            opacity: query.refreshing ? 1 : 0,
                            marginBottom: 30,
                            marginTop: 20,
                        }} />
                } />
        )
    }




    ////////////////////*************************  LOADING AND ERROR UI START's FROM HERE   *****************************\\\\\\\\\\\\\\\\



    const renderLoading = () => {
        return (
            <View style={{
                flex: 1,
                marginTop: -80,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <AnimatedLottieView
                    source={require('../../assets/LoadingView/OrderChat.json')}
                    autoPlay
                    loop
                    style={{
                        height: 120,
                        width: 120,
                    }}
                />
            </View>
        )
    }
    const renderError = () => {
        return (
            <NoRecord
                color={colors}
                title={query.errorText}
                buttonText={`Refresh`}
                onButtonPress={() => {
                    loadTransactionList();
                }} />
        )
    }
    ////////////////////*************************  LOADING AND ERROR UI END's FROM HERE   *****************************\\\\\\\\\\\\\\\\


    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderBalanceContainer()}
            {renderViewAllRow()}
            {renderFilters()}
            {query.isLoading ? renderLoading() : query.error ? renderError() : renderFilterData()}
        </SafeAreaView>
    )
}