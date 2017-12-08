import React from 'react';
import { KeyboardAvoidingView, View, Image, TextInput, Button } from 'react-native';
import {styles, colors} from '../Styles';
import LoginFormInput from './LoginFormInput';
import API from '../helpers/net';
import Text from '../helpers/Text';

export default class LoginForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      username : "",
      password : ""
    }
  }

  login = () => {
    var user = {
      username : this.state.username,
      password : this.state.password
    };
    console.log(user);
    API.postIt("users/login",user).then((data) => {
      if(data.status !== 200){
        Alert.alert(
          'Αποτυχία σύνδεσης',
          'Λάθος στοιχεία',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        return Promise.reject("Bad credentials");
      }
      else{
        return data.json();
      }
    }).
    then((data) => this.props.onLogin(data)).
    catch( (err) => null);
  }

  render() {
    return (
      <View
        style = {styles.loginForm}>
        <LoginFormInput
          name = 'Αναγνωριστικό καταστήματος'
          onChange = { (val) => this.setState({username:val}) }
          value = {this.state.username}
          style={styles.loginTextInput}
        />
        <LoginFormInput
          name = 'Κωδικός πρόσβασης'
          secureTextEntry = {true}
          onChange = { (val) => this.setState({password:val}) }
          value = {this.state.password}
          style={styles.loginTextInput}
        />
        <Button
          title = "Συνδεση"
          color = {colors.dark}
          onPress={this.login}
        />
      </View>
    );
  }
}
