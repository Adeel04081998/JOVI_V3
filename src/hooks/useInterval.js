import React from "react";
import BackgroundTimer from 'react-native-background-timer';

export default (duration = 30, delay = 1000) => {
    const initInfo = {
        mins: "",
        sec: "",
        intervalStoped: false
    }
    const [info, setInfo] = React.useState(initInfo);
    React.useEffect(() => {
        var timer = duration, minutes, seconds;
        BackgroundTimer.runBackgroundTimer(function () {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            // console.log("timer", timer);
            setInfo(prevState => ({ ...prevState, intervalStoped: false, mins: minutes, sec: seconds }));
            if (--timer <= 0) {
                BackgroundTimer.stopBackgroundTimer();
                setInfo(prevState => ({ ...prevState, intervalStoped: true }));
                // console.log("Interval Stopped---");
                return;
            }
        }, delay);

    }, []);
    return info;
};