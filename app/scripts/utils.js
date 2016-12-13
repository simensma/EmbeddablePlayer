var utils = (function () {
	return {
		parseGetParams: parseGetParams
	};

	function parseGetParams() {
		if(!location.search){ return null; }

		var getParams = location.search.substring(1);
		return JSON.parse('{"' + decodeURI(getParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	}

})();