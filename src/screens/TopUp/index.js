import React, { useState } from 'react'
import { ActivityIndicator, Alert, Appearance, Keyboard, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { Transition, Transitioning } from 'react-native-reanimated';
import svgs from '../../assets/svgs';
import SafeAreaView from '../../components/atoms/SafeAreaView';
import Text from '../../components/atoms/Text'
import TextInput from '../../components/atoms/TextInput';
import TouchableScale from '../../components/atoms/TouchableScale';
import View from '../../components/atoms/View'
import CustomHeader from '../../components/molecules/CustomHeader';
import NavigationService from '../../navigations/NavigationService';
import ROUTES from '../../navigations/ROUTES';
import FontFamily from '../../res/FontFamily';
import theme from '../../res/theme';
import GV, { hblRequestRef, PITSTOP_TYPES, PITSTOP_TYPES_INVERTED, TOPUP_ENUMS } from '../../utils/GV';
import { topUpStyles } from './styles';
import DashedLine from '../../components/organisms/DashedLine';
import Toast from '../../components/atoms/Toast';
import { getRequest, postRequest } from '../../manager/ApiManager';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import Endpoints from '../../manager/Endpoints';
import CardHeader from '../JoviJob/components/CardHeader';
import constants from '../../res/constants';
import { useIsFocused } from '@react-navigation/native';
import Button from '../../components/molecules/Button';
import VectorIcon from '../../components/atoms/VectorIcon';
import actions from '../../redux/actions';
import Regex from '../../utils/Regex';


export default () => {

  const transition = (
    <Transition.Together>
      <Transition.Out
        type="fade"
        durationMs={200}
      />
      <Transition.Change />
      <Transition.In
        type="fade"
        durationMs={200}
      />
    </Transition.Together>
  );//card open/close animation

  /////////////// ******************** START of variable initialization ***********************\\\\\\\\\\\\\\\\\\\\\\\\


  const { MODE_TYPES_ENUM, PAYMENT_TYPES_ENUM, EASY_PAISA_PAYMENT_OPTS, JAZZ_CASH_PAYMENT_OPTS, TNX_TYPES_ENUMS } = TOPUP_ENUMS;
  const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
  const WIDTH = constants.window_dimensions.width
  const HEIGHT = constants.window_dimensions.height
  const styles = topUpStyles(colors, WIDTH, HEIGHT);
  const isFocused = useIsFocused();

  const { transactionMethods, mobile, id, email } = useSelector(state => state.userReducer)
  console.log('transactionMethods', transactionMethods);

  let mobileNumStr = mobile.toString();
  if (mobileNumStr.includes("92")) {
    mobileNumStr = mobileNumStr.replace("92", "0")
  }
  const IS_EASYPAISA_ALLOWED = transactionMethods.find(x => (x.name.toLowerCase() === "easypaisa" && x.txnType == 1) || (x.name.toLowerCase() === "easypaisa" && x.txnType == 4) ? x : false);
  const IS_JAZZCASH_ALLOWED = transactionMethods.find(x => (x.name.toLowerCase() === "jazzcash" && x.txnType == 1) || (x.name.toLowerCase() === "jazzcash" && x.txnType == 4) ? x : false);

  const [topUpAmount, setTopUpAmount] = useState(__DEV__ ? '10' : '')
  // const [mobileNumber, setMobileNumber] = useState(__DEV__ ? "03123456789" : mobileNumStr)
  const [mobileNumber, setMobileNumber] = useState(__DEV__ ? "03123456789" : mobileNumStr)
  const [cnic, setCnic] = useState(__DEV__ ? '345678' : '')
  //This function is here for a reason, if you want to change its position, please dont.
  React.useEffect(() => {
    if (!isFocused) setLoader(false);
  }, [isFocused])
  const cardPaymentAllowed = () => {
    let isHblAllowed = false,
      isJazzcashCCAllowed = false,
      isEasyPaisaCCAllowed = false,
      disabled = false;
    if (transactionMethods.find(x => (x.name.toLowerCase() === "hbl" && x.txnType == TNX_TYPES_ENUMS.CARD_SUCCESS) || (x.name.toLowerCase() === "hbl" && x.txnType == TNX_TYPES_ENUMS.ALL))) {
      isHblAllowed = true;
    }
    else if (transactionMethods.find(x => (x.name.toLowerCase() === "jazzcash" && x.txnType == TNX_TYPES_ENUMS.ALL) || (x.name.toLowerCase() === "jazzcash" && x.txnType == TNX_TYPES_ENUMS.CARD_SUCCESS))) {
      isJazzcashCCAllowed = true  //
      // isHblAllowed = true; // added this line because this condition is only for credit card transactions through jazzcash.
    }
    else if (transactionMethods.find(x => (x.name.toLowerCase() === "easypaisa" && x.txnType == TNX_TYPES_ENUMS.ALL) || (x.name.toLowerCase() === "easypaisa" && x.txnType == TNX_TYPES_ENUMS.CARD_SUCCESS))) {
      isEasyPaisaCCAllowed = true  //

    }
    else disabled = true;
    return {
      disabled,
      isHblAllowed,
      isJazzcashCCAllowed,
      isEasyPaisaCCAllowed
    }

  }
  const initCartData = [
    {
      "idx": 1,
      "isOpened": true,
      // "key": PITSTOP_CARD_TYPES["location"],
      "title": "Easypaisa mobile account",
      "desc": "Use your easypaisa account",
      "paymentType": PAYMENT_TYPES_ENUM.EASYPAISA,
      "disabled": IS_EASYPAISA_ALLOWED ? false : true,
      "svg": svgs.easypaisa()
    },
    {
      "idx": 2,
      "isOpened": false,
      // "key": PITSTOP_CARD_TYPES["location"],
      "title": "Jazzcash mobile account",
      "desc": "Use your jazzcash account",
      "paymentType": PAYMENT_TYPES_ENUM.JAZZCASH,
      "disabled": IS_JAZZCASH_ALLOWED ? false : true,
      "svg": svgs.jazzcash()
    },
    {
      "idx": 3,
      "isOpened": false,
      "title": "Credit/Debit card",
      "desc": "Use your credit/debit card",
      "paymentType": PAYMENT_TYPES_ENUM.CREDIT_DEBIT_CARD,
      "disabled": cardPaymentAllowed().disabled,
      "svg": svgs.creditCard(),
    },
  ]
  const [cardData, setCardData] = useState(initCartData);
  const [selectedItem, setSelectedItem] = useState({});
  const [loader, setLoader] = useState(false);
  const { userReducer } = useSelector(state => state)
  const { balance } = userReducer;
  const dispatch = useDispatch();

  const ref = React.useRef();


  /////////////// ******************** END of variable initialization ***********************\\\\\\\\\\\\\\\\\\\\\\\\





  /////////////// ******************** Start of Useffect Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\



  const getBallance = () => {
    getRequest(`${Endpoints.GET_BALANCE}`,
      (resp) => {
        dispatch(actions.setUserAction({ ...userReducer, balance: resp.data.userBalance }))

      },
      (err) => {
        sharedExceptionHandler(err)
      }
    )

  }
  /////////////// ******************** END of Useffect Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\







  /////////////// ******************** START of JAZZ Cash Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\



  const JazzCashHandler = (txnType) => {
    let data = {
      "amount": parseInt(topUpAmount),
      "txnType": txnType,
      "pp_MobileNumber": mobileNumber,
      "pp_CNIC": cnic
    }
    console.log('[JazzCashHandler].data', data);
    postRequest(
      Endpoints.JAZZCASH_PAY,
      data,
      success => {
        console.log('[JazzCashHandler].success', success);
        const { jazzCashHtml, statusCode } = success.data
        if (statusCode === 200) {
          NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.WebView.screen_name, {
            uri: null,
            html: `${jazzCashHtml}`,
            title: "Top Up"
          })
        } else {
          sharedExceptionHandler(success)
        }
        // const { statusCode, jazzCashAuthViewModel } = success.data;
        // if (statusCode === 200) {
        //   NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.WebView.screen_name, {
        //     uri: {
        //       uri: jazzCashAuthViewModel.url,
        //       method: 'POST',
        //       body: `pp_Language=${jazzCashAuthViewModel.pp_Language}&pp_MerchantID=${jazzCashAuthViewModel.pp_MerchantID}&pp_SubMerchantID=${jazzCashAuthViewModel.pp_SubMerchantID}&pp_Password=${jazzCashAuthViewModel.pp_Password}&pp_BankID=${jazzCashAuthViewModel.pp_BankID}&pp_ProductID=${jazzCashAuthViewModel.pp_ProductID}&pp_TxnRefNo=${jazzCashAuthViewModel.pp_TxnRefNo}&pp_Amount=${jazzCashAuthViewModel.pp_Amount}&pp_TxnCurrency=${jazzCashAuthViewModel.pp_TxnCurrency}&pp_TxnDateTime=${jazzCashAuthViewModel.pp_TxnDateTime}&pp_BillReference=${jazzCashAuthViewModel.pp_BillReference}&pp_Description=${jazzCashAuthViewModel.pp_Description}&pp_TxnExpiryDateTime=${jazzCashAuthViewModel.pp_TxnExpiryDateTime}&pp_SecureHash=${jazzCashAuthViewModel.pp_SecureHash}&ppmpf_1=${jazzCashAuthViewModel.ppmpf_1}&ppmpf_2=${jazzCashAuthViewModel.ppmpf_2}&ppmpf_3=${jazzCashAuthViewModel.ppmpf_3}&ppmpf_4=${jazzCashAuthViewModel.ppmpf_4}&ppmpf_5=${jazzCashAuthViewModel.ppmpf_5}&pp_MobileNumber=${jazzCashAuthViewModel.pp_MobileNumber}&pp_CNIC=${jazzCashAuthViewModel.pp_CNIC}`
        //     },
        //     html: null,
        //     title: "Top Up"
        //   })
        // } else sharedExceptionHandler(success)
      },
      fail => {
        console.log('[JazzCashHandler].fail', fail);
        sharedExceptionHandler(fail)
        setLoader(false)
      })
  }



  /////////////// ******************** END of JAZZ Cash Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\





  /////////////// ******************** START of EasyPaisa Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\




  const EasyPaisaHandler = (paymentMethod) => {

    postRequest(
      Endpoints.EASYPAISA_PAY,
      {
        "amount": parseInt(topUpAmount),
        "orderRefNo": id,
        "emailAddr": email,
        "paymentMethod": paymentMethod,
        "mobileNum": mobileNumStr
      },
      success => {
        if (success.data.statusCode === 200) {
          NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.WebView.screen_name, {
            uri: { uri: success.data.easyPaisaAuthViewModel.url, method: 'POST', body: `postBackURL=${success.data.easyPaisaAuthViewModel.postBackURL}&auth_token=${success.data.easyPaisaAuthViewModel.auth_token}` }, html: null, title: "Top Up"
          });
          //    "TransactionComplete" 
        } else sharedExceptionHandler(success)
      },
      fail => {
        sharedExceptionHandler(fail)
      })
  }


  /////////////// ******************** END of EasyPaisa Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\




  /////////////// ******************** START of HBL Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\



  const HBLHandler = () => {
    postRequest(
      Endpoints.HBL_PAY,
      {
        "amount": parseInt(topUpAmount),
        "userID": id,
      },
      success => {
        hblRequestRef.current = JSON.parse(success.config.data)
        const { statusCode, hblTransactionViewModel } = success.data;
        const { url, signature } = hblTransactionViewModel
        if (statusCode === 200) {
          NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.WebView.screen_name, {
            uri: { uri: url, method: 'POST' }, html: null, title: "Top Up",
          });

        } else sharedExceptionHandler(success)
      },
      fail => {
        sharedExceptionHandler(fail)
      })
  }



  /////////////// ******************** END of HBL Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\





  /////////////// ******************** START of Card Transaction Handler Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\

  const cardTransactionHandler = () => {
    if (cardPaymentAllowed().isHblAllowed) {
      HBLHandler()
    }
    else if (cardPaymentAllowed().isJazzcashCCAllowed) {
      JazzCashHandler(JAZZ_CASH_PAYMENT_OPTS.CC)
    }
    else if (cardPaymentAllowed().isEasyPaisaCCAllowed) {
      EasyPaisaHandler(EASY_PAISA_PAYMENT_OPTS.CC)
    }
    else return null;

  }


  /////////////// ******************** END of Card Transaction Handler Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\




  /////////////// ******************** START of GetPayloadForWebViewHandler Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\


  const getPayloadForWebViewHandler = (paymentType) => {
    if (IS_EASYPAISA_ALLOWED && paymentType === PAYMENT_TYPES_ENUM.EASYPAISA) {
      EasyPaisaHandler(EASY_PAISA_PAYMENT_OPTS.MA)
    }
    else if (IS_JAZZCASH_ALLOWED && paymentType === PAYMENT_TYPES_ENUM.JAZZCASH) {
      JazzCashHandler(JAZZ_CASH_PAYMENT_OPTS.MA)
    }
    else if (PAYMENT_TYPES_ENUM.CREDIT_DEBIT_CARD) {
      cardTransactionHandler()
    }

  };

  /////////////// ******************** END of GetPayloadForWebViewHandler Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\




  /////////////// ********************  START of UI Functions ***********************\\\\\\\\\\\\\\\\\\\\\\\\

  const renderHeader = () => {
    return (
      <CustomHeader
        rightIconName={'home'}
        rightContainerStyle={{
          backgroundColor: colors.white,
        }}
        rightIconColor={colors.primary}
        onRightIconPress={() => {
          NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.Home.screen_name);
        }}
        title={`Top up`}
        titleStyle={{
          fontFamily: FontFamily.Poppins.SemiBold,
          fontSize: 16,
        }}
        defaultColor={colors.primary}
      />
    )
  }

  const renderBalanceContainer = () => {
    return (
      <View style={styles.balanceContainer}>
        <Text style={styles.availableCreditText} fontFamily="PoppinsMedium" >
          Available Credit
        </Text>
        <Text style={styles.availableCreditAmount} fontFamily="PoppinsBold" >
          Rs. {`${balance}`}
        </Text>
        {/* <Button style={{  }} text="Refresh" textStyle={{fontSize: 10}} onPress={() => {getBallance() }} /> */}
        <TouchableScale style={{ position: 'absolute', right: -40, height: 30, width: 80, top: 15 }} onPress={() => { getBallance() }} >
          <VectorIcon name="refresh" type="Ionicons" color={colors.black} size={21} />
        </TouchableScale>
      </View>
    )
  }

  const renderTextRow = () => {
    return (
      <View style={styles.viewAllRow} >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }} >
          <Text style={styles.recentActivityText} fontFamily="PoppinsSemiBold" >Top Up</Text>
        </View>
      </View>
    )
  }

  const onContinue = () => {
    try {
      const item = selectedItem;
      // console.log("[onContinue].item", item, topUpAmount);
      if (!Object.keys(item).length) {
        Toast.error(`Please select Topup method`);
      }
      else if (Number.isInteger(parseInt(topUpAmount))) {
        Keyboard.dismiss();
        console.log('topUpAmount', topUpAmount);
        if (!topUpAmount.toString().length) return Toast.error(`Amount cannot be less than 1`);
        else if (topUpAmount.toString()[0] == "0") return Toast.error(`Amount cannot be less than 1`);
        else if (parseInt(topUpAmount) < 10) return Toast.error(`Amount cannot be less than 10`);
        else if (item.paymentType > 0) {
          setLoader(true);
          getPayloadForWebViewHandler(item.paymentType);
        }
      } else {
        Toast.error(`Please enter amount`);
      }
    } catch (error) {
      console.log("[onContinue].error", error);
      setLoader(false);
    }
  }

  const updateCardOnHeaderPress = (item, index) => {
    // const { idx, } = item;
    // setCardData([...cardData].map(object => {
    //   if (object.idx === idx) {
    //     return {
    //       ...object,
    //       isOpened: !object.isOpened,
    //     }
    //   }
    //   else return {
    //     ...object,
    //     isOpened: false,
    //   }
    // }))
    setSelectedItem((selectedItem.idx === item.idx) ? {} : { ...item, index });
    ref.current.animateNextTransition();
  }

  const renderCardHeader = (item, index) => {
    return (
      <CardHeader
        title={item.title}
        description={item.desc}
        xmlSrc={item.svg}
        isOpened={false}
        isArrowIcon={false}
        svgStyles={{ backgroundColor: colors.white }}
        headerStyles={{
          backgroundColor: colors.white,
          flexDirection: 'row',
          marginHorizontal: 5,
          marginVertical: 10,
          alignItems: 'center',
        }}
        activeOpacity={0.9}
        disabled={item.disabled}
        onHeaderPress={() => {
          updateCardOnHeaderPress(item, index);
        }} />
    )
  }

  const renderEasyPaisaContainer = (item, index) => {
    return (
      <>
        {
          item.idx === selectedItem.idx &&
          <View>
            <TextInput value={topUpAmount} placeholder="Rs. 100" maxLength={5} spaceFree={true} pattern={Regex.numberOnly} onChangeText={(t) => { setTopUpAmount(t) }} title="Enter Amount" titleStyle={{ fontFamily: FontFamily.Poppins.Regular, fontSize: 12, color: '#272727' }} containerStyle={{ marginTop: 25, width: '90%' }} keyboardType="numeric" />
          </View>
        }
      </>
    )
  }

  const renderJazzCashContainer = (item, index) => {
    return (
      <>
        {
          item.idx === selectedItem.idx &&
          <View>
            <TextInput value={topUpAmount} placeholder="Rs. 100" maxLength={5} spaceFree={true} pattern={Regex.numberOnly} onChangeText={(t) => { setTopUpAmount(t) }} keyboardType="numeric" title="Enter Amount" titleStyle={{ fontFamily: FontFamily.Poppins.Regular, fontSize: 12, color: '#272727' }} containerStyle={{ marginTop: 25, width: '90%' }} />
            <TextInput value={mobileNumber} placeholder="03*********" maxLength={12} spaceFree={true} pattern={Regex.numberOnly} onChangeText={(t) => { setMobileNumber(t) }} keyboardType="numeric" title="Enter Mobile Number" titleStyle={{ fontFamily: FontFamily.Poppins.Regular, fontSize: 12, color: '#272727' }} containerStyle={{ marginTop: 25, width: '90%' }} />
            <TextInput value={cnic} placeholder="******" maxLength={6} spaceFree={true} pattern={Regex.numberOnly} onChangeText={(t) => { setCnic(t) }} keyboardType="numeric" title="Last 6 Digits CNIC" titleStyle={{ fontFamily: FontFamily.Poppins.Regular, fontSize: 12, color: '#272727' }} containerStyle={{ marginTop: 25, width: '90%' }} />
          </View>
        }
      </>
    )
  }

  const renderCreditCardContainer = (item, index) => {
    return (
      <>
        {
          item.idx === selectedItem.idx &&
          <View>
            <TextInput value={topUpAmount} pattern={Regex.numberOnly} placeholder="Rs. 100" spaceFree={true} onChangeText={(t) => { setTopUpAmount(t) }} keyboardType="numeric" title="Enter Amount" maxLength={5} titleStyle={{ fontFamily: FontFamily.Poppins.Regular, fontSize: 12, color: '#272727' }} containerStyle={{ marginTop: 25, width: '90%' }} />
          </View>
        }
      </>
    )
  }

  const renderBody = (item, index) => {
    const { idx } = item
    if (idx === 1) {
      return renderEasyPaisaContainer(item, index)
    } else if (idx === 2) {
      return renderJazzCashContainer(item, index)
    } else if (idx === 3) {
      return renderCreditCardContainer(item, index)
    }
    else {
      return <View />
    }

  }

  const renderCardUI = (item, index) => {
    return (
      <View>
        {renderCardHeader(item, index)}
        {renderBody(item, index)}
      </View>
    )
  }

  const renderAccountContainer = () => {
    return (
      <View style={styles.dataContainerStyle} >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
          {
            cardData.map((item, index) => {
              return (
                <React.Fragment key={`acc_type_${index}`}>
                  {renderCardUI(item, index)}
                  {(index === 0 || index === 1) && <DashedLine contentContainerStyle={{ paddingVertical: 8, }} />}
                </React.Fragment>
              )
            })
          }
        </ScrollView>
      </View>
    )
  }

  const validationCheck = () => {
    if (topUpAmount !== '' && mobileNumber !== '' && cnic !== '') return false
    else return true
  }

  const renderContinueBtn = () => {
    return (
      <TouchableOpacity
        onPress={onContinue}
        disabled={validationCheck()}
        activeOpacity={1}
        style={[styles.locButton, { height: 60, marginVertical: 10, backgroundColor: loader || validationCheck() ? 'grey' : colors.primary }]}>
        {
          loader ? <ActivityIndicator size="small" color={colors.white} /> :
            <Text style={[styles.btnText, { fontSize: 16, fontFamily: FontFamily.Poppins.Regular, color: colors.white }]} >Continue</Text>
        }
      </TouchableOpacity>
    )
  }


  /////////////// ********************  END of UI Functions ***********************\\\\\\\\\\\\\\\\\\\\\\\\




  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={styles.container}>
        {renderBalanceContainer()}
        <ScrollView>
          {renderTextRow()}
          {renderAccountContainer()}
        </ScrollView>
        {renderContinueBtn()}
      </Transitioning.View>
    </SafeAreaView>
  )
}