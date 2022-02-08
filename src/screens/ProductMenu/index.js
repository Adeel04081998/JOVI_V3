import React from 'react';
import { Animated, Appearance, Platform, StatusBar, StyleSheet } from 'react-native';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import theme from '../../res/theme';
import GV from '../../utils/GV';
import ProductMenuHeader from './components/ProductMenuHeader';
import ProductMenuScrollable from './components/ProductMenuScrollable';
import ScrollSpy from './components/scroll-spy';
import { stylesFunc } from './styles';
import { ProductDummyData, ProductDummyData1 } from './components/ProductDummyData';
import Text from '../../components/atoms/Text';

export default () => {
    const colors = theme.getTheme(GV.THEME_VALUES.JOVI, Appearance.getColorScheme() === "dark");
    const styles = stylesFunc(colors);

    React.useEffect(() => {
        if (Platform.OS === "android")
            StatusBar.setTranslucent(false)
    }, [])
    const animScroll = React.useRef(new Animated.Value(0)).current
    const [headerHeight, setHeaderHeight] = React.useState(380);


    const headerTextOpacity = animScroll.interpolate({
        inputRange: [0, 110],
        outputRange: [1, 0],
        extrapolate: "clamp"
    })



    const overlayTextOpacity = animScroll.interpolate({
        inputRange: [110, 200],
        outputRange: [0, 1],
        extrapolate: "clamp",
        useNativeDriver: true
    })

    const overlayHeight = animScroll.interpolate({
        inputRange: [110, 256],
        outputRange: [230, 60],
        extrapolate: "clamp",
        useNativeDriver: false
    })


    const headerTop = animScroll.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -50],
        extrapolate: "clamp",
        useNativeDriver: true
    })

    const tabTop = animScroll.interpolate({
        inputRange: [0, headerHeight],
        // outputRange: [305, 0],
        outputRange: [headerHeight, 0],
        extrapolate: "clamp",
        useNativeDriver: true
    })

    const textTranslate = animScroll.interpolate({
        inputRange: [180, 200],
        outputRange: [0, -10],
        extrapolate: "clamp",
        useNativeDriver: true
    })
    console.log(headerHeight);
    return (
        <>
            <View style={styles.primaryContainer}>
                <Animated.View style={{ ...StyleSheet.absoluteFill, transform:[{
                    translateY:headerTop
                }], zIndex: 9999, flex: 1 }}>
                    <ProductMenuHeader colors={colors}
                        onLayout={(e) => {
                            setHeaderHeight(e.nativeEvent.layout.height +20);
                        }}
                    />
                </Animated.View>

                <ScrollSpy
                    tabs={ProductDummyData1}
                    ÄnimatedScrollValue={animScroll}
                    topHeaderStyle={{ ...StyleSheet.absoluteFill, zIndex: 9999999999999999, height: 43, translateY: tabTop, backgroundColor: "white", elevation: 2, }}
                    itemsScrollViewStyle={{ ...StyleSheet.absoluteFill, top: -10, zIndex: 9999, backgroundColor: "transparent" }}
                    itemListPropertyName="dishes"
                    renderItem={dish => {
                        // const CART = findItemInCart(dish.id) || {}
                        return (
                            <View style={{ marginVertical: 30 }}>
                                <Text>{dish.name}</Text>
                            </View>
                        )
                    }}
                    renderAboveItems={() => (
                        <View style={{ marginTop: headerHeight, paddingHorizontal: 15, backgroundColor: "white", elevation: 2, paddingTop: 0 }}></View>
                    )}
                />


            </View>
        </>
    )
};//end of EXPORT DEFAULT
