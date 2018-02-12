import React from 'react';
import { TouchableOpacity,  KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import API from '../helpers/net';
import Constants from '../helpers/constants.js';

import Text from '../helpers/Text';

import SocketIOClient from 'socket.io-client';


class OrderRow extends React.Component{
  constructor(props){
    super(props);
    this.statusTexts = Constants.statusText;
    this.highlightColors = Constants.highlightColors; 
    this.bg = props.data.Status === "0" ? colors.secondary : colors.main;
    this.state = {
      highlightColor: this.highlightColors[props.data.Status]
    };
  }


  componentWillReceiveProps(props){
    this.bg = props.data.Status === "0" ? colors.secondary : colors.main;
    this.setState({
      highlightColor: this.highlightColors[props.data.Status]
    });
  }

  render() {
    const d = new Date(this.props.data.PostDate);
    let dateString = d.getDate() + "/" + (d.getMonth() + 1);
    return (<TouchableOpacity style={{backgroundColor : this.bg}} onPress={() => this.props.onPress(this.props.data.id)}>
            <View style = {styles.orderRow}>
              <View style = {styles.orderRowLeft}>
                <Text style={[styles.orderRowLeftText, styles.boldText]}>
                  {this.props.data.id.toUpperCase()} - {this.props.data.Address}
                </Text>
                <Text style={styles.orderRowLeftDescription}>
                  {this.props.data.FullDescription.map((data,index) => {
                    var s =  `${data.Quantity} x ${data.Name}  \n`;
                    s += data.Attributes.map( (attr) => {
                      return `${attr.Name} - ${attr.Value}` + ((attr.Price>0)? `+ ${attr.Price}` : '') + '';
                    }).join('\n') + '\n';  
                    return s;
                  })}
                </Text>
              </View>
              <View style = {styles.orderRowRight}>
                <Text style={[styles.orderRowRightText, styles.centerText, styles.boldText, {color: this.state.highlightColor} ]} adjustsFontSizeToFit={true} numberOfLines={1}>
                  { this.statusTexts[this.props.data.Status] }
                </Text> 
                <Text style={[styles.orderRowRightText, styles.centerText]}>  
                  { parseFloat(this.props.data.Total).toFixed(2) } €
                </Text>
                <Text style={styles.smalldate}>
                  { dateString }
                </Text>
              </View>
            </View> 
            </TouchableOpacity>);
  }
}
const imageBaseURL = "http://mourgos.gr";
export default class ListOrdersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let title = 'Παραγγελίες';
    let headerRight = (
      <View style={styles.logoutButton}>
        <View style={{paddingRight: 5}}>
          <Button
            title="Refresh"
            onPress={params.refresh ? params.refresh : () => null}
          />
        </View>
        <Button
          title="Logout"
          onPress={params.logout ? params.logout : () => null}
        />
      </View>
    );
    return { title, headerRight };
  };
  componentWillUnmount(){
    this._mounted = false
    this.closeTimer();
  }
  componentWillMount(){this._mounted = true}

  componentDidMount(){
    this.navigation.setParams({ logout: this.logout, refresh: this.loadOrders });
  }

  constructor(props){
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this._setState = this.setState;
    this.setState = (...args) => {
      if(this._mounted)
        this._setState(...args);
    }

    this.navigation = props.navigation;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource : this.ds.cloneWithRows([]),
      ImageUrl : require('../img/mourgos-logo-white.png')
    }
    
    this.loadCatalogue().then( () => this.loadOrders()).catch( (err) => {
      console.log(err);
      API.checkSession(this.navigation);
    });   


    this.soundObject = new Expo.Audio.Sound();
    this.prepareSound();
  }

  setupSockets = (id) => {
    this.socket = API.getSocket(id);
    this.socket.on('connect', () => {
      console.log("Connected to webSocket!")
    });
    this.socket.on('new-order', () => {
      this.playSound();
      this.loadOrders();
    });
    this.socket.on('update-order', () => {
      console.log("Order update!!")
      this.loadOrders();
    });
    this.socket.on('connect_failed', function() {
       console.log("Sorry, there seems to be an issue with the connection!");
    });
    this.socket.on('error', function() {
       console.log("Sorry,error");
    });
  }

  setupTimer = () => {
    if(!this.timer) { 
      this.timer = setInterval(() => this.playSound(), 30000);
    }
  }
  closeTimer = () => {
    if(this.timer) {
      clearInterval(this.timer);
    }
    this.timer = undefined;
  }
  componentDidUpdate() {
    if(this.state.haveNewOrders) {
      this.setupTimer();
    } else {
      this.closeTimer();
    }
  }

  prepareSound = async () => {
      await Expo.Audio.setIsEnabledAsync(true);

      await Expo.Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: false,
        interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
      await this.soundObject.loadAsync(require('../assets/notification.mp3'));
  }
  playSound = async () => {
    console.log("Lets play sound");
    try {
      await this.soundObject.setPositionAsync(0);
      await this.soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      console.log("Error while trying to play sound!");
      console.log(error);
    }
  }

  logout = () => {
    console.log("Logging out...");
    this.closeTimer();
    return AsyncStorage.removeItem("@Mourgos:token").
    then(() => API.navigate(this.props.navigation,  "Login", "Login"));
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
        dataSource : this.ds.cloneWithRows(data),
        haveNewOrders: data.reduce((a,b) => a || b.Status === "0", false)
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
