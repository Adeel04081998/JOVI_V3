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
// const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.17);
const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.195;

export default ({ CategoriesTabConfig = {}, paramItem = {}, selectedCategories = [], parentCategoryHandler = () => { }, colors, itemKeys = { id: 'categoryID', name: 'categoryName', image: 'image' }, }) => {
    const isRendered = React.useRef(false);
    const [state, setState] = React.useState({ activeTab: null });
    const categoriesTagsReducer = useSelector(state => state.categoriesTagsReducer);
    let categoriesList = itemKeys.id === "categoryID" ? [...new Set([paramItem, ...(categoriesTagsReducer?.vendorFilterViewModel?.cuisine?.categoriesList ?? [])])] : [...new Set([paramItem, ...(categoriesTagsReducer?.vendorFilterViewModel?.tagsList ?? [])])];
    if (itemKeys.id !== 'categoryID') {
        categoriesList = [paramItem, ...categoriesList.filter(x => x[itemKeys.id] !== paramItem[itemKeys.id])];
    }
    const checkSelectedTab = (item) => {
        // return state.activeTab === item.categoryID;
        return (selectedCategories ?? []).find(x => x === item[itemKeys.id]);
    }
    const selectedStyle = (item, index) => {
        const style = {
            height: CONTAINER_HEIGHT,
            width: CONTAINER_WIDTH,
            marginBottom: 5,
            justifyContent: 'center',
            left: 10,
            backgroundColor: '#fff',
            // ...sharedStyles._styles().shadow,
            ...styles.cat_item_container,
            marginRight: categoriesList.length - 1 === index ? 20 : 8,
        };
        return style;
    }
    React.useLayoutEffect(() => {
        setTimeout(() => {
            isRendered.current = true;
        }, 1000);
    }, []);
    const CategoryCardItemComponent = isRendered.current ? CategoryCardItemSimple : CategoryCardItem;
    return (<View style={{ marginTop: 10, overflow: 'visible', marginHorizontal: -10 }}>
        {CategoriesTabConfig.categoryTitle && <Text numberOfLines={1} fontFamily='PoppinsSemiBold' style={styles.categoryTitle}>
            Cuisine
        </Text>}
        <AnimatedFlatlist
            data={categoriesList}
            delay={250}
            renderItem={(x, i) => {
                return <CategoryCardItemComponent
                    key={`category card item${i}`}
                    xml={x[itemKeys.image]}
                    title={x[itemKeys.name]}
                    containerStyleOverride={true}
                    containerOverrideStyle={{
                        backgroundColor: checkSelectedTab(x) ? colors.primary + '20' : '#fff',
                        borderColor: checkSelectedTab(x) ? colors.primary : '',
                        borderWidth: checkSelectedTab(x) ? 2 : 0,
                        paddingTop: 3,
                        height: '100%',

                    }}
                    textStyle={styles.cardTextStyle}
                    imageContainerStyle={[{ height: CONTAINER_HEIGHT * 0.5, marginVertical: 5 }, styles.cat_img_container]}
                    onPress={() => { setState(pre => ({ ...pre, activeTab: pre.activeTab === x[itemKeys.id] ? null : x[itemKeys.id] })); parentCategoryHandler(x, [itemKeys.id], 'cuisines') }}
                />
            }}
            horizontal={true}
            itemContainerStyleCb={selectedStyle}
        />
    </View>)
};


const styles = StyleSheet.create({
    cat_img_container: {
        width: 80, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    cat_item_container: {
        justifyContent: 'center', borderRadius: 10,

    },
    categoryTitle: { fontSize: 15, color: "#272727", paddingVertical: SPACING_VERTICAL },
    cardTextStyle: { fontSize: 12, paddingHorizontal: 2, },
}) 