import React from 'react';
import { KeyboardAvoidingView, View, Image, TextInput, Button, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';

import Text from '../helpers/Text';
import API from '../helpers/net'

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Σύνδεση',
  }

  constructor(props){
    super(props);
    this.navigation = this.props.navigation;
  }

  componentWillMount(){
    console.log("Component Login will mount!");
    this._mounted = true;
    AsyncStorage.getItem("@Mourgos:token").then( (data) => {
      if(data !== null )
        API.checkSession(this.navigation).then( () => {
          if(this._mounted)
            API.resetNavi(this.navigation, "HomeStack")
        });
    });
  }

  componentWillUnmount(){
    this._mounted = false;
  }
  
  loggedIn = (user) => {
    console.log(user);
    if(!user.token)return;
    AsyncStorage.setItem("@Mourgos:token", user.token).
    then( () =>   API.checkSession(this.navigation) ).
    then( () =>   API.resetNavi(this.navigation, "HomeStack") );
  }
  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <View style = {styles.header}>
          <Image
            source = {require('../img/mourgos-logo-white.png')}
            style = {{height: 100, padding: 50}}
            resizeMode = 'contain'
          />
          <Text style = {styles.pageTitle}>Καλωσήρθατε!</Text>
        </View>
        <LoginForm onLogin={this.loggedIn}/>
        
      </KeyboardAvoidingView>
    );
  }
}
