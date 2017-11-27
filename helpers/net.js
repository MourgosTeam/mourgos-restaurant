import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation'

const baseURL = "http://mourgos.gr/api/";

var DEBUG = true;
var info = (msg) => {
	if(DEBUG)console.log(msg + "\n");
}

export default {
	checkSession : function(navigate){
		info("Checking session...");
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			console.log("Token : " + token);
			return this.getIt("orders/my",token).then((data) => {
				console.log(data);
				if(data.status === 403){
					info("We have an error here... Lets see");
					return AsyncStorage.removeItem("@Mourgos:token").then(() => navigate("Login"));
				}
				else{
					return Promise.resolve(true);
				}
			});
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
			return this.getIt(url,token).then((data) => data.json());
		});
	},
	postWithToken: function(url,json) {
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			return this.postIt(url,json,token).then((data) => data.json());
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
  	}
}