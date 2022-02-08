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
        outputRange: [0, -(headerHeight + 20)],
        extrapolate: "clamp",
        useNativeDriver: true
    })

    const tabTop = animScroll.interpolate({
        inputRange: [0, headerHeight + 20],
        // outputRange: [305, 0],
        outputRange: [headerHeight + 20, 0],
        extrapolate: "clamp",
        useNativeDriver: true
    })

    const textTranslate = animScroll.interpolate({
        inputRange: [180, 200],
        outputRange: [0, -10],
        extrapolate: "clamp",
        useNativeDriver: true
    })
    return (
        <>
            <StatusBar backgroundColor={"#fff"} />
            <View style={styles.primaryContainer}>
                <Animated.View style={{
                    ...StyleSheet.absoluteFill, transform: [{
                        translateY: headerTop
                    }], zIndex: 9999, flex: 1
                }}>
                    <ProductMenuHeader colors={colors}
                        onLayout={(e) => {
                            setHeaderHeight(e.nativeEvent.layout.height + 20);
                        }}
                    />
                </Animated.View>

                <ScrollSpy
                    data={[...ProductDummyData1,]}
                    headerHeight={headerHeight}
                    ÄnimatedScrollValue={animScroll}
                    topHeaderStyle={{
                        ...StyleSheet.absoluteFill, zIndex: 9999999999999999,
                        height: 50,
                        transform: [{
                            translateY: tabTop
                        }], backgroundColor: "white", elevation: 2,
                    }}
                    itemsScrollViewStyle={{ ...StyleSheet.absoluteFill, top: 0, zIndex: 9999, backgroundColor: "transparent" }}
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
                        <View style={{ marginTop: headerHeight + 50, paddingHorizontal: 15, backgroundColor: "white", elevation: 2, paddingTop: 0 }}></View>
                    )}
                />


            </View>
        </>
    )
};//end of EXPORT DEFAULT
