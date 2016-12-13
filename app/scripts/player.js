var player = (function (http, waveform, utils) {

	return Player;

	function Player(view, username, slug) {

		var ID = 'skpl-' + Math.floor(Math.random() * 100000);

		var self = this;

		var initialPosition = 0;
		var initialized = false;

		var JSON_URL = 'https://static-test.skiomusic.com';
		var API_URL = 'https://api-test.skiomusic.com';

		activate();

		/////////////////

		function activate() {
			self.view = view;

			addEventHandlers(self.view);

			http.get(projectUrl(username, slug), projectLoaded);

			soundManager.setup({
			   useFastPolling: true,
			   useHighPerformance: true,
			});
		}

		function projectLoaded(project) {
			self.project = project;
	
			loadAudioUrl(project);
			view.load(project);

			waveform.renderWaveform(project);
		}

		function loadAudioUrl(project) {
			http.post(playerUrl(project.id), {slug: project.slug}, setAudioUrl);
		}

		function setAudioUrl(data) {
			self.audioUrl = data['audioUrl'];
		}

		function projectUrl(username, slug) {
			return JSON_URL + '/profiles/'+username+'/projects/'+slug+'.json';
		}

		function playerUrl(id) {
			return API_URL + '/projects/' + id + '/play_preview'
		}

		function createAndPlaySound() {
			self.audio = soundManager.createSound({
				id: ID,
				url: self.audioUrl,
				autoPlay: true,
				autoLoad: true,
				onload: function () {
					setPosition(initialPosition);
				},
				whileplaying: function () {
					waveform.seek(self.audio.position/self.audio.durationEstimate);
				},
				onfinish: function () {
					waveform.seek(1);
					stop();
				}
			});

			initialized = true;
		}

		function play() {
			self.view.showPlayingButton();

			if(!isPlaying()) {
				return doPlay()
			}

			pause();
		}

		function isPlaying() {
			return self.audio && self.audio.playState !== 0 && !self.audio.paused && initialized;
		}

		function doPlay() {
			if(!initialized) {
				return createAndPlaySound();
			}

			self.audio.play();
		}

		function pause() {
			self.view.showPausedButton();
			self.audio.pause();
		}

		function stop() {
			self.view.showPausedButton();
			self.audio.stop();
		}

		function addEventHandlers(view) {
			view.waveform.addEventListener('click', updatePositionFromClickEvent);
			view.playBtn.addEventListener('click', play);
		}

		function updatePositionFromClickEvent(event) {
			var position = (event.clientX-this.offsetLeft) / this.offsetWidth;
		    
			setPosition(position);

	    }

	    function setPosition(position) {
	    	if(!self.audio) {
	    		initialPosition = position;
	    	} else {
	    		setAudioPosition(position);
	    	}
	    }

	    function setAudioPosition(position) {
		    self.audio.setPosition(position * self.audio.durationEstimate);
	    }

		return {
			play: play,
			pause: pause
		};
	}

})(http, waveform, utils);
