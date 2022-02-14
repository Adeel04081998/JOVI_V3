
import { NativeModules, Platform } from 'react-native'

const { RNMediaMeta } = NativeModules

export default {
    get(path, options) {
        return new Promise(async (resolve, reject) => {
            // RNMediaMeta.get(path, {
            //     getThumb: true,
            //     ...options,
            // })

            if (Platform.OS === "android") {
                RNMediaMeta.get(path, {
                    getThumb: true,
                    ...options,
                }).then((d) => {

                    let sec = 0;
                    if (d.duration) {
                        sec = parseInt(`${d.duration}`);
                        sec = sec / 1000;
                    }


                    resolve({
                        duration: `${sec}`,
                        language: d.language,
                    });
                    return
                }).catch(err => {
                    reject(err);
                })
            }
            else if (Platform.OS === "ios") {
                RNMediaMeta.get(path, {
                    getThumb: true,
                    ...options,
                }).then((d) => {

                    resolve({
                        duration: `${d.duration}`,
                        language: "eng",
                    });
                    return
                }).catch(err => {
                    reject(err);
                })

            }
            else {
                //WHEN DEVICE IS OTHER THEN iOS AND ANDROID 
                resolve({
                    duration: 0,
                });
                return
            }


        })//end of PROMISE

    },
}