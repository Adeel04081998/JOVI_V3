import React from 'react'
import { Animated, GestureResponderHandlers, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

     // #region :: INTERFACE START's FROM HERE 
     interface AnimatedCircleLayoutInterface {
        calcHeight: () => any;
        keyExtractor: (item: any, index: any) => React.Key;
        containerStyle?: StyleProp<ViewStyle>;
        displayData?: any[];
        panHandlers?: GestureResponderHandlers;
        renderItem?: any;
        state?: any;
        visibleDataBounds?: any;
    };

     // #endregion :: INTERFACE END's FROM HERE 

export default (props: AnimatedCircleLayoutInterface) => {
    const { calcHeight, containerStyle, displayData, keyExtractor, panHandlers, renderItem, state, visibleDataBounds, } = props;

    return (
        <View {...panHandlers} style={[styles.container, { height: calcHeight() }, containerStyle]}>
            <View style={styles.wrapper}>
                {(displayData ?? []).map((item, index) => {
                    const scale = state[`scale${index}`]
                    const translateX = state[`translateX${index}`]
                    const translateY = state[`translateY${index}`]
                    const { _dataIndex, ...itemToRender } = item

                    return (
                        translateX &&
                        translateY &&
                        visibleDataBounds &&
                        visibleDataBounds.includes(_dataIndex) && (
                            <Animated.View
                                key={keyExtractor(item, index)}
                                style={[
                                    styles.renderItemContainer,
                                    {
                                        transform: [{ translateX }, { translateY }, { scale }],
                                    },
                                ]}
                            >
                                {renderItem({ item: itemToRender, index: item._dataIndex })}
                            </Animated.View>
                        )
                    )
                })}
            </View>
        </View>
    )
};//end of AnimatedCircleLayout

     // #region :: STYLES START's FROM HERE 
     const styles = StyleSheet.create({
        container: {
            position: 'relative',
            alignItems:"center",
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'stretch',
            // overflow: 'hidden',

            width:"50%",
        },
        renderItemContainer: {
            position: 'absolute',
            margin: 30,
            
        },
        wrapper: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'stretch',
            marginTop: 10,
        },
    })

     // #endregion :: STYLES END's FROM HERE 

