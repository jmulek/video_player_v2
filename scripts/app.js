var video = document.getElementById('video');
var controlsContainer = document.getElementById('controls_container');
var controlsButtons = document.getElementById('controls_buttons');
var buffer = document.getElementById('buffer');
var timeDrag = false;
var progressBar = document.getElementById('progress_bar');
var progress = document.getElementById('progress');
var playpause = document.getElementById('playpause');
var timer = document.getElementById('timer');
var endTime = document.getElementById('end_time');
var speedLabel = document.getElementById('speed_label');
var fullscreen = document.getElementById('fullscreen');
var caption = document.getElementsByClassName('caption');
var volume = document.getElementById('volume');
var volumeslider = document.getElementById('volumeslider');



/**********************************
PROGRESS BAR
***********************************/

function progressPopulate() {
	var videoTime = ((video.currentTime / video.duration) * 100);
	progressBar.style.width = videoTime + '%';
}

video.addEventListener('timeupdate', progressPopulate);


/**********************************
BUFFER BAR
***********************************/

function bufferPopulate() {
	var currentBuffer = ((video.buffered.end(0) / video.duration) * 100);
	buffer.value = currentBuffer;
	console.log(currentBuffer);
}

video.addEventListener('progress', bufferPopulate);



function dragDown(e) {
	timeDrag = true;
	updateBar(e.pageX);
}

function dragUp(e) {
	if(timeDrag) {
		timeDrag = false;
		updateBar(e.pageX);
	}
}

function dragOver(e) {
	if(timeDrag) {
		updateBar(e.pageX);
	}
}

function clickNav(e) {
	updateBar(e.pageX);
}

function updateBar(x) {
	var position = x - progress.offsetLeft;
	var percentage = 100 * position / progress.offsetWidth;


	if(percentage > 100) {
		percentage = 100;
	}
	if(percentage < 0) {
		percentage = 0;
	}

	progress.value = percentage;
	video.currentTime = video.duration * percentage / 100;
}

progress.addEventListener('mousedown', dragDown);
progress.addEventListener('mouseup', dragUp);
progress.addEventListener('mousemove', dragOver);

progress.addEventListener('click', clickNav);


/**********************************
PLAY PAUSE BTN
***********************************/

function pauseIcon() {
	playpause.style.width = "18px";
	playpause.style.height = "24px";
	playpause.style.background = "url('./icons/pause-icon.png')";
}

function playIcon() {
	playpause.style.width = "22px";
	playpause.style.height = "26px";
	playpause.style.background = "url('./icons/play-icon.png')";
}

function playPause() {
	if (video.paused) {
		video.play();
		pauseIcon();
	} else {
		video.pause();
		playIcon();
	}
}

playpause.addEventListener("click", playPause);


/**********************************
TIME
***********************************/

function counter(e, i) {
	setInterval(e, i);
}

function showTimer() {
	var playedMinutes = parseInt(video.currentTime / 60, 10);
	var playedSeconds = parseInt(video.currentTime % 60);
	if (playedMinutes < 10) {
		playedMinutes = "0" + playedMinutes;
	}
	if (playedSeconds < 10) {
		playedSeconds = "0" + playedSeconds;
	}
	timer.innerHTML = playedMinutes + ":" + playedSeconds;
}

video.addEventListener('canplay', counter(showTimer, 1000));



/**********************************
LENGTH
***********************************/

function showLength() {
	var totalMinutes = parseInt(video.duration / 60, 10);
	var totalSeconds = parseInt(video.duration % 60);
	//tests to add leading 0 to short times
	if (totalMinutes < 10) {
		totalMinutes = "0" + totalMinutes;
	}
	if (totalSeconds < 10) {
		totalSeconds = "0" + totalSeconds;
	}
	endTime.innerHTML = "\/ " + totalMinutes + ":" + totalSeconds;
}

video.addEventListener('canplay', showLength);

video.addEventListener('loadeddata', showLength);
video.addEventListener('canplaythrough', showLength);




/**********************************
VOLUME BTN
***********************************/


function onIcon() {
	volume.style.background = "url('./icons/volume-on-icon.png')";
}


function offIcon() {
	volume.style.background = "url('./icons/volume-off-icon.png')";
}


function muteVideo() {
	if (!video.muted) {
		video.muted = true;
		offIcon();
	} else {
		video.muted = false;
		onIcon();
	}
}

volume.addEventListener("click", muteVideo);

/**********************************
VOLUME CONTROL
***********************************/

function setVolume() {
	video.volume = volumeslider.value / 100;
}

volumeslider.addEventListener('click', setVolume);


/**********************************
MAKES IT FULLSCREEN
***********************************/

function fullScreen() {
	if (video.requestFullscreen) {
		video.requestFullscreen();
	} else if (video.msRequestFullscreen) {
		video.msRequestFullscreen();
	} else if (video.mozRequestFullScreen) {
		video.mozRequestFullScreen();
	} else if (video.webkitRequestFullscreen) {
		video.webkitRequestFullscreen();
	}
}

fullscreen.addEventListener("click", fullScreen);



/**********************************
CAPTIONS
***********************************/

function highlighter() {
	for (var i = 0; i < caption.length; i++) {
		//if the video is within that caption's time range and less than data-end attr value
		if (video.currentTime >= caption[i].getAttribute('data-start') && video.currentTime <= caption[i].getAttribute('data-end')) {
			//caption gets highlight class
			caption[i].classList.add("highlight");
			// or else if the video is not in that caption's time range
		} else if (video.currentTime >= caption[i].getAttribute('data-end') || video.currentTime <= caption[i].getAttribute('data-start')) {
			//caption loses highlight class
			caption[i].classList.remove("highlight");
		}
	}
}

video.addEventListener("playing", counter(highlighter, 100));



/**********************************
CAPTIONS NAV
***********************************/

function captionMove() {
	var startTime = this.getAttribute('data-start');
	video.currentTime = startTime;
}

for (var i = 0; i < caption.length; i++) {
	caption[i].addEventListener("click", captionMove);
}



function showControls() {
	controlsContainer.classList.remove("down");
	controlsContainer.classList.add("up");
	controlsButtons.classList.remove("hide");
	controlsButtons.classList.add("show");
}

function hideControls() {
	controlsButtons.classList.remove("show");
	controlsButtons.classList.add("hide");
	controlsContainer.classList.remove("up");
	controlsContainer.classList.add("down");
}

video.addEventListener("mouseenter", showControls);
video.addEventListener("mouseleave", hideControls);

controlsContainer.addEventListener("mouseenter", showControls);
controlsContainer.addEventListener("mouseleave", hideControls);

progress.addEventListener("mouseenter", showControls);
progress.addEventListener("mouseleave", hideControls);
