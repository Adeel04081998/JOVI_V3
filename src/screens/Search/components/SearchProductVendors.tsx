import AnimatedLottieView from "lottie-react-native";
import * as React from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import Image from "../../../components/atoms/Image";
import Text from "../../../components/atoms/Text";
import TouchableScale from "../../../components/atoms/TouchableScale";
import View from "../../../components/atoms/View";
import NoRecord from "../../../components/organisms/NoRecord";
import { renderFile, renderPrice, sharedExceptionHandler, sharedOnVendorPress, uniqueKeyExtractor } from "../../../helpers/SharedActions";
import { postRequest } from "../../../manager/ApiManager";
import Endpoints from "../../../manager/Endpoints";
import NavigationService from "../../../navigations/NavigationService";
import ROUTES from "../../../navigations/ROUTES";
import AppStyles from "../../../res/AppStyles";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";
import { PITSTOP_TYPES } from "../../../utils/GV";
import RenderBottomBarComponent from "../../Home/components/RenderBottomBarComponent";

// #region :: INTERFACE START's FROM HERE 

interface Props {
    colors?: typeof initColors;
    pitstopType?: typeof PITSTOP_TYPES;
    searchText: string;
}


const defaultProps = {
    colors: initColors,
    pitstopType: PITSTOP_TYPES.JOVI,
};
// #endregion :: INTERFACE END's FROM HERE 
const WINDOW_WIDTH = constants.window_dimensions.width;
const ITEM_IMAGE_SIZE = WINDOW_WIDTH * 0.4;

