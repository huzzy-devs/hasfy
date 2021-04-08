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
}