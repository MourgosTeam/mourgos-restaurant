import { StyleSheet } from 'react-native';

export let colors = {
  main: '#EE6055',
  secondary: '#0D3B66',
  dark: '#3E3449',
  light: '#FBF5DD',
  white: '#FCFCFF',
  lightgray : '#FAFAFA',
  gray : '#CECECE',
  lightgreen: '#60EE55'
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
  orderRow : {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection : 'row',
    padding: 5,
    margin: 5,
    justifyContent: 'space-between',
    borderWidth:  1,
    borderColor: colors.gray,
    alignItems: 'center'
  },
  orderRowLeft: { 
    flex  : 3,
    borderRightWidth: 2,
    paddingRight: 5
  },
  orderRowRight : {
    paddingLeft: 5,
    flex: 2 
  },
  orderRowPrice : {
    textAlign: 'left' 
  },
  orderRowLeftText: {
    fontSize: 16
  },
  orderRowLeftDescription: {
    fontSize: 12
  },
  orderRowRightText: {
    fontSize: 12
  },
  smallText: {
    fontSize : 12
  },
  bigText : {
    fontSize : 16
  },
  boldText : {
    fontWeight: 'bold'
  },
  rightText : {
    textAlign : 'right'
  },
  leftText : {
    textAlign : 'left'
  },
  centerText : {
    textAlign : 'center'
  },
  orderDetailsContainer : {
    borderWidth : 1,
    borderColor : colors.lightgray,
    padding : 30,
    backgroundColor : colors.white,
    width: '100%'  
  },
  orderContainer: {
    backgroundColor: colors.gray,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding : 30
  },
  orderDetailsHeader : {
    fontSize : 22,
    color : colors.white,
    paddingBottom: 10
  },
  orderDetailsAttributes : {
    fontSize : 14,
    color : colors.gray
  },
  orderDetailsProducts : {
    fontSize : 16,
    color : colors.dark
  }
});