'use strict';

import React, {Component} from 'react';
import { Text } from 'react-native';
 
export default class AppText extends Component {
  constructor(props) {
    super(props);
    // Put your default font styles here. 
    this.style = [{fontSize: 14, color: '#000000'}]; 
    if( props.style ) {
      if( Array.isArray(props.style) ) {
        this.style = this.style.concat(props.style);
      } else {
        this.style.push(props.style);
      }
    }
    this.state = {
      style : this.style
    };
  }
  componentWillReceiveProps(props) {
    this.style = [{fontSize: 14, color: '#000000'}]; 
    if( props.style ) {
      if( Array.isArray(props.style) ) {
        this.style = this.style.concat(props.style);
      } else {
        this.style.push(props.style);
      }
    }
    this.setState({
      style: this.style
    });
  }

  render() { return (
    <Text {...this.props} style={this.state.style}>
      {this.props.children}
    </Text>
  )}
}