import React, { lazy } from 'react';
import { ColorValue } from 'react-native';
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import View from './View';

interface Props{
    type?: 'Ionicons' | 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Fontisto' | 'MaterialCommunityIcons' | 'MaterialIcons' | "Foundation" | "SimpleLineIcons" | 'Zocial' | 'Octicons';
    style?: StyleProp<ViewStyle>;
    name?: string;
    size?: number;
    color?: ColorValue;
    onPress?: (event: GestureResponderEvent) => void;

    brand?: boolean;//ONLY FOR FontAwesome5
    solid?: boolean; //ONLY FOR FontAwesome5
}
const defaultProps = {
    type: 'Ionicons',
    name: 'ios-camera',
    color: '#757575',
    size: 20,
    style: null,
    onPress:undefined,
}


  const VectorIcon =(props: Props) =>{


    switch (props.type) {
        case "AntDesign": {
            const AntDesign = require(`react-native-vector-icons/AntDesign`).default;
            return (
              <AntDesign
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "Entypo": {
            const Entypo = require("react-native-vector-icons/Entypo").default;
            return (
              <Entypo
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "SimpleLineIcons": {
            const SimpleLineIcons = require("react-native-vector-icons/SimpleLineIcons").default;
            return (
              <SimpleLineIcons
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "EvilIcons": {
            const EvilIcons = require("react-native-vector-icons/EvilIcons").default;
            return (
              <EvilIcons
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "MaterialIcons": {
            const MaterialIcons = require("react-native-vector-icons/MaterialIcons") .default;
            return (
              <MaterialIcons
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "FontAwesome": {
            const FontAwesome = require("react-native-vector-icons/FontAwesome").default;
            return (
              <FontAwesome
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "FontAwesome5": {
            const FontAwesome5 = require("react-native-vector-icons/FontAwesome5").default;
            return (
              <FontAwesome5
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
                brand={props.brand}
                solid={props.solid}
              />
            );
          }
          case "Foundation": {
            const Foundation = require("react-native-vector-icons/Foundation").default;
            return (
              <Foundation
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "MaterialCommunityIcons": {
            const MaterialCommunityIcons = require("react-native-vector-icons/MaterialCommunityIcons").default;
            return (
              <MaterialCommunityIcons
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "Zocial": {
            const Zocial = require("react-native-vector-icons/Zocial").default;
            return (
              <Zocial
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "Octicons": {
            const Octicons = require("react-native-vector-icons/Octicons").default;
            return (
              <Octicons
              {...props}
              name={props.name}
              size={props.size}
              style={props.style}
              color={props.color}
              onPress={props.onPress}
              />
            );
          }
          case "Fontisto": {
            const Fontisto = require("react-native-vector-icons/Fontisto").default;
            return (
              <Fontisto
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
          case "Feather": {
            const Feather = require("react-native-vector-icons/Feather").default;
            return (
              <Feather
                   {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
          }
        default: {
            const Ionicons = require("react-native-vector-icons/Ionicons").default;
            return (
              <Ionicons
                {...props}
                name={props.name}
                size={props.size}
                style={props.style}
                color={props.color}
                onPress={props.onPress}
              />
            );
        }
    }//end of SWITCH 

  }//end of VECTOR ICON
  
  VectorIcon.defaultProps=defaultProps;
  export default VectorIcon