const SearchProductVendors = (props: Props) => {
    const colors = props?.colors ?? defaultProps.colors;
    const pitstopType = props?.pitstopType ?? defaultProps.pitstopType;

    const styles = stylesFunc(colors);

    const [data, setData] = React.useState([]);
    const [query, updateQuery] = React.useState({
        loading: false,
        error: false,
        errorText: '',
    });

    React.useEffect(() => {
        loadData();
        return () => { };
    }, [props.searchText])

    const loadData = () => {
        const params = {
            "userID": null,
            "searchTxt": props.searchText,
            "pitstopType": pitstopType,
        }
        updateQuery({
            loading: true,
            error: false,
            errorText: '',
        });
        //@ts-ignore
        postRequest(Endpoints.VENDOR_SEARCH, params, (res: any) => {
            const statusCode = res.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const resData = res.data?.pitstopData ?? [];
                setData(resData);
                updateQuery({
                    loading: false,
                    error: false,
                    errorText: '',
                })
            } else {
                setData([]);
                updateQuery({
                    loading: false,
                    error: true,
                    errorText: sharedExceptionHandler(res),
                })
            }
        }, (err: any) => {
            sharedExceptionHandler(err);
            updateQuery({
                loading: false,
                error: true,
                errorText: sharedExceptionHandler(err),
            })
        }, {}, false)
    };//end of searching -- getting record from server using text user enter


    // #region :: GETTING PRODUCT MENU PRICE FROM ITEM START's FROM HERE 
    const getPricesForProductMenuItemCard = (item = { price: 0 }) => {

        return {
            price: item?.price ?? 0,
        }
    };
    // #endregion :: GETTING PRODUCT MENU PRICE FROM ITEM END's FROM HERE 

    const _renderParentItem = ({ item: parentItem, index: parentIndex }: any) => {
        const vendorName = parentItem?.pitstopName ?? '';

        return (
            <React.Fragment>
                <TouchableScale wait={0}
                    onPress={() => {
                        sharedOnVendorPress({
                            ...parentItem,
                            title: vendorName,
                            pitstopType,
                        }, parentIndex);
                    }}>
                    <Text style={{
                        color: "#212121",
                        fontSize: 16,
                        padding: constants.spacing_horizontal,
                    }}>{`${vendorName}`}</Text>
                </TouchableScale>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                    {(parentItem?.itemList ?? []).map((item: any, index: number) => {
                        return (
                            <View style={{
                                marginLeft: index === 0 ? constants.spacing_horizontal : 0,
                                marginRight: constants.spacing_horizontal,
                                marginTop: 2,
                                marginBottom: 2,
                            }} key={uniqueKeyExtractor()}>
                                <TouchableScale wait={0}
                                    onPress={() => {
                                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.ProductDetails.screen_name, {
                                            propItem: {
                                                ...item,
                                                pitStopItemID: item.pitstopItemID,
                                                pitStopDealID: item.pitstopDealID,
                                                vendorDetails: {
                                                    marketID: parentItem.pitstopID,
                                                    ...item,
                                                    pitstopType: PITSTOP_TYPES.RESTAURANT,
                                                    ...parentItem,
                                                }
                                            },
                                            pitstopType,
                                        });
                                    }}
                                    style={{
                                        backgroundColor: colors.white,
                                        padding: constants.spacing_horizontal,
                                        ...AppStyles.shadow,
                                        borderRadius: 8,
                                        width: ITEM_IMAGE_SIZE,
                                        height: ITEM_IMAGE_SIZE + (10 * 2),
                                    }} key={uniqueKeyExtractor()}>
                                    <Image source={{ uri: `${renderFile(item.itemImage)}` }} style={{
                                        width: ITEM_IMAGE_SIZE * 0.8,
                                        height: ITEM_IMAGE_SIZE * 0.7,
                                        borderRadius: 10,
                                    }}
                                        tapToOpen={false} />
                                    <Text fontFamily="PoppinsMedium" style={{
                                        color: "#212121",
                                        fontSize: 14,
                                        paddingTop: 8,
                                    }} numberOfLines={1}>{`${item.name}`}</Text>

                                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                                        <Text fontFamily="PoppinsBold" style={{
                                            color: "#272727",
                                            fontSize: 14,
                                        }}>{`${renderPrice({ showZero: true, price: getPricesForProductMenuItemCard(item).price })}`}</Text>
                                        {/*                                     <Text style={{
                                            paddingLeft: 4,
                                            color: "#C1C1C1",
                                            fontSize: 12,
                                            textDecorationLine: "line-through",
                                            textDecorationColor: "#C1C1C1",
                                        }}>{`${renderPrice(getPricesForProductMenuItemCard(item).price)}`}</Text> */}
                                    </View>
                                </TouchableScale>
                            </View>
                        )
                    })}
                </ScrollView>
            </React.Fragment>
        )
    }

    // #region :: LOADING AND ERROR RENDERING START's FROM HERE 
    if (query.error) {
        return (
            <View style={{ flex: 1, }}>
                <NoRecord
                    color={colors}
                    title={query.errorText}
                    buttonText={`Retry`}
                    onButtonPress={loadData} />
            </View>
        )
    }
    if (query.loading) {
        return (
            <View style={{ flex: 1, margin: 10, }}>
                <AnimatedLottieView
                    autoSize={true}
                    resizeMode={'contain'}
                    style={{ width: '100%' }}
                    source={require('../../../assets/gifs/Homeloading.json')}
                    autoPlay
                    loop
                />
            </View>
        )
    }

    // #endregion :: LOADING AND ERROR RENDERING END's FROM HERE 

    return (
        <View style={{ flex: 1, }}>
            <FlatList
                data={data}
                renderItem={_renderParentItem}
                contentContainerStyle={{
                    paddingBottom: 140,
                }}
            />
            <RenderBottomBarComponent
                //@ts-ignore
                showCategories={false}
                pitstopType={pitstopType}
                colors={colors}
            />

        </View>
    );
}

SearchProductVendors.defaultProps = defaultProps;
export default SearchProductVendors;



// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors: typeof initColors,) => StyleSheet.create({


});//end of stylesFunc

     // #endregion :: STYLES END's FROM HERE 