import { StyleSheet } from 'react-native';

export let colors = {
  main: '#EE6055',
  secondary: '#0D3B66',
  dark: '#3E3449',
  light: '#FBF5DD',
  white: '#FCFCFF',
  lightgray : '#FaFaFa'
};

export let styles = StyleSheet.create({
  container: {
    backgroundColor: colors.main,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
  },

  pageTitle: {
    alignItems: 'center',
    fontSize: 40,
    color: colors.white,
  },

  loginForm: {
    width: '80%'
  },

  textInput: {
    padding: 10,
    color: colors.dark
  },
  orderList: {
    width:'97%',

  },
  orderListItem: {
    alignItems: 'center',
    padding: 5,
    margin: 5,
    backgroundColor: colors.lightgray,
    width: '100%'
  },
  orderListItemText: {
    color : colors.secondary
  }
});
