import React from 'react'; 
import {styles,colors} from './Styles';
import LoginScreen from './views/LoginScreen';
import ListOrdersScreen from './views/ListOrdersScreen';
import OrderDetailsScreen from './views/OrderDetailsScreen';
import HistoryScreen from './views/HistoryScreen';

import {View, Text, Platform, StatusBar} from 'react-native';
import Tabs from 'react-native-tabs';


import {StackNavigator, TabNavigator} from 'react-navigation';
const OrderNavi = StackNavigator({
  Orders: { 
    screen: ListOrdersScreen,
    navigationOptions: {
      title: 'Παραγγελίες',
    }
  },
  OrderDetails: { screen: OrderDetailsScreen }  
},{
  headerMode : 'float'
});
const HomeStack = TabNavigator({
  OrdersStack: { screen: OrderNavi },
  // History: { 
  // 	screen: HistoryScreen,
  // 	navigationOptions: {
  //     title: 'Ιστορικό',
  //   }
  // }
}
, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: colors.white,
    style: {
      backgroundColor: colors.secondary,
    }
  }
});
const RootNavi = StackNavigator({
  Login : {
    screen : LoginScreen
  },
  HomeStack : {
    screen : HomeStack
  }
}, {
  headerMode : 'none',
  cardStyle: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor : '#000'
  }
});

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {page:'second'};
	}
  	render() {
    	return ( 
			  <RootNavi styles={styles.mainContainer}/> 
	    );
	}
}


export default App;