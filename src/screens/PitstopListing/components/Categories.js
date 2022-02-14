import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Text from '../../../components/atoms/Text';
import View from '../../../components/atoms/View';
import AnimatedFlatlist from '../../../components/molecules/AnimatedScrolls/AnimatedFlatlist';
import CategoryCardItem, { CategoryCardItemSimple } from '../../../components/molecules/CategoryCardItem';
import constants from '../../../res/constants';
import sharedStyles from '../../../res/sharedStyles';

const SPACING_VERTICAL = 10;
const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.195;

export default ({ CategoriesTabConfig={}, selectedCategories=[], parentCategoryHandler = () => { },  colors }) => {
    const isRendered = React.useRef(false);
    const [state,setState] = React.useState({activeTab:null});
    const categoriesTagsReducer = useSelector(state => state.categoriesTagsReducer);
    const categoriesList = categoriesTagsReducer?.vendorFilterViewModel?.cuisine?.categoriesList?? [];
    const checkSelectedTab = (item) => {
        // return state.activeTab === item.categoryID;
        return (selectedCategories ?? []).find(x => x === item.categoryID);
    }
    const selectedStyle = (item) => {
        const style = {
            height: CONTAINER_HEIGHT,
            width: CONTAINER_WIDTH,
            marginBottom: 5,
            justifyContent: 'center',
            backgroundColor: '#fff',
            ...sharedStyles._styles().shadow,
            ...styles.cat_item_container,
        };
        return style;
    }
    React.useLayoutEffect(() => {
        setTimeout(() => {
            isRendered.current = true;
        }, 1000);
    }, []);
    const CategoryCardItemComponent = isRendered.current ? CategoryCardItemSimple : CategoryCardItem;
    return (<View style={{ marginTop: 10, overflow: 'visible' }}>
        {CategoriesTabConfig.categoryTitle && <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={styles.categoryTitle}>
            Cuisine
        </Text>}
        <AnimatedFlatlist
            data={
                categoriesList
            }
            delay={250}
            renderItem={(x, i) => {
                return <CategoryCardItemComponent
                    key={`category card item${i}`}
                    xml={x.image}
                    title={x.categoryName}
                    containerStyleOverride={true}
                    containerOverrideStyle={{
                        backgroundColor: checkSelectedTab(x) ? colors.primary + '20' : '#fff',
                        borderColor: checkSelectedTab(x) ? colors.primary : '',
                        borderWidth: checkSelectedTab(x) ? 1 : 0,
                        height: '100%'
                    }}
                    textStyle={styles.cardTextStyle}
                    imageContainerStyle={[{ height: CONTAINER_HEIGHT * 0.6 }, styles.cat_img_container]}
                    onPress={() => {setState(pre=>({...pre,activeTab:pre.activeTab === x.categoryID?null:x.categoryID}));parentCategoryHandler(x, 'categoryID', 'cuisines')}}
                />
            }}
            horizontal={true}
            itemContainerStyleCb={selectedStyle}
        />
    </View>)
};


const styles = StyleSheet.create({
    cat_img_container:{
        width: 80, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    cat_item_container: {
        marginHorizontal: 3, justifyContent: 'center', borderRadius: 10
    },
    categoryTitle:{ fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL },
    cardTextStyle:{ fontSize: 12, padding: 2 },
}) 