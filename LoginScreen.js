import React from 'react';
import { Text, KeyboardAvoidingView, View, Image, TextInput, Button } from 'react-native';
import {styles, colors} from './Styles';
import LoginForm from './LoginForm';

export default class LoginScreen extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <View style = {styles.header}>
          <Image
            source = {require('./img/mourgos-logo-white.png')}
            style = {{height: 100, padding: 50}}
            resizeMode = 'contain'
          />
          <Text style = {styles.pageTitle}>Καλωσήρθατε!</Text>
        </View>
        <LoginForm />
        
      </KeyboardAvoidingView>
    );
  }
}
