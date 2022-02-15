
import React from 'react';
import Image from '../../../components/atoms/Image';
import Text from '../../../components/atoms/Text';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import { renderFile, sharedExceptionHandler } from '../../../helpers/SharedActions';
import { postRequest } from '../../../manager/ApiManager';
import Endpoints from '../../../manager/Endpoints';
import NavigationService from "../../../navigations/NavigationService";
import ROUTES from '../../../navigations/ROUTES';
import CardLoader from "./CardLoader";

const ITEMS_PER_PAGE = 40;

export default ({ config, filters, pitstopType, styles, imageStyles = { width: '100%' }, fetchPitstopsFlagParent = null, pitstopFilters = null, colors }) => {
    const [state, setState] = React.useState({
        pitstopListViewModel: {
            list: []
        },
        isLoading: false
    });
    const isRequestSent = React.useRef(false);
    const componentLoaded = React.useRef(false);
    const paginationInfo = React.useRef({
        pageNumber: 0,
        itemsPerPage: ITEMS_PER_PAGE,
        totalItems: null,
    });
    const preGetData = React.useRef({
        isRequestSent: true,
        preData: null,
        paginationInfo: {
            pageNumber: 0,
            itemsPerPage: ITEMS_PER_PAGE,
            totalItems: null,
        }
    });
    const getData = () => {
        isRequestSent.current = true;
        setState(pre => ({ ...pre, isLoading: true }));
        postRequest(Endpoints.GET_PITSTOPS, {
            "latitude": 33.66902188096789,
            "longitude": 73.07520348918612,
            "marketPageNumber": paginationInfo.current.pageNumber,
            "marketItemsPerPage": paginationInfo.current.itemsPerPage,
            "marketID": 0,
            "searchItem": filters.search,
            'categoryID': filters.cuisines[0] ?? '',
            "pitstopType": pitstopType
        }, (res) => {
            setTimeout(() => {
                isRequestSent.current = false;
            }, 500);
            if (res.data.statusCode === 200 && res.data.pitstopListViewModel?.list) {
                if (paginationInfo.current.pageNumber > 1 && res.data.pitstopListViewModel?.list) {
                    const prevData = [...state.pitstopListViewModel.list, ...res.data.pitstopListViewModel?.list];
                    setState(pre => ({ ...pre, isLoading: false, pitstopListViewModel: { list: prevData, } }));
                } else {
                    setState(pre => ({ ...pre, isLoading: false, pitstopListViewModel: res.data.pitstopListViewModel }));
                }
                paginationInfo.current = {
                    ...paginationInfo.current,
                    totalItems: res.data.pitstopListViewModel?.paginationInfo?.totalItems
                }
            }
            else if(res.data.statusCode === 404){
                setState(pre => ({ ...pre, isLoading: false, pitstopListViewModel: { list: [] } }));
            }
            console.log('GET_PITSTOPS', res);
        }, err => {
            sharedExceptionHandler(err);
            isRequestSent.current = false;
            paginationInfo.current = {
                ...paginationInfo.current,
                pageNumber: paginationInfo.current.pageNumber - 1,
                itemsPerPage: paginationInfo.current.itemsPerPage - ITEMS_PER_PAGE
            }
            if (err.data.statusCode === 404) {
                setState(pre => ({ ...pre, isLoading: false, pitstopListViewModel: { list: [] } }));
            } else {
                setState(pre => ({ ...pre, isLoading: false }));
            }
        }, {}, true);
    }
    const fetchDataWithUpdatedPageNumber = (onLoad = false) => {
        if (paginationInfo.current.totalItems && (ITEMS_PER_PAGE * paginationInfo.current.pageNumber) >= paginationInfo.current.totalItems) {
            return;
        }
        paginationInfo.current = {
            ...paginationInfo.current,
            pageNumber: paginationInfo.current.pageNumber + 1,
            itemsPerPage: paginationInfo.current.itemsPerPage
        }
        getData();
    }
    const fetchDataWithResetedPageNumber = () => {
        paginationInfo.current = {
            pageNumber: 1,
            itemsPerPage: ITEMS_PER_PAGE
        }
        getData();
    }
    React.useEffect(() => {
        if ((fetchPitstopsFlagParent) && state.pitstopListViewModel.list.length > 0 && !isRequestSent.current) {
            fetchDataWithUpdatedPageNumber();
        }
    }, [fetchPitstopsFlagParent]);
    React.useEffect(() => {
        if (componentLoaded.current) {
            fetchDataWithResetedPageNumber();
        }
    }, [filters]);
    React.useEffect(() => {
        fetchDataWithUpdatedPageNumber();
        componentLoaded.current = true;
    }, [])
    const onPressPitstop = (item) => {
        const routes = {
            4: ROUTES.APP_DRAWER_ROUTES.RestaurantProductMenu.screen_name,
            1: ROUTES.APP_DRAWER_ROUTES.ProductMenu.screen_name,
            2: ROUTES.APP_DRAWER_ROUTES.RestaurantProductMenu.screen_name,
        }
        NavigationService.NavigationActions.common_actions.navigate(routes[pitstopType],{...item,pitstopType});
    }
    const renderItem = (item, index) => {
        const { title, description, estTime, distanceFromLocation, image, averagePrice } = item;
        return (
            <TouchableOpacity onPress={()=>onPressPitstop(item)} key={index} activeOpacity={0.8} style={{ ...styles.itemContainer }}>
                <Image source={{ uri: renderFile(image) }} style={[styles.image, imageStyles]} tapToOpen={false} />
                <View style={styles.subContainer}>
                    <Text style={styles.title} numberOfLines={1} >{title}</Text>
                    {(distanceFromLocation || estTime) &&
                        <View style={styles.iconContainer} >
                            <VectorIcon name={item.distanceFromLocation ? "map-marker" : "clock-time-four"} type={item.distanceFromLocation ? "FontAwesome" : "MaterialCommunityIcons"} color={colors.primary || "#6D51BB"} size={15} style={{ marginRight: 5 }} />
                            <Text style={styles.estTime} >{estTime || distanceFromLocation} m</Text>
                        </View>
                    }
                </View>
                <Text style={styles.tagsText} numberOfLines={1} >{description}</Text>
                {averagePrice &&
                    <Text style={styles.title} >Rs. {averagePrice}</Text>
                }
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container} >
                <Text style={styles.mainText} >{config.pitstopListingTitle}</Text>
            </View>
            <View >
                {
                    state.pitstopListViewModel.list.map((item, index) => renderItem(item, index))
                }
                {
                    state.isLoading ? <CardLoader styles={styles} type={2} loaderStyles={{marginTop:-15}} /> : <></>
                }
            </View>
        </View>
    );
};