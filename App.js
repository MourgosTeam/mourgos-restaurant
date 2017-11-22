import React from 'react';
import {styles,colors} from './Styles';
import LoginScreen from './views/LoginScreen';
import ListOrdersScreen from './views/ListOrdersScreen';
import OrderDetailsScreen from './views/OrderDetailsScreen';

import {StackNavigator} from 'react-navigation';
const Navi = StackNavigator({
  Home: { screen: LoginScreen },
  Orders: { screen: ListOrdersScreen },
  OrderDetails: { screen: OrderDetailsScreen },
});

class App extends React.Component {
  render() {
    return (
      <Navi />
    );
  }
}


export default App;