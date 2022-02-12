import React from 'react';
import CategoryCardItem from '../../../components/molecules/CategoryCardItem';
import AnimatedView from '../../../components/atoms/AnimatedView';
import ENUMS from '../../../utils/ENUMS';
import constants from '../../../res/constants';
import Text from '../../../components/atoms/Text';
import NavigationService from '../../../navigations/NavigationService';
const CONTAINER_WIDTH = ((constants.screen_dimensions.width) * 0.22);
const CONTAINER_HEIGHT = constants.screen_dimensions.width * 0.3;
export default React.memo(({ homeStyles }) => {
    const cartOnPressHandler = (index) => {
        if(index === 1){
            NavigationService.NavigationActions.common_actions.navigate('VENDORS',{pitstopType:4});
        }else if(index ===2){
            NavigationService.NavigationActions.common_actions.navigate('VENDORS',{pitstopType:1});
        }
     }
    return <AnimatedView style={[homeStyles.categoriesCardPrimaryContainer]}>
        <Text style={homeStyles.categoriesCardTittleText}>Categories</Text>
        <AnimatedView style={{ flexDirection: 'row' }}>
            {ENUMS.PITSTOP_TYPES.filter(x => x.isActive).map((x, i) => {
                return <CategoryCardItem
                    key={`category card item${i}`}
                    xml={x.icon}
                    title={x.text}
                    containerStyle={homeStyles.cat_item_container}
                    height={CONTAINER_HEIGHT}
                    width={CONTAINER_WIDTH}
                    pressBackgroundColor={x.color}
                    textStyle={{ fontSize: 12, padding: 2 }}
                    imageContainerStyle={[{ height: CONTAINER_HEIGHT * 0.6 }, homeStyles.cat_img_container]}
                    onPress={() => cartOnPressHandler(i)}
                />
            })
            }
        </AnimatedView>
    </AnimatedView>
}, (prevProps, nextProps) => prevProps !== nextProps)
// }, (prevProps, nextProps) => prevProps !== nextProps)