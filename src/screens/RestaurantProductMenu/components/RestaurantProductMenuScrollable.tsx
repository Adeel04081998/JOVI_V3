import React, { useRef } from "react";
import { Animated, Easing, FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StatusBar, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Text from "../../../components/atoms/Text";
import TouchableScale from "../../../components/atoms/TouchableScale";
import View from "../../../components/atoms/View";
import AnimatedFlatlist from "../../../components/molecules/AnimatedScrolls/AnimatedFlatlist";
import { sharedHandleInfinityScroll, uniqueKeyExtractor, VALIDATION_CHECK } from "../../../helpers/SharedActions";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";

// #region :: INTERFACE START's FROM HERE 
type Props = React.ComponentProps<typeof Animated.View> & {
    children?: any;
    colors: typeof initColors;

    data: any;
    headerHeight?: number;
    topHeaderStyle?: StyleProp<ViewStyle>;
    itemsScrollViewStyle?: StyleProp<ViewStyle>;
    animatedScrollValue: Animated.Value;
    renderAboveItems?: () => React.Component;
    itemsContainerStyle?: StyleProp<ViewStyle>;
    itemListPropertyName: string;
    renderItem?: (parentItem: any, item: any, parentIndex: number, index: number) => React.Component;
    renderSectionHeader?: (item: any, index: number) => React.Component;
};

const defaultProps = {
    headerHeight: 0,
    topHeaderStyle: {},
    itemsScrollViewStyle: {},
    renderSectionHeader: undefined,
};

// #endregion :: INTERFACE END's FROM HERE 

const INDICATOR_WIDTH_MINUS = 0.8;

const RestaurantProductMenuScrollable = (props: Props) => {
    const HEADER_HEIGHT = props?.headerHeight ?? defaultProps.headerHeight;
    const style = stylesFunc(props.colors);

    // #region :: State's & Ref's START's FROM HERE 
    const value = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef<ScrollView>(null);
    const tabScrollRef = useRef<ScrollView>(null);

    const widthValue = useRef<any>(new Animated.Value(0)).current;
    const tabCategory = useRef(new Animated.Value(1));

    let tabs = useRef(props.data ? props.data : []);
    const currentTabRef = React.useRef(props.data && props.data.length > 0 ? props.data[0] : {});
    // #endregion :: State's & Ref's END's FROM HERE 
    React.useEffect(() => {
        tabs.current = props.data;
    }, [props.data]);
    // #region :: HORIZONTAL LAYOUT HANDLER START's FROM HERE 
    const handleTab = (categoryID: any, tabName: any, layout: any) => {
        layout.categoryID = categoryID;
        layout.name = tabName;
        layout.anim = false;
        layout.id = new Date().getTime();
        if (widthValue._value === 0) {
            widthValue.setValue(layout.width * INDICATOR_WIDTH_MINUS);
        }

        let index = tabs.current.findIndex((stab: any) => stab.categoryID === categoryID);
        let arr = tabs.current;
        if (index !== -1) {
            arr[index] = { ...arr[index], ...layout };
            tabs.current = arr;
        } else {
            tabs.current = [...tabs.current, layout];
        }
    }
    // #endregion :: HORIZONTAL LAYOUT HANDLER END's FROM HERE 

    // #region :: VERTICAL LAYOUT HANDLER START's FROM HERE 
    const handleTabContent = (categoryID: any, name: any, layout: any) => {
        const index = tabs.current.findIndex((stab: any) => stab.categoryID === categoryID)
        // console.log('tabName','---',layout.yy ,'--');
        if (index === -1) return

        const allTab = tabs.current;

        allTab[index].y = layout.y + HEADER_HEIGHT;
        allTab[index].yy = layout.yy + HEADER_HEIGHT;

        allTab[index].height = layout.height;
        tabs.current = [...allTab];
    }
    // #endregion :: VERTICAL LAYOUT HANDLER END's FROM HERE 

    // #region :: ON HORIZONTAL ITEM PRESS  START's FROM HERE 
    const handleScroll = (categoryID: any, name: any) => {
        const content = tabs.current.find((singleTab: any) => singleTab.categoryID === categoryID);
        currentTabRef.current = content;
        scrollRef.current && scrollRef.current.scrollTo({ y: content.yy + 2 })

        Animated.timing(value, {
            toValue: content.x,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();

        Animated.timing(widthValue, {
            toValue: content.width * INDICATOR_WIDTH_MINUS,
            duration: 100,
            useNativeDriver: false
        }).start()

    }

    // #endregion :: ON HORIZONTAL ITEM PRESS  END's FROM HERE 

    // #region :: ON VERTICAL SCROLL START's FROM HERE 
    const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {

        const scrollY = e.nativeEvent.contentOffset.y
        let updatedTap = tabs.current;
        const endReached = sharedHandleInfinityScroll(e);
        const currentTabAnimation = (tab: any, i: any) => {
            if (tab.anim) return
            currentTabRef.current = tab;
            const scrollTo = tabs.current[i > 0 ? i - 1 : 0].x;// Platform.OS === "ios" ? tab.x : tabs.current[i - 1] ? tabs.current[i - 1].x + tab.x : 0

            Animated.timing(value, {
                toValue: tab.x,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: true
            }).start(() => {
                updatedTap[i].anim = true

                setTimeout(() => tabScrollRef.current && tabScrollRef.current.scrollTo({ x: scrollTo }), 200)
            });
            Animated.timing(tabCategory.current, {
                toValue: 2,
                duration: 100,
                useNativeDriver: true
            }).start();
            Animated.timing(widthValue, {
                toValue: tab.width - INDICATOR_WIDTH_MINUS,
                duration: 100,
                useNativeDriver: false
            }).start()
        }
        if (endReached) {
            currentTabAnimation(tabs?.current[tabs?.current?.length - 1], tabs?.current?.length - 1);
            return;
        }
        tabs.current.forEach((tab: any, i: number) => {

            if (!("height" in tab)) {
                tabs.current.splice(i, 1);
                return
            }

            if (scrollY < 10) {
                tabScrollRef.current && tabScrollRef.current.scrollTo({ x: 0 });
            }

            if (scrollY > (tab.yy + tab.height)) {
                updatedTap[i].anim = false;
            }

            if (scrollY > tab.yy && scrollY < (tab.yy + tab.height)) {

                currentTabAnimation(tab, i);


            }

            if (scrollY < tab.yy) {
                if (tabs.current[i].anim) {
                    updatedTap[i].anim = false
                }
            }
        })

    }
    // #endregion :: ON VERTICAL SCROLL END's FROM HERE 
    const RenderTopNavigation = () => {
        const [currentTabState, setCurrentTabState] = React.useState(props.data ? props.data[0] : {});
        React.useEffect(() => {
            if (Object.keys(currentTabState ?? {}).length === 0 && props.data.length > 0) {
                setCurrentTabState(props.data[0]);
            }
        }, [props.data]);
        return (
            <View>
                <View style={[style.row]}>
                    {props.data && props.data.map((food: any, i: number) => (
                        <TouchableScale
                            key={uniqueKeyExtractor()}
                            onPress={e => handleScroll(food.categoryID, food.categoryName)}
                            onLayout={e => handleTab(food.categoryID, food.categoryName, e.nativeEvent.layout)}
                            style={{
                                backgroundColor: "#F2F1F6",
                                borderWidth: 0.2,
                                // borderColor: "#F2F1F6",
                                borderColor: "#707070",
                                marginRight: 6,
                                borderRadius: 26,
                            }}
                        >
                            <Text style={[style.tab, {
                            }]} >{food.categoryName}</Text>
                        </TouchableScale>
                    ))}
                </View>
                <Animated.View style={[{
                    transform: [{ translateX: value }],
                }]}>
                    <Animated.View onLayout={() => {
                        if (currentTabRef.current?.name) {
                            setCurrentTabState(currentTabRef.current);
                        }
                    }} style={[style.indicator, {
                        width: widthValue,
                        height: 45,
                        borderRadius: 26,
                        top: -44,
                        // overflow: "hidden",
                    }]}>
                        <Text style={[style.tab, {
                            color: 'white'
                        }]} >{currentTabState?.categoryName ?? currentTabState?.name}</Text>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
    return (
        <>
            <Animated.View style={[style.topHeaderStyle, props.topHeaderStyle]}>
                <ScrollView
                    ref={tabScrollRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>


                    <RenderTopNavigation />

                    {/* <Animated.View style={[{
                            transform: [{ translateX: value }],

                        }]}>
                            <Animated.View style={[style.indicator, {
                                width: widthValue,
                                left: widthValue._value * 0.15,
                                // marginRight: widthValue._value * 0.5,
                                overflow: "hidden",
                                alignItems: "center",
                                justifyContent: "center",
                            }]}>
                            </Animated.View>
                        </Animated.View> */}

                </ScrollView>
            </Animated.View>



            <Animated.ScrollView
                style={[props.itemsScrollViewStyle || {}]}
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: props.animatedScrollValue } } }],
                    //@ts-ignore
                    { listener: handleOnScroll, },
                )}
                contentContainerStyle={{ paddingBottom: 60 }}>

                {props.renderAboveItems && props.renderAboveItems()}

                <View style={{ paddingHorizontal: 0, backgroundColor: "white" }}>
                    {props.data && props.data.map((food: any, parentIndex: number) => {
                        return (
                            <View
                                onLayout={e => handleTabContent(food.categoryID, food.categoryName, { ...e.nativeEvent.layout, yy: e.nativeEvent.layout.y, xx: e.nativeEvent.layout.x })}
                                key={uniqueKeyExtractor()}>
                                {VALIDATION_CHECK(props.renderSectionHeader) ?
                                    props.renderSectionHeader && props.renderSectionHeader(food, parentIndex)
                                    :
                                    <Text style={style.sectionTitle}>{food.categoryName}</Text>
                                }
                                <View style={props.itemsContainerStyle || {}}>
                                    {(food?.isTopDeal ?? false) ?
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            {food[props.itemListPropertyName].map((singleFood: any, index: number) => {
                                                return <View key={uniqueKeyExtractor()}>
                                                    {props.renderItem && props.renderItem(food, singleFood, parentIndex, index)}
                                                </View>
                                            })}
                                        </ScrollView>
                                        :
                                        food[props.itemListPropertyName].map((singleFood: any, index: number) => {
                                            return <View key={uniqueKeyExtractor()}>
                                                {props.renderItem && props.renderItem(food, singleFood, parentIndex, index)}
                                            </View>
                                        })}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </Animated.ScrollView>

        </>
    )
}

RestaurantProductMenuScrollable.defaultProps = defaultProps;
export default React.memo(RestaurantProductMenuScrollable);

// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    topHeaderStyle: {
        backgroundColor: "transparent",
        zIndex: 99999999999,
    },
    indicator: {
        height: 3,
        backgroundColor: colors?.primary ?? "#D70F64",
    },
    tab: {
        color: "#272727",
        fontSize: 12,
        textAlign: "center",
        paddingVertical: 12,
        paddingHorizontal: 26,

        // color: "grey",
        // fontWeight: "bold",
        // textTransform: "uppercase",
        // padding: 10,
        // marginRight: 10,
        overflow: "hidden",
    },
    row: {
        display: "flex",
        flexDirection: "row",

    },
    sectionContainer: {
        paddingHorizontal: 15,
        flex: 1,
        backgroundColor: "white"
    },
    sectionTitle: {
        fontSize: 25,
        marginVertical: 20,
    },
});//end of stylesFunc

// #endregion :: STYLES END's FROM HERE 