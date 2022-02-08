import React, { useState, useRef } from 'react';
import { Easing, ScrollView, TouchableWithoutFeedback, StatusBar, View, StyleSheet, Text, Animated, Platform } from 'react-native'
import { uniqueKeyExtractor } from '../../../helpers/SharedActions';


const ScrollSpy = (props) => {
    const HEADER_HEIGHT = props?.headerHeight ?? 0;

    const value = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef("");
    const tabScrollRef = useRef("");
    const widthValue = useRef(new Animated.Value(0)).current;

    let tabs = useRef(props.data ? props.data : []);

    const currentTab = useRef(0);

    const [scrollBarScroll, setScrollBarScroll] = useState(true)

    const handleTab = (tabName, layout) => {
        layout.name = tabName;
        layout.anim = false;
        layout.id = new Date().getTime();

        if (widthValue._value === 0) {
            widthValue.setValue(layout.width);
        }

        let index = tabs.current.findIndex(stab => stab.name === tabName);
        let arr = tabs.current;
        if (index !== -1) {
            arr[index] = { ...arr[index], ...layout };
            tabs.current = arr;
        } else {
            tabs.current = [...tabs.current, layout];
        }
    }

    const handleTabContent = (name, layout) => {
        const index = tabs.current.findIndex(stab => `${stab.name}`.toLowerCase().trim() === `${name}`.toLowerCase().trim())
        if (index === -1) return

        const allTab = tabs.current;

        allTab[index].y = layout.y + HEADER_HEIGHT;
        allTab[index].height = layout.height;
        tabs.current = [...allTab];
    }

    const handleScroll = (name) => {
        const content = tabs.current.find(singleTab => singleTab.name === name)
        scrollRef.current.scrollTo({ y: content.y + 2 })
        setScrollBarScroll(false)
    }

    const handleOnScroll = e => {

        const scrollY = e.nativeEvent.contentOffset.y

        tabs.current.forEach((tab, i) => {

            if (scrollY > (tab.y + tab.height)) {
                const updatedTap = tabs.current;
                updatedTap[i].anim = false;
            }

            if (scrollY < 10) {
                tabScrollRef.current.scrollTo({ x: 0 });
                currentTab.current = 0;
            }

            if (scrollY > tab.y && scrollY < (tab.y + tab.height)) {

                if (tab.anim) return

                const scrollTo = tabs.current[i - 1] ? tabs.current[i - 1].x + tab.x : 0

                currentTab.current = i;

                Animated.timing(value, {
                    toValue: tab.x,
                    duration: 200,
                    easing: Easing.linear,
                    useNativeDriver: true
                }).start(() => {
                    const updatedTap = tabs.current
                    updatedTap[i].anim = true

                    if (scrollBarScroll)
                        setTimeout(() => tabScrollRef.current.scrollTo({ x: scrollTo }), 200)
                });

                Animated.timing(widthValue, {
                    toValue: tab.width,
                    duration: 100,
                    useNativeDriver: false
                }).start()
            }

            if (scrollY < tab.y) {

                if (tabs.current[i].anim) {
                    const updatedTap = tabs.current
                    updatedTap[i].anim = false
                }
            }
        })

    }


    return (
        <>

            <Animated.View style={[style.topHeaderStyle, props.topHeaderStyle && props.topHeaderStyle]}>
                <ScrollView
                    ref={tabScrollRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >

                    <View>
                        <View style={[style.row]}>
                            {props.data && props.data.map((food, i) => (
                                <TouchableWithoutFeedback
                                    key={uniqueKeyExtractor()}
                                    onPress={e => handleScroll(food.catagory)}
                                    onLayout={e => handleTab(food.catagory, e.nativeEvent.layout)}>
                                    <Text style={[style.tab]} >{food.catagory}</Text>
                                </TouchableWithoutFeedback>
                            ))}
                        </View>

                        <Animated.View style={[{ transform: [{ translateX: value }] }]}>
                            <Animated.View style={[style.indicator, { width: widthValue }]}></Animated.View>
                        </Animated.View>
                    </View>
                </ScrollView>
            </Animated.View>



            <Animated.ScrollView
                style={[props.itemsScrollViewStyle || {}]}
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: props.ÄnimatedScrollValue } } }],
                    { listener: handleOnScroll },
                )}
            >

                {props.renderAboveItems && props.renderAboveItems()}

                <View style={{ paddingHorizontal: 15, backgroundColor: "white" }}>
                    {props.data && props.data.map(food => {
                        return (
                            <View
                                onLayout={e => handleTabContent(food.catagory, e.nativeEvent.layout)}
                                key={uniqueKeyExtractor()}
                            >
                                <Text style={style.sectionTitle}>{food.catagory}</Text>
                                <View style={props.itemsContainerStyle || {}}>
                                    {food[props.itemListPropertyName].map(singleFood => {
                                        return <View key={uniqueKeyExtractor()}>
                                            {props.renderItem && props.renderItem(singleFood)}
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

export default React.memo(ScrollSpy);


const style = StyleSheet.create({
    topHeaderStyle: { paddingHorizontal: 15, backgroundColor: "white", elevation: 2 },
    indicator: {
        height: 3,
        backgroundColor: "#D70F64"
    },
    tab: {
        color: "grey",
        fontWeight: "bold",
        textTransform: "uppercase",
        padding: 10,
        marginRight: 10,
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

})