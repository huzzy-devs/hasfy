const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

exports.CommandHandler = class {
	constructor(Hasfy) {
		this.commands = new Collection();

		readdirSync('./src/commands/').forEach(dir => {
			readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.command.js') && !file.startsWith('--')).forEach(file => {
				try {
					const command = require(`../commands/${dir}/${file}`);

					if (!command.name || !command.run) {
						if (Hasfy.dev) Hasfy.log.warn(`${file} cannot be loaded because name or run is missing`);
						return;
					}

					if (this.commands.has(command.name)) {
						if (Hasfy.dev) Hasfy.log.warn(`${file} [${command.name}] cannot be loaded because this name is already taken`);
						return;
					}

					this.commands.set(command.name, command);

					if (Hasfy.dev) Hasfy.log.info(`${file} loaded successfully as ${command.name}`);
				} catch (e) {
					if (Hasfy.dev) {
						Hasfy.log.error(`Error while loading ${file}`);
						console.log(e);
					}
				}
			});
		});

		Hasfy.log.info(`Successfully loaded ${this.commands.size} command${this.commands.size < 2 ? '' : 's'}`);
	}

	getCommands() {
		return this.commands;
	}
}