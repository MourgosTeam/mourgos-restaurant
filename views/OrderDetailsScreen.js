import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'

import {styles, colors} from '../Styles';
import API from '../helpers/net';


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


    this.statusTexts = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ', 'ΕΤΟΙΜΑΣΤΗΚΕ','ΣΤΑΛΘΗΚΕ'];
    this.statusTexts[99] = 'ΑΠΟΡΡΙΦΘΗΚΕ';
    this.state = {
      order: {
        Status : 0,
        statusText : "",
        FullDescription: [],
        Address : "",
        Comments : ""
      }
    };
    const { navigate } = props.navigation;
    if(!props.navigation.state.params || !props.navigation.state.params.orderId){
      props.navigation.goBack();
      return;
    }
    this.code = props.navigation.state.params.orderId;
    API.checkSession(props.navigation.navigate).then( () => API.getWithToken("orders/" + this.code )).
    then((data) => {
      data.statusText = this.statusTexts[data.Status];
      API.getWithToken("orders/saw/" + this.code );
      this.setState({order:data});
    });
  }

  changeStatus = (statusCode) => {
    API.postWithToken("orders/" + this.code, { statusCode : statusCode }).
    then((order)=> this.props.navigation.goBack());
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
                  <Comments text={data.Comments} style={{paddingLeft:5, backgroundColor:colors.gray}} textStyle={{fontSize:10}}/>
                </View>
              })}
            </View>
            
            <Text style={ { fontSize : 16, paddingBottom:5 } }>
              Παράδοση
            </Text>
            <Text style={ { paddingBottom : 10 } }>
              {this.state.order.Address} 
            </Text>
            <Comments text={this.state.order.Comments} />

            <View>
              <Button
                title = "ΑΠΟΡΡΙΨΗ"
                color = {colors.main}
                onPress={() => this.changeStatus(99)}
              />
              <Button
                title = "ΕΤΟΙΜΑΣΤΗΚΕ"
                color = {colors.lightgreen}
                onPress={() => this.changeStatus(1)}
              />
            </View>
        </View>
      </View>
    );
  }
}
