import React, { Component } from "react";
import { StyleSheet, View, Button, Touchable, Text, } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";


import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class LogoutScreen extends Component{
    componendDidMount(){
        firebase.auth().signOut();
    }
    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>Logout</Text>
            </View>
        )
    }
}