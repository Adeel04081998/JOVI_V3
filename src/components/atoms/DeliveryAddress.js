import React from "react";
import { StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import ReduxActions from "../../redux/actions";
import { initColors } from "../../res/colors";
import sharedStyles from "../../res/sharedStyles";
import Text from "./Text";
import TouchableScale from "./TouchableScale";
import View from "./View";

const pin_icon = () => `<svg xmlns="http://www.w3.org/2000/svg" width="14.948" height="20.99" viewBox="0 0 14.948 20.99">
<g id="Group_42147" data-name="Group 42147" transform="translate(1 1)">
  <path id="Icon_material-location-on" data-name="Icon material-location-on" d="M13.974,3A6.47,6.47,0,0,0,7.5,9.474C7.5,14.33,13.974,21.5,13.974,21.5s6.474-7.168,6.474-12.024A6.47,6.47,0,0,0,13.974,3Zm0,8.786a2.312,2.312,0,1,1,2.312-2.312A2.313,2.313,0,0,1,13.974,11.786Z" transform="translate(-7.5 -3)" fill="#fff" stroke="#6d51bb" stroke-width="2"/>
</g>
</svg>
`

const edit_icon = () => `<svg xmlns="http://www.w3.org/2000/svg" width="19.97" height="19.97" viewBox="0 0 19.97 19.97">
<g id="Icon_feather-edit" data-name="Icon feather-edit" transform="translate(0.76 0.76)">
  <path id="Path_9821" data-name="Path 9821" d="M11.252,6H4.834A1.834,1.834,0,0,0,3,7.834V20.671A1.834,1.834,0,0,0,4.834,22.5H17.671A1.834,1.834,0,0,0,19.5,20.671V14.252" transform="translate(-3 -4.055)" fill="none" stroke="#6d51bb" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.52"/>
  <path id="Path_9822" data-name="Path 9822" d="M21.628,3.388a1.945,1.945,0,0,1,2.751,2.751l-8.711,8.711L12,15.766l.917-3.668Z" transform="translate(-6.498 -2.818)" fill="none" stroke="#6d51bb" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.52"/>
</g>
</svg>
`

const BottomLine = () => (
    <View
        style={{
            borderBottomColor: '#0000001A',
            borderWidth: 0.5,
            marginVertical: 5,
        }}
    />
);
export default ({ instructions = "" }) => {
    const SPACING = 10;
    const ICON_HEIGHT = 20;
    const ICON_WIDTH = 20;
    const styles = _styles(colors);
    const colors = initColors;
    const userReducer = useSelector(store => store.userReducer);
    const dispatch = useDispatch();
    console.log("[DeliveryAddress].userReducer", userReducer);
    const finalDestination = userReducer.finalDestObj;
    return (
        <View
            style={{
                backgroundColor: colors.white,
                borderRadius: 10,
                padding: 5,
                ...sharedStyles._styles(colors).shadow,
                elevation: 3,
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', padding: SPACING }}>
                    <SvgXml xml={pin_icon()} height={ICON_HEIGHT} width={ICON_WIDTH} />
                    <Text
                        style={{
                            paddingHorizontal: 10,
                            color: colors.primary,
                            fontSize: 16,
                        }}
                        fontFamily="PoppinsSemiBold">
                        Delivery Address
            </Text>
                </View>
                <TouchableScale onPress={() => dispatch(
                    ReduxActions.setModalAction({
                        visible: true,
                    })
                )}>
                    <SvgXml xml={edit_icon()} height={20} width={20} />
                </TouchableScale>
            </View>

            <BottomLine />
            <View style={{ padding: SPACING - 5, paddingLeft: SPACING + 20 }}>
                <Text
                    style={{ color: colors.primary, fontSize: 14 }}
                    fontFamily="PoppinsSemiBold"
                    numberOfLines={1}>
                    {finalDestination.addressTypeStr}
                </Text>
                <Text style={{ color: colors.black, fontSize: 11 }} numberOfLines={2}>
                    {finalDestination.title}

                </Text>
            </View>
            {
                instructions ?
                    <>
                        <BottomLine />
                        <View style={{ padding: SPACING - 5, paddingLeft: SPACING + 20 }}>
                            <Text
                                style={{ color: colors.primary, fontSize: 14 }}
                                fontFamily="PoppinsSemiBold"
                                numberOfLines={1}>
                                Instruction for rider
          </Text>
                            <Text style={{ color: colors.black, fontSize: 11 }} numberOfLines={2}>
                                {instructions}
                            </Text>
                        </View>
                    </>
                    : null
            }
        </View>
    );
};


const _styles = (colors = initColors) => StyleSheet.create({
    bar: {
    },
    circle: {
    }
})