var waveform = (function (http, Waveform) {

	var self = {};


    var BAR_WIDTH = 1, BAR_PADDING = 1; //px
    var MAX_UPDATE_INTERVAL = 30; // ms


	function init() {
		http.get('https://static-test.skiomusic.com/' + self.project.previewWaveform, addWaveform);
	}

	function addWaveform(waveformJson) {

		var viewElement = document.querySelector('.waveform')
		console.log(getWaveformOptions(waveformJson))
		self.waveform = new Waveform(viewElement, waveformJson.samples, getWaveformOptions(waveformJson));
		console.log(waveformJson)
	}


	function getWaveformOptions(waveformJson) {
        return {
            barWidth: BAR_WIDTH,
            barPadding: BAR_PADDING,
            waveform: waveformJson,
            resizeWithWindow: true,
            mirrored: true
        };
    }

    function renderWaveform(project) {
    	self.project = project;
    	init();
    }

    function seek(position) {
    	self.waveform.seek(position);
    }

    function getWaveform() {
    	return self.waveform
    }

	return {
		renderWaveform: renderWaveform,
		seek: seek,
		waveform: getWaveform
	};
})(http, Waveform);
