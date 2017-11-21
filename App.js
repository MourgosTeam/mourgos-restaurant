import React from 'react';
import {styles,colors} from './Styles';
import LoginScreen from './views/LoginScreen';
import ListOrdersScreen from './views/ListOrdersScreen';

// export default class App extends React.Component {
//   render() {
//     return (
//       <LoginScreen />
//     );
//   }
// }

import {StackNavigator} from 'react-navigation';

const App = StackNavigator({
  Home: { screen: LoginScreen },
  Orders: { screen: ListOrdersScreen },
});
export default App;