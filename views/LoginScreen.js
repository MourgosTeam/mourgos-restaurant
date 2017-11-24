import React from 'react';
import { Text, KeyboardAvoidingView, View, Image, TextInput, Button, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Σύνδεση',
  };

  constructor(props){
    super(props);
    const { navigate } = this.props.navigation;
    AsyncStorage.getItem("@Mourgos:token").then( (data) => navigate("OrdersStack"));

  }
  loggedIn = (user) =>{
    const { navigate } = this.props.navigation;
    console.log(user);
    if(!user.token)return;
    AsyncStorage.setItem("@Mourgos:token", user.token).
    then( () => navigate("OrdersStack"))

  }
  render() {
    const { navigate } = this.props.navigation;
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
