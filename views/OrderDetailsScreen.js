import React from 'react';
import { TouchableOpacity, Text, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import API from '../helpers/net';

export default class OrderDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελία',
  };

  constructor(props){
    super(props);
    
    this.statusTexts = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ', 'ΕΤΟΙΜΑΣΤΗΚΕ','ΣΤΑΛΘΗΚΕ'];
    this.statusTexts[666] = 'ΑΠΟΡΡΙΦΘΗΚΕ';
    this.state = {
      order: {
        Status : 0,
        statusText : "",
        FullDescription: [],
        Address : ""
      }
    };
    const { navigate } = props.navigation;
    if(!props.navigation.state.params || !props.navigation.state.params.orderId){
      props.navigation.goBack();
      return;
    }
    this.code = props.navigation.state.params.orderId;
    API.getWithToken("orders/" + this.code ).
    then((data) => {
      console.log(data);
      data.statusText = this.statusTexts[data.Status];
      this.setState({order:data});
    });
  }
  changeStatus = (statusCode) => {
    API.postWithToken("orders/" + this.code, { statusCode : statusCode });
  }
  render() {
    return (
      <View behavior = "padding"
        style = {styles.orderContainer}>
        <Text style={styles.orderDetailsHeader}>
          {this.state.order.statusText}
        </Text>
        <View style={styles.orderDetailsContainer} >
            <Text style={ { fontSize : 18, paddingBottom:5 } }>Προιόντα</Text>
            <View style={ { paddingBottom : 5 } }>
              {this.state.order.FullDescription.map((data, index)=>{
                return <View key={index}>
                  <Text>{data.Quantity} x {data.Name}</Text>
                  {data.Attributes.map((att,attindex)=>
                    <Text style={styles.orderDetailsAttributes} key={attindex}>
                      {att.Name} : {att.Value} 
                    </Text>
                  )}
                </View>;
              })}
            </View>
            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Παράδοση
            </Text>
            <Text style={ { paddingBottom : 5 } }>
              {this.state.order.Address} 
            </Text>
            <View>
              <Button
                title = "ΑΠΟΡΡΙΨΗ"
                color = {colors.main}
                onPress={this.changeStatus(666)}
              />
              <Button
                title = "ΕΤΟΙΜΑΣΤΗΚΕ"
                color = {colors.lightgreen}
                onPress={this.changeStatus(1)}
              />
            </View>
        </View>
      </View>
    );
  }
}
