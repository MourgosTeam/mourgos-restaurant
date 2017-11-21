import React from 'react';
import { Text, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import API from '../helpers/net';

export default class ListOrdersScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελίες',
  };

  constructor(props){
    super(props);
    const { navigate } = props.navigation;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource : ds.cloneWithRows([]),
      ImageUrl : require('../img/mourgos-logo-white.png')
    }
    const baseURL = "http://mourgos.gr";
    AsyncStorage.getItem("@Mourgos:token").then( (token) => {
      API.getIt("catalogues/my", token).then((data)=>data.json()).
      then((data) => {
        let img = (baseURL + data[0].Image);
        this.setState({ 
          ImageUrl : {uri : img}
        });
      });      
      return API.getIt("orders/my",token);
    }).then( (data) => {
      return data.json();
    }).then( (data) => {
      this.setState({
        dataSource : ds.cloneWithRows(data)
      }); 
    }).catch( (err) => {
      console.log(err);
    });
  }
  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
       
        <View style = {styles.header}>
          <Image
            source = {this.state.ImageUrl}
            style = {{height: 70, padding: 30}}
            resizeMode = 'contain'
          />          
        </View>
        <ListView style={styles.orderList}
            enableEmptySections={true} 
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <View style = {styles.orderListItem}>
                                      <Text style = {styles.orderListItemText}>
                                        {rowData.Address} - {parseFloat(rowData.Total).toFixed(2)}
                                      </Text>
                                      <Text style = {styles.orderListItemText}>
                                        {rowData.id}
                                      </Text>

                                    </View>}
          />
      </KeyboardAvoidingView>
    );
  }
}
