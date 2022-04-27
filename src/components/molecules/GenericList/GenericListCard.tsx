import * as React from 'react';
import { View } from 'react-native';

// #region :: INTERFACE & DEFAULT PROPS START's FROM HERE
interface GenericListCardProps {

};

const defaultProps = {

};
// #endregion :: INTERFACE & DEFAULT PROPS END's FROM HERE 

const GenericListCard = (props: GenericListCardProps) => {

    // #region :: MAIN UI START's FROM HERE 
    return (
        <View {...props} />
    );
    // #endregion :: MAIN UI END's FROM HERE 
};

GenericListCard.defaultProps = defaultProps;
export default GenericListCard;