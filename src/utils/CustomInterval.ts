import { Platform } from "react-native";
import BackgroundTimer from 'react-native-background-timer';

let timerListener: NodeJS.Timer | undefined = undefined;
export default {
    handleInterval: (callback: (timer: NodeJS.Timer | undefined) => void, second: number = 1,) => {
        if (Platform.OS === "ios") {
            timerListener = setInterval(() => {
                callback(timerListener);
            }, second * 1000)
        } else {
            BackgroundTimer.runBackgroundTimer(() => {
                callback(undefined);
            }, second * 1000)
        }
    },
    stopInterval: () => {
        if (timerListener) {
            clearInterval(timerListener);
        }
    }
}