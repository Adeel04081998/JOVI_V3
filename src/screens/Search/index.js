import AnimatedLottieView from 'lottie-react-native';
import * as React from 'react';
import { Alert, Animated, Appearance, FlatList, SafeAreaView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { KeyboardAwareScrollView } from '../../../libs/react-native-keyboard-aware-scroll-view';
import svgs from '../../assets/svgs';
import GenericLottieLoader from '../../components/atoms/GenericLottieLoader';
import Image from '../../components/atoms/Image';
import Text from '../../components/atoms/Text';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import TouchableScale from '../../components/atoms/TouchableScale';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import { renderFile, sharedExceptionHandler, sharedOnVendorPress } from '../../helpers/SharedActions';
import { getRequest, postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import NavigationService from '../../navigations/NavigationService';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import Search from '../Home/components/Search';
import SearchProductVendors from './components/SearchProductVendors';
import { stylesFunc } from './styles';

const WINDOW_WIDTH = constants.window_dimensions.width;

const debounceFunction = (func, delay) => {
    let timer;
    return function () {
        let self = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(self, args)
        }, delay)
    }
}

export default ({ navigation, route }) => {
    //#region :: params
    const pitstopType = route.params.pitstopType;
    const isFromListing = pitstopType ? true : false;
    // //#endregion :: params
    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const restaurantColors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.RESTAURANT]], Appearance.getColorScheme() === "dark");
    const smColors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.SUPER_MARKET]], Appearance.getColorScheme() === "dark");
    const styles = { ...stylesFunc(colors), };
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE & REF's START's FROM HERE 
    const [isRestaurantSelected, toggleIsRestaurantSelected] = React.useState(route.params.pitstopType === 1 ? false : true);
    const isRestaurantSelectedRef = React.useRef(route.params.pitstopType === 1 ? false : true);
    const [showProductVendor, toggleShowProductVendor] = React.useState(false);
    const [showJoviJob, toggleShowJoviJob] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');
    const [recentSearchesData, updateRecentSearchedData] = React.useState({ restaurant: [], grocery: [], });
    const [searchData, updateSearchData] = React.useState({ restaurant: { text: '', data: [] }, grocery: { text: '', data: [] }, });

    const [loading, toggleLoading] = React.useState(false);
    // #endregion :: STATE & REF's END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const renderTabItem = (text, selected = false) => {
        const selectedColors = isRestaurantSelected ? restaurantColors : smColors;
        return (
            <TouchableScale wait={0} onPress={() => {
                toggleIsRestaurantSelected(!isRestaurantSelected);
                isRestaurantSelectedRef.current = !isRestaurantSelectedRef.current;
            }} disabled={selected}
                style={{
                    flex: 1,
                    alignItems: "center",
                    paddingTop: constants.spacing_vertical,
                }}>
                <Text style={{
                    ...selected ? {
                        color: selectedColors.primary,
                    } : {
                        color: "#000",
                    },
                    fontSize: 14,
                    textTransform: "uppercase",
                    paddingBottom: constants.spacing_vertical,
                }}>{`${text}`}</Text>
                {selected &&
                    <View style={{
                        backgroundColor: selectedColors.primary,
                        height: 1,
                        width: "85%",
                        alignSelf: "center",
                    }} />
                }
            </TouchableScale>
        )
    };//end of renderTabItem


    const visibleShowProductVendor = (name) => {
        setSearchText(name);
        toggleShowProductVendor(true);
    };

    const hideShowProductVendor = () => {
        toggleShowProductVendor(false);
    };
    const debounceInputSearch = React.useCallback(debounceFunction((nextValue) => executeSearching(nextValue), 1000), [])

    const _renderHeader = () => {
        const headerColors = showProductVendor || isFromListing ? isRestaurantSelected ? restaurantColors : smColors : colors;
        return (
            <SafeAreaView>
                <CustomHeader
                    containerStyle={{
                        ...!showProductVendor ? {
                            borderBottomWidth: 0,
                            paddingBottom: 0,
                        } : {
                            borderBottomColor: headerColors.primary,
                        },
                    }}
                    {...(showProductVendor || isFromListing) && {
                        leftIconColor: headerColors.primary,
                        onLeftIconPress: () => {
                            if (isFromListing) {
                                NavigationService.NavigationActions.common_actions.goBack();
                                return;
                            }
                            hideShowProductVendor();
                        },
                    }}
                    leftSideContainer={{ width: "auto", }}
                    leftContainerStyle={{ marginRight: 0, }}
                    centerRightCustom={() => {
                        return (
                            <View style={{
                                paddingLeft: 4,
                                paddingRight: constants.spacing_horizontal * 1.5,
                                paddingTop: 0,
                            }}>
                                <Search
                                    {...showProductVendor ? {
                                        editable: false,
                                        onPress: () => {
                                            hideShowProductVendor();
                                        },
                                    } : {
                                        editable: true,
                                        autoFocus: true,
                                    }}
                                    text={searchText}
                                    containerStyle={{ height: 40, }}
                                    colors={colors}
                                    fontSize={12}
                                    placeholder={isRestaurantSelected ? 'Search for food or restaurant' : 'Search for products or shops'}
                                    onChangeText={(text) => {
                                        setSearchText(text);
                                        debounceInputSearch(text);

                                    }}
                                    searchIconPressDisable={false}
                                    onSearch={(text) => {
                                        executeSearching(text);
                                    }}
                                />
                            </View>
                        )
                    }} />
                {!showProductVendor && !isFromListing &&
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        {renderTabItem("Food", isRestaurantSelected)}
                        {renderTabItem("Shops", !isRestaurantSelected)}
                    </View>
                }
            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    // #region :: GETTING & CLEARING RECENT SERACHES START's FROM HERE 

    React.useEffect(() => {
        loadRecentSearches();
        executeSearching(searchText);
        return () => { };
    }, [isRestaurantSelected]);

    const loadRecentSearches = () => {
        const selectedKey = isRestaurantSelectedRef.current ? "restaurant" : "grocery";
        const typ = isRestaurantSelectedRef.current ? PITSTOP_TYPES.RESTAURANT : PITSTOP_TYPES.SUPER_MARKET;
        if (recentSearchesData[selectedKey].length > 1) return
        getRequest(
            `${Endpoints.GET_RECENT_SEARCHES}/${typ}`,
            res => {
                console.log(`${Endpoints.GET_RECENT_SEARCHES} res ---  `, res);
                const statusCode = res.data?.statusCode ?? 404;
                if (statusCode === 200) {
                    updateRecentSearchedData(pre => ({
                        ...pre,
                        [selectedKey]: res.data.mainSearchResults,
                    }))
                    return;
                }
            },
            err => {
            }, {}, false);
    }

    const onClearRecentPress = () => {
        const selectedKey = isRestaurantSelectedRef.current ? "restaurant" : "grocery";

        updateRecentSearchedData(pre => ({ ...pre, [selectedKey]: [] }));
        getRequest(
            Endpoints.CLEAR_RECENT_SEARCHES,
            res => {
            },
            err => {
                sharedExceptionHandler(err);
            }, {}, false);
    }

    // #endregion :: GETTING & CLEARING RECENT SERACHES END's FROM HERE 


    const executeSearching = (text) => {
        const textLength = `${text}`.trim().length;
        if (textLength > 2) {
            hideJOVIJob();
            searching(text);
        } else if (textLength === 0) {
            hideJOVIJob();
            clearBothSearch();
            toggleLoading(false);
        } else {
            showJOVIJob();
            clearBothSearch();
            toggleLoading(false);
        }
    }

    const showJOVIJob = () => {
        toggleShowJoviJob(true);
    }
    const hideJOVIJob = () => {
        toggleShowJoviJob(false);
    }

    const clearBothSearch = () => {
        updateSearchData({
            grocery: { text: '', data: [] },
            restaurant: { text: '', data: [] },
        })
    }

    const searching = (text) => {
        const selectedKey = isRestaurantSelectedRef.current ? "restaurant" : "grocery";
        if (`${text}`.toLowerCase() === `${searchData[selectedKey].text}`.toLowerCase()) {
            if (searchData[selectedKey].data.length < 1) {
                showJOVIJob();
            } else {
                hideJOVIJob();
            }
            return;
        }
        if (text.length < 1) {
            hideJOVIJob();
            clearBothSearch();
        }
        const params = {
            "userID": null,
            "searchTxt": text,
            "pitstopType": isRestaurantSelectedRef.current ? PITSTOP_TYPES.RESTAURANT : PITSTOP_TYPES.SUPER_MARKET,
        }
        toggleLoading(true);
        console.log(`${Endpoints.SEARCH} PARAMS ---  `, params);
        postRequest(Endpoints.SEARCH, params, (res) => {
            console.log(`${Endpoints.SEARCH} res ---  `, res);
            const statusCode = res.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const searchedResData = res.data?.mainSearchResults ?? [];
                updateSearchData(pre => ({
                    ...pre,
                    [selectedKey]: {
                        text: text,
                        data: searchedResData,
                    }
                }))
            } else {
                if (text.length > 0) {
                    showJOVIJob();
                    updateSearchData(pre => ({
                        ...pre,
                        [selectedKey]: {
                            text: text,
                            data: [],
                        }
                    }))
                } else {
                    hideJOVIJob();
                    clearBothSearch();
                }

            }
            toggleLoading(false);
        }, (err) => {
            sharedExceptionHandler(err);
            toggleLoading(false);
        }, {}, false)
    };//end of searching -- getting record from server using text user enter

    const renderRecentlyItem = () => {
        const selectedKey = isRestaurantSelectedRef.current ? "restaurant" : "grocery";
        if (recentSearchesData[selectedKey].length < 1) return null;
        return (
            <KeyboardAwareScrollView bounces={false} contentContainerStyle={{ paddingBottom: constants.spacing_vertical * 2, }}>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: constants.spacing_horizontal,
                    paddingTop: constants.spacing_vertical,
                    paddingBottom: constants.spacing_vertical,
                }}>
                    <Text style={{
                        color: "#272727",
                        fontSize: 16,
                    }}>{`Recently`}</Text>
                    <TouchableScale wait={0} onPress={onClearRecentPress}>
                        <Text fontFamily='PoppinsLight' style={{
                            color: "#707070",
                            fontSize: 14,
                        }}>{`Clear`}</Text>
                    </TouchableScale>
                </View>

                <View style={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    width: '100%',
                    paddingHorizontal: constants.spacing_horizontal,
                }}>
                    {recentSearchesData[selectedKey].map((item, index) => {
                        const { name } = extractItem(item);

                        return <TouchableScale wait={0} style={{
                            backgroundColor: "#E1E1E1",
                            borderRadius: 18,
                            paddingHorizontal: constants.spacing_horizontal,
                            paddingVertical: constants.spacing_vertical,
                            marginRight: 6,
                            marginBottom: 6,
                        }}
                            key={index}
                            onPress={() => {
                                setSearchText(name);
                                onItemPress(item, index);
                            }}>

                            <Text style={{
                                color: "#848484",
                                fontSize: 12,
                            }}>{`${name}`}</Text>
                        </TouchableScale>
                    })
                    }
                </View>
            </KeyboardAwareScrollView>
        )
    }

    const onItemPress = (item, index) => {
        const selectedKey = isRestaurantSelectedRef.current ? "restaurant" : "grocery";
        const { isVendor, name, pitstopType } = extractItem(item);
        if (isVendor) {
            sharedOnVendorPress({ ...item, pitstopType }, index);
            addSearchedText(item);
        } else {
            visibleShowProductVendor(name);
        }
        const itemIndex = recentSearchesData[selectedKey].findIndex(i => i.name === name);
        if (itemIndex === -1) {
            updateRecentSearchedData(pre => ({
                ...pre,
                [selectedKey]: [item, ...pre[selectedKey]],
            }));
        } else {
            recentSearchesData[selectedKey].splice(itemIndex, 1);
            updateRecentSearchedData(pre => ({
                ...pre,
                [selectedKey]: [item, ...recentSearchesData[selectedKey]],
            }));
        }
        executeSearching(name);
    };//end of onItemPress

    const addSearchedText = (item) => {
        const { name, pitstopType, pitstopID } = extractItem(item);
        const params = {
            "userID": null,
            "text": name,
            "pitstopType": pitstopType,
            "pitstopID": pitstopID,
        }

        console.log(`${Endpoints.ADD_SEARCHED_TEXT} PARAMS ---  `, params);
        postRequest(Endpoints.ADD_SEARCHED_TEXT, params, (res) => {
            console.log(`${Endpoints.ADD_SEARCHED_TEXT} res ---  `, res);
        }, (err) => {
        }, {}, false)
    };//end of addSearchedText

    const extractItem = (item) => {
        const pitstopID = item?.pitstopID ?? '0';
        const isVendor = pitstopID && `${pitstopID}` !== '0' ? true : false;
        const name = item?.name ?? '';
        const image = isVendor ? item?.image ?? null : null;
        const pitstopType = isRestaurantSelected ? PITSTOP_TYPES.RESTAURANT : PITSTOP_TYPES.SUPER_MARKET;
        return {
            pitstopID,
            isVendor,
            name,
            image,
            pitstopType,
        };
    };//end of extractItem

    const renderSearchedItem = () => {
        let searchedData = searchData.grocery.data;
        if (isRestaurantSelected) {
            searchedData = searchData.restaurant.data;
        }

        if (searchedData.length < 1) return null;
        return (
            <FlatList
                data={searchedData}
                bounces={false}
                contentContainerStyle={{
                    paddingBottom: constants.spacing_vertical * 2,
                    paddingTop: constants.spacing_vertical * 2,
                }}
                renderItem={({ item, index }) => {
                    const { isVendor, name, image, } = extractItem(item);

                    return (
                        <TouchableScale wait={0} onPress={() => {
                            onItemPress(item, index)
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingHorizontal: constants.spacing_horizontal,
                                paddingVertical: constants.spacing_vertical,
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}>
                                    {isVendor &&
                                        <Image tapToOpen={false} source={{ uri: renderFile(image) }} style={{
                                            height: 20,
                                            width: 20,
                                            resizeMode: "contain",
                                            borderRadius: 2,
                                            marginRight: constants.spacing_horizontal,
                                        }} />
                                    }
                                    <Text style={{ fontSize: 12, color: "#272727", }}>{`${name}`}</Text>
                                </View>
                                <VectorIcon
                                    name='arrow-up-left'
                                    type='Feather'
                                    size={10}
                                />
                            </View>
                            <View style={{
                                backgroundColor: "rgba(112, 112, 112, 0.3)",
                                height: 1,
                                flex: 1,
                            }} />
                        </TouchableScale>
                    )
                }} />
        )
    }

    // #region :: UI START's FROM HERE 
    return (
        <View style={{ ...styles.primaryContainer, }}>
            {_renderHeader()}
            {!showJoviJob && recentSearchesData[isRestaurantSelected ? "restaurant" : "grocery"].length < 1 && searchData[isRestaurantSelected ? "restaurant" : "grocery"].data.length < 1 ? <EmptyUI /> :
                <>
                    {showProductVendor ?
                        <SearchProductVendors
                            colors={isRestaurantSelected ? restaurantColors : smColors}
                            pitstopType={isRestaurantSelected ? PITSTOP_TYPES.RESTAURANT : PITSTOP_TYPES.SUPER_MARKET}
                            searchText={searchText}
                        />
                        : <>

                            {isRestaurantSelected ?
                                showJoviJob && searchData.restaurant.data.length < 1 ? <JoviJobUI /> : searchData.restaurant.data.length < 1 && !loading ? renderRecentlyItem() : loading ? <LoadingUI /> : renderSearchedItem() :
                                showJoviJob && searchData.restaurant.data.length < 1 ? <JoviJobUI /> : searchData.grocery.data.length < 1 && !loading ? renderRecentlyItem() : loading ? <LoadingUI /> : renderSearchedItem()}
                        </>
                    }
                </>}
        </View>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT

const EmptyUI = () => {
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <View style={{
                marginTop: -120,
            }}>
                <SvgXml
                    xml={svgs.searchEmptyRobot()}
                    height={WINDOW_WIDTH * 0.5}
                    width={WINDOW_WIDTH * 0.5}
                />
            </View>

        </View>
    )
}

const LoadingUI = () => {
    return (
        <GenericLottieLoader />
    )
}

const JOVI_JOB_ICON_SIZE = {
    backgroundColor: constants.window_dimensions.width * 0.15,
    image: constants.window_dimensions.width * 0.1,
};
const JoviJobUI = ({ }) => {
    const animate = React.useRef(new Animated.Value(100)).current;
    React.useEffect(() => {
        Animated.spring(
            animate, {
            toValue: 0,
            velocity: 3,
            tension: 2,
            friction: 8,
            useNativeDriver: true,
        }
        ).start();
    })
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <Animated.View style={{
                marginTop: 20,
                transform: [{ translateY: animate }]
            }}>
                <TouchableOpacity activeOpacity={1} wait={0}
                    onPress={() => {
                        sharedOnVendorPress({ pitstopType: PITSTOP_TYPES.JOVI }, 0)
                    }}
                    style={{
                        flexDirection: "row",
                        width: "90%",
                        alignItems: "center",
                        // justifyContent: "center",
                        alignSelf: "center",
                        backgroundColor: '#6D51BB',
                        borderRadius: 16,
                        padding: constants.spacing_horizontal,
                    }}>

                    <View style={{
                        height: JOVI_JOB_ICON_SIZE.backgroundColor,
                        width: JOVI_JOB_ICON_SIZE.backgroundColor,
                        borderRadius: JOVI_JOB_ICON_SIZE.backgroundColor,
                        backgroundColor: "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <SvgXml xml={svgs.jovi()} height={JOVI_JOB_ICON_SIZE.image} width={JOVI_JOB_ICON_SIZE.image} />
                    </View>

                    <View style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Text fontFamily='PoppinsMedium' style={{
                            fontSize: 18,
                            color: "#FFFFFF",
                        }}>{`Couldn't find your Product?`}</Text>
                        <Text fontFamily='PoppinsLight' style={{
                            fontSize: 30,
                            color: "#FFFFFF",
                        }}>{`Book a Jovi`}</Text>
                    </View>

                    <SvgXml xml={svgs.searchBookJoviBackground()}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 70,
                            overflow: 'hidden',
                            maxWidth: "100%",
                            maxHeight: "100%",
                            opacity: 0.3,
                        }}
                    />
                </TouchableOpacity>
            </Animated.View>

            <View style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                height: "30%",
                width: "100%",
            }}>
                <AnimatedLottieView
                    source={require('../../assets/gifs/RobotSearch.json')}
                    autoPlay
                    loop
                />
            </View>

        </SafeAreaView>
    )
}