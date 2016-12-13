var http = (function () {
	function get(url, callback, errorCallback) {
	    var request = new XMLHttpRequest();
	    request.onreadystatechange = function() { 
	    	handleRequest(request, callback, errorCallback);
	    }

	    request.open('GET', url, true); // true for asynchronous 
	    request.send(null);
	}

	function post(url, data, callback, errorCallback) {
	    var request = new XMLHttpRequest();

	    request.onreadystatechange = function() { 
	        handleRequest(request, callback, errorCallback);
	    }

	    request.open('POST', url, true); // true for asynchronous 

	    request.setRequestHeader('Content-type', 'application/json');

	    request.send(JSON.stringify(data));
	}

	function handleRequest(request, callback, errorCallback) {
	    if (request.readyState == 4) {
	    	handleFinishedResponse(request, callback, errorCallback);
	    }
	}

	function handleFinishedResponse(request, callback, errorCallback) {
    	if (request.status == 200) {
        	return callback(JSON.parse(request.responseText));
        }

        if (errorCallback) {
        	return errorCallback({
            	status: request.status,
            	message: request.responseText
            });
        }
	}

	return {
		post: post,
		get: get
	}
})();
