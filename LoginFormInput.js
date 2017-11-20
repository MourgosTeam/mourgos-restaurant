import React from 'react';
import { TextInput } from 'react-native';
import { styles, colors } from './Styles';

export default class LoginFormInput extends React.Component {
  defaultProps: {
    secureTextEntry: false
  }

  render() {
    return (
      <TextInput
        autoCapitalize = 'none'
        autoCorrect = {false}
        placeholder = {this.props.name}
        underlineColorAndroid = {colors.dark}
        placeholderTextColor = {colors.white}
        secureTextEntry = {this.props.secureTextEntry}
      />
    );
  }
}
