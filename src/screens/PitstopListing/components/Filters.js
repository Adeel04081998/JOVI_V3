import React from 'react';
import { StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import svgs from '../../../assets/svgs';
import Text from '../../../components/atoms/Text';
import TouchableScale from '../../../components/atoms/TouchableScale';
import VectorIcon from '../../../components/atoms/VectorIcon';
import View from '../../../components/atoms/View';
import AnimatedFlatlist from '../../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import { VALIDATION_CHECK } from '../../../helpers/SharedActions';

const SPACING_VERTICAL = 10;
const FILTER_ICON_HEIGHT = 35;
const FILTER_ICON_SIZE = 17;

export default ({ filterConfig,screenName='', selectedFilters, parentFilterHandler = () => { }, colors, goToFilters, }) => {
    const categoriesTagsReducer = useSelector(state => state.categoriesTagsReducer);
    const filtersList = categoriesTagsReducer?.vendorFilterViewModel?.filtersList ?? [];
    const [state, setState] = React.useState({ activeTab: null,filtersData:filtersList });
    const _listRef = React.useRef(null);
    const {filtersData} = state;
    const checkSelectedFilter = (item) => {
        // return state.activeTab === item.vendorDashboardCatID;
        return (selectedFilters ?? []).find(x => x === item.vendorDashboardCatID);
    }
    const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
    const onChangeFilter = (item = {}) => {
    //    const updatedList = [{...item},...state.filtersData];
       setState(pre => ({ ...pre, activeTab: pre.activeTab === item.vendorDashboardCatID ? null : item.vendorDashboardCatID }));
    //    setState(pre => ({ ...pre, activeTab: pre.activeTab === item.vendorDashboardCatID ? null : item.vendorDashboardCatID, filtersData:uniqueArray(updatedList) }));
       parentFilterHandler(item, 'vendorDashboardCatID', 'filter');
    //    if(_listRef.current){
    //        _listRef.current.scrollToOffset({ animated: true, offset: 0 });
    //    }
    }
    const _styles = styles(colors, checkSelectedFilter);
    React.useEffect(()=>{
        if(selectedFilters&&selectedFilters.length>0){
            let selectedFilter = filtersList.find(x => (selectedFilters??[]).includes(x.vendorDashboardCatID));
            setState(pre=>({...pre,activeTab:selectedFilter,filtersData:uniqueArray([selectedFilter,...filtersList])}));
        }
    },[]);
    return (<View style={_styles.parentContainer}>
        {filterConfig.filterTitleShown && <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={_styles.filterTitle}>
            Filters
        </Text>}
        <View style={_styles.scrollParent}>
            {filterConfig.filterScreenIcon && <TouchableScale onPress={goToFilters} style={_styles.filterIcon}>
                {/* <VectorIcon name={'filter'} type={'AntDesign'} size={17} color={'black'} style={{ marginRight: 2 }} /> */}
                <SvgXml height={20} width={20} xml={svgs.filter()} style={{ margin: 5 }} />
            </TouchableScale>}
            <AnimatedFlatlist
                data={filtersData}
                flatlistProps={{ref:_listRef}}
                renderItem={(item, i) => {
                    return <TouchableScale onPress={()=>onChangeFilter(item)} style={_styles.filterTouchable}>
                        {VALIDATION_CHECK(item.image) && <SvgXml height={FILTER_ICON_SIZE} width={FILTER_ICON_SIZE} xml={item.image} />}
                        <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', paddingHorizontal: 5 }} fontFamily={'PoppinsBold'} >{item.name}</Text>
                    </TouchableScale>
                }}
                horizontal={true}
                itemContainerStyleCb={(x,i) => (_styles.filterContainer(x))}
            />
        </View>
    </View>)
};
const styles = (colors, checkSelectedFilter) => {
    return StyleSheet.create({
        filterContainer: (x) => ({
            height: FILTER_ICON_HEIGHT,
            borderColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            paddingHorizontal: 8,
            marginHorizontal: 5,
            borderRadius: checkSelectedFilter(x) ? 4 : 1,
            backgroundColor: checkSelectedFilter(x) ? colors.primary + '20' : '#fff',
            borderColor: checkSelectedFilter(x) ? colors.primary : '',
            borderWidth: checkSelectedFilter(x) ? 1 : 0.1,
        }),
        filterTouchable: {
            display: 'flex',
            flexDirection: 'row',
        },
        scrollParent: {
            display: 'flex',
            flexDirection: 'row',
        },
        filterIcon: {
            height: FILTER_ICON_HEIGHT,
            borderRadius: 4,
            justifyContent: 'center',
            paddingHorizontal: 5,
            backgroundColor: 'white',
            marginHorizontal: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 6,
        },
        parentContainer: { width: '100%', paddingTop: 10, display: 'flex', justifyContent: 'center', alignContent: 'center'},
        filterTitle: { fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL },
    });
}