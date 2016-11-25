var http = (function () {
	
	function get(url, callback) {
	    var request = new XMLHttpRequest();
	    request.onreadystatechange = function() { 
	        if (request.readyState == 4 && request.status == 200)
	            callback(JSON.parse(request.responseText));
	    }

	    request.open("GET", url, true); // true for asynchronous 
	    request.send(null);
	}

	function post(url, data, callback) {
	    var request = new XMLHttpRequest();

	    request.onreadystatechange = function() { 
	        if (request.readyState == 4 && request.status == 200)
	            callback(JSON.parse(request.responseText));
	    }

	    request.open("POST", url, true); // true for asynchronous 

	    request.setRequestHeader('Content-type', 'application/json');

	    request.send(JSON.stringify(data));
	}

	return {
		post: post,
		get: get
	}
})();
