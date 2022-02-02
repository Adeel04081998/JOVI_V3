import React from "react";
import {Animated,ScrollView,Easing} from 'react-native';

const HEIGHT = 120;
const SPACING_VERTICAL = 10;
const EXP_HEIGHT = (HEIGHT * 2) + SPACING_VERTICAL;
const Dropdown = ({ collapsed,options=[],itemUI= null,scrollViewStyles={} }) => {
    const [shown, setShown] = React.useState(false);
    const animationDropdown = React.useRef(new Animated.Value(0)).current;
    const animationDropdownCollapse = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        if(collapsed && shown === true){
            Animated.timing(animationDropdownCollapse, {
                toValue:EXP_HEIGHT,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if(finished){
                    setShown(false);
                    animationDropdownCollapse.setValue(0);
                }
            });
        }else if(!collapsed){
            Animated.timing(animationDropdown, {
                toValue:EXP_HEIGHT,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(finished => {
                if(finished){
                    setShown(true);
                    animationDropdown.setValue(0);
                }
            });
        }
    }, [collapsed]);
    return (
        <ScrollView style={{ position:'absolute',display:!collapsed || shown === true?'flex':'none',maxHeight:250, overflow: 'hidden',width:'100%',borderBottomRightRadius:12,borderBottomLeftRadius:12,zIndex:3999,...scrollViewStyles }}>
            <Animated.View style={{
                backgroundColor:'white',
                marginBottom:10,
                transform: [shown? {
                    translateY:animationDropdownCollapse.interpolate({
                        inputRange:[0,EXP_HEIGHT],
                        outputRange:[0,-300]
                    })
                }:{
                    translateY:animationDropdown.interpolate({
                        inputRange:[0,EXP_HEIGHT],
                        outputRange:[-300,0]
                    })
                }]
            }}>
                {
                    options.map((item, index) => (
                        itemUI?itemUI(item,index,collapsed):<View key={index}></View>
                    ))
                }

            </Animated.View>
        </ScrollView>
    );
}
export default Dropdown;