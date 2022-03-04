/******************************************* MISSING POINTS **********************************/
// * Item status from backend upon add/update cart
// * Get Service charges from server on swapped array

import React from 'react';
import { Appearance } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from '../../../libs/react-native-keyboard-aware-scroll-view';
import DeliveryAddress from "../../components/atoms/DeliveryAddress";
import Image from '../../components/atoms/Image';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import SetpProgress from '../../components/atoms/StepProgress';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableScale from '../../components/atoms/TouchableScale';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import DraggableFlatList from '../../components/molecules/DraggableFlatList';
import DashedLine from '../../components/organisms/DashedLine';
import { renderFile, renderPrice, sharedAddUpdatePitstop, sharedConfirmationAlert } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import ReduxActions from '../../redux/actions';
import constants from '../../res/constants';
import sharedStyles from '../../res/sharedStyles';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';
import ProductQuantityCard from '../ProductMenu/components/ProductQuantityCard';
import stylesheet from './styles';
import { pencil_icon, percent_icon, routes_icon } from './svgs/cart_svgs';
const BottomLine = () => (
  <View
    style={{
      borderBottomColor: '#0000001A',
      borderWidth: 0.5,
      marginVertical: 5,
    }}
  />
);
// const DashedLines = () => {
//   return <View style={{ flexDirection: "row", overflow: "hidden" }}>
//     {Array(200).fill("-").map((line, idx) => <Text style={{ color: initColors.grey }}>{line}</Text>)}
//   </View>

// }
export default () => {
  const cartReducer = useSelector(store => store.cartReducer);
  const dispatch = useDispatch();
  console.log('[CART_SCREEN] cartReducer', cartReducer);
  const [expanded, setExpanded] = React.useState([0]);
  const [data, setData] = React.useState([...cartReducer.pitstops])
  const colors = theme.getTheme(
    GV.THEME_VALUES.DEFAULT,
    Appearance.getColorScheme() === 'dark',
  );
  const cartStyles = stylesheet.styles(colors);
  React.useEffect(() => {
    // sharedGetServiceCharges()
  }, [])
  const incDecDelHandler = (pitstopDetails, pitstopIndex = null, isDeletePitstop = false) => {
    sharedAddUpdatePitstop({ ...pitstopDetails }, isDeletePitstop, [], false, true);
  };
  const expandCollapeHanlder = (idx) => {
    let _list = [...expanded];
    const _idx = _list.findIndex(_num => _num === idx);
    if (_idx >= 0) _list = _list.filter(i => i !== idx);
    else _list.push(idx);
    setExpanded(_list)
  }
  const PitstopsCard = ({ pitstop }) => {
    const {
      pitstopIndex, // from cart pitstops
      pitstopID, // from cart pitstops
      pitstopName, // fill from component and got from cart iteration
      pitstopType, // fill from component and got from cart iteration
      checkOutItemsListVM, //fill from component and got from cart's pitstops nesting iteration
    } = pitstop;
    const dynamiColors = theme.getTheme(pitstopType);
    const isJOVI = pitstopType === PITSTOP_TYPES.JOVI;
    const viewToRender = () => {
      if (isJOVI) return <>
        <View
          style={{
            borderBottomColor: colors.grey,
            borderWidth: 0.2,
            marginVertical: 5,
            borderColor: colors.grey,
          }}
        />
        <Products
          key={`jovi-product-key`}
          dynamiColors={dynamiColors}
          isJOVI={isJOVI}
          product={{ ...pitstop, pitstopType }}
        />
      </>
      else return (checkOutItemsListVM || []).map((product, idx) => (
        // else return ([...checkOutItemsListVM, ...checkOutItemsListVM, ...checkOutItemsListVM, ...checkOutItemsListVM,] || []).map((product, idx) => (
        <>

          {
            idx === 0 &&
            <BottomLine />
          }
          <Products
            key={`product-key-${idx}`}
            dynamiColors={dynamiColors}
            isJOVI={isJOVI}
            product={{ ...product, title: product.title || product.pitStopItemName, pitstopType }}
            incDecDelHandler={quantity => {
              incDecDelHandler({
                // pitstopIndex,
                vendorDetails: {
                  actionKey: "pitstopID",
                  pitstopID,
                  pitstopName,
                  pitstopType,
                },
                itemDetails: { ...product, actionKey: "checkOutItemID", productIndex: idx, quantity },
              });
            }}
          />
          {
            idx === checkOutItemsListVM.length - 1 ? null : <DashedLine />
          }

        </>
      ))
    }
    const onStorePress = () => {
      const routes = {
        4: ROUTES.APP_DRAWER_ROUTES.RestaurantProductMenu.screen_name,
        1: ROUTES.APP_DRAWER_ROUTES.ProductMenu.screen_name,
        2: ROUTES.APP_DRAWER_ROUTES.JoviJob.screen_name,
      }
      NavigationService.NavigationActions.common_actions.navigate(routes[pitstopType], { ...pitstop, pitstopType });
    }
    return (
      <View
        style={{
          backgroundColor: dynamiColors.white,
          borderRadius: 7,
          margin: 5,
          ...sharedStyles._styles(dynamiColors).shadow,
          elevation: 3,
        }}
      // onPress={() => expandCollapeHanlder(pitstopIndex)}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "center",
            padding: 5,

          }}>
          <View style={{ flexDirection: 'row', maxWidth: "60%" }}>
            <View>
              <Text
                style={{ color: dynamiColors.primary, fontSize: 17 }}
                fontFamily="PoppinsBold"
                numberOfLines={1}
              >
                {pitstopName}
              </Text>
              <TouchableScale style={{ paddingTop: 2, maxWidth: 100 }} onPress={onStorePress}>
                <Text
                  style={{ color: dynamiColors.black, fontSize: 12 }}
                  fontFamily="PoppinsRegular">{`Back to ${isJOVI ? 'Jovi Job' : 'Store'
                    }`}
                </Text>
              </TouchableScale>
            </View>
            {!isJOVI && (
              <SvgXml
                xml={percent_icon(dynamiColors.primary)}
                height={15}
                width={15}
                style={{ margin: 5 }}
              />
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: "40%" }}>
            <TouchableScale onPress={() => {
              sharedConfirmationAlert(
                "Alert!", "Are you sure you want to clear the pitstop?",
                [
                  {
                    text: "No",
                    onPress: () => { }
                  },
                  {
                    text: "Yes",
                    onPress: () => sharedAddUpdatePitstop({ pitstopIndex, pitstopType }, true, [], false, false, () => {
                      if ((cartReducer.pitstops.length - 1) <= 0) {
                        NavigationService.NavigationActions.common_actions.goBack()
                      } else {

                      }
                    })
                  },
                ]
              )
            }} >
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontSize: 12,
                  color: dynamiColors.grey,
                }}
                fontFamily="PoppinsRegular">
                Clear pitstop
              </Text>
            </TouchableScale>

            <TouchableScale
              style={{
                height: 30,
                width: 30,
                borderRadius: 7,
                borderWidth: 0.5,
                borderColor: '#fff',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: .7,
              }}
              onPress={() => expandCollapeHanlder(pitstopIndex)}
            >
              <VectorIcon
                type="AntDesign"
                name={expanded.includes(pitstopIndex) ? "down" : "up"}
                color={dynamiColors.primary}
                size={20}
              />
            </TouchableScale>
          </View>
        </View>
        {expanded.includes(pitstopIndex) ? viewToRender() : null}
      </View>
    );
  };
  const Products = ({
    dynamiColors = colors,
    isJOVI = false,
    product,
    incDecDelHandler,
  }) => {
    const { title, estimatePrice, description, discountedPrice, notes, images, _itemPriceWithoutDiscount, _totalDiscount, _itemPrice, quantity, pitstopType } = product;
    if (isJOVI) {
      return <View style={{ flexDirection: 'row' }}>
        <View style={{ height: 70, width: 70, borderRadius: 10, margin: 5 }}>
          <Image
            source={require('./assets/jovi.png')}
            style={{ height: 70, width: 70, borderRadius: 10 }}
          />
        </View>
        <View style={{ flex: 1, margin: 5 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              // margin: 5,
            }}>
            <Text
              style={{ color: dynamiColors.black, fontSize: 14, textAlign: "left", width: "90%" }}
              fontFamily="PoppinsBold"
              numberOfLines={3}
            >
              {title}
            </Text>
            <TouchableScale style={{ width: "10%" }}>
              <SvgXml xml={pencil_icon()} height={25} width={16} />
            </TouchableScale>
          </View>
          <Text
            style={{ color: dynamiColors.black, fontSize: 10 }}
            fontFamily="PoppinsRegular">
            {description}
          </Text>
          <Text
            style={{ color: dynamiColors.primary, fontSize: 12 }}
            fontFamily="PoppinsMedium">
            {renderPrice(estimatePrice || 0)}
          </Text>
        </View>
      </View>
    } else {
      const IS_DISCOUNTED = _totalDiscount > 0;
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ height: 70, width: 70, borderRadius: 10, margin: 10 }}>
            <Image
              source={{ uri: renderFile(images[0].joviImageThumbnail) }}
              style={{ height: 70, width: 70, borderRadius: 10 }}
            />
          </View>
          <View style={{ flex: 1, margin: 5 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // margin: 5,
              }}>
              <View style={{ flexDirection: 'row', width: "80%" }}>
                <Text
                  style={{ color: dynamiColors.black, fontSize: 14 }}
                  fontFamily="PoppinsBold"
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {
                  IS_DISCOUNTED &&
                  <SvgXml
                    xml={percent_icon(dynamiColors.primary)}
                    height={15}
                    width={15}
                    style={{ marginHorizontal: 5, width: "10%", top: 5 }}
                  />
                }

              </View>
              <TouchableScale style={{ width: "10%" }}>
                <SvgXml xml={pencil_icon()} height={25} width={16} />
              </TouchableScale>
            </View>

            <Text style={{ color: colors.black, fontSize: 12 }} numberOfLines={1}>
              {
                pitstopType === PITSTOP_TYPES.RESTAURANT ? product?.selectedOptions?.map(obj => obj.tittle).join(", ") : description
              }
            </Text>
            <Text
              numberOfLines={1}
              style={{ textAlign: 'left', color: '#6B6B6B', fontSize: 10 }}
              fontFamily="PoppinsLight">
              {notes}
            </Text>
            <View
              style={{
                paddingVertical: 10
              }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ color: dynamiColors.primary, fontSize: 12 }}
                  fontFamily="PoppinsMedium">
                  {renderPrice(_itemPrice ?? discountedPrice)}
                </Text>
                {
                  IS_DISCOUNTED &&
                  <Text
                    style={{ color: dynamiColors.grey, fontSize: 10, textDecorationLine: "line-through", paddingHorizontal: 5 }}
                    fontFamily="PoppinsMedium">
                    {renderPrice(_itemPriceWithoutDiscount)}
                  </Text>
                }
              </View>
              <ProductQuantityCard
                size={100}
                initialQuantity={quantity}
                colors={dynamiColors}
                updateQuantity={(quantity) => {
                  incDecDelHandler(quantity)
                }}

              />
            </View>
          </View>
        </View>
      );
    }
  };
  const Totals = () => {
    const { subTotal, discount, serviceCharges, total } = cartReducer;
    const row = (caption = '', value = 0, isBold = false) => {
      if (value) {
        return <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text fontFamily={isBold ? 'PoppinsBold' : 'PoppinsLight'}>
            {caption}
          </Text>
          <Text
            fontFamily={
              isBold ? 'PoppinsBold' : 'PoppinsLight'
            }>{renderPrice(value)}</Text>
        </View>
      } else return null;
    };
    return (
      <View style={{}}>
        {row('Subtotal', subTotal, true)}
        {row('Discount', discount)}
        {row('Service Charges', serviceCharges)}
        <BottomLine />
        {row('Total', total, true)}
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        rightIconName='home'
        rightIconColor={colors.primary}
        leftIconName="arrow-back"
        title="Jovi Cart"
        containerStyle={{
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 0,
          // borderBottomColor: ,
        }}
      />
      <View style={{ top: -10 }}>
        <SetpProgress maxHighlight={2} />
      </View>
      <KeyboardAwareScrollView contentContainerStyle={{ padding: 10 }} nestedScrollEnabled style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 0 }}>
          <DeliveryAddress />
          <Text style={{ padding: 10, fontSize: 12 }} fontFamily="PoppinsLight">{'Hold and drag to rearrange your pitstops to get the better route and less service charges.'}</Text>
          {/* <FlatList
            keyExtractor={(index) => `index-${index}`}
            data={data}
            renderItem={({ item, index }) => <PitstopsCard
              key={`pit-key${index}`}
              pitstop={{ ...item, pitstopIndex: index }}
            />
            }
          /> */}
          <DraggableFlatList
            data={data}
            renderItem={({ item, index }) => <PitstopsCard
              key={`pit-key${index}`}
              pitstop={{ ...item, pitstopIndex: index }}
            />
            }
            updateData={(newData) => {
              setData(newData);
              // setExpanded([])
              // sharedAddUpdatePitstop(null, false, newData)
            }}
            style={{ maxHeight: constants.screen_dimensions.height * 0.40}}
          />
        </View>
        <TouchableScale
          style={{
            marginVertical: 5,
            padding: 10,
            borderRadius: 8,
            backgroundColor: colors.primary,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.SharedMapView.screen_name)}
        >
          <SvgXml xml={routes_icon()} height={20} width={20} color="#fff" />
          <Text style={{ color: '#fff', paddingHorizontal: 5 }}>
            Check route on map
          </Text>
        </TouchableScale>

        <TouchableScale
          style={{
            marginVertical: 5,
            padding: 10,
            borderRadius: 20,
            backgroundColor: colors.white,
            alignSelf: 'center',
            alignItems: 'center',
            borderColor: colors.primary,
            borderWidth: 1,
          }}
          onPress={() => {
            sharedConfirmationAlert(
              "Alert!", "Are you sure you want to clear entire cart?",
              [
                {
                  text: "No",
                  onPress: () => { }
                },
                {
                  text: "Yes",
                  onPress: () => {
                    dispatch(ReduxActions.clearCartAction({ pitstops: [] }));
                    NavigationService.NavigationActions.common_actions.goBack();
                  }
                },
              ],
              { cancelable: false }
            )
          }}
        >
          <Text style={{ color: colors.primary, paddingHorizontal: 5 }}>
            Empty entire jovi cart
          </Text>
        </TouchableScale>
        <TextInput
          placeholder="Want to add instructions for your rider?"
          placeholderTextColor={colors.grey}
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: colors.grey,
            borderWidth: 0.5,
            borderRadius: 7,
          }}
          onChangeText={text => GV.RIDER_INSTRUCTIONS.current = text.trim()}
        />
        <Totals />
      </KeyboardAwareScrollView>
      <View style={{ backgroundColor: colors.white, paddingVertical: 10, alignItems: "center", justifyContent: "center", }}>
        <View style={{ flexDirection: 'row', marginHorizontal: 10, }}>
          {['Add Pitstop', 'Checkout'].map((title, idx) => (
            <TouchableScale
              key={title}
              style={{
                flex: 1,
                paddingVertical: 10,
                backgroundColor: colors.primary,
                borderRadius: 10,
                marginHorizontal: 5,
              }}
              onPress={() => {
                NavigationService.NavigationActions.common_actions.navigate(idx > 0 ? ROUTES.APP_DRAWER_ROUTES.CheckOut.screen_name : ROUTES.APP_DRAWER_ROUTES.Home.screen_name)
              }}
            >
              <Text style={{ textAlign: 'center', color: colors.white }}>
                {title}
              </Text>
            </TouchableScale>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
