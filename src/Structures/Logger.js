const { green, white, red, blue, yellow } = require('chalk');
const dayjs = require('dayjs');

exports.Logger = class {
	static get timestamp() {
		return dayjs(Date.now()).format('DD.MM.YYYY HH:mm:ss');
	}

	static ready(content) {
		console.log(green(`(${this.timestamp}) [READY]: ${content}`));
	}

	static info(content) {
		console.log(blue(`(${this.timestamp}) [INFO]: ${content}`));
	}

	static warn(content) {
		console.log(yellow(`(${this.timestamp}) [WARN]: ${content}`));
	}

	static error(content) {
		console.log(red(`(${this.timestamp}) [ERROR]: ${content}`));
	}

	static cmd(content) {
		console.log(white(`(${this.timestamp}) [CMD]: ${content}`));
	}
}