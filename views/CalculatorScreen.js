import React from 'react';
import { TouchableOpacity, Text, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import API from '../helpers/net';
import Constants from '../helpers/constants';

import SocketIOClient from 'socket.io-client';

import DatePicker from 'react-native-datepicker'


export default class CalculatorScreen extends React.Component {
  static navigationOptions = {
    title: 'Κέρδος',
  };
 
  constructor(props){
    super(props);



    this.state = {
      date: this.today(0),
      numberOfOrders: 0,
      gain: 0,
      tziros: 0,
      allOrders: []
    }
    
    setTimeout( () => this.loadOrders(), 0);
  }

  goToOrder = (orderId) => {
    this.props.navigation.navigate("OrderDetails",{orderId : orderId});
  }

  loadOrders = ()=>{
    return API.getWithToken("orders/my").
    then( (data) => {
      this.setState({
        orders : data
      }); 
      this.filter(data, this.state.date);
    });
  }

  filter = (orders, date) => {
    const filtered = [];
    for (var i=0;i<orders.length;i+=1) {
      if (this.filterOrderDate(orders[i], date)) {
        filtered.push(orders[i]);
      }
    }
    this.setState({
      filteredOrders: filtered,
      date
    });
    this.caclculateNumbers(filtered);
  }

  filterOrderDate = (order, date) => {
    let temp = this.today(0,order.PostDate);
    return temp === date;
  }
  caclculateNumbers = (filtered) => {
    let tziros = 0;
    for (var i=0;i<filtered.length;i+=1) {
      tziros += parseFloat(filtered[i].Total);
    }
    let gain = (tziros * (1-Constants.gainMultiplier)).toFixed(2);
    let numberOfOrders = filtered.length;
    tziros = tziros.toFixed(2);
    this.setState({
      tziros,
      gain,
      numberOfOrders
    })
  }

  today = (d, initial) => {
    var today = initial ? new Date(initial) : new Date();
    today.setDate(today.getDate() + d);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd;
    } 
    if(mm<10){
      mm='0'+mm;
    } 
    var today = dd+'/'+mm+'/'+yyyy;
    return today;
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <View style = {styles.calculatorContainer}>
          <View style = {styles.calculatorgain}>
            <Text style = {styles.gainText}>Κέρδος</Text>
            <Text style = {styles.smallgainText}>({this.state.date})</Text>
            <Text style = {styles.gainText}>
            {this.state.gain}
            </Text>
            <View style = {styles.smallgainContainer}>
              <View style = {{ alignItems: 'center' }}>
                <Text style = {styles.smallgainText}>Τζίρος</Text>
                <Text style = {styles.smallgainText}>{this.state.tziros}</Text>
              </View>
              <View style = {{ alignItems: 'center' }}>
                <Text style = {styles.smallgainText}>Παραγγελίες</Text>
                <Text style = {styles.smallgainText}>{this.state.numberOfOrders}</Text>
              </View>
              <View style = {{ alignItems: 'center' }}>
                <Text style = {styles.smallgainText}>Μεση Τιμη α.π.</Text>
                <Text style = {styles.smallgainText}>{this.state.numberOfOrders && (this.state.tziros / this.state.numberOfOrders)}</Text>
              </View>
              {
                // Add more info here  f.e. number of orders 
              }
            </View>
          </View>
          <View style = {styles.calculatorbuttons}>
            <View style = {styles.calculatorbutton}>
              <Button title="Σήμερα" color={colors.dark} 
                     onPress={() => this.filter(this.state.orders, this.today(0))}/> 
            </View>
            <View style = {styles.calculatorbutton}>
              <Button title="Χθές" color={colors.dark}
                    onPress={() => this.filter(this.state.orders, this.today(-1))}/> 
            </View>
            {
              // today yesterday last week
            }
          </View>

          <View style = {styles.selectDate}>
                  <DatePicker
                    style={{width: 200}}
                    date={this.state.date}
                    mode="date"
                    placeholder="Επέλεξε ημερομηνία"
                    format="DD/MM/YYYY"
                    minDate="06/02/2017"
                    maxDate="06/02/2119"
                    confirmBtnText="Επιλογή"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {this.filter(this.state.orders, date)}}
                  />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
