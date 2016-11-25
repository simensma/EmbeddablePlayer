var player = (function (http) {

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
		
		console.log(project)
		self.view.artistText.textContent = project.name
		self.view.artistArt.src= "https://res.cloudinary.com/skiomusic-com/image/upload/c_fill,d_project_default_v2.png,h_100,w_100/v1/projects/"+project.id+"/project_image"
		self.view.artistText.href = "http://test.skiomusic.com/noizehazard/gang-signs-mate"
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

	function initializeView() {
		return {
			playBtn: document.querySelector('.playBtn'),
			artistText: document.querySelector('.artistText'),
			artistArt: document.querySelector('.artistArt')
		};
	}

	function createAndPlaySound() {
		self.audio = soundManager.createSound({
			id: self.project.id,
			url: self.audioUrl,
			autoPlay: true,
			autoLoad: true,
			whileplaying: function () {
				console.log('PLAYING ' + self.audio.position);
			},
			whileloading: function () {
				console.log('LOADING ' + self.audio.durationEstimate)
			},
			onload: function () {
				console.log('LOADED')
			}

		});

		self.initialized = true;
	}

	function play() {
		
		self.view.playBtn.classList.remove('paused');

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

		

		self.audio.pause();
	}

	return {
		play: play,
		pause: pause,
		init: init
	};

})(http);
