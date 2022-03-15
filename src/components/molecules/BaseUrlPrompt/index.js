import React from 'react'
import Prompt from '../../atoms/Prompt'
import preference_manager from '../../../preference_manager';
import GV from '../../../utils/GV';
import { Alert } from 'react-native';
import { sharedConfirmationAlert } from '../../../helpers/SharedActions';

export default () => {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        preference_manager.getSetBaseUrlAsync(GV.GET_VALUE)
            .then(url => {
                if (url) {
                    GV.BASE_URL.current = url;
                    sharedConfirmationAlert(
                        `Current base url`, `${GV.BASE_URL.current}`,
                        [
                            {
                                text: "OK",
                                onPress: () => { }
                            },
                            {
                                text: "EDIT",
                                onPress: () => {
                                    setVisible(true)
                                }
                            },
                        ]
                    )
                    // Alert.alert(`base url: \n ${GV.BASE_URL.current}`, " \n clear storage/cache if you want to update base url!");
                }
                else {
                    setVisible(true);
                }
            })
            .catch(err => console.log("[getSetBaseUrlAsync].catch", err))
    }, [])
    if (visible) {
        return (
            <Prompt
                visible={visible}
                title={`Current base url : \n ${GV.BASE_URL.current}`}
                placeholder="Type your new base url..."
                onCancel={() => setVisible(false)}
                onSubmit={(value) => {
                    value = value ? value: GV.BASE_URL.current
                    preference_manager.getSetBaseUrlAsync(GV.SET_VALUE, value)
                        .then(() => {
                            setVisible(false);
                            Alert.alert(`Your base url is saved as ${value}`);
                        })
                        .catch(err => console.log("[onSubmit].catch", err))

                }}
            />
        )
    } else return null;
}