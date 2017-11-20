import React from 'react';
import { Text, KeyboardAvoidingView, View, Image, TextInput, Button } from 'react-native';
import {styles, colors} from './Styles';
import LoginFormInput from './LoginForm';

export default class LoginForm extends React.Component {
  render() {
    return (
      <View
        style = {styles.loginForm}>
        <LoginFormInput
          name = 'Αναγνωριστικό καταστήματος'
        />
        <LoginFormInput
          name = 'Κωδικός πρόσβασης'
          secureTextEntry = {false}
        />
        <Button
          title = "Συνδεση"
          color = {colors.dark}
        />
      </View>
    );
  }
}
