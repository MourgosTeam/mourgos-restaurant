import React from 'react';
import { TouchableOpacity, Text, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import API from '../helpers/net';

import SocketIOClient from 'socket.io-client';


class OrderRow extends React.Component{
  constructor(props){
    super(props);
    this.statusTexts = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ', 'ΕΤΟΙΜΑΣΤΗΚΕ','ΣΤΑΛΘΗΚΕ'];
    this.statusTexts[99] = 'ΑΠΟΡΡΙΦΘΗΚΕ';
    this.highlightColors = [colors.main, colors.lightgreen, colors.lightgreen]; 
    this.description = this.props.data.FullDescription.map((data,index) => {
      var s =  `${data.Quantity} x ${data.Name} \n`;
      s += data.Attributes.map( (attr) => {
        return `${attr.Name} - ${attr.Value}` + ((attr.Price>0)? `+ ${attr.Price}` : '');
      }).join('\n');  
      return s;
    });
  }
  render() { 
    return (<TouchableOpacity style={{}} onPress={() => this.props.onPress(this.props.data.id)}>
            <View style = {styles.orderRow}>
              <View style = {styles.orderRowLeft}>
                <Text style={styles.orderRowLeftText, styles.boldText}>
                  {this.props.data.Address} - {this.props.data.Name}
                </Text>
                <Text style={styles.orderRowLeftDescription}>
                  {this.description}
                </Text>
              </View>
              <View style = {styles.orderRowRight}>
                <Text style={styles.orderRowRightText, styles.centerText, styles.boldText , {color: this.highlightColors[this.props.data.Status]}} adjustsFontSizeToFit={true} numberOfLines={1}>
                  { this.statusTexts[this.props.data.Status] }
                </Text> 
                <Text style={styles.orderRowRightText, styles.centerText}>  
                  { parseFloat(this.props.data.Total).toFixed(2) } €
                </Text>
              </View>
            </View> 
            </TouchableOpacity>);
  }
}
const imageBaseURL = "http://mourgos.gr";
export default class ListOrdersScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελίες',
  };
 
  constructor(props){
    super(props);
    const { navigate } = props.navigation;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource : this.ds.cloneWithRows([]),
      ImageUrl : require('../img/mourgos-logo-white.png')
    }
    
    this.loadCatalogue().then( () => this.loadOrders()).catch( (err) => {
      API.checkSession(navigate);
    });    
  }

  setupSockets = (id) => {
    this.socket = SocketIOClient('http://mourgos.gr?id='+id, { path: "/api/socket.io/" });
    this.socket.on('connect', () => {
    });
    this.socket.on('new-order', () => {
      console.log("NEW ORDER");
      this.loadOrders();
    });
    this.socket.on('connect_failed', function() {
       console.log("Sorry, there seems to be an issue with the connection!");
    });
    this.socket.on('error', function() {
       console.log("Sorry,error");
    });
  }

  loadCatalogue = ()=>{
    return API.getWithToken("catalogues/my").
    then((data) => {
      let img = (imageBaseURL + data[0].Image);
      this.setState({ 
        ImageUrl : {uri : img}
      });
      this.setupSockets(data[0].id);
    });
  }
  loadOrders = ()=>{
    return API.getWithToken("orders/my").
    then( (data) => {
      this.setState({
        dataSource : this.ds.cloneWithRows(data)
      }); 
    });
  }
  goToOrder = (orderId) => {
    this.props.navigation.navigate("OrderDetails",{orderId : orderId});
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <ListView style={styles.orderList}
            enableEmptySections={true} 
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <OrderRow data={rowData} onPress={this.goToOrder}/>}
          />
      </KeyboardAvoidingView>
    );
  }
}
