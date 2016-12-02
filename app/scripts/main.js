var player = (function (http, waveform) {

	var self = {
		initialized: false,
		view: initializeView()
	};

	function parseGetParams() {
		if(!location.search){ return null; }

		var getParams = location.search.substring(1);
		return JSON.parse('{"' + decodeURI(getParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	}

	function init() {
		var params = parseGetParams();

		var username = params.username;
		var slug = params.slug;

		http.get(projectUrl(username, slug), projectLoaded);

		soundManager.setup({
		   useFastPolling: true,
		   useHighPerformance: true,
		});
	}

	function projectLoaded(project) {
		self.project = project;
		http.post(playerUrl(project.id), {slug: project.slug}, playerUrlLoaded);

		var link = "http://test.skiomusic.com/"+project.profile.username +"/"+ project.slug;

		self.view.artistText.textContent = project.name
		self.view.artistArt.src= "https://res.cloudinary.com/skiomusic-com/image/upload/c_fill,d_project_default_v2.png,h_100,w_100/v1/projects/"+project.id+"/project_image"
		self.view.artistText.href = link;
		self.view.cta.href = link;
		self.view.trackLink.href = link; 

		waveform.renderWaveform(project);
	}

	function playerUrlLoaded(data) {
		self.audioUrl = data['audioUrl'];
	}


	function projectUrl(username, slug) {
		return 'https://static-test.skiomusic.com/profiles/'+username+'/projects/'+slug+'.json';
	}

	function playerUrl(id) {
		return 'https://api-test.skiomusic.com/projects/' + id + '/play_preview'
		
	}

	function formatMilliseconds(milliseconds) {
	   var minutes = Math.floor(milliseconds / 60000);
	   milliseconds = milliseconds % 60000;
	   var seconds = Math.floor(milliseconds / 1000);

	   return [minutes, seconds];
	}


	function initializeView() {
		return {
			playBtn: document.querySelector('.playBtn'),
			artistText: document.querySelector('.artistText'),
			artistArt: document.querySelector('.artistArt'),
			trackLink: document.querySelector('.trackLink'),
			secondsLabel: document.querySelector('.secondsLabel'),
			minutesLabel: document.querySelector('.minutesLabel'),
			totalTimeLabel: document.querySelector('.totalTimeLabel'),
			infoLabel: document.querySelector('.infoLabel'),
			time: document.querySelector('.time'),
			cta: document.querySelector('.cta')
		};
	}

	function createAndPlaySound() {
		self.view.time.classList.add('visible');

		self.audio = soundManager.createSound({
			id: 'remixcomps-' + self.project.id,
			url: self.audioUrl,
			autoPlay: true,
			autoLoad: true,
			whileplaying: function () {
				waveform.seek(self.audio.position/self.audio.durationEstimate);

				console.log(self.audio.position)
				console.log(formatMilliseconds(self.audio.position))

				var time = formatMilliseconds(self.audio.position);

				var totalTime = formatMilliseconds(self.audio.durationEstimate);

				self.view.secondsLabel.textContent = time[1];
				self.view.minutesLabel.textContent = time[0];
				self.view.totalTimeLabel.textContent = totalTime[0] + ":" + totalTime[1];
			}
		});

		self.initialized = true;
	}

	function play() {
		initializeTimelineClickHandler()
		self.view.playBtn.classList.remove('paused');
		self.view.playBtn.classList.add('default');

		if(!self.audio || self.audio.playState === 0 || self.audio.paused === true || !self.initialized) {
			return doPlay()
		}

		pause();
	}

	function doPlay() {
		if(!self.initialized) {
			return createAndPlaySound();
		}

		self.audio.play();
	}


	function pause() {
		self.view.playBtn.classList.add('paused');
		self.view.playBtn.classList.remove('default');

		self.audio.pause();
	}

	function initializeTimelineClickHandler() {
		document.getElementById('waveform').addEventListener('click', updatePositionFromClickEvent);
	}

	function updatePositionFromClickEvent(event) {
		var position = (event.clientX-this.offsetLeft) / this.offsetWidth;
	    
	    self.audio.setPosition(position * self.audio.durationEstimate);
    }

	return {
		play: play,
		pause: pause,
		init: init
	};

})(http, waveform);
