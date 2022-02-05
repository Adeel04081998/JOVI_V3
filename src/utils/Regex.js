export default {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi,
    passwordHard: /^(?=.*\d).{8,100}$/,
    password: /^.{6,}$/,
    numberOnly: /^[0-9]+$/,
    pkCellNo: /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/,
    name: /^[s\a-z]+[a-z\s]*$/i,
    Space_Regex: /\s/,
    androidOTP: /\b\d{4}\b/

}
