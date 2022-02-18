import React from 'react';
import { Appearance, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
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
import Progress from './components/Progress';
import stylesheet from './styles';
import {
  edit_icon, pencil_icon, percent_icon, pin_icon
} from './svgs/cart_svgs';

const BottomLine = () => (
  <View
    style={{
      borderBottomColor: '#0000001A',
      borderWidth: 0.5,
      marginVertical: 5,
    }}
  />
);
export default () => {
  const cartReducer = useSelector(store => store.cartReducer);
  console.log('[CART_SCREEN] cartReducer', cartReducer);
  const colors = theme.getTheme(
    GV.THEME_VALUES.DEFAULT,
    Appearance.getColorScheme() === 'dark',
  );
  const cartStyles = stylesheet.styles(colors);
  React.useEffect(() => {
    sharedGetServiceCharges()
  }, [])
  const incDecDelHandler = pitstopDetails => {
    sharedAddUpdatePitstop({ ...pitstopDetails });
  };
  const Address = () => {
    const SPACING = 10;
    const ICON_HEIGHT = 20;
    const ICON_WIDTH = 20;
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
          <SvgXml xml={edit_icon()} height={20} width={20} />
        </View>

        <BottomLine />
        <View style={{ padding: SPACING - 5, paddingLeft: SPACING + 20 }}>
          <Text
            style={{ color: colors.primary, fontSize: 14 }}
            fontFamily="PoppinsSemiBold"
            numberOfLines={1}>
            Office
          </Text>
          <Text style={{ color: colors.black, fontSize: 11 }} numberOfLines={2}>
            2nd floor, pakland plaza, I8 Markaz, Islamabad
          </Text>
        </View>
      </View>
    );
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
            <Text
              style={{
                paddingHorizontal: 10,
                fontSize: 10,
                color: dynamiColors.grey,
              }}
              fontFamily="PoppinsRegular">
              Clear pitstop
            </Text>

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
    const { title, description, images, price, gstAddedPrice, quantity } = product;
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ height: 70, width: 70, borderRadius: 10, margin: 5 }}>
          <Image
            source={
              isJOVI
                ? require('./assets/jovi.png')
                : {
                  uri: renderFile(images[0].joviImageThumbnail),
                }
            }
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
              {!isJOVI && (
                <SvgXml
                  xml={percent_icon(dynamiColors.primary)}
                  height={20}
                  width={20}
                  style={{ marginHorizontal: 10 }}
                />
              )}
            </View>

            <SvgXml xml={pencil_icon()} height={20} width={12} />
          </View>

          <View>
            <Text
              numberOfLines={2}
              style={{ textAlign: 'left', color: '#6B6B6B', fontSize: 12 }}
              fontFamily="PoppinsLight">
              {description}
            </Text>
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
              {
                gstAddedPrice &&
                <Text
                  style={{ color: dynamiColors.grey, fontSize: 12, textDecorationLine: "line-through" }}
                  fontFamily="PoppinsMedium">
                  {renderPrice(gstAddedPrice)}
                </Text>
              }
            </View>
            {
              !isJOVI &&
              <IncDec
                quantity={quantity}
                incDecDelHandler={quantity => incDecDelHandler(quantity)}
              />
            }
          </View>
        </View>
      </View>
    );
  };
  const IncDec = ({ quantity, incDecDelHandler }) => (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 5,
        ...sharedStyles._styles(colors).shadow,
      }}>
      <TouchableScale onPress={() => incDecDelHandler(quantity - 1)}>
        <VectorIcon
          name="minus"
          type="MaterialCommunityIcons"
          size={25}
          color={'black'}
        />
      </TouchableScale>
      <TouchableScale>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            paddingHorizontal: 16,
          }}>
          {quantity}
        </Text>
      </TouchableScale>
      <TouchableScale onPress={() => incDecDelHandler(quantity + 1)}>
        <VectorIcon
          name="plus"
          type="MaterialCommunityIcons"
          size={25}
          color={'black'}
        />
      </TouchableScale>
    </View>
  );
  const Totals = () => {
    const { subTotal, discount, serviceCharges, total } = cartReducer;
    const row = (caption = '', value = '', isBold = false) => (
      <View
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
    );
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
      <Progress styles={cartStyles} />
      <ScrollView contentContainerStyle={{ padding: 10 }} style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 0 }}>
          <Address />
          <Text style={{ padding: 10 }}>Hold text would be here...</Text>
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
          }}>
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
