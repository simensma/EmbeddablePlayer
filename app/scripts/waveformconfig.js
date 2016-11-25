var waveform = (function (http, Waveform) {
	console.log('WAVEFORM');
	console.log(Waveform)

	var self = {};


    var BAR_WIDTH = 1, BAR_PADDING = 1; //px
    var MAX_UPDATE_INTERVAL = 30; // ms


	function init() {
		http.get('https://static-test.skiomusic.com/' + self.project.previewWaveform, addWaveform);
	}

	function addWaveform(waveformJson) {

		var viewElement = document.querySelector('.waveform')
		self.waveform = new Waveform(viewElement, waveformJson.samples, getWaveformOptions());
		console.log(waveformJson)
	}


	function getWaveformOptions(waveformJson) {
        return {
            barWidth: BAR_WIDTH,
            barPadding: BAR_PADDING,
            resizeWithWindow: true,
            mirrored: false
        };
    }

    function renderWaveform(project) {
    	self.project = project;
    	init();
    }

    function seek(position) {
    	self.waveform.seek(position);
    }

	return {
		renderWaveform: renderWaveform,
		seek: seek
	};
})(http, Waveform);
