import * as React from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { renderPrice } from "../../helpers/SharedActions";
import AppStyles from "../../res/AppStyles";
import { initColors } from "../../res/colors";
import Text from "../atoms/Text";
import TouchableScale from "../atoms/TouchableScale";
import View from "../atoms/View";

interface Props {
    children?: any;
    colors: typeof initColors;
}



const defaultProps = {};

const RecentOrder = (props: Props) => {

    const colors = props.colors;
    const recentOrderStyles = recentOrderStylesFunc(colors);

    return (
        <View style={{
            zIndex: 9999999999999999,
        }}>
            <Text fontFamily="PoppinsMedium" style={recentOrderStyles.heading}>{`Recent orders`}</Text>

            <ScrollView
                horizontal
                style={{
                    // ...recentOrderStyles.scrollView,
                    // maxHeight: "auto",
                    // flexGrow: 0,
                    zIndex: 99999999,
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {new Array(10).fill({}).map((item, index) => {
                    return (
                        <View key={index} style={{
                            ...recentOrderStyles.primaryContainer,
                            marginLeft: index === 0 ? 10 : 2,
                        }}>
                            <Text fontFamily="PoppinsMedium" style={recentOrderStyles.title}>{`Beef Patty Burger`}</Text>
                            <Text style={recentOrderStyles.description}>{`2 More Products`}</Text>

                            <View style={recentOrderStyles.priceReorderContainer}>
                                <Text fontFamily="PoppinsMedium" style={recentOrderStyles.price}>{renderPrice(`Rs. 750`)}</Text>

                                <TouchableScale style={recentOrderStyles.reorderContainer}>
                                    <Text style={recentOrderStyles.reorderText}>{`Reorder`}</Text>
                                </TouchableScale>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    );
}//end of FUNCTION

RecentOrder.defaultProps = defaultProps;
export default RecentOrder;

const recentOrderStylesFunc = (colors: typeof initColors) => StyleSheet.create({
    heading: {
        color: "#1D1D1D",
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    reorderText: {
        color: colors.primary,
        fontSize: 12,
    },
    reorderContainer: {
        borderWidth: 1,
        borderColor: colors.primary,
        // paddingHorizontal: 10,
        // paddingVertical: 4,
        height: 25,
        width: 70,
        borderRadius: 25,
        marginLeft: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    price: {
        color: colors.primary,
        fontSize: 12,
    },
    priceReorderContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    description: {
        color: "#C1C1C1",
        fontSize: 10,
    },
    title: {
        color: "#272727",
        fontSize: 14,
    },
    primaryContainer: {
        padding: 10,
        backgroundColor: colors.white,
        marginBottom: 10,
        marginRight: 10,
        marginTop: 2,
        ...AppStyles.shadow,
        ...AppStyles.borderRadius,
    },
    scrollView: {
        flexGrow: 0,
        flex: 0,
    },

});//end of recentOrderStylesFunc