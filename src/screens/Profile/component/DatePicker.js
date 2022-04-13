
import React, { useCallback, useState } from 'react';
import { Alert, Appearance, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import Picker from '../../../components/atoms/Picker/Picker';

import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import View from '../../../components/atoms/View';
import colors from '../../../res/colors';


export default (props) => {

    const [dateState, setDateState] = useState({
        "D": props.parentState.dob?.split("-")[0] || props.parentState.daysArr[0],
        "M": props.parentState.dob?.split("-")[1] || props.parentState.monthsArr[0],
        "Y": props.parentState.dob?.split("-")[2] || props.parentState.yearsArr[0],
        // "dateString": props.parentState.dob || ""
    });

    return (
        <View style={{ width: "100%", padding: 30, }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', }}>
                <TouchableOpacity onPress={() => props.onClose()}>
                    <Text style={{ color: props.colors.primary }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    props.onSave('DateOfBirth', `${dateState.D}/${dateState.M}/${dateState.Y}`, 4);
                    props.onClose()
                }} >
                    <Text style={{ color: props.colors.primary }} >Save </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Platform.select({ android: 20, ios: 0 }) }}>
                {
                    [{ key: "D", selectedValue: dateState.D, prompt: "Date", data: props.parentState.daysArr }, { key: "M", selectedValue: dateState.M, prompt: "Month", data: props.parentState.monthsArr }, { key: "Y", selectedValue: dateState.Y, prompt: "Year", data: props.parentState.yearsArr }].map((X, i) => (
                        <View key={i} style={{ top: Platform.select({ android: 0, ios: 30 }) }} >
                            <Text style={[{ left: 5, textAlign: Platform.select({ ios: 'center', android: "left" }) }]}>
                                {X.prompt}
                            </Text>
                            <Picker
                                data={X.data}
                                setSelectedValue={v => setDateState({ ...dateState, [X.key]: v })}
                                selectedValue={X.selectedValue}
                                style={{ width: i > 1 ? 120 : 110, bottom: Platform.select({ ios: 50, android: 0 }) }}
                                prompt={`Select ${X.prompt}`}
                                enabled={true}
                            />
                        </View>

                    ))
                }
            </View>
        </View >

    );
};

const _styles = (colors) => StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.screen_background,
    },
    errorText: {
        color: "red",
        textAlign: 'center',
        width: '100%',
        bottom: isIOS ? -20 : -25,


    },
});