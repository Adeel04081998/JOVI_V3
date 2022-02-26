
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
import Card from './Card';
import CardLoader from "./CardLoader";
import { useSelector } from 'react-redux';

const ITEMS_PER_PAGE = 20;

export default ({ config, filters, pitstopType, styles, imageStyles = { width: '100%' }, fetchPitstopsFlagParent = null, pitstopFilters = null, colors }) => {
    const [state, setState] = React.useState({
        pitstopListViewModel: {
            list: []
        },
        isLoading: false
    });
    const userReducer = useSelector(store => store.userReducer);
    console.log('userReducer',userReducer);
    const finalDestination =  userReducer.finalDestObj??{};
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
            "latitude": finalDestination.latitude ?? 0,
            "longitude": finalDestination.longitude ?? 0,
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
            else if (res.data.statusCode === 404) {
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
        if(isRequestSent.current) return;
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
        if(isRequestSent.current) return;
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
    }, []);
    React.useEffect(()=>{
        fetchDataWithResetedPageNumber();
    },[finalDestination]);
    const onPressPitstop = (item) => {
        const routes = {
            4: ROUTES.APP_DRAWER_ROUTES.RestaurantProductMenu.screen_name,
            1: ROUTES.APP_DRAWER_ROUTES.ProductMenu.screen_name,
            2: ROUTES.APP_DRAWER_ROUTES.RestaurantProductMenu.screen_name,
        }
        NavigationService.NavigationActions.common_actions.navigate(routes[pitstopType], { ...item, pitstopType });
    }
    const renderItem = (item, index) => {
        return <Card
            colors={colors}
            key={index}
            data={item}
            index={index}
            onPressPitstop={onPressPitstop}
        />
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
                    state.isLoading ? <CardLoader styles={styles} type={2} loaderStyles={{ marginTop: -15 }} /> : <></>
                }
                {
                    state.pitstopListViewModel.list.length < 1 && state.isLoading === false ? <Text style={{ marginTop: 50, alignSelf: 'center', color: colors.grey }} fontFamily={'PoppinsMedium'}>
                        No {pitstopType === 4 ? 'Restaurants' : 'Supermarkets'} Found
                    </Text> : null
                }
            </View>
        </View>
    );
};