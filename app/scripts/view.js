var view = (function () {

	return View;


	function View(config) {

		var vm = createVm();

		var HEIGHT = 100;
		var INSTANT_REMIX_CTA = 'Get Stems';
		var NEGOTIATED_CTA = 'Remix Track';
		var DEFAULT_CTA = 'View Track';
		var PROJECT_TYPE_ORIGINAL = 1;

		var CLOUDINARY_URL = 'https://res.cloudinary.com/skiomusic-com';
		var APP_URL =  'http://test.skiomusic.com';

		activate(config);

		return vm;

		//////////////////

		function activate(config) {
			setTheme(config.theme)
		}

		function setTheme(theme) {
			if(theme === 'dark') {
				vm.body.classList.add('dark');
			}
		}

		function load(project) {
			var link = getLink(project);

			vm.artistText.textContent = project.name
			vm.artistText.href = link;
			vm.artistArt.src = getProjectImageUrl(project);

			vm.cta.href = link;
			vm.cta.textContent = getCtaText(project);

			vm.trackLink.href = link;

			vm.info.textContent = getInfoText(project);
		}

		function getProjectImageUrl(project) {
			return CLOUDINARY_URL + '/image/upload/c_fill,d_project_default_v2.png,h_' + HEIGHT + ',w_' + HEIGHT + '/v1/projects/'+project.id+'/project_image';
		}

		function getLink(project) {
			return APP_URL + '/' + project.profile.username +'/'+ project.slug;
		}

		function getCtaText(project) {
			if(project.prelicense) {
				return getInstantRemixCtaText(project);
			}

			if(project.type === PROJECT_TYPE_ORIGINAL) {
				return NEGOTIATED_CTA;
			}

			return DEFAULT_CTA;
		}

		function getInstantRemixCtaText(project) {
			if (!project.prelicense.cashPayment) {
				return INSTANT_REMIX_CTA;
			}

			return INSTANT_REMIX_CTA + ' | ' + formatCents(project.prelicense.cashPayment);
		}

		function getInfoText(project) {

			if(project.key && project.bpm){
				return project.key + ' | ' + project.bpm + ' bpm';
			}

			if(project.key) {
				return project.key;
			}

			return project.bpm || '';
		}

		function formatCents(cents) {
			return '$' + (cents/100).toFixed(0);
		}

		function showPlayingButton() {
			vm.playBtn.classList.remove('paused');
			vm.playBtn.classList.add('default');
		}

		function showPausedButton() {
			vm.playBtn.classList.remove('default');
			vm.playBtn.classList.add('paused');
		}

		function createVm() {
			return {
				playBtn: document.querySelector('.playBtn'),
				artistText: document.querySelector('.artistText'),
				artistArt: document.querySelector('.artistArt'),
				trackLink: document.querySelector('.trackLink'),
				secondsLabel: document.querySelector('.secondsLabel'),
				minutesLabel: document.querySelector('.minutesLabel'),
				totalTimeLabel: document.querySelector('.totalTimeLabel'),
				infoLabel: document.querySelector('.infoLabel'),
				cta: document.querySelector('.cta'),
				info: document.querySelector('.info'),
				waveform: document.querySelector('#waveform'),
				body: document.querySelector('body'),
				load: load,
				showPlayingButton: showPlayingButton,
				showPausedButton: showPausedButton
			};
		}
	}
})();