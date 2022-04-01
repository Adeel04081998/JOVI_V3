import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Appearance, FlatList, SafeAreaView } from 'react-native';
import Text from '../../components/atoms/Text';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import JoviTab from '../../components/organisms/JoviTab';
import NoRecord from '../../components/organisms/NoRecord';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import AppStyles from '../../res/AppStyles';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { stylesFunc } from './styles';

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = { ...stylesFunc(colors), };
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE & REF's START's FROM HERE 
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [query, updateQuery] = React.useState({ isLoading: false, error: false, errorText: '', });
    const [data, setData] = React.useState({ active: [], solved: [], });
    const [metaData, toggleMetaData] = React.useState(false);
    // #endregion :: STATE & REF's END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView>
                <CustomHeader
                    renderLeftIconAsDrawer
                    title={`Support`}
                    rightIconName={null}
                />
                <JoviTab
                    data={["Active", "Solved"]}
                    onActiveIndexChanged={(_, index) => {
                        setActiveIndex(index);
                    }}
                    containerStyle={{
                        marginHorizontal: constants.spacing_horizontal,
                        marginTop: constants.spacing_vertical,
                    }}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    React.useEffect(() => {
        loadData();
        return () => { };
    }, [activeIndex])

    const waitingToChange = () => {
        updateQuery({
            isLoading: true,
            error: false,
            errorText: '',
        });
        setTimeout(() => {
            updateQuery({
                isLoading: false,
                error: false,
                errorText: '',
            });
        }, 300);
    };

    const loadData = () => {
        if ((activeIndex === 0 && data.active.length > 0)) {
            waitingToChange();
            return
        };
        if ((activeIndex === 1 && data.solved.length > 0)) {
            waitingToChange();
            return;
        };

        const activeKey = activeIndex === 0 ? "active" : "solved";
        updateQuery({
            isLoading: true,
            error: false,
            errorText: '',
        });
        const params = {
            "pageNumber": 1,
            "itemsPerPage": 200,//GETTING MAX AMOUNT OF COMPLAINT's -- Suggested by AWAIS ;-) 
            "isAscending": true,
            "isSolved": activeIndex === 0 ? false : true,
            "month": 0,
            "year": 0,
            "genericSearch": "",
            "category": 0,
            "exportExcel": false,
        };
        postRequest(Endpoints.GET_COMPLAINT, params, (res) => {
            const statusCode = res?.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const resData = res?.data?.complaints?.data ?? [];
                setData(pre => ({
                    ...pre,
                    [activeKey]: resData,
                }));
                toggleMetaData(!metaData);
                updateQuery({
                    isLoading: false,
                    error: false,
                    errorText: '',
                });
            } else {
                updateQuery({
                    isLoading: false,
                    error: true,
                    errorText: sharedExceptionHandler(res, true),
                });
            }
        }, (err) => {
            sharedExceptionHandler(err, true);
            updateQuery({
                isLoading: false,
                error: true,
                errorText: sharedExceptionHandler(err),
            });
        })
    }

    // #region :: UI START's FROM HERE 
    return (
        <View style={{ ...styles.primaryContainer, }}>
            {_renderHeader()}

            {query.error ? <NoRecord
                color={colors}
                title={query.errorText}
                buttonText={`Retry`}
                onButtonPress={() => { loadData() }} /> :
                query.isLoading ? <View style={{
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
                </View> :


                    <FlatList
                        data={data[activeIndex === 0 ? "active" : "solved"]}
                        extraData={metaData}
                        contentContainerStyle={{ paddingBottom: 40, }}
                        renderItem={({ item, index }) => {
                            console.log('item ', item);
                            const isPending = activeIndex === 0;


                            return (
                                <ItemUI
                                    key={index}
                                    colors={colors}
                                    isPending={isPending}
                                    item={{
                                        complaintNo: item.complaintID,
                                        detail: item.joviTypeStr,
                                        date: `${item.complaintDate}`,
                                        time: `${item.complaintDateTime.split(' ').pop()}`,
                                    }}
                                    onPress={() => {
                                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.SupportDetail.screen_name);
                                    }}
                                />
                            )
                        }} />

            }
        </View>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT


// #region :: ITEM UI FOR SOLVE AND ACTIVE START's FROM HERE 
const ItemUI = ({ colors, isPending = true, item = { complaintNo: '', detail: '', date: '', time: '', }, onPress = () => { }, }) => {
    return (
        <TouchableScale
            wait={0}
            onPress={() => { onPress() }}
            style={{
                backgroundColor: colors.white,
                borderRadius: 5,
                marginHorizontal: constants.spacing_horizontal,
                marginTop: constants.spacing_vertical,
                minHeight: 50,
                ...AppStyles.shadow,
                padding: 10,
            }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <Text style={{
                    fontSize: 12,
                    color: "#272727",
                }}>{`Complaint # ${`${item.complaintNo}`.replace('#', '')}`}</Text>

                <Text style={{
                    fontSize: 12,
                    color: isPending ? "#F99E00" : "#27C787",
                }}>{`${isPending ? 'Pending' : 'Solved'}`}</Text>

            </View>

            <Text fontFamily='PoppinsMedium' style={{
                fontSize: 14,
                color: "#272727",
                paddingVertical: 8,
            }}>{`${item.detail}`}</Text>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                <Text style={{
                    fontSize: 12,
                    color: "#272727",
                }}>{`${item.date}`}</Text>

                <Text style={{
                    fontSize: 12,
                    color: "#272727",
                }}>{`${item.time}`}</Text>

            </View>

        </TouchableScale>
    )
}

     // #endregion :: ITEM UI FOR SOLVE AND ACTIVE END's FROM HERE 