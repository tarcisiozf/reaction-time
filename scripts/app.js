'use strict';

class App {

	constructor() {

		this.isRunning = false;
		this.isGreen = false;

		this.orangeTimeout = null;
		this.greenTimeout = null;

		this.colors = {
			grey: 	'#CCCCCC',
			red: 	'#FF0D0D',
			orange: '#FF930D',
			green: 	'#10E410'
		};

		this.led = document.getElementById('led');
		this.timeText = document.getElementById('time');
		this.bestText = document.getElementById('best');  

		document.addEventListener('click', this.start.bind(this));

		this.readBestTime();
	}

	start() {

		if ( this.isGreen ) {
			return this.calcReactionTime();
		}

		if ( this.isRunning ) {
			return this.jumpStart();
		}

		this.isRunning = true;

		this.changeLedColorTo('red');

		const delay_orange = 2000;
		const delay_green = delay_orange + 3500 + this.getRandomDelay();

		this.orangeTimeout = setTimeout(this.statusOrange.bind(this), delay_orange);
		this.greenTimeout = setTimeout(this.statusGreen.bind(this), delay_green);
	}

	jumpStart() {

		this.isRunning = false;
		this.isGreen = false;

		clearTimeout(this.orangeTimeout);
		clearTimeout(this.greenTimeout);

		this.changeLedColorTo('grey');

		this.timeText.textContent = 'JUMP START!';
	}

	calcReactionTime() {

		const diff = ( ( Date.now() - this.initial_time ) / 1000 );

		this.isGreen = false;

		this.timeText.textContent = diff.toFixed(3);

		if ( this.best && diff < this.best ) {
			this.updateBestTime(diff.toFixed(3));
		}

	}

	statusOrange() {

		if ( ! this.isRunning ) {
			return;
		}

		this.changeLedColorTo('orange');
	}

	statusGreen() {

		if ( ! this.isRunning ) {
			return;
		}

		this.isGreen = true;
		this.isRunning = false;

		this.initial_time = Date.now();

		this.changeLedColorTo('green');
	}

	readBestTime() {

		const best = getCookie('best_time');

		if ( best === false ) {
			this.best = Number.MAX_VALUE;
			return;
		}

		this.best = Number(best);

	}

	updateBestTime(time) {

		this.best = time;

		this.bestText.textContent = 'Your best: ' + time;

		setCookie('best_time', time, 1);
	}

	changeLedColorTo(id) {
		this.led.style.backgroundColor = this.colors[id];
	}

	getRandomDelay() {
		return Math.floor(Math.random() * 2000);
	}

}

window.onload = () => new App;