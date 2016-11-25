(function () {
	function parseGetParams() {
		if(!location.search){ return null; }

		var getParams = location.search.substring(1);
		return JSON.parse('{"' + decodeURI(getParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	}

	function init() {
		var params = parseGetParams();

		var username = params.username;
		var slug = params.slug;

		get(projectUrl(username, slug), projectLoaded);
	}

	function projectLoaded(project) {
		console.log("PROJECT LOADED");
		console.log(project);
		post(playerUrl(project.id), {slug: project.slug}, playerUrlLoaded);


	}

	function playerUrlLoaded(data) {
		console.log("PlayerURLLOADED");
		console.log(data);


	}


	function projectUrl(username, slug) {
		return 'https://static-test.skiomusic.com/profiles/'+username+'/projects/'+slug+'.json';
	}

	function playerUrl(id) {
		return 'https://api-test.skiomusic.com/projects/' + id + '/play_preview'
	}

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



	init();
})();
