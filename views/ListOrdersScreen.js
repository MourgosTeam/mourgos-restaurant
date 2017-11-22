import React from 'react';
import { TouchableOpacity, Text, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import API from '../helpers/net';


class OrderRow extends React.Component{
  constructor(props){
    super(props);
    this.statusTexts = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ', 'ΕΤΟΙΜΑΣΤΗΚΕ','ΣΤΑΛΘΗΚΕ'];
    this.highlightColors = [colors.main, colors.lightgreen, colors.lightgreen];
    this.highlight = {
      color: this.highlightColors[this.props.data.Status]
    };
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
                <Text style={styles.orderRowRightText, styles.centerText, styles.boldText , this.highlight} adjustsFontSizeToFit={true} numberOfLines={1}>
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
export default class ListOrdersScreen extends React.Component {
  static navigationOptions = {
    title: 'Παραγγελίες',
  };

  constructor(props){
    super(props);
    const imageBaseURL = "http://mourgos.gr";
    const { navigate } = props.navigation;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource : ds.cloneWithRows([]),
      ImageUrl : require('../img/mourgos-logo-white.png')
    }
    API.getWithToken("catalogues/my").
    then((data) => {
      let img = (imageBaseURL + data[0].Image);
      this.setState({ 
        ImageUrl : {uri : img}
      });
    }).then( () =>       
    API.getWithToken("orders/my")).
    then( (data) => {
      this.setState({
        dataSource : ds.cloneWithRows(data)
      }); 
    }).catch( (err) => {
      console.log("Ok this is handled ");
      console.log(err);

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
       
        <View style = {styles.header}>
          <Image
            source = {this.state.ImageUrl}
            style = {{height: 70, margin: 40}}
            resizeMode = 'contain'
          />          
        </View>
        <ListView style={styles.orderList}
            enableEmptySections={true} 
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <OrderRow data={rowData} onPress={this.goToOrder}/>}
          />
      </KeyboardAvoidingView>
    );
  }
}
