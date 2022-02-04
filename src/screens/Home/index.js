import { View, Text } from 'react-native';
import React from 'react';
// import GenericList from '../../components/molecules/GenericList';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ImageCarousel from '../../components/molecules/ImageCarousel';
export default () => {
    const promotionsReducer = useSelector(state => state.promotionsReducer);
    return (
        <KeyboardAwareScrollView>
            {
                Object.keys(promotionsReducer).length ?
                    <ImageCarousel data={promotionsReducer.dashboardContentListViewModel.dashboardPromoListVM || []} uriKey="promoImg" />
                    : null
            }
        </KeyboardAwareScrollView>
    );
}
