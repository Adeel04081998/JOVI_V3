import React, { useState } from 'react'
import { Appearance, Keyboard } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
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
import { postRequest } from '../../manager/ApiManager';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import TouchableOpacity from '../../components/atoms/TouchableOpacity';
import Endpoints from '../../manager/Endpoints';


export default () => {

  /////////////// ******************** START of variable initialization ***********************\\\\\\\\\\\\\\\\\\\\\\\\


  const { MODE_TYPES_ENUM, PAYMENT_TYPES_ENUM, EASY_PAISA_PAYMENT_OPTS, JAZZ_CASH_PAYMENT_OPTS, TNX_TYPES_ENUMS } = TOPUP_ENUMS;
  const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
  const styles = topUpStyles(colors);

  const { transactionMethods, mobile, id, email, balance } = useSelector(state => state.userReducer)

  const IS_EASYPAISA_ALLOWED = transactionMethods.find(x => (x.name.toLowerCase() === "easypaisa" && x.txnType == 1) || (x.name.toLowerCase() === "easypaisa" && x.txnType == 4) ? x : false);
  const IS_JAZZCASH_ALLOWED = transactionMethods.find(x => (x.name.toLowerCase() === "jazzcash" && x.txnType == 1) || (x.name.toLowerCase() === "jazzcash" && x.txnType == 4) ? x : false);

  const [topUpAmount, setTopUpAmount] = useState('')
  const [accountsArr, setAccountsArr] = useState([
    { name: "Easypaisa mobile account", desc: "Use your easypaisa account", paymentType: PAYMENT_TYPES_ENUM.EASYPAISA, disabled: IS_EASYPAISA_ALLOWED ? false : true, icon: svgs.easypaisa() },
    { name: "Jazzcash mobile account", desc: "Use your jazzcash account", paymentType: PAYMENT_TYPES_ENUM.JAZZCASH, disabled: IS_JAZZCASH_ALLOWED ? false : true, icon: svgs.jazzcash() },
    { name: "Credit/Debit card", desc: "Use your credit/debit card", paymentType: PAYMENT_TYPES_ENUM.CREDIT_DEBIT_CARD, disabled: true, icon: svgs.creditCard() }, //added disabled checked. 
  ])


  /////////////// ******************** END of variable initialization ***********************\\\\\\\\\\\\\\\\\\\\\\\\





  /////////////// ******************** Start of Card Payment Check Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\

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


  /////////////// ******************** END of Card Payment Check Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\







  /////////////// ******************** START of JAZZ Cash Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\


  
  const JazzCashHandler = (txnType) => {
    postRequest(
      Endpoints.JAZZCASH_PAY,
      {
        "amount": parseInt(topUpAmount),
        "txnType": txnType,
      },
      success => {
        const { statusCode, jazzCashHtml } = success.data;
        if (statusCode === 200) {
          NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.WebView.screen_name, {
            uri: null,
            html: `${jazzCashHtml}`, title: "Top Up"
          })
        } else sharedExceptionHandler(success)
      },
      fail => {
        sharedExceptionHandler(fail)
      })
  }



  /////////////// ******************** END of JAZZ Cash Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\





  /////////////// ******************** START of EasyPaisa Payment Function ***********************\\\\\\\\\\\\\\\\\\\\\\\\




  const EasyPaisaHandler = (paymentMethod) => {
    let mobileNum = mobile.toString();
    if (mobileNum.includes("92")) {
      mobileNum = mobileNum.replace("92", "0")
    }

    postRequest(
      Endpoints.EASYPAISA_PAY,
      {
        "amount": parseInt(topUpAmount),
        "orderRefNo": id,
        "emailAddr": email,
        "paymentMethod": paymentMethod,
        "mobileNum": mobileNum
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
        title={`Wallet`}
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
        <TextInput value={topUpAmount} placeholder="00" onChangeText={(t) => { setTopUpAmount(t) }} title="Enter Amount" titleStyle={{ fontFamily: FontFamily.Poppins.Regular, fontSize: 12, color: '#272727' }} containerStyle={{ marginTop: 25, width: '90%' }} />
      </View>
    )
  }

  const renderTextRow = () => {
    return (
      <View style={styles.viewAllRow} >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }} >
          <Text style={styles.recentActivityText} fontFamily="PoppinsSemiBold" >Top Up</Text>
        </View>
      </View>
    )
  }

  const onAccountPress = (item, index) => {
    if (Number.isInteger(parseInt(topUpAmount))) {
      Keyboard.dismiss();
      if (!topUpAmount.toString().length) return Toast.error(`Amount cannot be less than 1`);
      else if (topUpAmount.toString()[0] == "0") return Toast.error(`Amount cannot be less than 1`);
      else if (item.paymentType > 0) return getPayloadForWebViewHandler(item.paymentType);
    } else {
      Toast.error(`Entered text is not a number! Please enter numeric number like (123)`, null, "long");
    }

  }

  const renderAccountContainer = () => {
    return (
      <View style={styles.dataContainerStyle} >
        {
          accountsArr.map((item, index) => {
            return (
              <>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5  }} disabled={item.disabled} onPress={() => onAccountPress(item, index)} >
                  <SvgXml xml={item.icon} height={35} width={35} style={{ marginHorizontal: 20 }} />
                  <View style={{ flexDirection: 'column' }} >
                    <Text style={styles.accountTitle} fontFamily="PoppinsSemiBold" >{item.name}</Text>
                    <Text style={styles.filterDateStyle} fontFamily="PoppinsRegular" >{item.desc}</Text>
                  </View>
                  {item.disabled &&
                    <>
                      <View style={{ flexDirection: 'row', height: 50, width: '100%', borderRadius: 5, opacity: 0.6, alignItems: 'center', backgroundColor: '#444', position: 'absolute' }} />
                      <View style={{ height: 50, width: "100%", position: "absolute", justifyContent: 'center', }}>
                      </View>
                    </>}
                </TouchableOpacity>
                {(index === 0 || index === 1) && <DashedLine contentContainerStyle={{ paddingVertical: 8, }} />}
              </>
            )
          })
        }
      </View>
    )
  }


  /////////////// ********************  END of UI Functions ***********************\\\\\\\\\\\\\\\\\\\\\\\\




  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderBalanceContainer()}
      {renderTextRow()}
      {renderAccountContainer()}
    </SafeAreaView>
  )
}