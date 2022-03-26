import * as React from "react";
import { ColorValue, StyleSheet, useWindowDimensions } from "react-native";
import View from "../../../components/atoms/View";
import constants from "../../../res/constants";

interface Props {
  children?: any;
  length?: number;
  selectedIndex?: number;
  selectedBarColor?: ColorValue;
  unSelectedBarColor?: ColorValue;

  selectedCircleColor?: ColorValue;
  unSelectedCircleColor?: ColorValue;
  barHeight?: number;
  circleSize?: number;
  customSelectedCircle?: () => React.ReactNode;

};

const defaultProps = {
  length: 5,
  selectedIndex: 5,
  selectedBarColor: '#F99E00',
  unSelectedBarColor: '#C1C1C1',

  selectedCircleColor: '#F99E00',
  unSelectedCircleColor: '#C1C1C1',
  barHeight: 2,
  circleSize: 10,
  customSelectedCircle: undefined,
}


const BarDottedLine = (props: Props) => {
  const dotLength = props?.length ?? defaultProps.length;
  const [selectedIndex, setSelectedIndex] = React.useState(props?.selectedIndex ?? defaultProps.selectedIndex);

  React.useEffect(() => {
    setSelectedIndex(props?.selectedIndex ?? defaultProps.selectedIndex);
  }, [props.selectedIndex])

  const percentage = selectedIndex < 2 ? 0 : ((selectedIndex - 1) / (dotLength - 1)) * 100;

  return (
    <View style={{ flexDirection: "row", alignItems: 'center', overflow: 'hidden', }}>

      {/* ****************** Start of BAR ****************** */}
      <View style={{ position: 'absolute', display: 'flex', top: 9, flexDirection: 'row', width: '100%', height: 20 }}>
        <View style={{
          width: `${percentage}%`,
          height: props.barHeight,
          backgroundColor: props.selectedBarColor,
        }} />
        <View style={{
          width: `${100 - percentage}%`,
          height: props.barHeight,
          backgroundColor: props.unSelectedBarColor,
        }} />
      </View>

      {/* ****************** End of BAR ****************** */}

      <View style={{ display: 'flex', justifyContent: "space-between", flexDirection: 'row', width: '100%', alignItems: 'center' }}>
        {new Array(dotLength).fill({}).map((_, index) => {
          return (
            <React.Fragment key={index}>

              {/* ****************** Start of CIRCLE ****************** */}
              {props.customSelectedCircle && index === selectedIndex - 1 ? props.customSelectedCircle() :
                <View style={{
                  height: props.circleSize,
                  width: props.circleSize,
                  borderRadius: props.circleSize,
                  backgroundColor: index < selectedIndex ? props.selectedCircleColor : props.unSelectedCircleColor
                }} />
              }

              {/* ****************** End of CIRCLE ****************** */}

            </React.Fragment>
          )
        })}

      </View>

    </View>

  );
}
BarDottedLine.defaultProps = defaultProps;
export default BarDottedLine;

const styles = StyleSheet.create({

})