global.r = require('rethinkdb');

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
}