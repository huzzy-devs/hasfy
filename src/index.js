const { Client, ClientOptions } = require('discord.js');
const { CommandHandler } = require('./Structures/CommandHandler');
const { EventHandler } = require('./Structures/EventHandler');
const { Logger } = require('./Structures/Logger');
const { Utils } = require('./Structures/Utils');
const { config } = require('dotenv');

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

		this.log.cmd('App is staring please wait');

		this.dev = process.argv.includes('--dev');

		this.commands = new CommandHandler(this).getCommands();
		new EventHandler(this);

		this.utils.database().then(() => {
			this.login(process.env.CLIENT_TOKEN);
		});
	}
}

global.Hasfy = new Bot();