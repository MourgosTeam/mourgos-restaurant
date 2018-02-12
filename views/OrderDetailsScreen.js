import React from 'react';
import { ScrollView, TouchableOpacity,  KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import API from '../helpers/net';

import Constants from '../helpers/constants';

import Text from '../helpers/Text';

class Comments extends React.Component {
  render() { 
    if(!this.props.text)return <View></View>;
    return (
      <View style={this.props.style || {}}>
        <Text style={ { fontSize : 19, paddingBottom:5 } , (this.props.textStyle || {}) }>
          Σχόλια
        </Text> 
        <Text style={ { paddingBottom : 10 } , (this.props.textStyle || {})}>
          { this.props.text } 
        </Text>
      </View>
     );
  } 
}

export default class OrderDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελία',
  };

  componentWillUnmount(){this._mounted = false}
  componentWillMount(){this._mounted = true}

  constructor(props){
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this._setState = this.setState;
    this.setState = (...args) => {
      if(this._mounted)
        this._setState(...args);
    }


    this.statusTexts = Constants.statusText;
    this.state = {
      order: {
        Status : 0,
        statusText : "",
        FullDescription: [],
        Address : "",
        Comments : "",
        id: ""
      }
    };
    if(!props.navigation.state.params || !props.navigation.state.params.orderId){
      props.navigation.goBack();
      return;
    }
    this.code = props.navigation.state.params.orderId;
    API.checkSession(props.navigation).then( () => API.getWithToken("orders/" + this.code )).
    then((data) => {
      data.statusText = this.statusTexts[data.Status];
      if(data.Status === "0")
        API.postWithToken("orders/saw/" + this.code, {} );
      this.setState({order:data});
    });
  }

  changeStatus = (statusCode) => {
    API.postWithToken("orders/" + this.code, { statusCode : statusCode }).
    then((order)=> this.props.navigation.goBack()).
    catch(() => true); //  Handled exception 
  }

  render() {
    const d = new Date(this.state.order.PostDate);
    let dateString = d.getHours() + ":" + d.getMinutes() + " - " + d.getDate() + "/" + (d.getMonth() + 1);
    return (
      <ScrollView style={{backgroundColor: colors.main}}>
      <View behavior = "padding"
        style = {styles.orderContainer}>
        <Text style={styles.orderDetailsHeader}> 
          {this.state.order.statusText}
        </Text>
        <View style={styles.orderDetailsContainer} >
            <Text style={ { fontSize : 18, paddingBottom:5, textAlign: 'center'} }>
              {this.state.order.id.toUpperCase()}
            </Text>
            <Text style={ { fontSize : 18, paddingBottom:5, textAlign: 'center'} }>
              Προιόντα 
            </Text> 
            <View style={styles.orderDetailsInner}>
              {this.state.order.FullDescription.map((data, index)=>{
                return <View key={index}>
                  <View style={{flexDirection:'row'}}>
                   <Text style={styles.orderDetailsQuantity}>{data.Quantity} x</Text>
                   <View style={styles.orderDetailsPanel}>
                    <Text style={styles.orderDetailsProducts}>{data.Name}</Text>
                    {data.Attributes.map((att,attindex)=>
                      <Text style={styles.orderDetailsAttributes} key={attindex}>
                        {att.Name} : {att.Value} 
                      </Text>
                    )}
                   </View>
                  </View>
                  <Comments text={data.Comments} style={{paddingLeft:5, backgroundColor:colors.gray}} textStyle={{fontSize:12}}/>
                </View>
              })}
            </View>
            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Ώρα και ημερομηνία
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              {dateString} 
            </Text>
            
            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Παράδοση
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              {this.state.order.Address} 
            </Text>
            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Τηλέφωνο Πελάτη
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              {this.state.order.Phone} 
            </Text>
            <Comments text={this.state.order.Comments} />

            <View style={styles.orderDetailsButtonsView}>
              <View style={{paddingBottom:7}}>
                <Button
                  title = "ΑΠΟΡΡΙΨΗ"
                  color = {colors.main}
                  onPress={() => this.changeStatus(99)}
                />
              </View>
              <View style={{paddingBottom:7}}>
                <Button
                  title = "ΕΤΟΙΜΑΖΕΤΑΙ"
                  color = {colors.lightgreen}
                  onPress={() => this.changeStatus(1)}
                />
              </View>
              <View style={{paddingBottom:7}}>
                <Button
                  title = "ΕΤΟΙΜΑΣΤΗΚΕ"
                  color = {colors.green}
                  onPress={() => this.changeStatus(2)}
                />
              </View>
            </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}
