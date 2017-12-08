import { AsyncStorage, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation'

//const baseURL = "http://mourgos.gr/api/";
const baseURL = "http://192.168.1.10:3000/";

var DEBUG = true;
var info = (msg) => {
	if(DEBUG)console.log(msg + "\n");
}
function jsonForm(data){
       if(data && data.status && data.status === 200){
               return data.json();
       }
       return Promise.reject("This is not json or there is an error with this data.");
}

//let socket = SocketIOClient('http://mourgos.gr?id=all', { path: "/api/socket.io/" });
function getSocket(id) {
       return SocketIOClient('http://192.168.1.10:3000?id=' + id, { path: "/socket.io/" });
}
export default {
	checkSession : function(navigate){
		info("Checking session...");
               let Token = null;
                return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
                        console.log("Token : " + token);
                        Token = token;
                        return this.getIt("check/session",token);
                }).then((data) => {
                        if( data === undefined ){
                                info("There is no internet!");
                                // Works on both iOS and Android
                                Alert.alert(
                                  'Αποτυχία σύνδεσης',
                                  'Δέν έχεις πρόσβαση στο Internet',
                                  [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                  ],
                                  { cancelable: false }
                                )
                        }
                        else if(data.status === 403){
                                info("We have an error here... Lets see");
                                return AsyncStorage.removeItem("@Mourgos:token").then(() => navigate("Login"));
                        }
                        else{
                                console.log(data.status);
                                info("OK");
                                return Promise.resolve(Token);
                        }
                }).catch( (err) => {
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
    getSocket
}