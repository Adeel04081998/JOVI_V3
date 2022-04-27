export default {
    email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    passwordHard: /^(?=.*\d).{8,100}$/,
    password: /^.{6,}$/,
    numberOnly: /^[0-9]+$/,
    numberWithSpace: /^[\d]*$/,
    pkCellNo: /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/,
    name: /^[a-zA-Z]{2,}$/,
    Space_Regex: /\s/g,
    androidOTP: /\b\d{4}\b/,

    price: /[pkr|rs|rs.|pkr.]{2,}/i,
    distanceM: /[m]+/i,
    time: /:\d\d([ ap]|$)/,
    restrict_zero: /^[1-9][0-9]*$/

}
