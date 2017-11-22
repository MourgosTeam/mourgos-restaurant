import { AsyncStorage } from 'react-native';

const baseURL = "http://mourgos.gr/api/";

export default {
	getIt : function(url, token){
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
		}).catch( (err)=>{
			console.log("OK this is handle in .net but why?");
			console.log(err);
		});
	},
	postWithToken: function(url,json) {
		return AsyncStorage.getItem("@Mourgos:token").then( (token) => {
			return this.postIt(url,json,token).then((data) => data.json());
		}).catch( (err)=>{
			console.log("OK this is handle in .net but why?");
			console.log(err);
		});
	}
}