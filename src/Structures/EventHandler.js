const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

exports.EventHandler = class {
	constructor(Hasfy) {
		this.size = 0;

		readdirSync('./src/events/').forEach(dir => {
			readdirSync(`./src/events/${dir}/`).filter(file => file.endsWith('.event.js') && !file.startsWith('--')).forEach(file => {
				try {
					const event = require(`../events/${dir}/${file}`);

					if (!event.name || !event.run) {
						if (Hasfy.dev) Hasfy.log.warn(`${file} cannot be loaded because name or run is missing`);
						return;
					}			
					
					Hasfy.on(event.name, async (...args) => {
						const res = await event.run(...args).catch(e => e);

						if (res instanceof Error) {
							Hasfy.log.error(`Error while executing ${event.name}`);
							console.log(res);
						}
					});

					if (Hasfy.dev) Hasfy.log.info(`${file} successfully loaded as ${event.name}`);
					this.size++;
				} catch (e) {
					if (Hasfy.dev) {
						Hasfy.log.error(`Error while loading ${file}`);
						console.log(e);
					}
				}
			});
		});

		Hasfy.log.info(`Successfully loaded ${this.size} event${this.size < 2 ? '' : 's'}`);
	}
}