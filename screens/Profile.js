import React, { Component } from "react";
import { StyleSheet, View, Button, Touchable, Text, SafeAreaView, Platform,StatusBar,Image,Dimensions, Switch} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      lightTheme: true,
      profile_img: '',
      userName: ''
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser(){
    var theme, name, img;
    await firebase.database().ref("/users/"+firebase.auth().currentUser.uid).
    on("value",function(snapshot){
      theme=snapshot.val().current_theme
      name='${snapshot.val().first_name} ${snapshot.val().last_name}'
      img=snapshot.val().profile_picture
    })
    this.setState({
      lightTheme: theme==="light" ? true : false,
      isEnabled: theme==="light" ? false : true,
      userName: name,
      profile_img: img
      })
  }

  toggleSwitch(){
    const prevState = this.state.isEnabled;
    const theme = !this.state.isEnabled ? "dark" : "light";
    var updates = {};
      updates["/users/"+firebase.auth().currentUser.uid+"/current_themes"]=theme;
      firebase.database().ref().update(updates);
      this.setState({
        isEnabled: !prevState, 
        lightTheme: prevState
      })
    }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
      <View style={styles.container}>
        <SafeAreaView style={styles.droidSafeArea}/>
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image source={require("../assets/logo.png")} style={styles.iconImage}/>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>StoryTelling App</Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
              <Image source={{uri: this.state.profile_img}} style={styles.profileImage}/>
              <Text style={styles.nameText}>{this.state.userName}</Text>
            </View>
            <View style={styles.themeContainer}>
              <Text style={styles.themeText}>Dark Theme</Text>
              <Switch style={{transform:[{scaleX:1.3},{scaleY:1.3}]}}>
                trackColor={{false:"#767577",true:"white"}}
                thumbColor={this.state.isEnabled ? "#EE8249" : "#F4F3F4"}
                onValueChange={()=>this.toggleSwitch()}
                value={this.state.isEnabled}
              </Switch>
            </View>
          </View>
      </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  screenContainer: {
    flex: 0.85
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70)
  },

  nameText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  nameTextLight: {
    color: "black",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20)
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  },
  themeTextLight: {
    color: "black",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  }
});
