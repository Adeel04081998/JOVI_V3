import { Platform, StyleSheet } from "react-native";
import { initColors } from "../../res/colors";
import constants from "../../res/constants";
import sharedStyles from "../../res/sharedStyles";
const SPACING_VERTICAL = 10;
export default {
    styles(colors = initColors,width,height) {
        return StyleSheet.create({
            container: {
                flexGrow: 1,
                backgroundColor: colors.Whisper || "#F6F5FA",
            },
            gifLoader: {
                height: '93%', width: '101%', paddingLeft: 10, paddingTop: 8, paddingHorizontal: 5, display: 'flex', justifyContent: 'center', alignContent: 'center',
            },
            restaurantLoader: {
                paddingTop:-19, display: 'flex', justifyContent: 'center', alignContent: 'center',
            },
            imageCarousal: {
                marginHorizontal: 10,
                alignItems: 'center',
                borderRadius: 12,
                // backgroundColor: "red",
                // resizeMode: "contain"
            },
            wrapper: {
                margin: SPACING_VERTICAL,marginTop:0, paddingBottom: Platform.select({ android: 160, ios: 140 })
            },
            greetingMainContainer: {
                margin: 0,
                backgroundColor: colors.Whisper || "#F6F5FA",
                paddingLeft: 5,
                marginVertical: 5
            },
            greetingHeaderText: {
                fontSize: 14,
                color: '#272727'

            },
            greetingBodyText: {
                fontFamily: 'Poppins-Light', color: colors.DoveGray || '#6B6B6B', fontSize: 14, bottom: 2
            },
            alertMsgPrimaryContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 7,
                backgroundColor: colors.BlueChalk || '#EEE5FF',
            },
            alertMsgSecondaryContainer: {
                flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10
            },
            alertMsgHeaderText: {
                fontSize: 14,
                color: colors.BlueVoilet || "#6D51BB",

            },
            alertMsgBodyText: {
                fontSize: 10,
                width: '90%',
                color: colors.Bossanova || '#453463'
            },
            alertMsgSvgView: {
                flex: 0.5,
                flexDirection: 'column',
                alignItems: 'center',
            },
            categoriesCardPrimaryContainer: {
                flex: 0.8,
                margin: 0
            },
            categoriesCardTittleText: {
                fontSize: 16,
                color: colors.MineShaft || "#272727",
                paddingVertical: 8
            },
            categoriesCardItemContainer: {

            },
            cat_item_container: {
                marginHorizontal: 3, justifyContent: 'center', borderRadius: 10
            },
            cat_img_container: {
                width: 80, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'
            },
            allPitstopListing:{
                container: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10
                },
                itemContainer: {
                    ...sharedStyles._styles(colors).shadow,
                    backgroundColor: colors.white || '#fff',
                    borderRadius: 10,
                    marginHorizontal: 5,
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginVertical: 5
                },
                mainText: {
                    color: colors.text,
                    fontSize: 18,
                    fontWeight:'600'
                },
                viewMoreBtn: {
                    color: colors.primary || '#6D51BB', // colors.theme here should be the theme color of specific category
                    fontSize: 12
                },
                itemContainer: {
                    ...sharedStyles._styles(colors).shadow,
                    backgroundColor: colors.white || '#fff',
                    borderRadius: 10,
                    marginHorizontal: 5,
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginVertical: 5
                },
                image: {
                    height: 200,
                    // height: height,
                    width: width,
                    borderRadius: 10
                },
                iconContainer: {
                    borderRadius: 15,
                    backgroundColor: colors.iconContainer || '#F6F5FA',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                },
                tagsText: {
                    fontSize: 12,
                    color: colors.subText || '#212121',
                    opacity: 0.6,
                    width: width * 0.9,
                    // backgroundColor:'blue',
                    marginTop: -10
                },
                estTime: {
                    fontSize: 12,
                    color: colors.primary || '#6D51BB', // colors.theme here should be the theme color of specific category
                    marginTop: Platform.OS === "android" ? 3 : 0
                },
                title: {
                    fontSize: 14,
                    // paddingVertical: 5,
                    color: '#000',
                    width: width * 0.7
                },
                bodyContainer: {
                    width: width * 0.8
                },
                subContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                    // backgroundColor:'red'
                }
            }
        })
    }
} 