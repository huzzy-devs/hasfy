global.r = require('rethinkdb');
const { Team } = require('discord.js');

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
}