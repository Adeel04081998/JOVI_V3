import { Platform } from "react-native";

const IOS_OBJ = {
    Black: "Poppins-Black",
    BoldItalic: "Poppins-BlackItalic",
    Bold: "Poppins-Bold",
    BoldItalic: "Poppins-BoldItalic",
    ExtraBold: "Poppins-ExtraBold",
    ExtraBoldItalic: "Poppins-ExtraBoldItalic",
    ExtraLight: "Poppins-ExtraLight",
    ExtraLightItalic: "Poppins-ExtraLightItalic",
    Italic:"Poppins-Italic",
    Light:"Poppins-Light",
    LightItalic:"Poppins-LightItalic",
    Medium:"Poppins-Medium",
    MediumItalic:"Poppins-MediumItalic",
    Regular:"Poppins-Regular",
    SemiBold:"Poppins-SemiBold",
    SemiBoldItalic:"Poppins-SemiBoldItalic",
    Thin:"Poppins-Thin",
    ThinItalic:"Poppins-ThinItalic",
};

const ANDROID_OBJ = {
    Black: "PoppinsBlack",
    BoldItalic: "PoppinsBlackItalic",
    Bold: "PoppinsBold",
    BoldItalic: "PoppinsBoldItalic",
    ExtraBold: "PoppinsExtraBold",
    ExtraBoldItalic: "PoppinsExtraBoldItalic",
    ExtraLight: "PoppinsExtraLight",
    ExtraLightItalic: "PoppinsExtraLightItalic",
    Italic:"PoppinsItalic",
    Light:"PoppinsLight",
    LightItalic:"PoppinsLightItalic",
    Medium:"PoppinsMedium",
    MediumItalic:"PoppinsMediumItalic",
    Regular:"PoppinsRegular",
    SemiBold:"PoppinsSemiBold",
    SemiBoldItalic:"PoppinsSemiBoldItalic",
    Thin:"PoppinsThin",
    ThinItalic:"PoppinsThinItalic",
};

export default {
    Poppins: Platform.OS==="ios" ? IOS_OBJ : ANDROID_OBJ,
}//end of EXPORT DEFAULT