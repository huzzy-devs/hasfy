global.r = require('rethinkdb');
const { Team, MessageEmbed } = require('discord.js');

exports.Utils = class {
	static async database() {
		global.conn = await r.connect({ db: 'hasfy' }).catch(() => {
			Hasfy.log.error('RethinkDB connection rejected');
			process.exit();
		});

		await r.dbCreate('hasfy').run(conn).catch(e => e);
		await r.db('hasfy').tableCreate('guilds', { primaryKey: 'guildID' }).run(conn).catch(e => e);
		await r.db('hasfy').tableCreate('gbans', { primaryKey: 'userID' }).run(conn).catch(e => e);
		await r.db('hasfy').tableCreate('verify', { primaryKey: 'messageID' }).run(conn).catch(e => e);
		await r.table('verify').indexCreate('guildID').run(conn).catch(e => e);
		await r.db('hasfy').tableCreate('ads', { primaryKey: 'number' }).run(conn).catch(e => e);
		await r.table('ads').indexCreate('guildID').run(conn).catch(e => e);

		Hasfy.log.ready('RethinkDB connected');
	}

	static jebacVersy(guild) {
		return guild.members.cache.has('785586120074199060');
	}

	static isOwner(userID) {
		const owner = Hasfy.application.owner;

		if (owner instanceof Team) {
			return owner.members.has(userID);
		} else {
			return owner.id === userID;
		}
	}

	static fakeObject = {
		has() {
			return true;
		}
	}

	static checkChannel(channel) {
		let pass = true;

		for (const perm of channel.permissionOverwrites) {
			const permission = channel.permissionsFor(perm.id);
			if (permission) {
				if (!permission.has(['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'])) {
					pass = false;
					break;
				}
			}
		}

		return pass;
	}

	static async check(guild) {
		const data = await r.table('guilds').get(guild.id).run(conn);

		if (!data || !data.channelID) return false;

		const channel = guild.channels.cache.get(data.channelID);

		if (!channel || channel.type !== 'text') return false;

		return this.checkChannel(channel);
	}

	static async approve({ guild, msg, user, embed, time, userID, channel, number }) {
		await r.table('verify').get(msg.id).delete().run(conn);
		const verifyOldEmbed = new MessageEmbed(embed).setColor('GREEN')
			.addField('**(** <:user:829680298248896552> **) ・** __**Kto zaakceptował**__', `\`\`\`yaml\n${user.tag} (${user.id})\`\`\``)
			.addField('**(** <a:info:828700286591828058> **) ・** __**Numer pod który została dodana reklama**__', `\`\`\`yaml\n${number}\`\`\``)
		await msg.edit(verifyOldEmbed);

		await msg.reactions.removeAll();

		const notflicationEmbed = new MessageEmbed()
			.setAuthor('Reklama została ZAAKCEPTOWANA', Hasfy.user.displayAvatarURL())
			.setColor(Hasfy.config.main)
			.addField('**(** <a:discord:829680039754334268> **) ・** __**Serwer**__', `\`\`\`yaml\n${guild ? `${guild.name} (${guild.id})` : 'Nie można określić'}\`\`\``)
			.addField('**(** <:czas_end:829061069459947550> **) ・** __**Czas oczekiwania**__', `\`\`\`yaml\n${time.hours}H ${time.minutes}m\`\`\``)
			.addField('**(** <a:info:828700286591828058> **) ・** __**Numer pod który została dodana reklama**__', `\`\`\`yaml\n${number}\`\`\``)
			.addField('**(** <:user:829680298248896552> **) ・** __**Weryfikator**__', `\`\`\`yaml\n${user.tag} (${user.id})\`\`\``)

		await channel?.send(notflicationEmbed).catch(e => e);
		await Hasfy.users.cache.get(userID)?.send(notflicationEmbed).catch(e => e);
		const m = await Hasfy.guilds.cache.get(Hasfy.config.support.id).channels.cache.get(Hasfy.config.support.notflicationsChannel)?.send(notflicationEmbed).catch(e => e);

		if (!m instanceof Error) m.crosspost();
	}

	static async reject({ guild, msg, user, reason, embed, time, userID, channel }) {
		await r.table('verify').get(msg.id).delete().run(conn);
		const verifyOldEmbed = new MessageEmbed(embed).setColor(Hasfy.config.error)
			.addField('**(** <:user:829680298248896552> **) ・** __**Kto odrzucił**__', `\`\`\`yaml\n${user.tag} (${user.id})\`\`\``)
			.addField('**(** <a:info:828700286591828058> **) ・** __**Powód odrzucenia**__', `\`\`\`yaml\n${reason}\`\`\``)
		await msg.edit(verifyOldEmbed);

		await msg.reactions.removeAll();

		const notflicationEmbed = new MessageEmbed()
			.setAuthor('Reklama została ODRZUCONA', Hasfy.user.displayAvatarURL())
			.setColor(Hasfy.config.error)
			.addField('**(** <a:discord:829680039754334268> **) ・** __**Serwer**__', `\`\`\`yaml\n${guild ? `${guild.name} (${guild.id})` : 'Nie można określić'}\`\`\``)
			.addField('**(** <:czas_end:829061069459947550> **) ・** __**Czas oczekiwania**__', `\`\`\`yaml\n${time.hours}H ${time.minutes}m\`\`\``)
			.addField('**(** <a:info:828700286591828058> **) ・** __**Powód odrzucenia**__', `\`\`\`yaml\n${reason}\`\`\``)
			.addField('**(** <:user:829680298248896552> **) ・** __**Weryfikator**__', `\`\`\`yaml\n${user.tag} (${user.id})\`\`\``)

		await channel?.send(notflicationEmbed).catch(e => e);
		await Hasfy.users.cache.get(userID)?.send(notflicationEmbed).catch(e => e);
		const m = await Hasfy.guilds.cache.get(Hasfy.config.support.id).channels.cache.get(Hasfy.config.support.notflicationsChannel)?.send(notflicationEmbed).catch(e => e);

		if (!m instanceof Error) m.crosspost();
	}
}