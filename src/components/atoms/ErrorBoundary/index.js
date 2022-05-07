import { View, Text } from 'react-native';
import React, { Component } from 'react';
import Axios from 'axios';
// import crashlytics from '@react-native-firebase/crashlytics';



export const ErrorComponent = ({ description }) => (
    <View style={{ backgroundColor: '#fff', flex: 1, justifyContent: "center", alignItems: 'center' }}>
        <Text style={{ color: "#000" }}>Something went wrong</Text>
    </View >
);

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: {},
            errorInfo: {}
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        // console.log("[ErrorBoundary] getDerivedStateFromError :", error);
        // crashlytics().recordError(error); // crashlytics
        if (__DEV__) return;
        Axios.post(`/api/ErrorLog/FrontEndError/AddOrUpdate`, {
            "userID": null,
            "frontEndErrorID": 0,
            "description": `${JSON.stringify({ error })}`,
            "creationDate": null
        })
            .then(res => {
                console.log('[componentDidCatch].then().res :', res);
            })
            .catch(err => {
                console.log('[componentDidCatch].catch().err :', err)
            }).finally(() => {

            });
        return {
            hasError: true,
            error: JSON.stringify(error),
        };

    }

    componentDidCatch(error, errorInfo) {
        if (error || errorInfo) {
            // crashlytics().recordError(error || errorInfo); // crashlytics
            this.setState({
                hasError: true,
                error: JSON.stringify(error),
                errorInfo: JSON.stringify(errorInfo)
            });
        }
    }

    render() {
        // console.log('[Error Boundary] this.state :', this.state)
        if (this.state.hasError) {
            return <ErrorComponent />
        } else {
            return this.props.children;
        }

    }
}