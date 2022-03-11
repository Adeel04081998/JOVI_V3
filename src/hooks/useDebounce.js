import React from 'react'
export default (callback, delay) => {
    const latestCallback = React.useRef();
    const latestTimeout = React.useRef();
    React.useEffect(() => {
        latestCallback.current = callback;
    }, [callback]);
    return () => {
        if (latestTimeout.current) {
            clearTimeout(latestTimeout.current);
        }
        latestTimeout.current = setTimeout(() => { latestCallback.current(); }, delay);
    };
};