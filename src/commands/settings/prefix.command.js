module.exports = {
	name: 'prefix',
	perm: 'MANAGE_GUILD',
	run: async ({ args, msg }) => {
		if (!args[0] || args[0] === msg.guild.prefix) return {
			type: 'error',
			text: 'Podaj nowy prefix'
		}

		if (args[0].length > 20) return {
			type: 'error',
			text: 'Prefix może mieć maksymalnie 20 znaków'
		}

		msg.guild.prefix = args[0];

		await r.table('guilds').get(msg.guild.id).update({
			prefix: args[0]
		}).run(conn);

		return {
			text: 'Nowy prefix został ustawiony'
		}
	}
}