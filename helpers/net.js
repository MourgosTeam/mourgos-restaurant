

export default {
	getIt : function(url){
		return fetch('http://mourgos.gr/api/'+url, {
		  method: 'GET',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  }
		})
	},
	postIt : function(url, json){
		return fetch('http://mourgos.gr/api/'+url, {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(json)
		})
	}
}