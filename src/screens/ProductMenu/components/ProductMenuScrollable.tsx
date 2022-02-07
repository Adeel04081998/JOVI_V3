import * as React from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import Text from "../../../components/atoms/Text";
import TouchableScale from "../../../components/atoms/TouchableScale";
import View from "../../../components/atoms/View";
import AnimatedFlatlist from "../../../components/molecules/AnimatedScrolls/AnimatedFlatlist";
import { mockData } from "../../../components/molecules/mockData";
import AppStyles from "../../../res/AppStyles";
import { initColors } from '../../../res/colors';
import constants from "../../../res/constants";
import { ProductDummyData } from "./ProductDummyData";

// #region :: INTERFACE START's FROM HERE 
type Props = React.ComponentProps<typeof Animated.View> & {
    children?: any;
    colors: typeof initColors;
};

const defaultProps = {

};
const WINDOW_WIDTH = constants.window_dimensions.width;
const WINDOW_HEIGHT = constants.window_dimensions.height;
const tabData = ProductDummyData;
const datadetail = mockData;
// #endregion :: INTERFACE END's FROM HERE 

const ProductMenuScrollable = (props: Props) => {
    const colors = props.colors;
    const styles = stylesFunc(colors);

    // #region :: STATE's & REF's START's FROM HERE 
    const [data, updateData] = React.useState(tabData);
    const [currentIndex, updateCurrentIndex] = React.useState(0);
    const scrollViewRef = React.useRef(null);
    // #endregion :: STATE's & REF's END's FROM HERE 

    const onScroll = ({ nativeEvent: { contentOffset: { y, x } } }: any) => {
        let _currentSection: number = -1;
        // loop sections to calculate which section scrollview is on
        // tabData.forEach((section) => {
        //     // adding 15 to calculate Text's height
        //     if ((y + 15) > tabData) _currentSection = section.id
        // })
        // settint the currentSection to the calculated current section
        console.log('_currentSection ', _currentSection);

        updateCurrentIndex(_currentSection);
    }

    const onItemLayout = ({ nativeEvent: { layout: { x, y, width, height } } }: any, index: any) => {
        // setting each items position
        // this.setState({ [section]: y });
        console.log('Y ', y);

    };
    return (
        <View style={styles.primaryContainer}>

            <View style={{
            }}>
                {/* <AnimatedFlatlist
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    //@ts-ignore
                    keyExtractor={(_: any, index: number) => `${index}`}
                    //@ts-ignore
                    renderItem={(item, index) => {
                        return (
                            <TouchableScale key={index} style={{
                                paddingHorizontal: 26,
                                paddingVertical: 12,
                                backgroundColor: index === currentIndex ? colors.primary : "#F2F1F6",
                                borderRadius: 30,
                                marginRight: 5,
                                borderColor: "#707070",
                                borderWidth: index === currentIndex ? 0 : 0.5,
                                marginLeft: index === 0 ? 12 : 0,
                            }}>
                                <Text style={{
                                    color: index === currentIndex ? colors.white : "#272727",
                                    fontSize: 12,
                                }}>{item.name}</Text>
                            </TouchableScale>
                        )
                    }} /> */}


                <ScrollView
                    style={{}}
                    ref={scrollViewRef}
                    scrollEventThrottle={100}
                    onScroll={onScroll}>
                    {datadetail.map((section: any, index: number) => {

                        return (
                            <View key={index}
                                onLayout={e => onItemLayout(e, index)}>
                                <Text>{`KEY is==> ${section.key}`}</Text>
                            </View>
                        )
                    })}
                </ScrollView>

            </View>

        </View >
    );
}

ProductMenuScrollable.defaultProps = defaultProps;
export default ProductMenuScrollable;


// #region :: STYLES START's FROM HERE 
const stylesFunc = (colors: typeof initColors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
    },
});//end of stylesFunc

// #endregion :: STYLES END's FROM HERE 