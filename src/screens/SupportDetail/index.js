import * as React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import Text from '../../components/atoms/Text';
import View from '../../components/atoms/View';
import Button from '../../components/molecules/Button';
import CustomHeader from '../../components/molecules/CustomHeader';
import { sharedConfirmationAlert, sharedExceptionHandler } from '../../helpers/SharedActions';
import { getRequest, multipartPostRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import AppStyles from '../../res/AppStyles';
import constants from '../../res/constants';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import SupportChat from './components/SupportChat';
import { stylesFunc } from './styles';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { store } from '../../redux/store';
import NavigationService from '../../navigations/NavigationService';
dayjs.extend(customParseFormat)

const WINDOW_WIDTH = constants.window_dimensions.width;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = { ...stylesFunc(colors), };
    const parseParams = (route?.params);
    const complaintID = parseParams?.complaintID ?? 0;
    const isPending = parseParams?.isPending ?? false;
    const userReducer = store.getState().userReducer;
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE & REF's START's FROM HERE 
    const [query, updateQuery] = React.useState({ isLoading: false, error: false, errorText: '', });
    const [data, setData] = React.useState({});
    const [closeComplaintLoading, toggleCloseComplaintLoading] = React.useState(false);
    // #endregion :: STATE & REF's END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView>
                <CustomHeader
                    title={`Complaint # ${complaintID}`}
                    rightIconName={null}
                />
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: API Implementation's START's FROM HERE 
    React.useEffect(() => {
        loadData();
        return () => { };
    }, [])


    const loadData = () => {
        updateQuery({
            isLoading: true,
            error: false,
            errorText: '',
        });
        getRequest(`${Endpoints.GET_COMPLAINT_DETAIL}${complaintID}`, (res) => {
            const statusCode = res?.data?.statusCode ?? 404;

            console.log('rasejkdskjfkjsadkasdfjfkhask  ', res);
            if (statusCode === 200) {
                const resData = res?.data?.getComplaintsByID ?? {};

                let newData = resData?.complaintDetailListV2 ?? [];
                newData = newData.map(i => {
                    const date = dayjs(i.createdAt, constants.server_time_format);
                    return {
                        ...i,
                        createdAt: new Date(date),
                    }
                });
                resData["complaintDetailListV2"] = newData.reverse();

                setData(resData);
                updateQuery({
                    isLoading: false,
                    error: false,
                    errorText: '',
                });
            } else {
                setData({});
                updateQuery({
                    isLoading: false,
                    error: true,
                    errorText: sharedExceptionHandler(res, true),
                });
            }
        }, (err) => {
            console.log('rasejkdskjfkjsadkasdfjfkhask   errerrerr  ', err);
            sharedExceptionHandler(err, true);
            setData({});
            updateQuery({
                isLoading: false,
                error: true,
                errorText: sharedExceptionHandler(err),
            });
        })
    }


    // #endregion :: API Implementation's END's FROM HERE 

    // #region :: CLOSE COMPLAINT PRESS START's FROM HERE 
    const onGoBackPress = () => {
        NavigationService.NavigationActions.common_actions.goBack();
    };//end of onGoBackPress

    const onCloseComplaintPress = () => {

        const apiImplementationCloseComplaint = () => {
            toggleCloseComplaintLoading(true);
            let formData = new FormData();
            formData.append("complaintID", complaintID);
            formData.append("rating", 0);
            formData.append("statusID", 2);
            formData.append("orderID", complaintID);
            console.log('PARAM FOR CLOSE COMPLAINT ', formData);
            multipartPostRequest(Endpoints.CLOSE_COMPLAINT, formData, (res) => {
                const statusCode = (res?.statusCode ?? 400);
                console.log('resssss 22222 ', res);
                console.log('resssss statusCode ', statusCode);
                if (statusCode === 200) {
                    //REQUEST SUCCESSFULLY....
                    route.params?.loadData(true);
                    onGoBackPress();
                } else {
                    sharedExceptionHandler(res);
                }
                toggleCloseComplaintLoading(false);
            }, (err) => {
                sharedExceptionHandler(err);
                toggleCloseComplaintLoading(false);
            }, false, { Authorization: `Bearer ${userReducer?.token?.authToken}` });
        };//end of apiImplementationCloseComplaint

        sharedConfirmationAlert("Confirm!", "Are you sure you want to close this complaint?", null, null, {
            cancelButton: { text: "No", onPress: () => { } },
            okButton: {
                text: "Yes", onPress: () => apiImplementationCloseComplaint()
            },
        });
    };//end of onCloseComplaintPress




    // #endregion :: CLOSE COMPLAINT PRESS END's FROM HERE 

    // #region :: UI START's FROM HERE 
    return (
        <View style={{ ...styles.primaryContainer, }}>
            {_renderHeader()}

            <View style={{
                backgroundColor: colors.white,
                borderRadius: 5,
                marginHorizontal: constants.spacing_horizontal,
                marginTop: constants.spacing_vertical,
                paddingVertical: constants.spacing_vertical,
                ...AppStyles.shadow,
                minHeight: 30,
                marginBottom: constants.spacing_vertical,
            }}>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: constants.spacing_horizontal, }}>
                    <Text style={{
                        color: "#272727",
                        fontSize: 12,
                    }}>{`Complaint # ${complaintID}`}</Text>

                    {isPending &&
                        <Button
                            text='Close Complaint'
                            wait={0}
                            isLoading={closeComplaintLoading}
                            loaderSize={"small"}
                            style={{
                                width: WINDOW_WIDTH * 0.35,
                                height: "auto",
                                paddingVertical: constants.spacing_vertical * 0.9,
                                paddingHorizontal: constants.spacing_horizontal,
                                borderRadius: 6,
                                marginTop: -3,
                            }}
                            textStyle={{
                                fontSize: 12,
                                fontFamily: FontFamily.Poppins.Medium,
                                color: colors.white,
                            }}
                            onPress={() => { onCloseComplaintPress() }} />
                    }
                </View>

                <View style={{
                    backgroundColor: "#272727",
                    height: 0.5,
                    width: "100%",
                    marginTop: constants.spacing_vertical * 0.5,
                    paddingHorizontal: 0,
                }} />

                <Text fontFamily='PoppinsSemiBold' style={{
                    paddingHorizontal: constants.spacing_horizontal,
                    paddingTop: constants.spacing_vertical,
                    fontSize: 14,
                    color: "#272727",
                }}>{`${data?.complaintReason ?? ''}`}</Text>

                <Text style={{
                    paddingHorizontal: constants.spacing_horizontal,
                    paddingTop: constants.spacing_vertical,
                    fontSize: 12,
                    color: "#272727",
                }}>{`${data?.description ?? ''}`}</Text>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: constants.spacing_horizontal, paddingTop: constants.spacing_vertical, }}>
                    <Text style={{
                        fontSize: 10,
                        color: "#B4B4B4",
                    }}>{`${data?.complaintDate ?? ''}`}</Text>
                    <Text style={{
                        fontSize: 10,
                        color: "#B4B4B4",
                    }}>{`${data?.complaintTime ?? ''}`}</Text>
                </View>
            </View>


            <SupportChat
                colors={colors}
                complaintID={complaintID}
                orderID={data?.orderID ?? 0}
                allowMultipleImages
                data={data?.complaintDetailListV2 ?? []}
                disableChat={!isPending}
            />

        </View>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT

