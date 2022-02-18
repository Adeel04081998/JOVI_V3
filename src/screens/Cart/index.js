import React from 'react';
import { Appearance, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import svgs from '../../assets/svgs';
import Image from '../../components/atoms/Image';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text';
import TextInput from '../../components/atoms/TextInput';
import TouchableScale from '../../components/atoms/TouchableScale';
import VectorIcon from '../../components/atoms/VectorIcon';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import { renderFile, renderPrice, sharedAddUpdatePitstop, sharedGetServiceCharges } from '../../helpers/SharedActions';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import sharedStyles from '../../res/sharedStyles';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES } from '../../utils/GV';
import SetpProgress from '../../components/atoms/StepProgress';
import stylesheet from './styles';
import { pencil_icon, percent_icon } from './svgs/cart_svgs';
import DeliveryAddress from "../../components/atoms/DeliveryAddress";
import colors, { initColors } from '../../res/colors';
import ReduxActions from '../../redux/actions';

const BottomLine = () => (
  <View
    style={{
      borderBottomColor: '#0000001A',
      borderWidth: 0.5,
      marginVertical: 5,
    }}
  />
);
const DashedLines = () => {
  return <View style={{ flexDirection: "row", overflow: "hidden" }}>
    {Array(1000).fill("-").map((line, idx) => <Text style={{ color: initColors.grey }}>{line}</Text>)}
  </View>

}
export default () => {
  const cartReducer = useSelector(store => store.cartReducer);
  const dispatch = useDispatch();
  console.log('[CART_SCREEN] cartReducer', cartReducer);
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
    return (
      <View
        style={{
          backgroundColor: dynamiColors.white,
          borderRadius: 10,
          margin: 5,
          ...sharedStyles._styles(dynamiColors).shadow,
          elevation: 3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text
                style={{ color: dynamiColors.primary, fontSize: 17 }}
                fontFamily="PoppinsBold">
                {pitstopName}
              </Text>
              <Text
                style={{ color: dynamiColors.black, fontSize: 12 }}
                fontFamily="PoppinsRegular">{`Back to ${isJOVI ? 'Jovi Job' : 'Store'
                  }`}</Text>
            </View>
            {!isJOVI && (
              <SvgXml
                xml={percent_icon(dynamiColors.primary)}
                height={20}
                width={20}
                style={{ marginHorizontal: 10 }}
              />
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableScale onPress={() => {
              sharedAddUpdatePitstop({ pitstopIndex, pitstopType }, true)
            }} >
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontSize: 10,
                  color: dynamiColors.grey,
                }}
                fontFamily="PoppinsRegular">
                Clear pitstop
            </Text>
            </TouchableScale>

            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 7,
                borderWidth: 0.5,
                borderColor: '#C1C1C1',
                backgroundColor: '#C1C1C1',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: .7,
              }}>
              <VectorIcon
                type="AntDesign"
                name="up"
                color={dynamiColors.primary}
                size={20}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#000',
            borderWidth: 0.2,
            marginVertical: 5,
            borderColor: colors.grey,
          }}
        />
        {
          isJOVI ? <Products
            key={`jovi-product-key`}
            dynamiColors={dynamiColors}
            isJOVI={isJOVI}
            product={pitstop}
          />
            :
            (checkOutItemsListVM || []).map((product, idx) => (
              <>
                <Products
                  key={`product-key-${idx}`}
                  dynamiColors={dynamiColors}
                  isJOVI={isJOVI}
                  product={{ ...product, title: product.title || product.pitStopItemName, price: product.discountedPrice || product.gstAddedPrice || product.price }}
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
                  idx === checkOutItemsListVM.length - 1 ? null : <DashedLines />
                }

              </>
            ))
        }
      </View>
    );
  };
  const Products = ({
    dynamiColors = colors,
    isJOVI = false,
    product,
    incDecDelHandler,
  }) => {
    const { title, description, images,_itemPriceWithoutDiscount, _totalDiscount,_itemPrice, quantity } = product;
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
              style={{ color: dynamiColors.black, fontSize: 14 }}
              fontFamily="PoppinsBold">
              {title}
            </Text>
            <TouchableScale style={{ paddingRight: 5 }}>
              <SvgXml xml={pencil_icon()} height={20} width={12} />
            </TouchableScale>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{ color: dynamiColors.primary, fontSize: 12 }}
                fontFamily="PoppinsMedium">
                {renderPrice(price)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    } else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ height: 70, width: 70, borderRadius: 10, margin: 5 }}>
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
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{ color: dynamiColors.black, fontSize: 14 }}
                  fontFamily="PoppinsBold">
                  {title}
                </Text>

                <SvgXml
                  xml={percent_icon(dynamiColors.primary)}
                  height={20}
                  width={20}
                  style={{ marginHorizontal: 10 }}
                />
              </View>
              <TouchableScale style={{ paddingRight: 5 }}>
                <SvgXml xml={pencil_icon()} height={22} width={14} />
              </TouchableScale>
            </View>
            <View>
              <Text
                numberOfLines={1}
                style={{ textAlign: 'left', color: '#6B6B6B', fontSize: 12 }}
                fontFamily="PoppinsLight">
                {notes}
              </Text>
            </View>
            <Text style={{ color: colors.grey }} numberOfLines={1}>
              {
                product?.selectedOptions?.map(obj => obj.tittle).join(",")
              }
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{ color: dynamiColors.primary, fontSize: 12 }}
                  fontFamily="PoppinsMedium">
                  {renderPrice(_itemPrice)}
                </Text>
                {
                  _totalDiscount > 0 &&
                  <Text
                    style={{ color: dynamiColors.grey, fontSize: 12, textDecorationLine: "line-through" }}
                    fontFamily="PoppinsMedium">
                    {renderPrice(_itemPriceWithoutDiscount)}
                  </Text>
                }
              </View>
              <IncDec
                quantity={quantity}
                incDecDelHandler={quantity => incDecDelHandler(quantity)}
                dynamiColors={dynamiColors}
              />
            </View>
          </View>
        </View>
      );
    }
  };
  const IncDec = ({ quantity, incDecDelHandler, dynamiColors }) => (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: dynamiColors.white,
        borderRadius: 30,
        alignItems: 'center',
        paddingHorizontal: 6,
        borderColor: dynamiColors.primary,
        borderWidth: 1,
        paddingVertical: 2,
        ...sharedStyles._styles(dynamiColors).shadow,
      }}>
      <TouchableScale onPress={() => incDecDelHandler(quantity - 1)}>
        <VectorIcon
          name={quantity <= 1 ? "delete" : "minus"}
          type="MaterialCommunityIcons"
          size={20}
          color={dynamiColors.primary}
        />
      </TouchableScale>
      <TouchableScale>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            justifyContent: 'center',
            alignItems: 'center',
            color: dynamiColors.primary,
            paddingHorizontal: 16,
          }}>
          {quantity}
        </Text>
      </TouchableScale>
      <TouchableScale onPress={() => incDecDelHandler(quantity + 1)}>
        <VectorIcon
          name="plus"
          type="MaterialCommunityIcons"
          size={20}
          color={dynamiColors.primary}
        />
      </TouchableScale>
    </View>
  );

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
        rightIconName=""
        leftIconName="arrow-back"
        title="Jovi Cart"
        containerStyle={{
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 0,
          // borderBottomColor: ,
        }}
      />
      <View style={{ top: -10 }}>
        <SetpProgress isCart={true} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 10 }} style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 0 }}>
          <DeliveryAddress />
          <Text style={{ padding: 10, fontSize: 12 }} fontFamily="PoppinsLight">{'Hold and drag to rearrange your pitstops to get the better route and less service charges.'}</Text>
          {(cartReducer.pitstops || []).map((pitstop, pitstopIndex) => (
            <PitstopsCard
              key={`pit-key${pitstopIndex}`}
              pitstop={{ ...pitstop, pitstopIndex }}
            />
          ))}
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
          }}>
          <SvgXml xml={svgs.jovi()} height={20} width={20} color="#fff" />
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
            dispatch(ReduxActions.clearCartAction());
            NavigationService.NavigationActions.common_actions.goBack();
          }}
        >
          <Text style={{ color: colors.primary, paddingHorizontal: 5 }}>
            Empty entire jovi cart
          </Text>
        </TouchableScale>
        <TextInput
          placeholder="Want to add instructions for your rider?"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: colors.grey,
            borderWidth: 0.5,
            borderRadius: 7,
          }}
        />
        <Totals />
      </ScrollView>
      <View style={{ flexDirection: 'row' }}>
        {['Add Pitstop', 'Checkout'].map(title => (
          <TouchableScale
            key={title}
            style={{
              flex: 1,
              paddingVertical: 10,
              backgroundColor: colors.primary,
              borderRadius: 10,
              marginHorizontal: 3,
            }} >
            <Text style={{ textAlign: 'center', color: colors.white }}>
              {title}
            </Text>
          </TouchableScale>
        ))}
      </View>
    </SafeAreaView>
  );
};
