const temp = new Map();

module.exports = {
	name: 'messageReactionAdd',
	run: async (reaction, user) => {
		if (user.bot) return;
		const msg = reaction.message;

		if (!msg.guild) return;

		if (msg.guild.id !== Hasfy.config.support.id) return;

		if (msg.channel.id !== Hasfy.config.support.verifyChannel) return;

		const verifyData = await r.table('verify').get(msg.id).run(conn);

		if (!verifyData) return;

		if (temp.has(`${user.id}_u`) || temp.has(`${msg.id}_m`)) return reaction.users.remove(user.id);

		const embed = JSON.parse(verifyData.embed);

		let totalSeconds = ((Date.now() - verifyData.timestamp) / 1000);
		totalSeconds %= 86400;
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);

		const time = {
			hours,
			minutes
		}

		const guild = Hasfy.guilds.cache.get(verifyData.guildID);

		if (!guild) return await Hasfy.utils.reject({ msg, user: Hasfy.user, reason, embed, time, userID: verifyData.userID, reason: 'Brak bota na serwerze' });

		const guildData = await r.table('guilds').get(guild.id).run(conn);

		if (!guildData) return await Hasfy.utils.reject({ guild, msg, user: Hasfy.user, reason, embed, time, userID: verifyData.userID, reason: 'Brak ustawionego kanału reklam' });

		const channel = guild.channels.cache.get(guildData.channelID);

		if (!channel || !Hasfy.utils.checkChannel(channel)) return await Hasfy.utils.reject({ guild, channel, msg, user: Hasfy.user, reason, embed, time, userID: verifyData.userID, reason: 'Skasowany lub ukryty kanał reklam' });

		if (channel.nsfw) return await Hasfy.utils.reject({ guild, channel, msg, user: Hasfy.user, reason, embed, time, userID: verifyData.userID, reason: 'Kanał reklam jest nsfw' });

		temp.set(`${msg.id}_m`, true);
		temp.set(`${user.id}_u`, true);

		switch (reaction._emoji.id) {
			case '825785935706193950': {
				const adData = (await r.table('ads').getAll(guild.id, { index: 'guildID' }).coerceTo('array').run(conn))[0];

				const number = adData ? adData.number : (await r.table('ads').count().run(conn)) + 1;

				if (adData) {
					await r.table('ads').get(number).update({
						content: verifyData.content
					}).run(conn);
				} else {
					await r.table('ads').insert({
						guildID: guild.id,
						content: verifyData.content,
						number,
						sent: 0,
						queue: 0
					}).run(conn);
				}

				await Hasfy.utils.approve({ guild, msg, user, embed, time, userID: verifyData.userID, channel, number });
				temp.delete(`${msg.id}_m`);
				temp.delete(`${user.id}_u`);
				break;
			}

			case '825785890289877032': {
				const filter = m => m.author.id === user.id;

				const message = await msg.channel.send('> `Podaj powód odrzucenia reklamy`');

				const collector = msg.channel.createMessageCollector(filter, { time: 40000 });

				const reason = await new Promise(async resolve => {
					let r;
					collector.on('collect', async m => {
						m.delete({ timeout: 250 });
						if (!m.content) {
							const mm = await m.channel.send('> `Ale podaj powód odrzucenia reklamy a nie załącznik :<`');

							return mm.delete({ timeout: 3000 });
						}

						r = m.content.slice(0, 150);
						collector.stop();
					});

					collector.on('end', () => {
						resolve(r);
						message.delete();
					});
				});
				if (!reason) {
					message.delete();
					return reaction.users.remove(user.id);
				}
				await Hasfy.utils.reject({ guild, msg, user, reason, embed, time, userID: verifyData.userID, channel });
				temp.delete(`${msg.id}_m`);
				temp.delete(`${user.id}_u`);
				break;
			}

			case '828700286591828058': {
				const filter = m => m.author.id === user.id;

				const message = await msg.channel.send('> `Podaj numer pod który mam dodać reklamę`');

				const collector = msg.channel.createMessageCollector(filter, { time: 40000 });

				const number = await new Promise(async resolve => {
					let rr;
					collector.on('collect', async m => {
						m.delete({ timeout: 250 });
						if (!m.content) {
							const mm = await m.channel.send('> `Ale podaj numer a nie załącznik :<`');

							return mm.delete({ timeout: 3000 });
						}

						if (isNaN(m.content)) {
							const mm = await m.channel.send('> `Ale podaj poprawny numer :<`');

							return mm.delete({ timeout: 3000 });
						}

						const data = await r.table('ads').get(Number(m.content)).run(conn);

						if (!data) {
							const mm = await m.channel.send('> `Pod tym numerem nie ma żadnej reklamy :<`');

							return mm.delete({ timeout: 3000 });
						}

						rr = Number(m.content);
						collector.stop();
					});

					collector.on('end', () => {
						resolve(rr);
						message.delete();
					});
				});
				
				if (!number) {
					message.delete();
					return reaction.users.remove(user.id);
				}
				const adData = (await r.table('ads').getAll(guild.id, { index: 'guildID' }).coerceTo('array').run(conn))[0];

				if (adData) {
					await r.table('ads').get(number).update({
						content: verifyData.content
					}).run(conn);
				} else {
					await r.table('ads').insert({
						guildID: guild.id,
						content: verifyData.content,
						number,
						sent: 0,
						queue: 0
					}).run(conn);
				}

				await Hasfy.utils.approve({ guild, msg, user, number, embed, time, userID: verifyData.userID, channel });
				temp.delete(`${msg.id}_m`);
				temp.delete(`${user.id}_u`);
				break;
			}

			default: return reaction.users.remove(user.id);
		}
	}
}
