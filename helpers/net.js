import { AsyncStorage, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation'

import SocketIOClient from 'socket.io-client';

const baseURL = "https://mourgos.gr/api/";
//const baseURL = "http://192.168.2.4:3000/";

var DEBUG = false;
var info = (msg) => {
	if(DEBUG)console.log(msg + "\n");
}
function jsonForm(data){
      if(data && data.status && data.status === 200){
        return data.json();
      }
      info(data);
      return Promise.reject("This is not json or there is an error with this data.");
}

//let socket = SocketIOClient('http://mourgos.gr?id=all', { path: "/api/socket.io/" });
function getSocket(id) {
      let socket = SocketIOClient('https://mourgos.gr?id='+id, { path: "/api/socket.io/" });
      //let socket = SocketIOClient('http://192.168.2.4:3000?id='+id, { path: "/socket.io/" });
      socket.on('connect', function() {
         console.log("socket connect!");
      });

      socket.on('connect_error', function() {
         console.log(" connect_error");
      });

      socket.on('connect_timeout', function() {
         console.log("connect_timeout");
      });

      socket.on('error', function() {
         console.log("  socket error!");
      });

      socket.on('disconnect', function() {
         console.log("disconnect!");
      });

      socket.on('reconnect', function() {
         console.log("Sorry, socket reconnect!");
      });

      socket.on('reconnect_attempt', function() {
         console.log("Sorry, socket reconnect_attempt!");
      });
      socket.on('reconnecting', function() {
         console.log("Sorry, socket reconnecting!");
      });
      socket.on('reconnect_error', function() {
         console.log("Sorry, socket reconnect_error!");
      });
      socket.on('reconnect_failed', function() {
         console.log("Sorry, socket reconnect_failed!");
      });
      return socket;
}
export default {
	checkSession : function(navigation){
		let Token = null;
        info("Checking session...");
        return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
            Token = token;
            return this.getIt("check/session",token);
        }).then((data) => {
            if( data === undefined ){
                info("There is no internet!");
                // Works on both iOS and Android
                Alert.alert(
                  'Αποτυχία Σύνδεσης',
                  'Δεν έχεις πρόσβαση στο Internet',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  { cancelable: false }
                )
                throw Error("No net");
            } else if(data.status === 403) {
                info("We have an error here... Lets see");
                info("This is a forbidden response. This token is no more valid : " + Token);
                AsyncStorage.removeItem("@Mourgos:token").then(() => this.navigate(navigation, "Login", "Login"));
                throw Error("Forbidden! go login");
            } else {
                info(data.status);
                info("Session OK");
                return Token;
            }
        }).
        catch( (err) => {
            info("Cannot check session...");
            info(err);
        });
	},
	getIt : function(url, token){
		info("Getting : " + url);
		return fetch(baseURL+url, {
		  method: 'GET',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Token' : token
		  }
		})
	},
	postIt : function(url, json, token){
		info("Posting : " + url);
		return fetch(baseURL+url, {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Token' : token
		  },
		  body: JSON.stringify(json)
		})
	},
	getWithToken: function(url) {
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			return this.getIt(url,token).then(jsonForm);
        });
	},
	postWithToken: function(url,json) {
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			return this.postIt(url,json,token).then(jsonForm);
		});
	},
	resetNavi(navigation, route){
	    return navigation.dispatch(NavigationActions.reset(
        {
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: route})
            ]
        }));
  	},
    getSocket,
    navigate(navigation, routeName, route){
        console.log("Navigating");
        return navigation.dispatch(NavigationActions.navigate(
        {
            routeName: routeName,
            action: NavigationActions.navigate({ routeName: route })
        }));
    }
}