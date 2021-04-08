const { Client, ClientOptions } = require('discord.js');
const { CommandHandler } = require('./Structures/CommandHandler');
const { EventHandler } = require('./Structures/EventHandler');
const { Logger } = require('./Structures/Logger');
const { Utils } = require('./Structures/Utils');
const { config } = require('dotenv');
const duration = require('dayjs/plugin/duration');
const dayjs = require('dayjs');

dayjs.extend(duration);

config();

/**
 	* @param {ClientOptions} clientOptions - Discord.js Client class options
	* @class 
 */
class Bot extends Client {
	constructor(clientOptions) {
		super(clientOptions);

		this.log = Logger;

		this.config = require('../config.json');

		this.utils = Utils;

		this.log.cmd('App is starting please wait');

		this.dev = process.argv.includes('--dev');

		this.commands = new CommandHandler(this).getCommands();
		new EventHandler(this);

		this.utils.database().then(async () => {
			this.login(process.env.CLIENT_TOKEN);
			this.application = await this.fetchApplication();
		});
	}

	get uptime() {
		return dayjs.duration(super.uptime).format('D[d] H[h] m[m] s[s]');
	}
}

global.Hasfy = new Bot();